# CareKompass v6.0 — Databas, RLS & API

> **Serie:** 01-system-spec · **02-database-api** · 03-frontend-guide · 04-implementation-plan
> **Stack-kontext:** Supabase Postgres + RLS som sanning. Klient-anrop via `supabase.from(...)`. Server-anrop via `createServerFn` med `requireSupabaseAuth` eller via Supabase Edge Functions för specifika kantfall.

> **⚠ ÖVERSTYRD AV 07 — läs detta först.** Denna fil skrevs före v4-mappningen. Följande överstyrs av **07-v4-mapping-and-overrides.md** där de krockar — använd alltid 07:s version:
> - **Tabellnamn (07 §4):** Använd v4-konsistenta namn — `company_users` + `clinic_assignments` (inte `memberships`), `policy_documents` (inte `documents`), `medication_items`/`medication_logs` (inte `medications`/`medication_usages`), `checklist_*` (inte `hygiene_*`), `subscription_plans`/`plan_features`/`company_modules` (inte `plans`/`plan_feature_defaults`/`company_features`).
> - **Audit (07 §4.2):** Två tabeller — `audit_logs` + `module_audit_logs` + `delegation_audits` — inte en enda `audit_logs`.
> - **Rollmodell & helpers (07 §2, §2.5):** Hierarkiska roller + `user_capabilities` + `staff_subroles`; helpers `is_member_of_company`, `has_company_role`, `has_capability` (inte `current_company_ids`/`has_role`/`has_permission`).
> - **AI & betalning (07 §5.4):** Lovable AI Gateway och Lovable Stripe-payments — inga egna AI- eller Stripe-Edge-Functions.
>
> Schemamönstren, RLS-principerna, `createServerFn`-mönstret och API-svarsformatet i denna fil gäller fortsatt — det är **namn och rollmodell** som 07 förfinar.

---

## Innehåll

1. Konventioner
2. Helper-funktioner (auth/RLS)
3. Bas-schema (tenant/bolag/klinik/profil/RBAC)
4. Feature flags & plans
5. Industry templates
6. Modul-tabeller (översikt + nyckeltabeller)
7. Audit logs
8. API-strategi (`createServerFn` vs Edge Functions)
9. Standardiserat API-svar
10. Edge Function-katalog
11. pg_cron-jobb
12. Migrations-disciplin

---

## 1. Konventioner

### 1.1 Tabell-fundament

Varje muterbar domän-tabell har:

```sql
id              uuid primary key default gen_random_uuid()
tenant_id       uuid not null references tenants(id)
company_id      uuid not null references companies(id)
clinic_id       uuid references clinics(id)        -- null = bolags-nivå
created_at      timestamptz not null default now()
created_by      uuid not null references profiles(id)
updated_at      timestamptz not null default now()
updated_by      uuid references profiles(id)
deleted_at      timestamptz                         -- soft delete
version         int not null default 1              -- optimistic locking
```

Trigger uppdaterar `updated_at` automatiskt. Trigger bumpar `version` vid UPDATE.

### 1.2 Namngivning

- Tabeller: snake_case, plural (`avvikelser`, `ordinations`, `medications`)
- Kolumner: snake_case, singular
- Enums: `<table>_<field>_enum` (`avvikelse_severity_enum`)
- RLS-policies: `<table>_<operation>_<scope>` (`avvikelser_select_member`, `avvikelser_insert_member`, `avvikelser_update_owner_or_assignee`)

### 1.3 Soft delete

`deleted_at IS NOT NULL` = raderad. Alla SELECT-policies filtrerar bort dessa. Hard delete sker endast via underhållsjobb efter X dagar (eller aldrig — beror på modul).

### 1.4 Optimistic locking

Frontend skickar `version` med vid UPDATE. `createServerFn` validerar och bumpar:

```sql
UPDATE avvikelser
SET status = $1, version = version + 1, updated_at = now(), updated_by = $2
WHERE id = $3 AND version = $4 AND deleted_at IS NULL
RETURNING *;
```

0 rader → returnera `{ error: { code: "version_conflict" } }`. Frontend refetchar och visar konflikt-UI.

