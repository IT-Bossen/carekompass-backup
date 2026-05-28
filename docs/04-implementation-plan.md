# CareKompass v6.0 — Implementationsplan

> **Serie:** 01-system-spec · 02-database-api · 03-frontend-guide · **04-implementation-plan**
> **Driv:** Toni Kazarian, lead dev. Claude Code som primärt implementations-verktyg. Lovable för scaffolding/UI-iteration vid behov.

---

## Innehåll

1. Reviderad fas-indelning (v5.0 → v6.0)
2. Fas 0: Bootstrap & arkitektur-fundament
3. Fas 1: Multi-tenant fundament
4. Fas 2: Dokument + avvikelser
5. Fas 3: Läkemedel + ordination & delegering
6. Fas 4: Hygien + risk
7. Fas 5: Compliance Center + audit-export
8. Fas 6: Personal & legitimation
9. Fas 7: Billing-aktivering (Stripe)
10. Fas 8: Behandlingslogg & samtycke (valfritt — kräver PDL-beslut)
11. Fas 9: Externa behandlare & rumsuthyrning
12. Fas 10: BankID + BokaDirekt
13. Compliance-score-algoritm
14. Acceptance-checklista för cutover (v4 → v6)
15. Öppna frågor som blockerar Fas 0

---

## 1. Reviderad fas-indelning (v5.0 → v6.0)

### Skillnad mot v5.0-planen

| v5.0-plan | v6.0 | Varför ändring |
|---|---|---|
| Fas 1 hade auth + multi-tenant + dokument + avvikelser + läkemedel + ordination (en stor fas) | Splittas: Fas 1 = fundament, Fas 2 = dokument + avvikelser, Fas 3 = läkemedel + ordination | För stor bit för att etablera nya patterns i ny stack på en gång. Etablera CRUD-pattern (Fas 2) innan komplexa workflows (Fas 3). |
| Billing tidigt | Billing Fas 7 | Plan + feature flags-schema finns i Fas 1 (krävs av RLS), men **Stripe-aktivering** kan vänta. Pilotkliniker kör trial/manuellt under Fas 1–6. |
| BankID i Fas 5/6 | BankID Fas 10 | Click-signering räcker för MVP. BankID kräver leverantörsavtal som inte ska blockera utveckling. |
| Personal/legitimation otydligt placerad | Egen Fas 6 | Texten i 6.0-visionen gör det till en dedikerad modul. |
| Customer_records osäkert | Egen Fas 8, gated på PDL-beslut | Kräver explicit go/no-go från Toni innan kod skrivs. |

### Total tidsuppskattning

Ungefär 16–20 veckor från Fas 0-start till feature-paritet med v4.0 + alla nya moduler. Trial-paritet (Fas 0–3) kan nås på 6–7 veckor.

**Cutover-kandidat:** Slutet av Fas 5 eller efter Fas 7. Cutover före billing kräver manuell prenumerationshantering.

---

## 2. Fas 0: Bootstrap & arkitektur-fundament

**Mål:** Etablera ALLA arkitektoniska mönster så att resten av faserna är repetition.

**Längd:** 1–2 veckor.

### 2.1 Innehåll

- Konfigurera tomma Lovable-projektet (TanStack Start, Lovable Cloud Supabase)
- Tailwind v4 + shadcn/ui-installation (verifiera Tailwind v4-kompatibilitet med shadcn)
- bun lockfile, scripts
- `src/styles/app.css` med `@theme inline`-block
- Genererade typer: `bunx supabase gen types typescript > src/types/supabase.ts` + script i package.json
- `src/lib/supabase.client.ts` (browser) + `src/lib/supabase.server.ts` (SSR-factory)
- `src/lib/_helpers.ts` — `requireSupabaseAuth`, `requirePermission`, `requireWritableSubscription`, `auditLog`, `createApiResult` (standardiserat svar)
- Root layout (`__root.tsx`) med QueryClient, Toaster, ThemeProvider
- Authed layout (`_app.tsx`) med skeleton för Sidebar + Topbar + ClinicSwitcher (dummy-data ok)
- Public layout-routes: `/login`, `/signup`, `/accept-invite/$token`
- Inspector layout-route: `/inspect/$token` (skeleton)
- Verifiera SSR fungerar: en `/health`-route som loadar via `createServerFn` och visar timestamp från servern
- CI: GitHub Actions (eller Lovable native) — `bun typecheck`, `bun build`, ev. `bun test`

