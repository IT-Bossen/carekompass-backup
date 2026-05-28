# CareKompass v6.0 — v4-mapping & overrides

> **Serie:** 01-system-spec · 02-database-api · 03-frontend-guide · 04-implementation-plan · 05-domain-content · 06-conventions · **07-v4-mapping-and-overrides** · 08-public-and-admin
> **Källa:** v4-dokumentationen på `github.com/tonikazarian/carekompass-2-0-6882b4c8/tree/main/docs/export` (publik export per 2026-05-26)
> **Syfte:** Konkret v4 → v6 mappning så att Claude Code förstår vad som ärvs, vad som byggs om, vad som skippas. Innehåller också **överstyrningar** av tidigare beslut i 01-06.

---

## ⚠ Överstyrningar av tidigare beslut

Denna fil ändrar/förfinar följande:

| Område | Tidigare beslut (01-06) | Nytt beslut (denna fil) | Anledning |
|---|---|---|---|
| **Rollmodell** | 13 separata roller (05 §1) | **Hierarkiska roller + kapabilitetsflaggor + utbyggbara subroller** (§2 nedan) | v4 har mer skalbar modell, redan validerad i produktion |
| **Prismodell** | Per klinik (01 §5) | **Per-användare ovanpå paketpris; consulting practitioners räknas inte** (§3 nedan) | v4-modell, mer rättvis och redan etablerad |
| **Tabellnamn** | `documents`, `medications`, `hygiene_*`, `orders+delegations` (02) | **Behåll v4-namn där möjligt** (§4 nedan) | Underlättar dataimport och hjälper folk som redan känner v4 |
| **Audit-loggar** | En tabell `audit_logs` (02 §7) | **Två tabeller: `audit_logs` (plattform) + `module_audit_logs` (per modul)** (§4 nedan) | v4-mönstret, bättre query-performance och separation |
| **Onboarding** | Auto-trial (04 §3) | **Manuell godkännande av systemadmin med option för auto-trial** (08 §4) | v4-modell, ger kontroll över vilka som onboardas; auto-trial som FUTURE-toggle |
| **AI-leverantör** | Anthropic/OpenAI med egen nyckel | **Lovable AI Gateway** — Gemini-modeller, ingen separat nyckel (§5.4) | Beslut 09 §9. Mindre secrets, inbyggt i plattformen |
| **Betalning** | Egna Stripe Edge Functions (07 §5.1) | **Lovable Stripe-payments** (`enable_stripe_payments`) (§5.4) | Beslut 09 §14. Mindre custom kod, Lovable hanterar webhooks |

Resten av 01-06 gäller oförändrat.

---

## Innehåll

1. v4 → v6 koncept-mappning på toppnivå
2. **Ny rollmodell** (ersätter 05 §1)
3. **Ny prismodell** (ersätter 01 §5)
4. Tabell-rename + ny audit-modell
5. Edge function-katalog (alla 26 från v4 → v6-destination)
6. Hooks-mapping (v4 → v6)
7. Module template-pattern (ärvs från v4)
8. Feature-parity-inventory per modul
9. Genuint nya features i v6 (utöver v4)
10. Migration-strategi (v4-data → v6)
11. Cutover-plan med rollback

---

## 1. v4 → v6 koncept-mappning

| v4 | v6 | Anmärkning |
|---|---|---|
| React 18 + Vite 5 + Tailwind v3 + React Router | React 19 + TanStack Start + Vite 7 + Tailwind v4 + filbaserad routing | Stack-byte |
| `src/integrations/supabase/client.ts` | `src/lib/supabase.client.ts` + `src/lib/supabase.server.ts` | Klient + server-factory |
| 26 Edge Functions | Hybrid: `createServerFn` (~80%) + Edge Functions (~20%) | Se §5 |
| 17 hooks i `src/hooks/` | Liknande set, anpassad mot TanStack Start | Se §6 |
| `src/pages/modules/` med React.lazy | `src/routes/_app/<module>/` med native route-splitting | Se 03 §2 |
| `useSelectedClinic` (localStorage) | `setActiveClinic` via cookie + router context | SSR-vänligt |
| `ModuleGuard` (UI-skydd) | `beforeLoad` på route-grupp + RLS-policies | Säkerhet via RLS, UX via beforeLoad |
| `RoutePreloader` (förladdning) | TanStack Router native preload på `Link`-hover | Bättre integration |
| `compliance_exports` | Behålls som tabell, körs via Edge Function | Se 04 Fas 5 |
| `module_audit_logs` med `action='deviation.*'` | Behåll mönstret | §4 nedan |
| `subscription_plans`, `plan_features`, `company_modules` | Översätts till `plans`, `plan_feature_defaults`, `company_features` (02 §4) | Bibehåll konceptet, byt namn för konsekvens med v6-konventioner |
| Static i `tailwind.config.ts` | `@theme inline` i `app.css` | Tailwind v4-syntax |

---

## 2. Ny rollmodell (ersätter 05 §1)

### 2.1 Tre lager

```
LAGER 1: Hierarkisk roll (vad användaren är)
  ├─ Företagsnivå:  Owner | Manager | Quality Manager | Member
  └─ Kliniknivå:    Clinic Manager | Staff | Auditor

LAGER 2: Kapabilitetsflaggor (vad användaren får göra extra)
  ├─ Licensed Practitioner
  ├─ Medication Custodian
  ├─ Hygiene Lead
  └─ Consulting Practitioner

LAGER 3: Staff-subroll (för Staff-rollen, branschanpassad)
  ├─ Standard:     Sjuksköterska | Läkare | Tandläkare
  └─ Utbyggbara:   Tatuerare | Piercare | Fotvårdare | <eget>
```

