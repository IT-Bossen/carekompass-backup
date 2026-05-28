# CareKompass v6.0 — Systemspecifikation

> **Datum:** 2026-05-26
> **Serie:** 01-system-spec · 02-database-api · 03-frontend-guide · 04-implementation-plan
> **Status:** Greenfield på `v6.carekompass.se`. Ersätter v5.0-planen. Kör parallellt med v4.0 (`carekompass.se`) tills feature-paritet uppnåtts.

---

## Innehåll

1. Sammanfattning (v5.0 → v6.0)
2. Stack & arkitektur
3. Multi-tenant-hierarki
4. Moduler — översikt
5. Billing & abonnemang
6. Branschstöd
7. Säkerhet & compliance
8. Integrationer

➡ Databas, RLS, API: se **02-database-api.md**
➡ Routing, SSR, UI: se **03-frontend-guide.md**
➡ Faser & prompts: se **04-implementation-plan.md**

---

## 1. Sammanfattning (v5.0 → v6.0)

v6.0 behåller hela arkitekturmodellen från v5.0-planen (multi-tenant, RBAC, feature flags, industry_templates, consulting_assignments, audit logs, RLS-som-sanning) men byter frontend-stack och flyttar affärslogik till **TanStack Start server functions** med **Supabase Edge Functions** för specifika kantfall.

### Vad är nytt mot v5.0-planen

| Område | v5.0-plan | v6.0 |
|---|---|---|
| Frontend-stack | React + Vite + React Router | **React 19 + TanStack Start v1 + TanStack Router (filbaserad)** |
| Build/SSR | Vite SPA | **Vite 7 + SSR via TanStack Start på Cloudflare Workers** |
| Styling | Tailwind v3 + shadcn/ui | **Tailwind v4 + shadcn/ui** |
| Pakethanterare | npm | **bun** |
| Affärslogik | Alla Edge Functions | **Hybrid: `createServerFn` (CRUD/workflows) + Edge Functions (webhooks/PDF/cron)** |
| Datafetching | TanStack Query | **Router loaders (initial) + TanStack Query (mutations/realtime)** |
| Mål-domän | `app.carekompass.se` | **`v6.carekompass.se`** under utveckling, blir produktion vid cutover |

### Vad är **oförändrat** från v5.0-planen

- Multi-tenant-hierarki: `tenant → bolag → klinik → moduler`
- RLS är sanningen — server functions kör med användarens JWT, inte service_role
- Feature flags via `company_features` + `plan_feature_defaults` per plan
- `industry_templates` styr terminologi, regulatorisk myndighet, default-mallar
- `customer_records` är medvetet **inte** ett journalsystem — strukturerade fält, 500 tecken, PDL-disclaimer (se §7.3)
- `consulting_assignments` med flexibel scope för externa läkare som ordinerar till flera bolag
- Standardiserat API-response-format (`{ data, error, request_id, meta }`)
- Optimistic locking med `version`-fält på muterbara entiteter
- Audit-logg som **aldrig** joinas i realtids-queries
- Stripe för CareKompass egna SaaS-prenumerationer (separat från klinikens egen kassa)
- BankID för avtalssignering och stark autentisering
- BokaDirekt som primär bokningsintegration

---

## 2. Stack & arkitektur

### 2.1 Tech stack (fastställd)

| Lager | Teknik | Anmärkning |
|---|---|---|
| Frontend | React 19 + TanStack Start v1 | Full-stack, filbaserad routing |
| Router | TanStack Router | Filer under `src/routes/` styr routing |
| Build | Vite 7 | |
| Styling | Tailwind CSS v4 + shadcn/ui | **OBS:** Tailwind v4 använder `@theme inline` i CSS, inte `tailwind.config.js` |
| Backend | Lovable Cloud (Supabase) | Auth, Postgres, Storage, Realtime |
| Server-logik (primär) | `createServerFn` | Kör på Cloudflare Workers |
| Server-logik (specialfall) | Supabase Edge Functions (Deno) | Stripe webhooks, PDF-export, cron, BankID-callbacks |
| Språk | TypeScript strict | |
| Pakethanterare | bun | |
| TypeScript-typer | Genererade via `supabase gen types typescript` | Inga manuella `as any` |