### 2.2 Acceptance

- [ ] `bun dev` startar utan fel
- [ ] `/health` SSR:as och visar server-renderad data
- [ ] `bunx supabase gen types typescript` ger fil utan diff
- [ ] `bun typecheck` är grön (strict mode)
- [ ] En enkel `createServerFn` kan anropas från en route loader och från en komponent via TanStack Query med samma queryKey
- [ ] shadcn `<Button>` renderar med rätt design tokens

### 2.3 Claude Code-prompt (kopiera direkt)

```
Du arbetar i ett BEFINTLIGT CareKompass v6.0-projekt i Lovable. Scaffolding finns redan:
TanStack Start v1, React 19, Vite 7, Tailwind v4, shadcn/ui, bun, Lovable Cloud (Supabase).
KÖR INTE `bun create @tanstack/start` — verifiera och bygg vidare på det som finns.

Läs ALLA dokument i /docs/ innan du börjar — inte bara de tre första:
01-system-spec, 02-database-api, 03-frontend-guide, 04-implementation-plan,
05-domain-content, 06-conventions, 07-v4-mapping-and-overrides, 08-public-and-admin,
09-oppna-fragor-och-beslut.

Viktiga beslut som gäller (från 09):
- Branding: Inter + shadcn `slate` base color. Placeholder-logo ("CK"). Ingen custom blå-palett. (03 §6.1)
- AI: Lovable AI Gateway (Gemini), ingen AI-secret. (07 §5.4)
- Betalning: Lovable Stripe-payments (`enable_stripe_payments`), inga egna Stripe-webhooks. (07 §5.4)
- Email: Lovable Cloud Email. (07 §5.4)
- Rollmodell: hierarkiska roller + kapabilitetsflaggor + staff-subroller. (07 §2) — INTE 13 separata roller.
- Tabellnamn: v4-konsistenta (policy_documents, medication_items, checklist_*, etc). (07 §4)
- Audit: två tabeller (audit_logs + module_audit_logs). (07 §4.2)
- Ansvarsgräns: CareKompass är verktyg, aldrig granskare. (01 §7.0)

Implementera Fas 0 (endast fundament — inga moduler, inget domän-schema):

1. Verifiera befintlig scaffolding: bekräfta TanStack Start v1, Vite 7, bun, Tailwind v4,
   shadcn/ui och Lovable Cloud-Supabase-koppling. Rapportera vad som finns innan du ändrar.
2. Konfigurera shadcn med slate base color (`bunx shadcn@latest init` → Slate) och verifiera
   att src/styles/app.css har slate-tokens enligt 03 §6.1. Font: Inter.
3. Installera shadcn/ui-primitives: button, input, dialog, dropdown-menu, sonner (toast),
   card, badge, tabs, form, command.
4. Skapa src/lib/_helpers.ts med requireSupabaseAuth, requirePermission,
   requireWritableSubscription, auditLog och createApiResult enligt 02 §8.3 + §9.
5. Skapa src/lib/supabase.client.ts och src/lib/supabase.server.ts (SSR-factory).
6. Skapa src/routes/__root.tsx enligt 03 §2.3 och src/routes/_app.tsx enligt 03 §2.2
   (dummy session/context just nu).
7. Skapa src/routes/health.tsx som SSR:ar en createServerFn-anropad server-timestamp
   (bevisar att SSR + createServerFn + loader-mönstret fungerar enligt 03 §3).
8. Skapa skeleton-routes: login.tsx, signup.tsx, accept-invite.$token.tsx, inspect.$token.tsx.
9. Etablera mönstret "loader anropar createServerFn → komponent får initialData → TanStack
   Query tar över" på health-routen så det kan kopieras i alla moduler. (03 §3)
10. Sätt upp observability-grund (06 §2.1, alla i Fas 1 men initiera nu): Sentry-SDK (client +
    server) med PII-strip enligt 06 §2.2. BetterStack-probe mot /health. Lägg INTE in GA4 ännu
    — det kommer med cookie-consent-bannern i Fas 1 (08 §4.3-4.5).
11. Lägg till package.json-scripts: "gen-types" (bunx supabase gen types typescript >
    src/types/supabase.ts), "typecheck", "test".
12. Sätt upp .github/workflows/ci.yml: bun install, bun typecheck, bun build.
13. Skapa docs/decisions/ med de första ADR:erna enligt 06 §14.3 (0001-0006).

Inga moduler, inget domän-databas-schema, ingen GA4, ingen auth-logik utöver skeleton i Fas 0.
Allt det kommer i Fas 1.

Acceptance (04 §2.2): `bun dev` startar; /health SSR:ar server-renderad timestamp;
`bun typecheck` grön (strict); shadcn <Button> renderar med slate-tokens; en createServerFn
kan anropas från både route-loader och komponent via samma queryKey.

Rapportera när varje delsteg är klart innan du fortsätter till nästa. Visa diff för varje
större fil. Eskalera om scaffolding avviker från antagandena ovan, eller om Tailwind v4 /
TanStack Start-verkligheten krockar med dokumentationen.
```