### 2.2 Hierarkiska roller

**Företagsnivå (`company_users.role`):**

| Roll | Sammanfattning |
|---|---|
| `owner` | Full kontroll. Skapar företaget. Hanterar billing, kliniker, all personal. Kan ge sig själv kliniska kapabiliteter (med audit-log). Kan nedgradera egna rättigheter. |
| `manager` | Operativ administration. Inviterar personal, hanterar moduler, ser allt. Ingen billing. |
| `quality_manager` | Klinikens **egen** kvalitetsansvarige. Äger kvalitetsmoduler (dokument, avvikelser, risk, compliance), attesterar, följer upp egenkontroll. Detta är vårdgivarens interna granskare — **inte** CareKompass. Se 01 §7.0. |
| `member` | Standard företagskoppling utan automatiska klinikrättigheter. Vidare permissions kräver clinic assignment. |

> **Krav (01 §7.0):** Varje bolag **måste ha minst en `quality_manager`** innan onboarding kan slutföras. Egenkontroll får aldrig vara herrelös. För större organisationer kan `quality_manager` även tilldelas per klinik via `clinic_assignments` (se granularitet i 09 §16). CareKompass är verktyget — kvalitetsansvaret bärs alltid av en namngiven person inom vårdgivaren.

**Kliniknivå (`clinic_assignments.role`):**

| Roll | Sammanfattning |
|---|---|
| `clinic_manager` | Full kontroll på tilldelad klinik. |
| `staff` | Operativ åtkomst enligt subroll (§2.4). |
| `auditor` | Läsbehörighet för revision. |

En användare har **en** företagsroll per företag, och **noll-till-många** klinikroller. Owner och Manager har implicit full klinik-åtkomst (utan separat assignment).

### 2.3 Kapabilitetsflaggor

Sätts per individ utöver rollen (`company_users.capabilities` eller separat `user_capabilities`-tabell):

| Flagga | Effekt | Krav |
|---|---|---|
| `is_licensed_practitioner` | Krävs för ordination, attestering, injektionsbehandling. | Validerad legitimation på profilen (`license_type`, `license_no`, `valid_to`). |
| `is_medication_custodian` | Utökat ansvar för läkemedelslager (kassation, batch-godkännande). | – |
| `is_hygiene_lead` | Ägaransvar för hygienprogram (godkänner checklist-mallar, ansvarig vid avvikelse). | – |
| `is_consulting_practitioner` | Extern läkare/tandläkare med begränsad åtkomst. | Måste vara `is_licensed_practitioner = true`. |

Flaggor kan kombineras (Owner kan vara `licensed_practitioner + medication_custodian + hygiene_lead`).

### 2.4 Staff-subroller (utbyggbara per bransch)

Tabell `staff_subroles`:

```sql
create table public.staff_subroles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id),   -- null = systemmall
  code text not null,
  display_name text not null,
  is_practitioner boolean not null default false,
  can_perform_injections boolean not null default false,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (company_id, code)
);
```

**Standard-subroller** (seedade per industry_template):

| industry_template | Subroller | Notering |
|---|---|---|
| `estetisk_injektion` | Sjuksköterska, Läkare, Tandläkare | Standard svenska vården |
| `tandvard_estetik` | Läkare, Tandläkare, Tandhygienist | |
| `estetisk_kirurgi` | Läkare, Sjuksköterska, Undersköterska | |
| `piercing_tatuering` | Tatuerare, Piercare | `is_practitioner = true`, `can_perform_injections = false` |
| `fotvard` | Medicinsk fotvårdare, Diplomerad fotvårdare | |
| `laser_ipl` | Läkare, Sjuksköterska, Estetiker (laser) | |

**Företag kan skapa egna subroller** (`company_id IS NOT NULL`) — t.ex. "Senior tatuerare" med samma flaggor som "Tatuerare" men annan rapport-tillhörighet.

### 2.5 RLS-implementation (avviker från 05 helper-funktioner)

Ersätt mina `current_company_ids()` / `has_role()` med v4-mönster:

```sql
-- Är användaren medlem i företaget?
create or replace function public.is_member_of_company(_user_id uuid, _company_id uuid)
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from public.company_users
    where user_id = _user_id and company_id = _company_id
      and (revoked_at is null or revoked_at > now())
  );
$$;

-- Är användaren tilldelad kliniken?
create or replace function public.is_assigned_to_clinic(_user_id uuid, _clinic_id uuid)
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from public.clinic_assignments
    where user_id = _user_id and clinic_id = _clinic_id
      and (revoked_at is null or revoked_at > now())
  );
$$;

-- Har användaren rollen X i företaget?
create or replace function public.has_company_role(_user_id uuid, _company_id uuid, _role text)
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from public.company_users
    where user_id = _user_id and company_id = _company_id and role = _role
      and (revoked_at is null or revoked_at > now())
  );
$$;

-- Har användaren kapabiliteten X i företaget?
create or replace function public.has_capability(_user_id uuid, _company_id uuid, _capability text)
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from public.user_capabilities
    where user_id = _user_id and company_id = _company_id and capability = _capability
      and (revoked_at is null or revoked_at > now())
  );
$$;
```

### 2.6 Permission-checks i Edge Functions / createServerFn

Eftersom kapabiliteter inte är RLS-baserade (de är beslutsregler, inte access-kontroll), kontrolleras de i `createServerFn`:

```ts
// I createOrder
const canOrder = await ctx.supabase.rpc("has_capability", {
  _user_id: ctx.userId, _company_id: companyId, _capability: "is_licensed_practitioner"
})
if (!canOrder.data) return apiError("forbidden", "Endast legitimerad behandlare kan ordinera.")
```

RLS skyddar **vad du kan se**, kapabilitetschecks skyddar **vad du kan göra**.