---

## 2. Helper-funktioner (auth/RLS)

Dessa funktioner är hjärtat i RLS-modellen. De är `SECURITY DEFINER`, mappar mot `auth.uid()` och returnerar IDn som tillåts.

```sql
-- Aktiv profil-ID
create or replace function public.current_profile_id()
returns uuid
language sql stable security definer
as $$
  select id from public.profiles where auth_user_id = auth.uid() limit 1;
$$;

-- Tenant-ID som användaren tillhör (en användare = en tenant)
create or replace function public.current_tenant_id()
returns uuid
language sql stable security definer
as $$
  select p.tenant_id
  from public.profiles p
  where p.auth_user_id = auth.uid()
  limit 1;
$$;

-- Bolag som användaren är medlem i
create or replace function public.current_company_ids()
returns setof uuid
language sql stable security definer
as $$
  select distinct m.company_id
  from public.memberships m
  join public.profiles p on p.id = m.profile_id
  where p.auth_user_id = auth.uid()
    and m.revoked_at is null;
$$;

-- Kliniker som användaren är medlem i (eller alla i bolaget om bolagsroll)
create or replace function public.current_clinic_ids()
returns setof uuid
language sql stable security definer
as $$
  select distinct c.id
  from public.clinics c
  join public.memberships m on m.company_id = c.company_id
  join public.profiles p on p.id = m.profile_id
  where p.auth_user_id = auth.uid()
    and m.revoked_at is null
    and (m.clinic_id is null or m.clinic_id = c.id);
$$;

-- Har användaren rollen X i scope Y?
create or replace function public.has_role(
  required_role text,
  scope_company_id uuid default null,
  scope_clinic_id uuid default null
)
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1
    from public.memberships m
    join public.profiles p on p.id = m.profile_id
    join public.roles r on r.id = m.role_id
    where p.auth_user_id = auth.uid()
      and r.code = required_role
      and m.revoked_at is null
      and (scope_company_id is null or m.company_id = scope_company_id)
      and (scope_clinic_id is null or m.clinic_id is null or m.clinic_id = scope_clinic_id)
  );
$$;

-- Har användaren behörigheten X i bolaget?
create or replace function public.has_permission(
  required_perm text,
  scope_company_id uuid
)
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1
    from public.memberships m
    join public.profiles p on p.id = m.profile_id
    join public.role_permissions rp on rp.role_id = m.role_id
    join public.permissions perm on perm.id = rp.permission_id
    where p.auth_user_id = auth.uid()
      and perm.code = required_perm
      and m.revoked_at is null
      and m.company_id = scope_company_id
  );
$$;

-- Är feature flag aktiv för bolaget?
create or replace function public.feature_enabled(
  feature_key text,
  scope_company_id uuid
)
returns boolean
language sql stable security definer
as $$
  select coalesce(
    (select enabled from public.company_features
      where company_id = scope_company_id and feature_key = $1 limit 1),
    false
  );
$$;
```

### 2.1 RLS-policy-mall

Standardmall för alla domän-tabeller:

```sql
alter table public.<table> enable row level security;

-- SELECT: medlem i bolaget och feature aktiv (om relevant)
create policy "<table>_select_member"
  on public.<table> for select
  using (
    deleted_at is null
    and company_id in (select public.current_company_ids())
    and (clinic_id is null or clinic_id in (select public.current_clinic_ids()))
    and public.feature_enabled('<feature_key>', company_id)
  );

-- INSERT: medlem i bolaget + tenant_id sätts korrekt + writable subscription
create policy "<table>_insert_member"
  on public.<table> for insert
  with check (
    tenant_id = public.current_tenant_id()
    and company_id in (select public.current_company_ids())
    and (clinic_id is null or clinic_id in (select public.current_clinic_ids()))
    and public.has_permission('<perm>.create', company_id)
    and public.feature_enabled('<feature_key>', company_id)
  );

-- UPDATE: behörighet + writable
create policy "<table>_update_member"
  on public.<table> for update
  using (
    deleted_at is null
    and company_id in (select public.current_company_ids())
    and public.has_permission('<perm>.update', company_id)
  )
  with check (
    company_id = (select company_id from public.<table> where id = <table>.id)
    -- ingen cross-bolags-flytt
  );

-- DELETE: ingen direkt DELETE — soft delete via UPDATE deleted_at
-- DELETE-policy lämnas medvetet bort → DELETE blockeras av PG
```