---

## 3. Fas 1: Multi-tenant fundament

**Mål:** Auth, tenant/bolag/klinik, RBAC, RLS, onboarding, klinik-switcher, terminologi-system.

**Längd:** 2–3 veckor.

### 3.1 Databas (migrationer i ordning)

> **OBS (07-overrides):** Använd v4-konsistenta tabellnamn (`company_users` + `clinic_assignments` istället för `memberships`; `subscription_plans`/`plan_features`/`company_modules`), rollmodellen från 07 §2 (hierarkiska roller + `user_capabilities` + `staff_subroles`), och tvåtabells-audit (07 §4.2). Helper-funktionerna är de i 07 §2.5 (`is_member_of_company`, `has_company_role`, `has_capability`, ...).

1. `0001_extensions.sql` — `pgcrypto`, `pg_cron`, `uuid-ossp`, `pg_net`
2. `0002_tenants_companies_clinics.sql` — bas-tabeller (utan RLS ännu)
3. `0003_profiles_company_users_clinic_assignments.sql` — profil + medlemskap (07 §3.2, v4-modell)
4. `0004_roles_permissions_capabilities.sql` — roller, permissions, `user_capabilities`, `staff_subroles` (07 §2)
5. `0005_helper_functions.sql` — `current_profile_id`, `current_tenant_id`, `is_member_of_company`, `is_assigned_to_clinic`, `has_company_role`, `has_capability`, `feature_enabled` (07 §2.5)
6. `0006_industry_templates.sql`
7. `0007_plans_features.sql` — `subscription_plans`, `plan_features`, `company_modules`, `subscriptions` (seat-modell, 07 §3.3)
8. `0008_audit_logs.sql` — `audit_logs` + `module_audit_logs` + `delegation_audits` (07 §4.2)
9. `0009_consulting_assignments.sql`
10. `0010_cookie_consents.sql` — 3-nivå-samtycke (08 §4.5)
11. `0011_rls_base.sql` — RLS-policies för bas-tabeller + super_admin read-all (08 §8.3)
12. `0012_seed_roles_permissions.sql` — inkl. krav minst en `quality_manager` per bolag (01 §7.0)
13. `0013_seed_plans_features.sql`
14. `0014_seed_industry_templates.sql` — `estetisk_injektion` fullt utfylld (05 §4.1), övriga seedas enligt 05/24

### 3.2 Server functions

- `src/lib/auth.functions.ts` — `signUp`, `acceptInvite`, `signOut`
- `src/lib/session.functions.ts` — `getServerSession`, `setActiveClinic`
- `src/lib/companies.functions.ts` — `createCompany`, `getMyCompanies`, `updateCompany`
- `src/lib/clinics.functions.ts` — `createClinic`, `listClinics`, `updateClinic`
- `src/lib/users.functions.ts` — `inviteUser`, `listMembers`, `revokeMembership`, `getMyPermissions`
- `src/lib/terminology.functions.ts` — `getTerminology`, `getCompanyFeatures`