### 2.7 Consulting Practitioner (extern läkare)

Är **inte** en separat roll utan en kapabilitetsflagga ovanpå `is_licensed_practitioner`:

- Användaren är `Member` på företagsnivå (eller har **inget** företagsmedlemskap — bara `consulting_assignments`)
- Har `is_consulting_practitioner = true`
- Får **endast** Ordination & Delegation-modul
- Får endast valda kliniker via `consulting_assignments`-tabell
- `consulting_assignments` finns kvar enligt 02-database-api §3.4

Detta är cleanare än min v6-konstruktion med 13 roller där `consulting_practitioner` var en separat roll.

---

## 3. Ny prismodell (ersätter 01 §5)

### 3.1 Tre komponenter

```
Total månadskostnad = Paketpris + (Antal vanliga användare × Per-seat-pris) + ev. tillägg
```

- **Paketpris** — basabonnemang per företag (inkl. 1 klinik). Bestämmer vilka moduler som är aktiva.
- **Per-seat-pris** — månadskostnad per användare ovanpå paketet. Räknar **alla användare med `company_users`-rad** utom de med `is_consulting_practitioner = true`.
- **Tillägg** — extra kliniker, extra storage, BankID-volymer, BokaDirekt-integration (om relevant).

### 3.2 Vad räknas som "seat"?

| Användare | Räknas som seat? |
|---|---|
| Owner / Manager / QM / Member | ✓ |
| Clinic Manager / Staff / Auditor | ✓ |
| `is_consulting_practitioner = true` (oavsett hierarkisk roll) | ✗ |
| Inspector token (tillfällig) | ✗ |
| Inbjuden men ännu inte accepterat | ✗ |
| Revoked (`revoked_at IS NOT NULL`) | ✗ |

### 3.3 Schema-justering (utöver 02 §4)

```sql
-- Lägg till på subscriptions:
alter table public.subscriptions
  add column included_seats int not null default 5,
  add column extra_seat_price_sek int not null default 0,
  add column additional_clinic_count int not null default 0,
  add column additional_clinic_price_sek int not null default 0;

-- Trigger som räknar aktuella seats per företag
create or replace function public.count_billable_seats(_company_id uuid)
returns int
language sql stable
as $$
  select count(*)::int
  from public.company_users cu
  where cu.company_id = _company_id
    and cu.accepted_at is not null
    and cu.revoked_at is null
    and not exists (
      select 1 from public.user_capabilities uc
      where uc.user_id = cu.user_id and uc.company_id = cu.company_id
        and uc.capability = 'is_consulting_practitioner'
    );
$$;
```

### 3.4 Stripe-modellering

- En `stripe_subscription` per företag
- Två `stripe_price_id` per plan: base + per-seat
- Quantity uppdateras via webhook när seat-count ändras (`company_users` insert/revoke)
- Edge Function `subscription-seat-sync` triggas på `company_users.INSERT`/`UPDATE`

### 3.5 Plan-tabell-justering

```sql
-- subscription_plans-utvidgning
alter table public.subscription_plans
  add column included_seats int not null default 5,
  add column extra_seat_price_sek int not null default 100,
  add column stripe_base_price_id text,
  add column stripe_seat_price_id text;
```

### 3.6 Plan-katalog (förslag — slutgiltigt prissatt av Toni)

| Plan | Pris (bas) | Inkl. seats | Extra seat | Inkl. kliniker | Extra klinik | Moduler |
|---|---|---|---|---|---|---|
| **Trial** | 0 kr, 14 dagar | 10 | 0 kr | 1 | – | Alla |
| **Starter** | 495 kr/mån | 3 | 95 kr | 1 | 295 kr | Dokument, Avvikelser, Hygien (basic) |
| **Pro** | 1 295 kr/mån | 5 | 145 kr | 1 | 395 kr | + Läkemedel, Ordination, Risk, Compliance |
| **Enterprise** | offert | 25+ | offert | 5+ | offert | + BankID, BokaDirekt, custom integrationer |

---

## 4. Tabell-rename + ny audit-modell

### 4.1 Tabell-rename (v4-namn vinner där tillämpligt)

| 02 (v6 förslag) | Ny v6-namnsättning (v4-konsistent) |
|---|---|
| `companies` | **`companies`** (oförändrat) |
| `clinics` | **`clinics`** (oförändrat) |
| `memberships` | **`company_users`** + **`clinic_assignments`** (två tabeller, v4-mönster) |
| `documents`, `document_versions`, `document_signatures` | **`policy_documents`**, **`policy_document_versions`**, **`policy_document_signatures`**, **`policy_categories`** |
| `deviations`, `deviation_actions`, `deviation_attachments` | **`deviations`**, **`deviation_actions`**, **`deviation_attachments`** (oförändrat) |
| `medications`, `medication_batches`, `medication_usages`, `medication_temperature_logs` | **`medication_items`**, **`medication_batches`**, **`medication_logs`**, **`medication_temperature_logs`** |
| `orders`, `delegations` | **`delegations`** + **`delegation_audits`** (v4 sammanfogar i en delegations-tabell; vi behåller v4-modell men lägger till `delegation_orders` som join-tabell om både ordination och delegation hanteras) |
| `hygiene_schedules`, `hygiene_checks`, `hygiene_checklist_templates` | **`checklist_templates`**, **`checklist_categories`**, **`checklists`**, **`checklist_items`**, **`checklist_responses`**, **`recurring_checklists`** |
| `risks` | **`risks`** (oförändrat) |
| `customers`, `customer_records` | **`customers`**, **`customer_records`** (oförändrat, men kvar med PDL-begränsning från 02 §6.8) |
| `audit_logs` | **`audit_logs`** + **`module_audit_logs`** (två tabeller, §4.2) |
| `subscriptions` | **`subscriptions`** (oförändrat) |
| `plans` | **`subscription_plans`** (v4-namn) |
| `plan_feature_defaults` | **`plan_features`** (v4-namn) |
| `company_features` | **`company_modules`** (v4-namn) |
| `notifications` | **`notifications`** (oförändrat) |
| `inspector_tokens` | **`inspector_tokens`** (oförändrat) |
| `rental_agreements` | **`rental_agreements`** (oförändrat) |
| – | **`news`** (ny, för plattformsnyheter — se 08) |
| – | **`user_sessions`** (ny, inloggningsspår — se 08) |
| – | **`compliance_exports`** (ny, exportlog — Fas 5) |
| – | **`staff_subroles`** (ny, §2.4) |
| – | **`user_capabilities`** (ny, §2.3) |