### 2.2 RLS-tester

RLS-policies är så centrala att de testas separat (Fas 1, ej senare).

Test-mönster: pgTAP-stil eller dedikerade `_rls_test.sql`-filer som kör mot Supabase med olika `set_config('request.jwt.claim.sub', '<user_uuid>', true)`. Varje test:

1. Skapa två tenants A och B med varsina bolag, kliniker, användare
2. Logga in som användare i A → ska se A:s data, inte B:s
3. INSERT med `tenant_id = B.id` som A-användare → ska misslyckas
4. UPDATE av B:s rad som A-användare → ska träffa 0 rader

Detta är **Fas 1, inte Fas 5.**

---

## 3. Bas-schema

### 3.1 Tenants, companies, clinics

```sql
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  name text not null,
  org_nr text,
  industry_template_id uuid references public.industry_templates(id),
  plan_id uuid references public.plans(id),
  trial_ends_at timestamptz,
  shared_customers boolean not null default false,
  created_at timestamptz not null default now(),
  created_by uuid not null,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  company_id uuid not null references public.companies(id) on delete restrict,
  name text not null,
  address text,
  city text,
  postal_code text,
  responsible_profile_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  created_by uuid not null,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### 3.2 Profiles & memberships

```sql
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id),
  email text not null,
  full_name text,
  phone text,
  personnummer_hash text,           -- hash, inte klartext
  legitimation_type text,           -- läkare/tandläkare/sjuksköterska/null
  legitimation_id text,             -- HSA-id eller motsv.
  legitimation_verified_at timestamptz,
  legitimation_expires_at timestamptz,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid not null references public.companies(id),
  clinic_id uuid references public.clinics(id),   -- null = hela bolaget
  role_id uuid not null references public.roles(id),
  invited_by uuid references public.profiles(id),
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (profile_id, company_id, clinic_id, role_id)
);
```

### 3.3 Roles, permissions

```sql
create table public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,             -- 'company_owner', 'legitimerad_lakare', ...
  display_name text not null,
  is_system boolean not null default true
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,             -- 'avvikelse.create', 'ordination.approve', ...
  display_name text not null,
  module text not null                   -- 'avvikelse', 'ordination', ...
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);
```

Roles och permissions seedas via migration. Custom roller per bolag är out of v6.0 scope.

### 3.4 Consulting assignments

För externa läkare som ordinerar till flera bolag/kliniker som inte tillhör samma tenant.

```sql
create table public.consulting_assignments (
  id uuid primary key default gen_random_uuid(),
  practitioner_profile_id uuid not null references public.profiles(id),
  scope_type text not null check (scope_type in ('tenant', 'company', 'clinic')),
  scope_tenant_id uuid references public.tenants(id),
  scope_company_id uuid references public.companies(id),
  scope_clinic_id uuid references public.clinics(id),
  granted_by_profile_id uuid not null references public.profiles(id),
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  check (
    (scope_type = 'tenant' and scope_tenant_id is not null) or
    (scope_type = 'company' and scope_company_id is not null) or
    (scope_type = 'clinic' and scope_clinic_id is not null)
  )
);
```

Helper `current_consulting_scopes()` ger tillbaka tenants/bolag/kliniker som consulting practitioner har tillgång till — RLS-policies för `ordinations` UNION:ar denna mot `current_company_ids()`.

---

## 4. Feature flags & plans

```sql
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,             -- 'trial', 'starter', 'pro', 'enterprise'
  display_name text not null,
  stripe_price_id text,
  monthly_price_sek int,
  is_active boolean not null default true
);

create table public.plan_feature_defaults (
  plan_id uuid not null references public.plans(id) on delete cascade,
  feature_key text not null,
  enabled boolean not null default false,
  primary key (plan_id, feature_key)
);