### 3.3 Frontend

- Onboarding-wizard (8 steg)
- Login/signup/accept-invite
- Sidebar med modul-länkar (alla pekar mot tomma sidor)
- Topbar med ClinicSwitcher, profil-meny
- `/app/settings/company`, `/app/settings/clinics`, `/app/settings/users`
- Alla 5 hooks (§5 i 03-frontend-guide) implementerade

### 3.4 RLS-tester

`tests/rls/` med pgTAP-stil eller eget runner. Minst:
- Tenant-isolering (A ser inte B:s data)
- Bolags-isolering inom tenant
- Klinik-isolering inom bolag
- Roll-baserad åtkomst (auditor kan SELECT men inte INSERT)
- Consulting practitioner cross-tenant via `consulting_assignments`

### 3.5 Acceptance

- [ ] Användare kan signa upp, skapa bolag, välja bransch, skapa klinik
- [ ] Användare kan bjuda in en annan användare via mail-invite + token-länk
- [ ] Active clinic kan bytas via switcher
- [ ] Terminologi-hook returnerar rätt strängar baserat på vald bransch
- [ ] RLS-tester passerar
- [ ] Audit-log skrivs vid bolag/klinik/membership-skapande
- [ ] Read-only fallback fungerar om subscription är `canceled` (testat med manuell DB-set)

### 3.6 Claude Code-prompt

```
Fas 1: Multi-tenant fundament. Läs /docs/02-database-api.md §3, §4, §5 och §7 noggrant.

1. Skapa migrationer 0001 till 0013 i supabase/migrations/ exakt enligt 02-database-api §3-7 och §11.
2. Kör migrationerna lokalt och regenerera supabase.ts-typer.
3. Implementera server functions i src/lib/ enligt §3.2 ovan med korrekt zod-validering och requirePermission.
4. Implementera frontend-routes och komponenter enligt §3.3 ovan och 03-frontend-guide §4 och §12.
5. Skapa RLS-tester i tests/rls/ enligt §3.4 ovan. Tester ska passera.
6. Implementera ALLA hooks i src/hooks/ enligt 03-frontend-guide §5.
7. Verifiera att audit-log skrivs vid alla muterande operationer.

Eskalera till mig OMEDELBART om:
- RLS-test misslyckas och du inte förstår varför inom 15 minuter
- En migration kräver att vi droppar en tabell som redan har data
- Du upptäcker en konflikt mellan denna spec och Tailwind v4 / TanStack Start verkligen

Visa Pull Request per logisk del (migrationer separat från server functions separat från frontend).
```

---

## 4. Fas 2: Dokument + avvikelser

**Mål:** Etablera CRUD-pattern på två moduler som har olika karaktär. Dokument = innehåll + versionering. Avvikelser = workflow + realtime.

**Längd:** 2 veckor.

### 4.1 Innehåll

- Migrationer: `documents`, `document_versions`, `document_signatures`, `deviations`, `deviation_actions`, `deviation_attachments`
- Seed: default-dokumentmallar per industry_template
- Server functions: `documents.functions.ts`, `deviations.functions.ts`
- Frontend: List + detalj + form för båda modulerna
- Realtime: deviations-listan uppdateras live
- Signering: click-baserad i v6.0 (BankID Fas 10)
- Notifieringar: när avvikelse tilldelas → notification-row + topbar-badge
- Filuppladdning: signed URL från `createServerFn`, klient laddar upp till Storage direkt

### 4.2 Acceptance

- [ ] Skapa dokument från mall, redigera, signera (klick), exportera som PDF
- [ ] Rapportera avvikelse, byta status, lägga till åtgärder, stänga
- [ ] Filtrera avvikelser per status, severity, klinik
- [ ] Realtime: två fönster öppna, en användare skapar avvikelse → andra fönstret ser den utan reload
- [ ] Optimistic UI fungerar för status-byte och version_conflict hanteras
- [ ] Audit-log innehåller före/efter-snapshots
- [ ] Bara behörig roll kan stänga avvikelse (visuell + RLS)