### 4.2 Audit-modell

**Två separata tabeller** (v4-mönster):

```sql
-- Plattformsövergripande
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  company_id uuid,
  actor_user_id uuid,
  actor_role text,
  action text not null,           -- 'auth.login', 'company.created', 'role.granted', 'impersonation.start', ...
  target_user_id uuid,
  metadata jsonb,
  ip_address inet,
  user_agent text,
  request_id text,
  created_at timestamptz not null default now()
);
create index on public.audit_logs (company_id, created_at desc);
create index on public.audit_logs (actor_user_id, created_at desc);

-- Per modul (mer detaljerat, högre volym)
create table public.module_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  clinic_id uuid,
  actor_user_id uuid not null,
  module text not null,           -- 'deviation' | 'medication' | 'document' | 'risk' | ...
  action text not null,           -- 'deviation.created' | 'medication.attested' | 'document.published' | ...
  entity_id uuid,
  before jsonb,
  after jsonb,
  request_id text,
  created_at timestamptz not null default now()
);
create index on public.module_audit_logs (company_id, module, created_at desc);
create index on public.module_audit_logs (entity_id, created_at desc);

-- Plus dedikerad delegation-audit (v4 har egen)
create table public.delegation_audits (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  clinic_id uuid,
  delegation_id uuid references public.delegations(id),
  actor_user_id uuid not null,
  action text not null,           -- 'created' | 'approved' | 'rejected' | 'revoked' | 'expired' | 'executed'
  reason text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

**Varför två tabeller:**
- `audit_logs` används av admin för "vem gjorde vad övergripande", söks sällan men måste behållas länge
- `module_audit_logs` används av varje modul för entity-historik, söks ofta men kan rensas tidigare (om retention tillåter)
- Performance: en kombinerad tabell blir snabbt enorm; separationen håller index varma

### 4.3 Action-namnsmönster

```
<modul>.<action>
```

Exempel:
```
auth.login, auth.logout, auth.failed_attempt
company.created, company.approved, company.suspended
user.invited, user.accepted_invite, user.revoked
role.granted, role.revoked
capability.granted, capability.revoked
deviation.created, deviation.assigned, deviation.status_changed, deviation.closed
medication.created, medication.batch_added, medication.dispensed, medication.attested, medication.discarded
document.created, document.version_published, document.signed, document.archived
risk.created, risk.assessed, risk.action_added, risk.closed
delegation.created, delegation.approved, delegation.rejected, delegation.revoked
order.created, order.approved, order.executed   (om vi separerar)
hygiene.checklist_started, hygiene.checkpoint_responded, hygiene.checklist_completed
compliance.export_started, compliance.export_completed
impersonation.start, impersonation.end
```

---

## 5. Edge function-katalog (v4 → v6)

### 5.1 Mappning av alla 26

| v4-funktion | v6-destination | Anmärkning |
|---|---|---|
| `create-company` | **Edge Function** (behåll) | Skapar företag, default-roller, modul-aktivering. Service_role behövs för cross-tenant setup. |
| `invite-user` | **createServerFn** | Skickar email via Lovable Cloud Email. RLS gäller, JWT räcker. |
| `delete-user` | **Edge Function** (behåll) | GDPR-radering. Service_role behövs för cross-table anonymisering. |
| `create-subscription` | **Lovable Stripe-payments** (`enable_stripe_payments`) | Lovable hanterar checkout-flödet. Se §5.4. |
| `create-annual-subscription` | **Lovable Stripe-payments** | Samma, annan price. |
| `manage-subscription` | **Lovable Stripe-payments** | Lovable Customer Portal. |
| `subscription-webhook` | **Lovable Stripe-payments** | Lovable hanterar webhook-mottagning + signaturverifiering. Vår kod läser resultatet via Supabase. Se §5.4. |
| `calculate-prorated-billing` | **createServerFn** | Pure computation, ingen extern API-anrop |
| `create-invoice` | **createServerFn** | |
| `create-manual-invoice` | **createServerFn** | |
| `void-invoice` | **createServerFn** | + Stripe API-anrop |
| `get-all-invoices` | **createServerFn** | |
| `get-all-payments` | **createServerFn** | |
| `get-all-subscriptions` | **createServerFn** | |
| `get-billing-stats` | **createServerFn** | |
| `process-refund` | **createServerFn** | + Stripe API-anrop |
| `retry-payment` | **createServerFn** | + Stripe API-anrop |
| `checklist-renewal` | **Edge Function** + pg_cron | Schemalagd via pg_cron, måste vara Edge Function |
| `manual-checklist-renewal` | **createServerFn** | Manuell trigger från admin |
| `categorize-checkpoints` | **Edge Function** (behåll) | AI-anrop via **Lovable AI Gateway** — ingen separat API-nyckel. Se §5.4. |
| `analyze-hygiene-priorities` | **Edge Function** (behåll) | Samma, via Lovable AI Gateway. Se §5.4. |
| `send-contact-email` | **Edge Function** (behåll) | Publik endpoint, ingen JWT |
| `send-document-review-notification` | **createServerFn** | JWT-baserad, Lovable Cloud Email |
| `send-email-resend` | **createServerFn** | Wrapper för Resend API |
| `send-email-microsoft365` | **createServerFn** | Wrapper för MS365-connector |
| `secret-expiry-check` | **Edge Function** + pg_cron | Schemalagd kontroll av API-nycklars utgångsdatum |

### 5.2 Nya Edge Functions i v6 (från 02 §10)

| Funktion | Anledning |
|---|---|
| `bankid-callback` | Extern POST utan JWT (Fas 10) |
| `audit-export` | PDF-generering med `pdf-lib`, Deno-runtime krävs (Fas 5) |
| `compliance-recalc` | Schemalagd via pg_cron (Fas 5) |
| `delegation-expiry-check` | Schemalagd (Fas 3) |
| `medication-expiry-check` | Schemalagd (Fas 3) |
| `hygiene-schedule-tick` | Schemalagd (Fas 4) |
| `subscription-seat-sync` | Trigger på `company_users` ändring → Stripe quantity update |
| `audit-log-archive` | Årlig arkivering till kall storage (Fas 5+) |

### 5.3 Totalsumma

| Kategori | Antal |
|---|---|
| Edge Functions från v4 (behållna) | 5 (AI ×2, contact-email, checklist-renewal, secret-expiry-check) |
| Edge Functions nya i v6 | 8 |
| Stripe-funktioner → Lovable inbyggda | 11 (ersatta av `enable_stripe_payments`) |
| **Totalt egna Edge Functions i v6** | **~13** |
| `createServerFn`-handlers (CRUD + workflows) | ~50+ |

### 5.4 Lovable-plattformstjänster (beslut 09 §9, §14, §13)

Tre v4-områden ersätts av Lovable-plattformens inbyggda tjänster i v6. Detta minskar mängden custom-kod, secrets och webhooks avsevärt.

#### AI — Lovable AI Gateway (09 §9)

All AI går via **Lovable AI Gateway** — ingen separat OpenAI/Anthropic-nyckel, ingen AI-secret att hantera.

| Användning | Modell | Var |
|---|---|---|
| Rekommendationer, chat, lättviktig kategorisering | `google/gemini-3-flash-preview` | Edge Functions + ev. createServerFn |
| Komplex matchning, bildanalys (fotobevis, före/efter) | `google/gemini-2.5-pro` | Edge Functions |

Konkret påverkan:
- `categorize-checkpoints` och `analyze-hygiene-priorities` anropar Lovable AI Gateway med `gemini-3-flash-preview` (kategorisering) respektive `gemini-2.5-pro` (prioriteringsanalys).
- **AI-driven sök/matchning** kan introduceras i **Fas 3** via gateway — t.ex. matcha läkemedel/produkter eller kund-dedupe i command palette. MVP-sök är manuell text/Postgres-sök (03 §13); ett ev. AI-lager läggs ovanpå senare. (Org.nr-verifiering mot myndighet är ett separat FUTURE-spår — se 09 §13.)
- Bildanalys (`gemini-2.5-pro`) blir tillgänglig för fotobevis-granskning (hygien Fas 4) och ev. före/efter-jämförelse (Fas 8).
- Ingen `AI_API_KEY`-secret i 06 §5.3 — ta bort den raden; gateway autentiseras av Lovable-plattformen.

#### Betalning — Lovable Stripe-payments (09 §14)

Aktiveras via Lovables `enable_stripe_payments`. Lovable hanterar Stripe-integrationen (checkout, customer portal, webhook-mottagning, signaturverifiering).

Konkret påverkan:
- De 11 Stripe-relaterade v4-Edge-Functions ersätts — vi bygger **inte** egen `subscription-webhook`, `create-subscription`, etc.
- Vår kod **läser** prenumerationsstatus från den tabell Lovable Stripe-payments skriver till (eller via Lovable-API), och speglar in i `company_modules`/`subscriptions` för feature-gating.
- `subscription-seat-sync` (07 §5.2) blir tunnare: den justerar seat-quantity mot Lovable Stripe-payments API istället för rå Stripe API.
- **Test-miljö fungerar direkt.** Live-läge kräver senare Stripe-verifiering (Toni gör det inför public launch).
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` i 06 §5.3 hanteras av Lovable — inte våra egna secrets. Endast ev. `STRIPE_PUBLISHABLE_KEY` om vi behöver klient-referens.
- Prismodellen (07 §3, seat-baserad) gäller fortfarande — den uttrycks som Stripe products/prices som Lovable Stripe-payments använder.