### 2.2 Arkitekturdiagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          v6.carekompass.se                              │
│                       (TanStack Start på Workers)                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   Browser                                                               │
│      │                                                                  │
│      │  initial GET (SSR)                                              │
│      ▼                                                                  │
│   ┌──────────────────────────┐                                          │
│   │  TanStack Start Worker   │  ← src/routes/*.tsx + loaders            │
│   │  (Cloudflare Edge)       │     SSR rendering                        │
│   └──────────┬───────────────┘                                          │
│              │                                                          │
│              │  RPC                                                     │
│              ▼                                                          │
│   ┌──────────────────────────┐                                          │
│   │   createServerFn         │  ← src/lib/*.functions.ts                │
│   │   (samma Worker)         │     CRUD, workflows, validering          │
│   │   requireSupabaseAuth    │     RLS körs på användarens JWT          │
│   └──────────┬───────────────┘                                          │
│              │                                                          │
└──────────────┼──────────────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       Lovable Cloud (Supabase)                          │
├─────────────────────────────────────────────────────────────────────────┤
│   Auth · Postgres (RLS) · Storage · Realtime · pg_cron                  │
│                                                                         │
│   Edge Functions (Deno):                                                │
│     - stripe-webhook                                                    │
│     - bankid-callback                                                   │
│     - audit-export (PDF via pdf-lib)                                    │
│     - compliance-recalc (schemalagd via pg_cron)                        │
│     - delegation-expiry-check (schemalagd)                              │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Var bor affärslogiken

**`createServerFn` (Workers):** all CRUD, alla workflows, all validering, alla domän-beslut.
- Inkommande request → `requireSupabaseAuth` → Supabase-klient med användarens JWT → DB → svar
- Pratar **inte** med Stripe, **inte** med BankID, **inte** med externa filgenererande bibliotek

**Edge Functions (Deno):** specifika fall där Workers-runtime är otillräcklig eller där auth-kedjan inte ska gälla.
- `stripe-webhook` — offentlig endpoint, signaturverifiering, uppdaterar `company_features` via service_role
- `bankid-callback` — extern POST från BankID-leverantör
- `audit-export` — PDF-generering med `pdf-lib`, kräver Deno-runtime
- `compliance-recalc` — schemalagd via `pg_cron`, beräknar compliance-score per bolag
- `delegation-expiry-check` — schemalagd, skickar notiser om delegeringar som löper ut

### 2.4 Datafetching-strategi (för SSR)

| Mönster | När | Varför |
|---|---|---|
| **Router loader** (`createServerFn` anropas från loader) | Initial sidladdning av lista/detalj | SSR-vinst, snabb FCP, inga laddningstillstånd för första renderingen |
| **TanStack Query** | Mutations, optimistic updates, realtime-prenumerationer, refetch efter mutation | Cache-invalidering, optimistic UI, prenumerationer |
| **Loader + Query hybrid** | Standardmönster för CRUD-sidor | Loader sätter `initialData` på Query — SSR + interaktivitet utan dubbla anrop |

Detta är ett centralt mönster, etableras i Fas 0 och följs av alla moduler. Se 03-frontend-guide.md §3.

### 2.5 Cloudflare Workers — kända begränsningar

| Begränsning | Konsekvens | Lösning |
|---|---|---|
| Ingen Node-runtime | Bibliotek som kräver `fs`, `child_process` etc. fungerar inte | Använd Web-API:er; tunga bibliotek hamnar i Edge Functions |
| Request body-storlek | Storleksgräns på Workers | Filuppladdningar går direkt till Supabase Storage via signerad URL, inte via Worker |
| CPU-tid per request | Tidsgräns för CPU-tid på Workers | Långa jobb → Edge Function eller cron |
| Kallstart | Liten latens vid ny region | Försumbart för CK:s användningsfall |
| Inga långkörande anslutningar | Postgres-pool ska inte hållas öppen i Worker | Supabase-klient skapas per request — använd `requireSupabaseAuth` helper |

---

## 3. Multi-tenant-hierarki

### 3.1 Modell

```
tenant (toppnivå — ofta = bolagsgrupp eller franchise)
  └── bolag (juridisk enhet, "Avesta Beauty AB")
        └── klinik (fysisk verksamhet, "Derma Beauty Östermalm")
              └── moduldata (avvikelser, ordinations, hygien, risk, läkemedel)

Delat per bolag:    customers (kunder/patienter)
Delat per tenant:   optional shared_customers (opt-in via flagga)
Per användare:      memberships (kopplar profile → bolag/klinik med roll)
```

### 3.2 Datakorthet per nivå

| Entitet | Innehåller | Delat med |
|---|---|---|
| `tenant` | Toppnivå-konfig, opt-in cross-bolag-funktioner | — |
| `companies` (bolag) | Org.nr, plan, billing, industry_template, feature flags | Egen tenant |
| `clinics` | Adress, ansvarig, lokala inställningar | Eget bolag |
| `profiles` | Användarprofil (en per auth-user) | — |
| `memberships` | Roll per (profile, bolag, klinik?) | — |
| `customers` | Kund/patient — namn, kontakt, hälsodeklaration metadata | **Hela bolaget** (alla kliniker) |
| `customer_records` | Strukturerad behandlingsanteckning (se §7.3) | Hela bolaget |
| `consulting_assignments` | Extern ordinerande läkare → tenant/bolag/klinik | Cross-tenant tillåtet |

### 3.3 Roller

13 roller (mappas till `role`-tabell med flaggor `can_*`):

| Roll | Scope | Typisk användare |
|---|---|---|
| `tenant_owner` | tenant | Kedjeägare, franchise-toppen |
| `company_owner` | bolag | Klinikbolagsägare, VD |
| `verksamhetschef` | bolag | Verksamhetschef (legitimerad krav i vissa fall) |
| `clinic_manager` | klinik | Daglig drift av en klinik |
| `legitimerad_lakare` | klinik (multi) | Ordination, MAS |
| `legitimerad_tandlakare` | klinik (multi) | Ordination |
| `legitimerad_sjukskoterska` | klinik (multi) | Behandling enligt delegering |
| `behandlare` | klinik | Intern behandlare, ej legitimerad |
| `extern_behandlare` | klinik (per kontrakt) | Hyr rum, separat avtal |
| `consulting_practitioner` | cross-tenant | Extern läkare som ordinerar till flera bolag |
| `administrator` | bolag/klinik | Adminstöd, schemaläggning |
| `auditor` | bolag (read-only) | Revisor, intern compliance-granskning |
| `inspector_token` | tidsbegränsad | Genererad token för IVO/miljö-inspektion |

### 3.4 Permissions

Roll → granulära `can_*`-permissions per modul. Hämtas i `usePermissions(module)`-hook (frontend) och kontrolleras i `createServerFn` via helper `requirePermission(ctx, "avvikelse.approve")`.

Detaljerat schema i **02-database-api.md §2**.

---

## 4. Moduler — översikt

Moduler är gruperade efter fas i implementationsplanen (se 04). Här en katalog:

### 4.1 Kärnmoduler (Fas 1–3)

| # | Modul | Kort beskrivning | Fas |
|---|---|---|---|
| 1 | **Auth & multi-tenant** | tenant/bolag/klinik/profil/memberships/RBAC, onboarding | 1 |
| 2 | **Dokumenthantering** | Styrdokument, rutiner, mallar; versionering, signering, PDF-export | 2 |
| 3 | **Avvikelsehantering** | Rapport → klassificering → ansvarig → åtgärd → uppföljning → stängning | 2 |
| 4 | **Läkemedelslogg & produktspårbarhet** | Batch, utgångsdatum, temperaturlogg, lager per klinik, kassation | 3 |
| 5 | **Ordination & delegering** | Vem får ordinera, vem får utföra, giltighetstid, spärrar, Consulting Practitioner Global Inbox | 3 |

### 4.2 Utbyggnad (Fas 4–6)

| # | Modul | Kort beskrivning | Fas |
|---|---|---|---|
| 6 | **Miljö & hygien (egenkontroll)** | Schemalagda checklistor, fotobevis, automatisk avvikelse vid "ej OK" | 4 |
| 7 | **Riskanalys** | SOSFS 2011:9, riskmatris, åtgärdsplan, koppling till avvikelser | 4 |
| 8 | **Compliance Center** | Score, vad saknas/förfallet, exportpaket vid tillsyn | 5 |
| 9 | **Personal, legitimation & kompetens** | Legitimation, certifikat, utgångsdatum, behörighet per behandling | 6 |

### 4.3 Senare faser (Fas 7–10)

| # | Modul | Kort beskrivning | Fas |
|---|---|---|---|
| 10 | **Billing & prenumeration (aktivering)** | Stripe Checkout, Customer Portal, webhook → feature flags, read-only fallback | 7 |
| 11 | **Behandlingslogg & samtycke** | Strukturerad, **inte journal** (se §7.3) — hälsodeklaration, samtycke, kontraindikationer | 8 |
| 12 | **Externa behandlare & rumsuthyrning** | Hyresavtal, ansvarsfördelning, klinik-rum-koppling, behandlingsbehörighet per behandlare | 9 |
| 13 | **BankID & BokaDirekt** | Signering, stark auth; bokningssynk | 10 |

### 4.4 Modul-anatomi (gemensam struktur)

Varje modul följer samma fundament:
- En eller flera tabeller med `tenant_id`, `company_id`, `clinic_id?`, `created_by`, `created_at`, `updated_at`, `version`, `deleted_at`
- RLS-policies som kräver matchande tenant/bolag/klinik via helper-funktioner
- Feature flag-styrd åtkomst (`company_features.module_<x>_enabled`)
- En route-grupp under `src/routes/_app/<module>/`
- `createServerFn`-fil per modul: `src/lib/<module>.functions.ts`
- Audit log-skrivning på alla muterande operationer
- Notifieringsflöde där applicerbart

---

## 5. Billing & abonnemang

### 5.1 Vad CareKompass tar betalt för

CareKompass säljer **abonnemang till klinikbolaget**. Det är inte ett kassasystem för klinikens egna kunder.

| Plan | Pris (placeholder) | Inkluderar |
|---|---|---|
| **Trial** | 0 kr, 14 dagar | Allt i Pro |
| **Starter** | 295 kr/mån/klinik | Auth, multi-tenant, dokument, avvikelser, hygien (begränsad), 1 användare/klinik |
| **Pro** | 695 kr/mån/klinik | + läkemedel, ordination, risk, compliance center, obegränsade användare |
| **Enterprise** | offert | + tenant-skala, BankID, custom integrationer, audit-export, SLA |

(Priser slutgiltigt prissatta av Toni; backendlogiken är plan-agnostisk.)

### 5.2 Hur det implementeras

- `plans` — tabell med plan-definitioner
- `plan_feature_defaults` — vilka feature flags som default-aktiveras per plan
- `subscriptions` — bolagets aktiva prenumeration (Stripe subscription_id)
- `company_features` — den **aktiva** uppsättningen flaggor för bolaget (kan avvika från plan via Enterprise-overrides)
- Stripe Checkout för köp; Stripe Customer Portal för uppgradering/uppsägning
- `stripe-webhook` Edge Function → uppdaterar `company_features` när subscription byter status

### 5.3 Trial och read-only-fallback

- Nytt bolag startar med 14 dagars Pro-trial (alla flaggor på)
- När trialen löper ut **utan** aktiv prenumeration → bolaget faller tillbaka till read-only-läge (kan läsa allt, kan inte skapa/ändra)
- All data bevaras minst 90 dagar efter utgång
- Read-only-läget bestäms i frontend via `useSubscriptionStatus()` och i backend via `requireWritableSubscription`-helper i `createServerFn`

### 5.4 Race-condition (känt från v5.0-planen)

När Stripe-webhook landar samtidigt som användaren utför en åtgärd:
- Webhook uppdaterar `company_features`
- Användaren har gammal cache → ser fel UI
- Lösning: efter mutation som påverkas av flaggor — refetch `company_features` i Query-cachen. Etableras i `useFeatureFlags`-hook (03-frontend-guide §4.5).

---

## 6. Branschstöd

### 6.1 Industry templates

`industry_templates` styr dynamiskt:
- **Terminologi** — "Ordination" (estetisk injektion) vs "Behandlingsprotokoll" (tatuering) vs "Behandlingsplan" (fotvård)
- **Reglerande myndighet** — IVO (estetisk injektion) vs Miljöförvaltningen (tatuering) vs båda (laser/IPL)
- **Default-dokumentmallar** — vilka mallar som auto-seedas i ett nytt bolag
- **Hygienchecklistor** — branschspecifika mallar
- **Risk-kategorier** — branschspecifika typ-listor
- **Behandlingstyper** — dropdowns

### 6.2 Branscher i v6.0

Primära:
- `estetisk_injektion` — botox, fillers, skinboosters, PRP, hyalase
- `estetisk_kirurgi` — anmälningspliktigt enligt lag 2021:363
- `tandvard_estetik` — estetisk tandvård
- `klinikkedja` — multi-klinik, blandad personal

Sekundära (Fas 2 eller senare):
- `hudvard` — facial, kemiska peelings
- `laser_ipl`
- `microneedling_prp`
- `fotvard`
- `piercing_tatuering`
- `frisor_skonhet` (om avancerad hygien/egenkontroll)
- `uthyrningsklinik` — flera externa behandlare under samma tak

### 6.3 Terminologi-hook

```tsx
// 03-frontend-guide §4.3 detaljerar
const t = useTerminology()
return <Heading>{t("ordination.title")}</Heading>
// → "Ordination" eller "Behandlingsprotokoll" beroende på bransch
```

### 6.4 Industry-väljs vid bolags-skapande

- Onboarding-wizard frågar bransch
- Sätter `companies.industry_template_id`
- Trigger seedar default-mallar (dokument, checklistor)
- Kan **inte** ändras efter att data finns (kräver migrationsstöd om begäran kommer)

---

## 7. Säkerhet & compliance

### 7.0 Ansvarsgräns — CareKompass är verktyg, inte granskare

**Grundprincip (icke-förhandlingsbar):** CareKompass är ett *verktyg* som vårdgivaren använder för sitt kvalitetsarbete. CareKompass är **aldrig** klinikens kvalitetsgranskare och tar **aldrig** över vårdgivarens lagstadgade ansvar.

Enligt patientsäkerhetslagen och SOSFS 2011:9 äger vårdgivaren (bolaget/den juridiska personen) det yttersta ansvaret för sitt ledningssystem, sin egenkontroll och sina attesteringar. Detta ansvar kan **inte** delegeras till en mjukvaruleverantör. CareKompass varken kan eller ska bära det.

Konkreta konsekvenser för systemdesignen:

- **Varje bolag måste ha minst en egen kvalitetsansvarig** (rollen `quality_manager`, 07 §2.2). Onboarding kan inte slutföras utan att minst en person tilldelats den rollen. Egenkontroll får aldrig vara "herrelös".
- **Granskning, attestering och uppföljning sker inom respektive tenant/verksamhet** — av deras egen `quality_manager` och `verksamhetschef`, inte av CK-personal.
- **Compliance-score (04 §13) är ett internt hjälpmedel** för klinikens egen kvalitetsansvariga — inte ett myndighetsutlåtande, inte en stämpel eller ett godkännande från CareKompass. UI:t ska aldrig formulera score som att "CareKompass godkänner" något.
- **CK-onboarding-godkännande (08 §10) är affärsmässig gatekeeping** (är detta en legitim kund?) — inte en kvalitetsbedömning av klinikens vård. De två får aldrig blandas ihop i copy, UI eller dokumentation.
- **Inspector mode (7.5) ger en extern myndighet read-only insyn** — CareKompass förmedlar bevis, men gör ingen egen bedömning av om kliniken uppfyller kraven.
- **CK-admin / super_admin** (08 §8) kan supporta och felsöka, men granskar aldrig en kunds kvalitetsarbete och uttalar sig aldrig om en kunds regelefterlevnad.

Detta är också ett positioneringsargument: CareKompass säljer *kontroll och trygghet till vårdgivaren* — inte en outsourcad kvalitetsfunktion. Marknadsföring (08 §2) ska spegla detta: "Du får verktygen att äga ditt kvalitetsarbete", aldrig "Vi sköter din compliance".

### 7.1 RLS-modell

- **Alla** tabeller har RLS aktiverat
- **Inga** policies har `USING (true)` utom för pure-lookup-tabeller (plans, industry_templates)
- Helper-funktioner: `current_tenant_id()`, `current_company_ids()`, `current_clinic_ids()`, `has_role(role, scope)`, `has_permission(perm, scope)`
- Server functions kör med **användarens JWT**, inte service_role — RLS gäller alltid
- Edge Functions som behöver bypass (Stripe webhook) använder service_role **uttryckligen** och har egen auth-logik (signaturverifiering)

### 7.2 Audit

- `audit_logs`-tabell: append-only, ingen UPDATE, ingen DELETE (RLS blockerar)
- Skrivs vid alla mutationer: skapa/ändra/radera (soft) på domain-entiteter
- Innehåller: `actor_id`, `actor_role`, `tenant_id`, `company_id`, `clinic_id`, `action`, `entity_type`, `entity_id`, `before`, `after`, `request_id`, `created_at`
- **Aldrig** joinas i realtids-queries — egen sida `/audit` för granskning, paginerad
- Behållstid: minst 7 år (svensk bokföring/IVO-praxis)

### 7.3 PDL och behandlingsanteckningar

`customer_records` (om aktiverad i Fas 8) är **inte** ett journalsystem. Begränsningar:
- Strukturerade fält: `treatment_date`, `treatment_type`, `treated_by`, `product_batch_ref`, `dose`, `area`, `aftercare_given (bool)`, `complications (bool)`, `notes (max 500 tecken)`
- **Inga** bilagor på `customer_records` (separat `treatment_photos`-tabell med eget samtycke)
- Vid aktivering: bolaget måste kryssa i PDL-disclaimer som varnar att CareKompass inte är ett journalsystem enligt patientdatalagen och att riktig journal måste föras i godkänt system
- Disclaimer-acceptans loggas (`pdl_disclaimer_accepted_at`, `accepted_by`)
- Framtida: integration mot extern journal (HOSP-system, Cliniconex) — out of v6.0 scope

### 7.4 GDPR-praktik

- PuB-avtal genereras vid bolagsskapande som PDF-mall — signering manuell (eller via BankID i Fas 10)
- Användare kan begära dataexport (egen profil)
- Bolag kan begära raderingsplan (90-dagars wind-down)
- Storage: filer ligger i Supabase Storage med RLS, signerade URL:er för åtkomst (aldrig publika buckets för känslig data)

### 7.5 Audit-export / tillsynsläge

Två separata mekanismer:

**Audit-paket (PDF-export):**
- Genereras via `audit-export` Edge Function (Deno + `pdf-lib`)
- Innehåller: dokument, signaturer, avvikelse-historik, hygienkontroller, riskanalys, läkemedelsspårning, audit-logg-utdrag — för vald tidsperiod
- Levereras som signerad URL till ZIP i Storage (giltig 7 dagar)

**Tillsynsläge (tidsbegränsad token):**
- Bolaget genererar en `inspector_token` — UUID + giltighetstid (max 30 dagar) + scope (klinik eller bolag)
- Inspektören öppnar `v6.carekompass.se/inspect/<token>` → får read-only UI mot vald scope
- Allt som inspektören öppnar loggas (`inspection_views`)
- Inspektören kan exportera audit-paket utan att kunna skapa/ändra något

### 7.6 BankID

- Avtalssignering vid onboarding (PuB-avtal, klinikens styrdokument-signering)
- Stark autentisering för: ordinations-godkännande, audit-export, känsliga inställningsändringar
- Implementeras i Fas 10 — fram tills dess används enkel "klick-signering" (sparas som `signed_at`, `signed_by`, `signature_method = 'click'`)

---

## 8. Integrationer

### 8.1 Prioriterade integrationer

| Integration | Prioritet | Syfte | Fas |
|---|---|---|---|
| **Stripe** | 🔴 Måste | Prenumerationshantering (Checkout, Customer Portal, webhooks) | 7 |
| **BankID** | 🟠 Hög | Avtalssignering, stark auth | 10 |
| **BokaDirekt** | 🟠 Hög | Bokningssynk, kund-/patientsynk | 10 |
| **Lovable Cloud Email** | 🔴 Måste | Transaktionella mail (invites, notiser, avtalsutskick) | 1 |
| **Supabase Storage** | 🔴 Måste | Filuppladdning (fotobevis, signerade dokument, audit-paket) | 1 |

### 8.2 Stripe-flöde

```
[Klient]                [createServerFn]              [Stripe]
   │                          │                          │
   │  "Uppgradera till Pro"  │                          │
   │─────────────────────────▶│                          │
   │                          │  createCheckoutSession   │
   │                          │─────────────────────────▶│
   │                          │◀─────────────────────────│
   │◀─────────────────────────│  checkoutUrl             │
   │                          │                          │
   │  Redirect till Stripe    │                          │
   │─────────────────────────────────────────────────────▶│
   │                                                     │
   │  Betalning klar, redirect tillbaka                  │
   │                                                     │
   │                          │                          │
   │                          │   webhook (separat)      │
   │                          │  ◀───────────────────────│
   │              [stripe-webhook Edge Function]         │
   │                          │                          │
   │              service_role: uppdatera                │
   │              company_features                       │
```

### 8.3 BokaDirekt-flöde (Fas 10)

- Kund/patient skapas i BokaDirekt → webhook → CareKompass
- CareKompass kontrollerar duplikat (samma personnummer eller telefon i bolaget)
- Vid match: koppling skapas; vid ny: ny `customer` skapas
- Bokning i BokaDirekt → webhook → används för att initiera behandlings-flow i CareKompass om behandlingsmodulen är aktiv

### 8.4 Vad CareKompass v6.0 **inte** integrerar med (för nu)

- Journalsystem (Cliniconex, Take Care) — endast som länk/notering, inte API-koppling
- Bokföring (Fortnox, Visma) — Stripes egna export räcker för MVP
- E-handelsplattformar — irrelevant för denna domän

---

*Slut på 01-system-spec. Vidare till 02-database-api.md för schema, RLS-policies och API-design.*