---

## 5. Fas 3: Läkemedel + ordination & delegering

**Mål:** Komplexa workflows. Consulting practitioner pattern etableras.

**Längd:** 2–3 veckor.

### 5.1 Innehåll

- Migrationer: `medications`, `medication_batches`, `medication_temperature_logs`, `medication_usages`, `orders`, `delegations`
- Trigger: `medication_usages INSERT` minskar `medication_batches.units_remaining`
- Server functions: `medications.functions.ts`, `orders.functions.ts`, `delegations.functions.ts`
- Global Inbox för consulting practitioners: `/app/inbox` — listar pending ordinations från alla `consulting_assignments`
- Spärrar: kan inte logga `medication_usage` utan giltig delegering (om utförare ej är legitimerad)
- Notifieringar: utgående batch (30d/14d/7d), utgående delegering (30d/14d), pending order för consulting practitioner

### 5.2 Acceptance

- [ ] Skapa läkemedel, registrera batch med utgångsdatum, temperaturkontroll
- [ ] Lägg ordination som legitimerad användare
- [ ] Lägg ordination som consulting practitioner mot annat bolag
- [ ] Godkänn/avslå ordination
- [ ] Skapa delegering med giltighetstid; spärras vid utgång
- [ ] `medication_usage` minskar lager automatiskt
- [ ] Global Inbox visar pending från alla tilldelade bolag
- [ ] pg_cron `delegation-expiry-check` kör och skickar notifieringar

---

## 6. Fas 4: Hygien + risk

**Mål:** Schemaläggning och fotobevis. Riskmatris.

**Längd:** 2 veckor.

### 6.1 Innehåll

- Migrationer: `hygiene_checklist_templates`, `hygiene_schedules`, `hygiene_checks`, `risks`
- Trigger: `hygiene_check` med result fail → auto-skapa `deviation`
- Server functions för båda modulerna
- pg_cron: `hygiene-schedule-tick` skapar uppgifter när `next_due_at` passerar
- Riskmatris UI (5×5 visualisering)
- Fotouppladdning för hygien (signed URLs)

### 6.2 Acceptance

- [ ] Skapa schemalagd hygienkontroll, utför, ladda upp foto
- [ ] Failed check skapar automatiskt avvikelse
- [ ] Riskmatris visualiseras, klicka cell → lista risker i den cellen
- [ ] Risk-uppföljning: review_due_at-uppgifter

---

## 7. Fas 5: Compliance Center + audit-export

**Mål:** Sammanfattnings-dashboard + IVO-redo export.

**Längd:** 2 veckor.

### 7.1 Innehåll

- Migration: `compliance_scores`
- Edge Function: `compliance-recalc` (Deno) — körs nightly via pg_cron
- Edge Function: `audit-export` (Deno + `pdf-lib`) — genererar ZIP med PDF + CSV, levererar via signed URL
- Frontend: Compliance Center-dashboard med score-widget, breakdown, "att åtgärda"-lista
- Inspector mode: `inspector_tokens`-tabell, route `/inspect/$token`, RLS som kollar token-tabell, inspection-views-loggning

### 7.2 Compliance-score-algoritm

Se §13 för fullständig algoritm. Sammanfattat: viktade KPI:er per modul, total 0–100.

### 7.3 Acceptance

- [ ] Dashboard visar overall_score + breakdown per modul
- [ ] "Att åtgärda"-lista är klickbar och leder till rätt entitet
- [ ] Audit-export genererar ZIP inom rimlig tid (mål: <30s för bolag med 12 månaders historik)
- [ ] Inspector token kan skapas, delas via länk, fungerar tills den löper ut, och loggar allt
- [ ] pg_cron compliance-recalc körs nightly och uppdaterar `compliance_scores`

---

## 8. Fas 6: Personal & legitimation