#### Email — Lovable Cloud Email + Resend backup (09 §10)

- Primär: **Lovable Cloud Email** (Fas 1) för invites, notiser, avtalsutskick.
- Backup: **Resend** kopplas in om Lovable-limits nås.
- Microsoft 365-connector skippas.

#### Konsekvens för secrets-tabellen (06 §5.3)

| Secret | v6-status |
|---|---|
| `AI_API_KEY` | ❌ Behövs inte — Lovable AI Gateway |
| `STRIPE_SECRET_KEY` | ❌ Hanteras av Lovable Stripe-payments |
| `STRIPE_WEBHOOK_SECRET` | ❌ Hanteras av Lovable Stripe-payments |
| `RESEND_API_KEY` | ⚠ Endast om/när Resend-backup aktiveras |
| `SUPABASE_*` | ✅ Kvar enligt 06 §5.3 |

---

## 6. Hooks-mapping (v4 → v6)

### 6.1 Auth & kontext

| v4 | v6 | Anmärkning |
|---|---|---|
| `useAuth` | `useAuth` (samma idé, ny implementation) | Använder Supabase Auth direkt + TanStack Start session |
| `useUserCompanies` | `useUserCompanies` | |
| `useUserClinics` | `useUserClinics` | |
| `useSelectedClinic` (localStorage) | `useActiveContext` (cookie + router context) | SSR-vänligt |
| `useEnabledModules` | `useFeatureFlags` + `isModuleEnabled(key)` | Samma idé, ny API |