create table public.company_features (
  company_id uuid not null references public.companies(id) on delete cascade,
  feature_key text not null,
  enabled boolean not null default false,
  source text not null default 'plan',  -- 'plan' | 'override'
  updated_at timestamptz not null default now(),
  primary key (company_id, feature_key)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  plan_id uuid not null references public.plans(id),
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text not null,                  -- 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

**Feature-nycklar** (v6.0):
- `module.documents_enabled`
- `module.deviations_enabled` (avvikelser)
- `module.medications_enabled`
- `module.orders_enabled` (ordination & delegering)
- `module.hygiene_enabled`
- `module.risk_enabled`
- `module.compliance_center_enabled`
- `module.staff_credentials_enabled`
- `module.customer_records_enabled` (Fas 8)
- `module.external_practitioners_enabled` (Fas 9)
- `feature.bankid_signing`
- `feature.audit_export`
- `feature.inspector_mode`

---

## 5. Industry templates

```sql
create table public.industry_templates (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,             -- 'estetisk_injektion', 'tatuering', ...
  display_name text not null,
  regulatory_body text,                  -- 'IVO', 'Miljöförvaltningen', 'IVO+Miljö'
  terminology jsonb not null,            -- { "ordination.title": "Ordination", ... }
  default_document_template_ids uuid[] default array[]::uuid[],
  default_hygiene_checklist_ids uuid[] default array[]::uuid[],
  default_risk_categories text[] default array[]::text[],
  default_treatment_types text[] default array[]::text[],
  is_active boolean not null default true
);
```

Terminology JSON läses i frontend via `useTerminology()`-hook (03-frontend-guide §4.3).

Branscher (v6.0 seed):
- `estetisk_injektion`, `estetisk_kirurgi`, `tandvard_estetik`, `klinikkedja`
- `hudvard`, `laser_ipl`, `microneedling_prp`, `fotvard`, `piercing_tatuering`, `frisor_skonhet`, `uthyrningsklinik`

---

## 6. Modul-tabeller

För korthet visas nyckel-tabellerna. Fullständiga DDL skrivs i migration-PR per fas.

### 6.1 Dokument

```sql
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  clinic_id uuid,                        -- null = bolagsövergripande
  category text not null,                -- 'policy' | 'procedure' | 'guideline' | 'form' | 'checklist'
  title text not null,
  current_version_id uuid,               -- pekar på document_versions
  status text not null,                  -- 'draft' | 'active' | 'archived'
  requires_signature boolean not null default false,
  ...
);

create table public.document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id),
  version_no int not null,
  content_md text,                       -- markdown
  file_storage_path text,                -- om uppladdad PDF
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  ...
);

create table public.document_signatures (
  id uuid primary key default gen_random_uuid(),
  document_version_id uuid not null references public.document_versions(id),
  signed_by uuid not null references public.profiles(id),
  signed_at timestamptz not null default now(),
  signature_method text not null,        -- 'click' | 'bankid'
  bankid_transaction_id text,
  ...
);
```

### 6.2 Avvikelser

```sql
create table public.deviations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  clinic_id uuid not null,
  ref_no text not null,                  -- 'AV-2026-042'
  category text not null,                -- 'hygiene' | 'medication' | 'treatment' | 'equipment' | ...
  severity text not null,                -- 'low' | 'medium' | 'high' | 'critical'
  status text not null,                  -- 'reported' | 'triaged' | 'investigating' | 'remediation' | 'closed'
  title text not null,
  description text,
  reported_by uuid not null references public.profiles(id),
  assigned_to uuid references public.profiles(id),
  related_risk_id uuid references public.risks(id),
  ...
);

create table public.deviation_actions (
  id uuid primary key default gen_random_uuid(),
  deviation_id uuid not null references public.deviations(id) on delete cascade,
  action_type text not null,             -- 'comment' | 'status_change' | 'assignment' | 'remediation_step'
  payload jsonb,
  created_by uuid not null,
  created_at timestamptz not null default now()
);

create table public.deviation_attachments (
  id uuid primary key default gen_random_uuid(),
  deviation_id uuid not null references public.deviations(id) on delete cascade,
  storage_path text not null,
  filename text not null,
  uploaded_by uuid not null,
  ...
);
```

### 6.3 Läkemedel

```sql
create table public.medications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  display_name text not null,            -- 'Botox 100E'
  substance text,
  product_category text,                 -- 'botox' | 'filler' | 'skinbooster' | 'hyalase' | 'anesthetic' | 'prp_kit' | 'other'
  manufacturer text,
  ...
);

create table public.medication_batches (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  clinic_id uuid not null,               -- batch finns på en specifik klinik
  medication_id uuid not null references public.medications(id),
  batch_no text not null,
  lot_no text,
  units_total numeric not null,
  units_remaining numeric not null,
  unit_type text not null,               -- 'ml' | 'units' | 'vials'
  purchased_at date,
  expires_at date not null,
  storage_temp_min numeric,
  storage_temp_max numeric,
  status text not null default 'active', -- 'active' | 'consumed' | 'discarded' | 'expired'
  ...
);

create table public.medication_temperature_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  clinic_id uuid not null,
  recorded_at timestamptz not null,
  temperature_c numeric not null,
  recorded_by uuid not null,
  ...
);

create table public.medication_usages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  clinic_id uuid not null,
  batch_id uuid not null references public.medication_batches(id),
  customer_id uuid references public.customers(id),  -- nullbar; ej alla kliniker kopplar batch→kund
  amount_used numeric not null,
  used_by uuid not null references public.profiles(id),
  used_at timestamptz not null,
  related_order_id uuid references public.orders(id),
  ...
);
```

### 6.4 Ordination & delegering

```sql
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  clinic_id uuid not null,
  customer_id uuid references public.customers(id),
  ordered_by uuid not null references public.profiles(id),  -- legitimerad/consulting
  status text not null,                  -- 'pending' | 'approved' | 'rejected' | 'expired' | 'executed'
  treatment_type text not null,
  product_category text,
  notes text,
  approved_at timestamptz,
  expires_at timestamptz,
  ...
);

create table public.delegations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  clinic_id uuid,                         -- null = bolagsövergripande
  delegated_to_profile_id uuid not null references public.profiles(id),
  delegated_by_profile_id uuid not null references public.profiles(id),  -- måste vara legitimerad
  treatment_categories text[] not null,
  granted_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  signature_method text not null,        -- 'click' | 'bankid'
  ...
);
```

### 6.5 Hygien

```sql
create table public.hygiene_schedules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  clinic_id uuid not null,
  checklist_template_id uuid not null references public.hygiene_checklist_templates(id),
  frequency text not null,                -- 'daily' | 'weekly' | 'monthly'
  next_due_at timestamptz not null,
  responsible_profile_id uuid,
  ...
);

create table public.hygiene_checks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  clinic_id uuid not null,
  schedule_id uuid references public.hygiene_schedules(id),
  performed_by uuid not null references public.profiles(id),
  performed_at timestamptz not null default now(),
  result text not null,                   -- 'pass' | 'fail' | 'partial'
  items jsonb not null,                   -- [{ item_id, result, note, photo_path }]
  auto_generated_deviation_id uuid references public.deviations(id),
  ...
);
```

Trigger: `hygiene_checks INSERT WHERE result IN ('fail', 'partial')` → skapar automatiskt en `deviation` med kategorin `hygiene`.

### 6.6 Risk

```sql
create table public.risks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  clinic_id uuid,
  title text not null,
  description text,
  category text not null,                 -- från industry_templates.default_risk_categories
  probability int not null check (probability between 1 and 5),
  consequence int not null check (consequence between 1 and 5),
  risk_score int generated always as (probability * consequence) stored,
  mitigation_plan text,
  status text not null,                   -- 'identified' | 'mitigating' | 'monitoring' | 'closed'
  review_due_at timestamptz,
  ...
);
```

### 6.7 Compliance score (materialiserad vy alternativt nightly recalc)

```sql
create table public.compliance_scores (
  company_id uuid primary key references public.companies(id),
  overall_score int not null,             -- 0-100
  breakdown jsonb not null,               -- { documents: 95, deviations: 80, hygiene: 70, ... }
  computed_at timestamptz not null default now()
);
```

Beräknas av `compliance-recalc` Edge Function dagligen via `pg_cron` (se §11). Algoritm i 04-implementation-plan §6.

### 6.8 Customer & customer_records (Fas 8 — om aktiverat)

```sql
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  external_id text,                       -- ev BokaDirekt-ID
  full_name text not null,
  email text,
  phone text,
  personnummer_hash text,
  gdpr_consent_at timestamptz,
  health_declaration jsonb,               -- strukturerad, inte fritext-journal
  pdl_disclaimer_accepted_at timestamptz,
  ...
);

create table public.customer_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  clinic_id uuid not null,
  customer_id uuid not null references public.customers(id),
  treatment_date date not null,
  treatment_type text not null,
  treated_by uuid not null references public.profiles(id),
  product_batch_id uuid references public.medication_batches(id),
  dose numeric,
  area text,
  aftercare_given boolean not null default false,
  complications boolean not null default false,
  notes text check (char_length(notes) <= 500),  -- HÅRD GRÄNS
  -- INGA attachments här. Foton i separat tabell med eget samtycke.
  ...
);

create table public.treatment_photos (
  id uuid primary key default gen_random_uuid(),
  customer_record_id uuid not null references public.customer_records(id),
  storage_path text not null,
  consent_given_at timestamptz not null,
  ...
);
```

### 6.9 Externa behandlare / rumsuthyrning (Fas 9)

```sql
create table public.rental_agreements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  clinic_id uuid not null,
  external_practitioner_profile_id uuid not null references public.profiles(id),
  treatment_categories_allowed text[] not null,
  rooms_allowed text[],
  start_date date not null,
  end_date date,
  signed_at timestamptz,
  signature_method text,
  agreement_pdf_path text,
  ...
);
```

---

## 7. Audit logs

```sql
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid,
  clinic_id uuid,
  actor_profile_id uuid,
  actor_role_code text,
  action text not null,                   -- 'create' | 'update' | 'delete' | 'sign' | 'approve' | ...
  entity_type text not null,              -- 'deviation' | 'order' | 'document' | ...
  entity_id uuid,
  before jsonb,
  after jsonb,
  request_id text,                        -- spårning från createServerFn
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

-- INGA update/delete policies — append-only
create policy "audit_logs_select_company_member"
  on public.audit_logs for select
  using (company_id in (select public.current_company_ids()));

create policy "audit_logs_insert_authenticated"
  on public.audit_logs for insert
  with check (actor_profile_id = public.current_profile_id());

-- Inget UPDATE, inget DELETE → blockerat
```

Index: `(company_id, created_at desc)`, `(entity_type, entity_id, created_at desc)`.

Skrivs från `createServerFn` via helper `auditLog(ctx, { action, entityType, entityId, before, after })` — aldrig direkt från klient.

---

## 8. API-strategi

### 8.1 Beslutsregler

| Scenario | Var | Varför |
|---|---|---|
| CRUD på domän-entiteter | `createServerFn` | Behåller användarens JWT → RLS → ingen dubbel auth-logik |
| Workflows (avvikelse-status-byte, ordination-godkännande) | `createServerFn` | Samma anledning + transaktionell |
| Generering av signerade URL:er för upload | `createServerFn` | Auth-bunden |
| Realtime-prenumeration | **Direkt från klient** via `supabase.channel(...)` | RLS gäller |
| Enkel läsning av icke-känslig data | **Direkt från klient** via `supabase.from(...)` | RLS gäller; sparar en RPC |
| Stripe-webhook | Edge Function | Offentlig endpoint, signaturverifiering, service_role |
| BankID-callback | Edge Function | Extern POST utan användar-JWT |
| PDF-generering (audit-paket) | Edge Function | `pdf-lib` i Deno-runtime; Workers kan inte köra det |
| Schemalagda jobb | Edge Function + `pg_cron` | Compliance-score, delegerings-utgång, hygien-påminnelser |

### 8.2 `createServerFn`-mönster

Fil-konvention: `src/lib/<module>.functions.ts`.

```ts
// src/lib/deviations.functions.ts
import { createServerFn } from "@tanstack/start"
import { z } from "zod"
import { requireSupabaseAuth, requirePermission, auditLog } from "./_helpers"

const CreateDeviationSchema = z.object({
  company_id: z.string().uuid(),
  clinic_id: z.string().uuid(),
  category: z.enum(["hygiene", "medication", "treatment", "equipment", "other"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional(),
})

export const createDeviation = createServerFn({ method: "POST" })
  .validator(CreateDeviationSchema)
  .handler(async ({ data }) => {
    const ctx = await requireSupabaseAuth()
    await requirePermission(ctx, "deviation.create", data.company_id)

    const { data: row, error } = await ctx.supabase
      .from("deviations")
      .insert({
        ...data,
        tenant_id: ctx.tenantId,
        ref_no: await generateDeviationRef(ctx.supabase, data.company_id),
        status: "reported",
        reported_by: ctx.profileId,
        created_by: ctx.profileId,
      })
      .select()
      .single()

    if (error) return { ok: false as const, error: error.message, request_id: ctx.requestId }

    await auditLog(ctx, {
      action: "create",
      entityType: "deviation",
      entityId: row.id,
      after: row,
    })

    return { ok: true as const, data: row, request_id: ctx.requestId }
  })
```

### 8.3 `_helpers.ts`-skiss

```ts
// src/lib/_helpers.ts
import { createServerFn } from "@tanstack/start"
import { createServerClient } from "@supabase/ssr"
import { getCookie } from "@tanstack/start/server"

export async function requireSupabaseAuth() {
  const cookies = parseCookies()
  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      get: (name) => getCookie(name),
      set: () => {},     // ignoreras på server
      remove: () => {},
    },
  })

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new UnauthorizedError()

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, tenant_id")
    .eq("auth_user_id", user.id)
    .single()

  if (!profile) throw new UnauthorizedError("profile_not_found")

  return {
    supabase,
    user,
    profileId: profile.id,
    tenantId: profile.tenant_id,
    requestId: crypto.randomUUID(),
  }
}

export async function requirePermission(
  ctx: Awaited<ReturnType<typeof requireSupabaseAuth>>,
  permission: string,
  companyId: string,
) {
  const { data, error } = await ctx.supabase
    .rpc("has_permission", { required_perm: permission, scope_company_id: companyId })
  if (error || !data) throw new ForbiddenError(permission)
}

export async function requireWritableSubscription(ctx, companyId: string) {
  const { data } = await ctx.supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("company_id", companyId)
    .single()
  if (!data || !["trialing", "active"].includes(data.status)) {
    throw new ForbiddenError("subscription_read_only")
  }
}

export async function auditLog(ctx, entry: { action: string; entityType: string; entityId?: string; before?: unknown; after?: unknown }) {
  await ctx.supabase.from("audit_logs").insert({
    tenant_id: ctx.tenantId,
    actor_profile_id: ctx.profileId,
    action: entry.action,
    entity_type: entry.entityType,
    entity_id: entry.entityId,
    before: entry.before,
    after: entry.after,
    request_id: ctx.requestId,
  })
}
```

---

## 9. Standardiserat API-svar

Alla `createServerFn`-handlers returnerar:

```ts
type ApiResult<T> =
  | { ok: true; data: T; request_id: string; meta?: Record<string, unknown> }
  | { ok: false; error: string; error_code?: string; request_id: string; field_errors?: Record<string, string> }
```

`error_code` är maskinläsbart (`version_conflict`, `forbidden`, `feature_disabled`, `subscription_read_only`, `validation_failed`). Frontend mappar `error_code` → toast/inline-meddelande, inte rå `error`-text.

---

## 10. Edge Function-katalog

| Funktion | Trigger | Auth | Syfte |
|---|---|---|---|
| `stripe-webhook` | Stripe HTTP POST | Signaturverifiering | Uppdaterar `subscriptions` + `company_features` |
| `bankid-callback` | BankID-leverantör POST | Token i URL + sessionsverifiering | Markerar signering klar, uppdaterar `document_signatures` eller `orders` |
| `audit-export` | `createServerFn` initierar, Edge utför asynkront | Service_role + intern token | Genererar ZIP + signed URL i Storage |
| `compliance-recalc` | `pg_cron` nightly | Service_role | Beräknar `compliance_scores` per bolag |
| `delegation-expiry-check` | `pg_cron` dagligen | Service_role | Skickar notiser för delegeringar som löper ut inom 14 dagar |
| `medication-expiry-check` | `pg_cron` dagligen | Service_role | Notiser om batchar som går ut |
| `hygiene-schedule-tick` | `pg_cron` varje timme | Service_role | Skapar `hygiene_check`-uppgifter när `next_due_at` passerar |
| `inspector-token-create` | `createServerFn` initierar | Användarens JWT (via createServerFn) | Skapar tidsbegränsad inspektörstoken |

Edge Functions ligger i `supabase/functions/<name>/index.ts`, deployas via Supabase CLI.

---

## 11. pg_cron-jobb

Aktiveras via Supabase Dashboard eller migration:

```sql
select cron.schedule('compliance-recalc-nightly', '0 2 * * *',
  $$ select net.http_post(
    url := 'https://<project>.supabase.co/functions/v1/compliance-recalc',
    headers := '{"Authorization": "Bearer <service_role>"}'::jsonb
  ) $$);

select cron.schedule('delegation-expiry-daily', '0 7 * * *',
  $$ select net.http_post(url := '...delegation-expiry-check', ...) $$);

select cron.schedule('hygiene-schedule-hourly', '0 * * * *',
  $$ select net.http_post(url := '...hygiene-schedule-tick', ...) $$);
```

Service_role-token lagras som Supabase Vault secret, inte i klartext i SQL.

---

## 12. Migrations-disciplin

- **En migration per logisk ändring** (inte en stor "fas-1.sql" med 50 tabeller)
- Filnamn: `YYYYMMDDHHMMSS_<beskrivande_snake_case>.sql` — workflow-regex `^[0-9]{14}_.*\.sql$` är obligatorisk; filer som inte matchar appliceras inte
- Aldrig redigera en redan deployad migration — alltid ny migration (auto-apply gör äldre filer immutable så snart de står som applied i `supabase_migrations.schema_migrations`)
- Varje migration är idempotent där möjligt (`if not exists`, `create or replace`)
- RLS-policies som rör en tabell ligger i samma migration som tabellen skapas
- **GRANT-mönster i varje migration som skapar tabell:** följ Lovables `<public-schema-grants>`-block — schema-grant (`GRANT USAGE ON SCHEMA public TO ...`), default-privilegier (`ALTER DEFAULT PRIVILEGES`), och per-tabell-grant (`GRANT SELECT, INSERT, UPDATE, DELETE ... TO authenticated`). Utan grants får runtime-fel i Supabase REST/Realtime. (Lovables säkerhetsskanner körs **inte** på auto-applicerade migreringar — så grants är vårt ansvar, inte verifieras av plattformen.)
- Seeds (roller, permissions, plans, industry_templates) i separata `seed_*`-migrationer
- **Auto-apply via `.github/workflows/migration-drift-check.yml`:** push av `supabase/migrations/*.sql` till `main` triggar workflow:n som jämför filer mot `supabase_migrations.schema_migrations` på Lovable Cloud-DB:n och applicerar pending i ordning. Varje migration körs atomiskt (`BEGIN; <SQL>; INSERT version; COMMIT;`). Failed migration stoppar resten och öppnar GitHub-issue med labels `migrations`, `automated`, `failed`. PR mot main gör dry-run + listar pending i en kommentar — applicerar inget förrän merge.

---

*Slut på 02-database-api. Vidare till 03-frontend-guide.md för routing, SSR och UI-patterns.*