**Mål:** Spårning av legitimation, certifikat, utgångsdatum + spärrar.

**Längd:** 1–2 veckor.

### 8.1 Innehåll

- Migrationer: `staff_credentials`, `staff_credential_categories`
- Server functions: `staff.functions.ts`
- Frontend: `/app/staff` — lista, detalj, upload-bevis
- Notifieringar: certifikat går ut inom 30d/14d/7d
- Spärr: ordination/utförande kräver giltig legitimation (utvidgning av Fas 3-spärrarna)

### 8.2 Acceptance

- [ ] Lägga till legitimation/certifikat med utgångsdatum + bevisfil
- [ ] Utgånget certifikat → spärrar relaterade åtgärder
- [ ] Notifiering inför utgång

---

## 9. Fas 7: Billing-aktivering (Stripe)

**Mål:** Riktig Stripe-integration. Trial-aktivering, betalda planer, read-only fallback.

**Längd:** 1–2 veckor.

### 9.1 Innehåll

- Stripe-konto + produkter + priser (Starter/Pro/Enterprise) skapas manuellt i Stripe
- `stripe_price_id` läggs in i `plans`-tabellen
- Server function: `createCheckoutSession`, `createPortalSession`
- Edge Function: `stripe-webhook` med signaturverifiering
- Mappning av Stripe-events:
  - `checkout.session.completed` → uppdatera subscription, sätt `company_features` enligt `plan_feature_defaults`
  - `customer.subscription.updated` → status/plan-byte
  - `customer.subscription.deleted` → mark canceled, fall till read-only
  - `invoice.payment_failed` → status past_due
- Frontend: `/app/settings/billing` med plan-kort + uppgradera-knappar
- Read-only banner i topbar när subscription är `past_due` eller `canceled`

### 9.2 Acceptance

- [ ] Trial fungerar (auto vid bolagsskapande, 14 dagar)
- [ ] Köp av Pro går genom Stripe Checkout och aktiverar feature flags
- [ ] Uppsägning aktiverar read-only efter periodens slut
- [ ] Webhook race-condition: efter uppgradering → klient invaliderar `company-features` cache
- [ ] Edge case: webhook missas → cron-job recoveryskript synkar med Stripe nightly

---

## 10. Fas 8: Behandlingslogg & samtycke (kräver beslut)

**⚠ Blockerad på Toni-beslut:** Detta öppnar för patientdata under PDL. Beslut måste tas innan kod skrivs. Två vägar:

**Väg A:** Aktivera `customer_records` enligt 02-database-api §6.8 med hårda begränsningar (500 tecken, inga bilagor förutom separata `treatment_photos` med samtycke, PDL-disclaimer obligatorisk).

**Väg B:** Hoppa över; CareKompass förblir compliance-system och länkar till externt journalsystem.

**Längd:** 2 veckor (Väg A).

### 10.1 Innehåll (om Väg A)

- Migrationer: `customers`, `customer_records`, `treatment_photos`, `customer_consents`
- PDL-disclaimer-flöde vid modul-aktivering
- Server functions för customer + customer_record
- Frontend: `/app/customers` — lista, sökbar, detalj med behandlingshistorik
- Foton: eget samtycke per foto, separat lagring, eget audit-trail
- Koppling till `medication_usages` (vilken batch användes på vilken kund)
- BokaDirekt-koppling (om Fas 10 är klar): import av kunder

### 10.2 Acceptance

- [ ] PDL-disclaimer måste accepteras innan customer_records skapas
- [ ] 500-tecken-gränsen enforceras både i UI och i DB-constraint
- [ ] Foto kräver separat samtycke
- [ ] GDPR-export per kund fungerar (skapa ZIP med alla customer_records för en kund)
- [ ] GDPR-radering av kund: anonymisering där radering blockeras av lagkrav (medication_usages spårbarhet)

---

## 11. Fas 9: Externa behandlare & rumsuthyrning

**Mål:** Stötta uthyrningskliniker med flera externa behandlare under samma tak.

**Längd:** 1–2 veckor.

### 11.1 Innehåll