### 6.2 Data-hooks

| v4 | v6 | Anmärkning |
|---|---|---|
| `useDeviations` | `useQuery({ queryKey: ["deviations", ...], queryFn: () => listDeviations(...) })` | Inline TanStack Query med createServerFn |
| `useCustomersPaginated` | Samma mönster | |
| `useCustomerStats` | Samma | |
| `useNavigationCounts` | `useNavigationCounts` (behåll namn, ny implementation) | Polled var 30s + realtime invalidation |
| `useSubscription` | `useSubscriptionStatus` (06 §5.5) | Lite annorlunda API |
| `useSubscriptionPlans` | `useQuery(["plans"])` | |
| `useAuditTrail` | `useAuditTrail` (behåll namn) | |
| `useModuleAuditTrail` | `useModuleAuditTrail` (behåll namn) | |
| `useClinicDataCheck` | `useClinicDataCheck` (behåll namn) | Guard för modulanvändning |
| `useRoutePreloader` | TanStack Router native | Tas bort, ersätts av preload på `<Link>` |

### 6.3 UI-hooks

| v4 | v6 | Anmärkning |
|---|---|---|
| `use-mobile` | `useMediaQuery("(max-width: 768px)")` | Tas bort som dedikerad hook, generic helper |
| `use-toast` | shadcn sonner direkt | |

### 6.4 Nya hooks i v6 (från 03)

- `usePermissions(module)` — kapabilitets-aware permissions
- `useTerminology()` — industry_template terminology
- `useRealtimeChannel(...)` — wrapper för supabase.channel
- `useFeatureRollout(featureKey)` — ship-flag check (06 §15.4)

---

## 7. Module template-pattern

v4 har `src/templates/ModuleTemplate.tsx` + `module-migration.sql` som mall för nya moduler. **Behåll detta mönster i v6.**

### 7.1 Förslag på struktur

```
src/templates/
├── ModuleRoute.tsx.template       # Mall för src/routes/_app/<module>/index.tsx
├── ModuleDetail.tsx.template      # Mall för src/routes/_app/<module>/$id.tsx
├── ModuleForm.tsx.template        # Mall för Form-komponent
├── module.functions.ts.template   # Mall för createServerFn-fil
├── module.schemas.ts.template     # Mall för zod-schema
├── module-migration.sql.template  # Mall för DB-migration
└── MODULE_DEVELOPMENT_GUIDE.md    # Steg-för-steg-guide
```

### 7.2 Guide-utdrag

```markdown
## Skapa en ny modul

1. Kör `bun gen:module <name>` (skapar alla filer från templates)
2. Justera SQL-migrationen — lägg till modul-specifika fält
3. Kör `bun migrate` lokalt
4. Regenerera typer: `bun gen:types`
5. Implementera `<name>.functions.ts` enligt mönster (createServerFn × 5: list, get, create, update, delete)
6. Implementera UI: List, Detail, Form
7. Lägg till route i sidebar (`src/components/app/Sidebar.tsx`)
8. Lägg till `module.<name>_enabled` i `company_modules` defaults
9. Skriv RLS-tester
10. Skriv 1 integration-test per createServerFn-handler
```

Detta script kan ingå i v6.0 redan i Fas 2 — då blir resterande moduler dramatiskt snabbare att bygga.

---

## 8. Feature-parity-inventory per modul

**Format per modul:** v4 har / v6 ska ha / v6 skippar / FUTURE

### 8.1 Avvikelsehantering

| Feature | v4 har | v6 ska ha | Anmärkning |
|---|---|---|---|
| CRUD avvikelse | ✓ | ✓ (Fas 2) | |
| Status-flöde | ✓ | ✓ | reported → triaged → investigating → remediation → closed |
| Prioritet/severity | ✓ | ✓ | |
| Kategorier | ✓ | ✓ | + branschspecifika (05 §7) |
| Tilldelning | ✓ | ✓ | |
| Åtgärdsplan | ✓ | ✓ | |
| Kommentarer | ✓ | ✓ | |
| Bilagor | ✓ | ✓ | |
| Filtrering/sökning | ✓ | ✓ | |
| Audit-trail | ✓ | ✓ | via module_audit_logs |
| Realtime-uppdatering | – | ✓ (nytt) | |
| Auto-skapas från failed hygiene-check | – | ✓ (nytt) | trigger i Fas 4 |
| Koppling till risk | – | ✓ (nytt) | `related_risk_id` |
| Export till PDF | indirekt via Compliance | direkt | |

### 8.2 Styrdokument

| Feature | v4 har | v6 ska ha | Anmärkning |
|---|---|---|---|
| CRUD dokument | ✓ | ✓ (Fas 2) | |
| Versionshantering | ✓ | ✓ | |
| Rich text-editor | ✓ | ✓ | sanerad via dompurify |
| Mallar med placeholders | ✓ | ✓ | `src/lib/templatePlaceholders.ts` |
| Smart templates (AI-genererade) | ✓ (`SmartTemplatesManager`) | FUTURE | Inte i MVP |
| Kategorier | ✓ | ✓ | `policy_categories` |
| Publicering/arkivering | ✓ | ✓ | |
| Kvittering av personal | ✓ | ✓ | document_signatures |
| Notifieringar vid review | ✓ | ✓ | |
| BankID-signering | – | ✓ (Fas 10) | |
| PDF-export | ✓ | ✓ | |