- Migrationer: `rental_agreements`, `rooms` (om relevant), utvidgad `memberships` för `extern_behandlare`-roll
- Server functions: `rentals.functions.ts`
- Frontend: `/app/external-practitioners` — lista, agreements, behörighet per behandlare per behandlingskategori
- Avtalsgenerering: PDF-mall + click-signering (Fas 10: BankID)
- Spärr: extern behandlare kan bara utföra det som finns i sitt `treatment_categories_allowed`

---

## 12. Fas 10: BankID + BokaDirekt

**Mål:** Riktig identitet vid signering. Bokningssynk.

**Längd:** 2 veckor.

### 12.1 BankID

- Leverantörsval (Signicat eller Criipto är vanligt i SE)
- Edge Function: `bankid-init` (createServerFn → leverantör) + `bankid-callback` (leverantör → CK)
- Användning: avtalssignering (PuB-avtal, rental_agreements), ordination-godkännande, audit-export-initiering
- Lagring: `bankid_transaction_id` i relevanta tabeller (`document_signatures`, `delegations`, `rental_agreements`)

### 12.2 BokaDirekt

- API-nyckel per bolag i `settings/integrations`
- Edge Function: `bokadirekt-webhook` tar emot kund + bokning
- Server function: nightly fullsynk `bokadirekt-sync`
- Konflikthantering: telefon + personnummer-hash som dedupe-nyckel

---

## 13. Compliance-score-algoritm

Score = viktat genomsnitt av modul-scores, totalt 0–100.

| Modul | Vikt | Hur räknas |
|---|---|---|
| Dokument | 15% | (godkända aktiva dokument) / (förväntade per industry_template) × 100, max 100. Förfallna versioner drar ner. |
| Avvikelser | 20% | 100 om inga öppna critical/high äldre än SLA (critical 24h, high 7d, medium 30d, low 90d). Drar ner per överträdelse. |
| Hygien | 20% | (utförda kontroller / schemalagda kontroller senaste 30d) × 100. Failed checks drar ner. |
| Läkemedel | 10% | Lager utan utgångsvarningar, temperaturlogg utförd inom schema, ingen batch utan utgångsdatum. |
| Ordination & delegering | 15% | Inga aktiva delegeringar utan giltighetstid; inga ordinations äldre än 7d i `pending`. |
| Risk | 10% | Antal `high`-risker utan mitigation_plan = avdrag. Review_due passerat = avdrag. |
| Personal & legitimation | 10% | Andel personal med giltig legitimation / certifikat. |

Score < 50 = röd, 50–79 = gul, ≥ 80 = grön. Visas som widget på dashboard + i Compliance Center med klickbar breakdown.

Algoritmen är dokumenterad i Edge Function `compliance-recalc`. Justering av vikter är en konfiguration i `compliance_score_config`-tabell (Fas 5 kan starta med hårdkodat).

---

## 14. Acceptance-checklista för cutover (v4 → v6)

Innan trafik flyttas från `carekompass.se` till `v6.carekompass.se`:

- [ ] Alla Fas 1–5 acceptance-kriterier passerade i staging
- [ ] Migrationskript för v4-data → v6-schema testat på production-snapshot
- [ ] Backup-strategi dokumenterad (Supabase daily backups + manuell pre-cutover backup)
- [ ] Rollback-plan: DNS-switch tillbaka till v4 går inom 5 min
- [ ] Pilotkliniker (minst Derma Beauty Clinic + en till) har kört i parallel på v6 i minst 2 veckor
- [ ] BankID kan kvarstå att vänta — click-signering är ok för cutover om kliniker accepterar
- [ ] Billing-aktivering är klart eller manuellt hanterat (för pilotkliniker okej)
- [ ] Lasttest på SSR + Workers (mål: 200 samtidiga inloggade utan degradation)
- [ ] Penetrationstest av RLS (en pilotklinik försöker komma åt en annans data via API)

---

## 15. Öppna frågor som blockerar Fas 0

Måste besvaras innan Claude Code startar Fas 0:

1. **Befintligt Lovable-projekt:** finns det redan en initierad TanStack Start-scaffolding eller börjar Claude Code från `bun create @tanstack/start`? Antagandet i prompten ovan är att scaffolding redan finns; bekräfta.

2. **Lovable Cloud / Supabase-projekt:** är Supabase-projektet redan kopplat till Lovable Cloud? Vi behöver `SUPABASE_URL`, `SUPABASE_ANON_KEY` (publik) och `SUPABASE_SERVICE_ROLE_KEY` (server-only, för Edge Functions).

3. **Cloudflare Workers-deployment:** Lovable hostar Workers automatiskt på `v6.carekompass.se`? Bekräfta att custom domain redan är pekad mot Lovable.

4. **`bunx supabase` i Lovable-miljön:** Lovable Cloud kan exponera Supabase CLI eller använder en egen mekanism för migrations. Verifiera workflow med Lovable-dokumentationen.

5. **CK-admin (intern):** ska CK-admin-panelen (`/admin/*` eller separat domän) byggas i samma kodbas eller separat? Antagande: samma kodbas, gated av `is_super_admin`-flagga på profile.

6. **Pilotkliniker:** är Derma Beauty Clinic dogfooding-pilot, och en till klinik utöver det? Det påverkar branschtemplate-prioritering (estetisk_injektion + ?).

7. **PDL-beslut (Fas 8):** Väg A eller B? Behöver inte besvaras nu men måste vara klart innan Fas 8 startar.

8. **Stripe-konto:** finns redan, eller behöver skapas? Påverkar Fas 7 lead-time.

9. **BankID-leverantör (Fas 10):** Signicat, Criipto, eller annan? Påverkar både Fas 10 timing och Edge Function-implementation.

10. **Migration från v4:** finns dokumentation av v4:s schema så vi kan skriva migrationskript? Eller är cutover en clean-start (kliniker börjar om i v6)? Om clean-start kan Fas 0 starta utan v4-koppling.

11. **Felövervakning / observability:** Sentry, Logflare, Axiom — vad ska användas för error tracking och Worker-loggar? Behövs inte i Fas 0 men ska in senast Fas 2.

12. **Email-mall-utseende:** transaktionella mail (invites, notiser) — egen design eller Lovable Cloud-default? Påverkar Fas 1 utseendet på invites.

---

## Bilaga A: Claude Code-arbetssätt

Generella regler för alla Claude Code-sessioner:

- **Läs alla fyra MD-filer först** vid sessionsstart, inte bara den aktuella fasen
- **En PR per logisk del** — migrationer separat från functions separat från frontend
- **Visa diff för varje fil** innan commit
- **Kör typecheck + tester innan commit**
- **Eskalera till Toni vid:**
  - RLS-test misslyckas och root cause är oklart inom 15 min
  - Migration kräver destructive change på data som finns
  - Konflikt mellan denna spec och nyare TanStack Start / Tailwind v4 / Supabase-verkligheter
  - Behov att avvika från det dokumenterade mönstret (loaders + Query, JWT-pass-through, etc.)
- **Aldrig service_role från `createServerFn`** — bara från Edge Functions
- **Aldrig manuell DELETE** — alltid soft delete via `deleted_at`
- **Aldrig manuella `as any`** — om typer saknas: regenerera via `bunx supabase gen types typescript`

---

## Bilaga B: Filnaming för dokumentation i repo

```
docs/
├── 01-system-spec.md
├── 02-database-api.md
├── 03-frontend-guide.md
├── 04-implementation-plan.md
├── decisions/                  # ADR (Architecture Decision Records) löpande
│   ├── 0001-tanstack-start-vs-next.md
│   ├── 0002-hybrid-server-fn-edge.md
│   └── ...
└── runbooks/                   # Operativa runbooks
    ├── cutover-v4-to-v6.md
    ├── stripe-webhook-recovery.md
    └── rls-incident-response.md
```

ADR skrivs när ett beslut tas som påverkar arkitekturen och inte är trivialt. Format: kontext, beslut, konsekvenser.

---

*Slut på 04-implementation-plan. Detta är en levande plan — uppdateras löpande under v6.0-utvecklingen.*