### 8.3 Läkemedelslogg

| Feature | v4 har | v6 ska ha | Anmärkning |
|---|---|---|---|
| Items + batch + logs | ✓ | ✓ (Fas 3) | |
| Utgångsdatum-spårning | ✓ | ✓ | |
| Lagerstatus per klinik | ✓ | ✓ | |
| Kassation med motivering | ✓ | ✓ | |
| Attestering | ✓ | ✓ | kräver `is_licensed_practitioner` |
| Temperaturlogg | – (eller minimalt) | ✓ (utvidgad) | `medication_temperature_logs` |
| Export | ✓ | ✓ | |
| IoT-temperaturintegration | – | FUTURE | |

### 8.4 Ordination & Delegation

| Feature | v4 har | v6 ska ha | Anmärkning |
|---|---|---|---|
| Sjuksköterska skapar, läkare godkänner | ✓ | ✓ (Fas 3) | |
| Läkare/tandläkare direkt | ✓ | ✓ | |
| 4-ögonprincip (option) | ✓ | ✓ | feature flag per företag |
| Externa Consulting Practitioners | ✓ | ✓ | via `consulting_assignments` |
| Tids- och scope-begränsning | ✓ | ✓ | |
| Revokering | ✓ | ✓ | |
| Global Inbox för consulting | – | ✓ (nytt) | `/inbox` route |
| Delegation_audits | ✓ | ✓ | dedikerad tabell |

### 8.5 Miljö & Hygien

| Feature | v4 har | v6 ska ha | Anmärkning |
|---|---|---|---|
| Checklist templates | ✓ | ✓ (Fas 4) | |
| Aktiva checklistor | ✓ | ✓ | |
| Återkommande (recurring) | ✓ | ✓ | |
| Arkiv | ✓ | ✓ | |
| Rapporter | ✓ | ✓ | |
| Fotobevis | – (kan finnas i v4) | ✓ (utvidgad) | Supabase Storage |
| AI-kategorisering av checkpoints | ✓ | ✓ (behåll Edge Function) | |
| AI-prioriteringsanalys | ✓ | ✓ (behåll Edge Function) | |
| Auto-skapande av avvikelse vid fail | – | ✓ (nytt) | trigger |
| Schemalagd förnyelse | ✓ | ✓ | pg_cron + Edge Function |

### 8.6 Riskhantering

| Feature | v4 har | v6 ska ha | Anmärkning |
|---|---|---|---|
| Riskregister | ✓ | ✓ (Fas 4) | |
| Sannolikhet × konsekvens | ✓ | ✓ | 5×5-matris |
| Åtgärder | ✓ | ✓ | |
| Uppföljningsdatum | ✓ | ✓ | review_due_at |
| Påminnelser | ✓ | ✓ | notifications |
| Historik | ✓ | ✓ | module_audit_logs |
| Riskmatris-visualisering | – (kan finnas) | ✓ (förbättrad) | klickbar 5×5 |

### 8.7 Compliance Center

| Feature | v4 har | v6 ska ha | Anmärkning |
|---|---|---|---|
| Export Wizard | ✓ | ✓ (Fas 5) | välj data, period, syfte |
| Export-historik | ✓ | ✓ | `compliance_exports`-tabell |
| Audit Logs vy | ✓ | ✓ | |
| Compliance-score | – | ✓ (nytt) | 04 §13 |
| Inspector mode (token) | – | ✓ (nytt) | 03 §14 |
| PII-maskering | ✓ | ✓ | |
| Avmaskning med ärende-ID | ✓ | ✓ | |

### 8.8 Statistik & Rapporter

| Feature | v4 har | v6 ska ha | Anmärkning |
|---|---|---|---|
| Aggregerade dashboards | ✓ | ✓ (Fas 5) | dashboard.tsx |
| Modulspecifika rapporter | ✓ | ✓ | |
| Tidsfilter | ✓ | ✓ | |
| Klinikfilter | ✓ | ✓ | |
| CSV-export | ✓ | ✓ | |
| recharts | ✓ | ✓ | |

### 8.9 Kunder

| Feature | v4 har | v6 ska ha | Anmärkning |
|---|---|---|---|
| Paginerad lista | ✓ | ✓ (Fas 8) | |
| CSV-import | ✓ | ✓ | |
| CSV-export | ✓ | ✓ | |
| Personnummer-formatering | ✓ | ✓ | |
| GDPR export/radering | ✓ | ✓ | |
| BokaDirekt-import | – | ✓ (Fas 10) | |
| Behandlingslogg (customer_records) | – | ✓ (Fas 8, PDL-gated) | |

### 8.10 Företag & Kliniker

| Feature | v4 har | v6 ska ha | Anmärkning |
|---|---|---|---|
| CRUD företag | ✓ | ✓ (Fas 1) | |
| CRUD klinik | ✓ | ✓ | |
| Klinikväljare | ✓ | ✓ | |
| Användarinbjudan | ✓ | ✓ | |
| Roll/kapabilitets-tilldelning | ✓ | ✓ | |
| Företagsväxling | ✓ | ✓ | för användare i flera bolag |
| Avregistrering | ✓ | ✓ | wind-down-flöde |

### 8.11 Inställningar

| Feature | v4 har | v6 ska ha | Anmärkning |
|---|---|---|---|
| Företagsuppgifter | ✓ | ✓ (Fas 1) | |
| Klinikuppgifter | ✓ | ✓ | |
| Öppettider | ✓ | ✓ | |
| Användarprofil med legitimation | ✓ | ✓ | |
| Quick Access | ✓ | ✓ (förenklad MVP) | |
| Modulkonfiguration | ✓ | ✓ | |
| 2FA | flagga finns | ✓ (Fas 5) | TOTP |
| BankID som auth-faktor | – | ✓ (Fas 10) | |

---

## 9. Genuint nya features i v6 (utöver v4)

| Feature | Fas | Anmärkning |
|---|---|---|
| SSR via TanStack Start | 0 | Snabbare initial render, bättre SEO |
| Filbaserad routing | 0 | Mindre boilerplate |
| Tailwind v4 + design tokens via `@theme inline` | 0 | Modernare CSS |
| Realtime-uppdateringar i alla listor | 2+ | TanStack Query + Supabase realtime |
| Industry templates med terminologi-hook | 1 | Anpassar UI per bransch |
| Inspector mode (revisor-token) | 5 | Tidsbegränsad read-only access |
| Compliance-score (algoritm + dashboard) | 5 | Aktiv vägledning, inte bara reaktiv |
| Auto-avvikelse från failed hygien | 4 | Mindre manuellt arbete |
| Coupling deviation ↔ risk | 4 | Spårbarhet |
| Optimistic locking på muterbara entiteter | 1+ | Konfliktdetektering |
| Global Inbox för consulting practitioners | 3 | Bättre UX för externa läkare |
| Schemalagda jobb via pg_cron | 3+ | Mer ändamålsenligt än manuellt |
| Ship-flags (feature rollouts) | 0+ | Gradvis utrullning av nya features |
| BankID-integration | 10 | Stark signering |
| BokaDirekt-integration | 10 | Bokningssynk |
| Audit-paket-PDF via Deno + pdf-lib | 5 | IVO-redo export i ett klick |

---

## 10. Migration-strategi (v4-data → v6)

Det här är den största risken och behöver dedikerad planering. Två huvudvägar:

### 10.1 Väg A: Clean cutover (rekommenderas för v6 MVP)

- Befintliga v4-kunder fortsätter på `carekompass.se` tills de manuellt flyttar
- Nya kunder från lansering går direkt till v6
- Datamigration sker per kund vid begäran, med bekräftelse om att gamla v4-data raderas eller arkiveras
- Tidsfönster: 6-12 månader för naturlig övergång

**Fördelar:** Inga blocking-issues. Inga komplexa migrationer av live-data. Toni kan testa länge.

**Nackdelar:** Två system parallellt. Stripe-abonnemang måste hanteras manuellt vid flytt.

### 10.2 Väg B: Big-bang cutover (för senare)

- Allt flyttas på en helg via migration-script
- Stora risker (RLS, dataintegritet, Stripe-customers)

**Rekommendation:** Väg A.

### 10.3 Migration-script-anatomi (för Väg A, per kund)

```
1. Export från v4-DB (snapshot)
2. Mappa v4-tabeller → v6-tabeller enligt §4.1
3. Behåll alla UUID:n (samma id i v6 som v4)
4. Mappa v4-roller → v6 hierarkisk roll + kapabilitetsflaggor
   - v4 Owner → company_users.role='owner'
   - v4 Manager → company_users.role='manager'
   - v4 Quality Manager → company_users.role='quality_manager'
   - v4 Clinic Manager → clinic_assignments.role='clinic_manager'
   - v4 Staff → clinic_assignments.role='staff' + staff_subroles.code = mapped
   - v4 Auditor → clinic_assignments.role='auditor'
   - v4 Licensed Practitioner flag → user_capabilities('is_licensed_practitioner')
   - osv
5. Mappa subscription-plan → ny seat-baserad modell (manuell granskning för Enterprise)
6. Verifiera RLS: testkör med kundens första användare, jämför row counts mot v4
7. Cutover-fönster: max 2 timmar (DNS-byte + email till kund)
```

Detaljerat migration-script skrivs när Toni bestämmer att första kunden ska flyttas.

### 10.4 Vad migreras inte automatiskt

- **Inloggade sessioner** — alla v4-användare måste logga in på nytt i v6
- **Stripe-customers** — behålls (Stripe customer_id är samma), men subscription byter price_id
- **Custom rapporter** — om kund har egna anpassade exports, dessa skapas om i v6
- **Mallar (templates)** — system-mallar synkas; kund-anpassade mallar migreras med UUID-bevarande

---

## 11. Cutover-plan med rollback

Detaljerad i 04 §14. Här tilläggen från v4-perspektiv:

### 11.1 Pre-cutover-checklista (utöver 04 §14)

- [ ] v4-snapshot tagen (Supabase Dashboard manual backup)
- [ ] v6 testat med samma kund-data (anonymiserad) i staging
- [ ] DNS-TTL sänkt till 60s 24h före cutover (för snabb revert)
- [ ] Stripe webhook URL uppdaterad **både** för v4 och v6 (lyssnar på båda under övergångsfönstret)
- [ ] Email-kommunikation till kund: vad händer, hur loggar de in, kontaktperson
- [ ] Status-sida uppdaterad ("Vi uppgraderar mellan kl X-Y")
- [ ] Edge Functions för v4 fortsätter köra (för fortsatt async-processing) tills v4 stängs av

### 11.2 Rollback-tröskel

- Datainkonsistens upptäckt → rollback (DNS revert + Stripe back)
- Login fungerar inte för > 5% av användarna → rollback
- RLS-läcka (en kund ser annan kunds data) → rollback **omedelbart** + post-mortem
- Performance < 50% av v4 → rollback om inte kan fixas inom 1h

---

*Slut på 07-v4-mapping-and-overrides. Vidare till 08-public-and-admin.md för publika sidor, SEO, PWA, system admin och onboarding.*
