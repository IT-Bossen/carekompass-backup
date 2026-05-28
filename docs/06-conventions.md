# CareKompass v6.0 — Tekniska konventioner

> **Serie:** 01-system-spec · 02-database-api · 03-frontend-guide · 04-implementation-plan · 05-domain-content · **06-conventions**
> **Syfte:** Tvärfunktionella tekniska standarder som gäller från Fas 0. Etableras i Fas 0–1 och måste följas av alla efterföljande faser.

---

## Innehåll

1. Teststrategi & teststack
2. Observability & felövervakning
3. CI/CD & branch-strategi
4. Migrations-pipeline
5. Säkerhetsstandard (CSP, headers, secrets)
6. Rate limiting & abuse-skydd
7. Performance-budgets
8. Accessibility (WCAG 2.1 AA)
9. i18n & lokalisering
10. Code style & lint
11. Git-konventioner
12. Error handling & loggning
13. Backup & disaster recovery
14. ADR-format & beslutsdokumentation
15. Release management

---

## 1. Teststrategi & teststack

### 1.1 Tre nivåer

| Nivå | Verktyg | Vad testas | När körs |
|---|---|---|---|
| **Unit** | Vitest | Pure functions, schemas, hjälpfunktioner, klient-hooks | Varje commit (CI) + lokalt |
| **Integration (server)** | Vitest + Supabase lokal | `createServerFn`-handlers + DB (med RLS) | CI + lokalt |
| **RLS-test** | Vitest + Supabase + JWT-simulering | RLS-policies isoleras per användare/tenant | CI + lokalt |
| **E2E** | Playwright | Critical user flows i browser | CI (på PR + nightly) |

### 1.2 Vitest-uppsättning

```
tests/
├── unit/
│   ├── schemas/
│   │   ├── deviations.test.ts
│   │   ├── orders.test.ts
│   │   └── ...
│   ├── helpers/
│   │   └── compliance-score.test.ts
│   └── hooks/
│       └── useTerminology.test.ts
├── integration/
│   ├── deviations.functions.test.ts
│   ├── orders.functions.test.ts
│   └── ...
├── rls/
│   ├── tenant-isolation.test.ts
│   ├── company-isolation.test.ts
│   ├── role-permissions.test.ts
│   └── consulting-practitioner.test.ts
└── e2e/
    ├── onboarding.spec.ts
    ├── report-deviation.spec.ts
    ├── create-order.spec.ts
    └── inspector-mode.spec.ts
```

### 1.3 RLS-test-mönster

Egen helper `tests/_rls/withUser.ts` skapar en Supabase-klient med ett spoofat JWT för en given `auth_user_id`:

```ts
// tests/_rls/withUser.ts
import { createClient } from "@supabase/supabase-js"
import { signJwt } from "./_jwt"

export function withUser(authUserId: string) {
  const token = signJwt({ sub: authUserId, role: "authenticated" })
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
}
```

```ts
// tests/rls/tenant-isolation.test.ts
import { describe, it, expect, beforeAll } from "vitest"
import { withUser } from "../_rls/withUser"
import { seedTwoTenants } from "../_fixtures/seedTwoTenants"

describe("tenant isolation", () => {
  let setup: Awaited<ReturnType<typeof seedTwoTenants>>
  beforeAll(async () => { setup = await seedTwoTenants() })

  it("user in tenant A cannot read tenant B's deviations", async () => {
    const sb = withUser(setup.userA.authUserId)
    const { data, error } = await sb.from("deviations").select("*").eq("company_id", setup.companyB.id)
    expect(data ?? []).toHaveLength(0)
  })

  it("user in tenant A cannot insert with tenant_id = B", async () => {
    const sb = withUser(setup.userA.authUserId)
    const { error } = await sb.from("deviations").insert({
      tenant_id: setup.tenantB.id,
      company_id: setup.companyB.id,
      clinic_id: setup.clinicB.id,
      // ...
    })
    expect(error).toBeTruthy()
  })
})
```

**JWT-signering kräver Supabase JWT-secret.** Lagras i CI som secret, lokalt i `.env.test.local` (gitignored).

### 1.4 E2E-mönster (Playwright)

- En testuppsättning seedar två fasta testbolag i staging-DB (med kända lösenord)
- Tests körs mot `staging.v6.carekompass.se` på PR, och mot lokal `bun dev` på utvecklare
- Kritiska flows: signup → onboarding → första avvikelse → första hygienkontroll → invitera kollega
- `playwright.config.ts`: 2 workers parallellt, screenshots på fail, video on retry

### 1.5 Coverage-mål

- Unit: 80% på `src/lib/**/*.ts` (exklusive *.functions.ts som testas via integration)
- Integration: alla `createServerFn`-handlers har minst happy path + 1 error case
- RLS: 100% av RLS-policies (varje policy träffas av minst ett test)
- E2E: 100% av kritiska user flows enligt §1.4

Coverage är inte ett självändamål — kvalitativ täckning av RLS och permissions är viktigare än siffran.

### 1.6 Vad testas inte automatiskt

- Visuell regression (Chromatic/Percy — inte i MVP)
- Performance benchmarks (manuellt + Lighthouse i CI)
- A11y (axe-core inkluderad i Playwright, men ej blockerande för PR)

---

## 2. Observability & felövervakning

> **Fas-placering (09 §17-19):** Sentry, BetterStack och GA4 (med cookie-consent) implementeras alla i **Fas 1** — inte senare. Tidig felövervakning är särskilt viktig givet AI-integrationer (Lovable AI Gateway) och betalningsflöden (Lovable Stripe-payments).

### 2.1 Stack

| Område | Verktyg | Var används |
|---|---|---|
| **Frontend errors** | Sentry (browser SDK) | Client-side runtime errors, unhandled rejections |
| **Server function errors** | Sentry (Node/Workers SDK) | `createServerFn` exceptions, Edge Function exceptions |
| **Worker logs** | Cloudflare Workers logs (gratis tier räcker initialt) → Axiom (om volym kräver) | Strukturerad output från Workers |
| **Postgres logs** | Supabase Logs (built-in) | RLS-fel, slow queries |
| **Uptime monitoring** | BetterStack | Probe på sajt, backend och viktiga API-endpoints; larm vid driftstörning |
| **Analytics** | Google Analytics 4 (consent-gated) | Publika sidor; aktiveras endast vid analytiskt samtycke. Plausible/Fathom som GDPR-backup. Se 08 §4.3-4.4 |
| **Performance** | Sentry Performance + Lighthouse CI | TTFB, FCP, LCP, route-transitioner |

### 2.2 Sentry-konfiguration

```ts
// src/lib/sentry.ts
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,           // 10% av requests
  replaysSessionSampleRate: 0,     // av session replay för PHI-skäl
  replaysOnErrorSampleRate: 0,
  beforeSend(event) {
    // Strip all PII från events innan de skickas
    if (event.request?.cookies) delete event.request.cookies
    if (event.user) event.user = { id: event.user.id }   // bara id, inte email
    return event
  },
})
```

**Aldrig logga:** personnummer, email, telefon, customer-namn, läkemedelsbatchnummer kopplade till identifierbar person.

### 2.3 Strukturerade logs

`createServerFn` loggar via en helper `logger.ts` som lägger till `request_id`, `tenant_id`, `actor_profile_id`, `function_name`:

```ts
// src/lib/logger.ts
export function log(level: "info" | "warn" | "error", message: string, meta?: Record<string, unknown>) {
  console.log(JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  }))
}
```

Workers konsoll → Cloudflare Workers Logs → exporteras till Axiom om/när volym kräver.

### 2.4 Alert-trösklar

| Alert | Tröskel | Kanal |
|---|---|---|
| Uptime-probe fail | 2 consecutive failures | BetterStack → Slack + SMS till Toni |
| Error rate (Sentry) | > 1% av requests över 5 min | Sentry → Slack |
| p95 latency (createServerFn) | > 500ms över 10 min | Sentry Performance → Slack |
| Failed Stripe webhook | varje fail | Sentry → Slack |
| RLS-fel (Postgres logs) | varje fall | Manuell daglig review (auto-alert FUTURE) |

---

## 3. CI/CD & branch-strategi

### 3.1 Branches

```
main           — produktion (v6.carekompass.se efter cutover)
develop        — staging (staging.v6.carekompass.se)
feature/<name> — feature-branches, PR mot develop
hotfix/<name>  — direkt mot main för akuta produktionsproblem
```

### 3.2 PR-process

1. Feature-branch från `develop`
2. PR mot `develop` — kräver:
   - `bun typecheck` grön
   - `bun test` grön (unit + integration + RLS)
   - `bun build` grön
   - Playwright smoke (5 kritiska flows) grön
   - Minst 1 review (Toni, eller automatisk för bot-PR)
   - Inga merge-conflicts
3. Squash merge till `develop`
4. Auto-deploy till staging
5. Release-PR från `develop` till `main` veckovis (eller per beslut)
6. Auto-deploy till produktion

### 3.3 GitHub Actions workflows

```
.github/workflows/
├── ci.yml              # PR-checks: typecheck, test, build
├── e2e.yml             # Playwright på develop + nightly
├── migrations.yml      # Manuell trigger för production-migrations
├── deploy-staging.yml  # Auto vid push till develop
└── deploy-prod.yml     # Auto vid push till main + tag
```

### 3.4 Preview deploys

Lovable Cloud / Cloudflare Pages ger automatisk preview-URL per PR. Format: `pr-<nr>.v6.carekompass.dev` (separat dev-domän). Använder en separat Supabase-projekt-instans (eller staging-DB med PR-isolerade scheman om volym blir hög).

---

## 4. Migrations-pipeline

### 4.1 Regler

- En migration per logisk ändring (02-database-api §12)
- Filnamn: `YYYYMMDDHHMMSS_<snake_case_description>.sql`
- Aldrig redigera deployad migration
- Idempotent där möjligt
- RLS-policies för en tabell ligger i samma migration som tabellen
- Seeds i separata `seed_*`-migrationer

### 4.2 Workflow

```
1. Utvecklare skapar migration lokalt
   → bunx supabase migration new <namn>
   → skriver SQL
2. Lokal körning
   → bunx supabase db reset (re-skapar lokal DB med alla migrationer)
   → bunx supabase db push (pushar mot lokal Supabase)
3. Regenerera typer
   → bunx supabase gen types typescript > src/types/supabase.ts
4. PR mot develop
   → CI kör migrations mot ephemeral staging-DB-snapshot
   → CI verifierar att RLS-tester fortfarande passerar
5. Merge till develop
   → Manuell migrations-deploy mot staging via .github/workflows/migrations.yml
   → Toni triggar workflow med "target=staging"
6. Verifiering i staging i minst 24h
7. Release till main
   → Manuell migrations-deploy mot production
   → Toni triggar workflow med "target=production"
   → Förkrav: manuell backup-snapshot via Supabase Dashboard
```

### 4.3 Rollback-strategi

- Aldrig auto-rollback av migrationer (för riskabelt)
- Vid produktion-fel: skriv reverse-migration som `YYYYMMDDHHMMSS_revert_<original>.sql`
- För destruktiva fall (column drop): pre-deployment snapshot från Supabase Dashboard

### 4.4 Destruktiva förändringar

Kräver explicit godkännande:
- DROP COLUMN
- DROP TABLE
- Ändra kolumn-typ
- Borttagning av enum-värden
- Borttagning av RLS-policy (utan ersättning)

Process: skriv ADR, vänta 24h, exekvera. Inget akut-godkännande för dessa.

---

## 5. Säkerhetsstandard

### 5.1 HTTP-headers

Sätts i TanStack Start root layout (eller via Workers response middleware):

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: <se 5.2>
```

### 5.2 Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://js.stripe.com https://*.sentry.io https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://*.supabase.co https://www.google-analytics.com https://*.googletagmanager.com;
font-src 'self' data:;
connect-src 'self' https://*.supabase.co https://api.stripe.com https://*.sentry.io https://*.ingest.sentry.io https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com;
frame-src https://js.stripe.com https://hooks.stripe.com;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

`'unsafe-inline'` på script är tyvärr nödvändigt initialt för TanStack Start SSR (hydration data). Mål: ersätta med nonces-baserad CSP i Fas 5.

**Analytics-domäner (GA4, 09 §19):** Google Tag Manager / Analytics-domänerna ovan är med i CSP men GA-scriptet **laddas inte** förrän användaren gett analytiskt samtycke (08 §4.3 + §4.4). Tills dess injiceras ingen GA-tagg. Om Plausible/Fathom används istället (GDPR-backup) byts dessa domäner mot `https://plausible.io` respektive Fathoms domän.

### 5.3 Secrets management

| Secret | Var lagras | Vem ser |
|---|---|---|
| `SUPABASE_URL` | Lovable env (publik) | Bundlad i klient |
| `SUPABASE_ANON_KEY` | Lovable env (publik) | Bundlad i klient |
| `SUPABASE_SERVICE_ROLE_KEY` | Lovable env (server-only) + Supabase Vault för cron | Aldrig i klient |
| `STRIPE_PUBLISHABLE_KEY` | Lovable env (publik) | Bundlad i klient |
| `STRIPE_SECRET_KEY` | Lovable env (server-only) | Aldrig i klient |
| `STRIPE_WEBHOOK_SECRET` | Supabase Edge Function secret | Edge Function only |
| `SENTRY_DSN` (publik) | Lovable env (publik) | Bundlad |
| `SENTRY_AUTH_TOKEN` (server) | GitHub Actions secret | CI only |
| `BANKID_*` | Lovable env (server-only) + Edge Function secret | Server only |
| `BOKADIREKT_API_KEY` | `companies.integrations` (krypterad) | Per bolag, krypterad i DB |

**Aldrig:**
- Commit secrets till Git (`.gitignore` täcker `.env*`)
- Logga secrets i klartext (Sentry beforeSend strippar)
- Skicka secrets i URL-parametrar
- Servera service_role-key från `createServerFn` (endast Edge Functions)

### 5.4 Auth-säkerhet

- Lösenordskrav: Supabase Auth defaults (min 8 tecken). Stärks i Fas 1 till min 10 tecken + minst en siffra.
- 2FA: TOTP i Fas 5 (BankID i Fas 10 ersätter delvis)
- Session timeout: 24h sliding window
- "Login from new device" → mail-notifiering (Supabase native)
- Brute force: Supabase rate-limit (default) + Cloudflare Turnstile på `/login` om missbruk upptäcks

---

## 6. Rate limiting & abuse-skydd

### 6.1 Lager

| Lager | Skydd | Implementering |
|---|---|---|
| **Cloudflare Workers** | DDoS, geo-blocking | Cloudflare automatic + manuell konfig vid behov |
| **Per-IP rate limit** | Spam, brute force | Cloudflare WAF rules: max 100 req/min per IP på public routes, max 10 login-attempts per 5 min |
| **Per-user rate limit** | Abuse av authenticated användare | I `_helpers.ts`: räkna `requestId` per `profileId` i Workers KV/Durable Object — max 600 req/min |
| **Supabase rate limit** | DB-överbelastning | Supabase native + connection pooling (Transaction mode) |
| **Stripe webhook** | Replay-attacker | Signaturverifiering i Edge Function — avvisa events > 5 min gamla |

### 6.2 Konkret config (Fas 0)

Workers Durable Object för per-user rate limiting **är overkill för MVP.** Starta med Cloudflare WAF + Supabase native. Lägg till per-user-limit i Fas 7 när trafik kräver det.

---

## 7. Performance-budgets

### 7.1 Mål per metric

| Metric | Mål (p75) | Mål (p95) | Mätning |
|---|---|---|---|
| TTFB (Time to First Byte) | < 200ms | < 400ms | Sentry Performance + Lighthouse CI |
| FCP (First Contentful Paint) | < 1.5s | < 2.5s | Lighthouse CI |
| LCP (Largest Contentful Paint) | < 2.5s | < 4.0s | Lighthouse CI |
| INP (Interaction to Next Paint) | < 200ms | < 500ms | Sentry RUM |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.25 | Lighthouse |
| Initial JS bundle (gzip) | < 200KB | — | Build-time check |
| Route-chunk (gzip) | < 50KB | — | Build-time check |

### 7.2 createServerFn-mål

| Operation | p50 | p95 |
|---|---|---|
| Simpel CRUD (1 query) | < 100ms | < 300ms |
| Lista med filter (3-5 queries) | < 200ms | < 600ms |
| Workflow med audit + notification | < 300ms | < 800ms |

Långsammare → Sentry alert + utredning.

### 7.3 Vilka optimeringar är "in scope" från start

- React 19 Server Components (om TanStack Start stödjer) — nej, TanStack Start använder annan modell
- Code splitting per route — ja, native i TanStack Router
- Image optimization — använd Supabase Storage transformations
- Postgres-index på alla join-/filterkolumner — ja, från Fas 1

### 7.4 Vilka är FUTURE

- React Query persisting (`localStorage` cache mellan sessions)
- Materialiserade vyer för tunga aggregat (Compliance Center, dashboard)
- CDN-cachning av semi-statiska assets
- Service worker / PWA — inte i v6.0 MVP

---

## 8. Accessibility (WCAG 2.1 AA)

### 8.1 Baseline

- **Färgkontrast** ≥ 4.5:1 för normal text, ≥ 3:1 för stor text — verifieras i Tailwind v4 design tokens (§6 i 03-frontend-guide)
- **Tab-navigering** fungerar genom hela appen — focus-ring synlig (shadcn default ok)
- **ARIA labels** på alla interaktiva element utan synlig text (ikonknappar, switchar)
- **Skip links** — "Hoppa till huvudinnehåll" först i `_app.tsx`
- **Semantisk HTML** — `<main>`, `<nav>`, `<header>`, korrekt hierarki av `<h1>-<h6>`
- **Förstoringsbart** — fungerar vid 200% zoom utan horisontell scroll
- **Inga "color only"-signaler** — status-färger följs alltid av ikon eller text

### 8.2 Validering

- **axe-core i Playwright** — körs på alla E2E-tester, samlar a11y-violations som rapport (inte blockerande för PR i v6.0 MVP — blockerande från Fas 5)
- **Manuell screen reader-test** för kritiska flows en gång per fas: VoiceOver (Mac) + NVDA (Windows)
- **Keyboard-only-test** för login, onboarding, rapportera avvikelse

### 8.3 Vad är medvetet utanför scope

- WCAG AAA-nivå
- Tecken-/svenskt teckenspråk-stöd
- Egen text-to-speech

---

## 9. i18n & lokalisering

### 9.1 Default

- **Svenska** är default och enda språk i v6.0 MVP
- All UI-text på svenska
- All terminologi från `industry_templates` på svenska

### 9.2 Förberedelse för framtid

Även om bara svenska levereras i v6.0, struktureras koden för att **enkelt** kunna lägga till engelska senare:

- All UI-text går via `t("nyckel")`-funktion (`src/lib/i18n.ts`) — även om endast en `sv`-fil finns
- Datum: `date-fns` med `sv` locale + `format` (aldrig hårdkodade strängar)
- Belopp: `Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" })`
- Pluralisering: `Intl.PluralRules` om relevant

Detta är **inte gratis** — kräver disciplin från Fas 0. Men retrofitting är mångdubbelt dyrare.

### 9.3 Library-val

För TanStack Start finns flera alternativ. Rekommendation:
- **`@tanstack/react-i18next`** om/när det finns
- Annars **`react-i18next`** direkt — robust, väldokumenterat, fungerar med SSR

Beslut tas i Fas 0 första timmen. ADR-dokumenterat.

### 9.4 Engelska-läge (FUTURE)

Aktiveras när första engelsktalande pilotkund finns. Då görs:
1. Översättning av alla `sv`-strängar
2. Per-användare språkpreferens i `profiles.locale`
3. Industry templates får `terminology_en`-fält
4. Mail-templates på båda språk

---

## 10. Code style & lint

### 10.1 Verktyg

- **TypeScript strict mode** — `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`
- **ESLint** — typescript-eslint + plugin-react + plugin-react-hooks + plugin-tanstack-query
- **Prettier** — för formatering, körs på pre-commit
- **Biome** som alternativ (snabbare, kombinerar lint + format) — utvärderas i Fas 0

### 10.2 Regler

- **Inga `as any`** — om typ saknas: regenerera Supabase-typer eller använd `unknown` + zod-parsing
- **Inga `// @ts-ignore`** — använd `// @ts-expect-error` med kommentar varför
- **Importer:** `import type { ... }` för rena typer (Vite trädskakar)
- **Inga default exports** utom för route-filer och React komponenter där TanStack Start kräver det
- **Funktioner > 50 rader** triggar lint-varning — överväg att bryta upp
- **Filer > 400 rader** triggar lint-varning — överväg att bryta upp

### 10.3 Naming

- Komponenter: `PascalCase`
- Hooks: `useCamelCase`
- Server functions: `camelCase`
- Filer: `kebab-case.ts` för utility, `PascalCase.tsx` för komponenter, `<module>.functions.ts` för server functions
- Variabler/funktioner: `camelCase`
- Konstanter: `UPPER_SNAKE_CASE`
- Typer/Interfaces: `PascalCase`, inga "I"-prefix

### 10.4 Pre-commit

Husky + lint-staged kör:
- `bun typecheck` (changed files)
- `bun eslint --fix` (changed files)
- `bun prettier --write` (changed files)

---

## 11. Git-konventioner

### 11.1 Conventional Commits

```
feat:     Ny funktionalitet
fix:      Buggfix
refactor: Refaktorering utan beteendeändring
perf:     Performance-förbättring
test:     Test-tillägg eller -ändring
docs:     Dokumentation
chore:    Tooling, dependencies, CI
style:    Formatering, semicolons (ej kodbeteende)
build:    Build-konfig
revert:   Återgå tidigare commit
```

Scope används där det hjälper: `feat(deviations): add export action`.

### 11.2 PR-titlar

Samma format som commits. Squash-merge gör PR-titeln till commit-meddelande i `develop`.

### 11.3 Branch-namn

```
feature/<kort-beskrivning>
fix/<kort-beskrivning>
chore/<kort-beskrivning>
docs/<kort-beskrivning>
```

### 11.4 PR-mall

`.github/pull_request_template.md`:

```markdown
## Vad
<kort beskrivning>

## Varför
<motivering>

## Hur
<implementationsöversikt, eventuella avvägningar>

## Tester
- [ ] Unit
- [ ] Integration
- [ ] RLS (om policy-ändringar)
- [ ] E2E (om user flow-ändringar)
- [ ] Manuellt testat i staging

## Påverkan
- [ ] Migrationer ingår
- [ ] Breaking changes (beskriv)
- [ ] Påverkar feature flags
- [ ] Påverkar permissions

## Skärmdumpar / GIF
<om UI-ändringar>
```

---

## 12. Error handling & loggning

### 12.1 Server functions

Alla `createServerFn`-handlers returnerar standardiserat `ApiResult` (02-database-api §9). Aldrig throw från en handler — fånga i en wrapper:

```ts
// _helpers.ts
export function createApiHandler<T>(fn: () => Promise<T>) {
  return async (): Promise<ApiResult<T>> => {
    const requestId = crypto.randomUUID()
    try {
      const data = await fn()
      return { ok: true, data, request_id: requestId }
    } catch (err) {
      if (err instanceof ForbiddenError) {
        return { ok: false, error: err.message, error_code: "forbidden", request_id: requestId }
      }
      if (err instanceof ValidationError) {
        return { ok: false, error: err.message, error_code: "validation_failed",
                 field_errors: err.fieldErrors, request_id: requestId }
      }
      // Okänt fel — logga + Sentry, returnera generic till klient
      log("error", "Unhandled server error", { error: String(err), requestId })
      Sentry.captureException(err, { extra: { requestId } })
      return { ok: false, error: "Internal server error", error_code: "internal", request_id: requestId }
    }
  }
}
```

### 12.2 Klient

`ErrorBoundary` per route-fil (TanStack Router native `errorComponent`). Topbar visar persistent banner vid offline-läge.

Toast-fel via centraliserad `translateError(error_code)`:

```ts
const messages: Record<string, string> = {
  forbidden: "Du har inte behörighet att göra detta.",
  validation_failed: "Något i formuläret är fel — granska markerade fält.",
  version_conflict: "Någon annan har ändrat detta samtidigt. Ladda om sidan.",
  subscription_read_only: "Din prenumeration är inaktiv. Uppgradera för att fortsätta.",
  feature_disabled: "Den här funktionen ingår inte i din nuvarande plan.",
  internal: "Något gick fel. Vi har informerats. Försök igen om en stund.",
}
```

### 12.3 Aldrig

- Visa rå `error.message` från servern för slutanvändare
- Logga PHI (personnummer, customer-namn, läkemedelsbatch + identifierbar person)
- Sluka fel tyst — fel ska antingen returneras strukturerat eller loggas via Sentry

---

## 13. Backup & disaster recovery

### 13.1 Supabase backups

- **Daily backups** av hela DB (Supabase default, behålls 7 dagar i Free, 14 dagar i Pro)
- **Point-in-Time Recovery** på Pro+ — kan återställa till exakt sekund inom retention-fönstret
- **Manuell snapshot** före varje produktion-migration (Toni triggar via Supabase Dashboard)

### 13.2 Audit-log retention

Audit logs har 7 års retention (svensk bokföringspraxis + IVO). Implementeras via:
- Ingen rad raderas från `audit_logs` i normala drift
- Årlig export till "kall" storage (Supabase Storage bucket med Object Lock om tillgängligt, alternativt extern S3) via Edge Function `audit-log-archive`

### 13.3 Storage

- Alla filer i Supabase Storage replikeras enligt Supabase SLA
- Kritiska filer (signerade dokument, audit-paket): versionerade, kan inte hard-deleteras inom 90 dagar

### 13.4 RTO/RPO

| Scenario | RTO (recovery time) | RPO (data loss tolerance) |
|---|---|---|
| Worker outage (Cloudflare) | < 1 timme | 0 (statelös) |
| Supabase DB-restore from backup | < 4 timmar | < 24 timmar (eller PITR) |
| Cutover-fail från v4 → v6 | < 1 timme (DNS revert) | 0 (rollback-path testad) |
| Total infrastructure failure | < 24 timmar | < 24 timmar |

### 13.5 Runbooks

`docs/runbooks/`:
- `db-restore.md` — steg-för-steg återställning från Supabase backup
- `cutover-rollback.md` — hur DNS-revert görs på <5 min
- `stripe-webhook-recovery.md` — om webhook missade events, hur synkar vi mot Stripe
- `rls-incident-response.md` — om RLS-läcka upptäcks, hur hanteras

---

## 14. ADR-format & beslutsdokumentation

### 14.1 När skriva ADR

ADR (Architecture Decision Record) skrivs när:
- En arkitekturmässig riktning väljs som inte är trivial
- En spec i 01–06 avviks från
- En ny tredje-parts-integration läggs till
- En icke-trivial återgång (revert) görs

### 14.2 Format

`docs/decisions/NNNN-titel.md`:

```markdown
# ADR NNNN — Titel

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-XXXX

## Context
<vad är problemet, vilka alternativ finns>

## Decision
<vad valdes>

## Consequences
<positiva, negativa, neutrala konsekvenser>

## Date
2026-MM-DD

## Author
Toni Kazarian
```

### 14.3 Existerande ADR att skapa i Fas 0

- `0001-tanstack-start-vs-nextjs.md` — varför TanStack Start
- `0002-hybrid-server-fn-edge-functions.md` — gränsen mellan createServerFn och Edge Functions
- `0003-jwt-passthrough-rls.md` — varför inte service_role i createServerFn
- `0004-loaders-plus-tanstack-query.md` — SSR-mönstret
- `0005-tailwind-v4-shadcn.md` — Tailwind v4 + shadcn-kompatibilitet
- `0006-i18n-strategy.md` — sv-default, en-future

---

## 15. Release management

### 15.1 Versionering

- **Semantic versioning** på `CHANGELOG.md`: `MAJOR.MINOR.PATCH`
- v6.0.0 = Fas 5 acceptance (cutover-redo)
- v6.0.x = patches efter cutover
- v6.1.0 = Fas 6 levererad
- v6.2.0 = Fas 7 levererad
- ...

### 15.2 CHANGELOG

`CHANGELOG.md` i repo-roten. Format: [Keep a Changelog](https://keepachangelog.com/).

Sektioner per release: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.

### 15.3 Release notes till användare

För kunder skrivs separata release notes på `v6.carekompass.se/changelog` — kortare, mindre teknisk text. Genereras från PRs märkta `release-note`.

### 15.4 Feature flags som release-mekanism

Utöver subscription-flags (`module.*_enabled`) finns "ship-flags" för att rulla ut nya funktioner gradvis:

```sql
create table public.feature_rollouts (
  feature_key text primary key,
  rollout_percent int not null default 0,   -- 0-100
  allowlist_company_ids uuid[] default array[]::uuid[]
);
```

Helper `featureRolloutActive(featureKey, companyId)` returnerar boolean. Använd för:
- Nya UI:n som testas hos pilotkund först
- Risky refactors (kör gamla + nya implementering parallellt, jämför)

Stäng inte av gamla flags utan att radera koden — annars samlas teknisk skuld.

### 15.5 Cutover-checklista (v4 → v6)

Se 04-implementation-plan §14 — komplett checklista där.

---

## 16. Sammanfattande prioriteringsregler

När en konvention här krockar med snabb leverans:

1. **Säkerhet vinner.** RLS-tester, secrets, audit-logging är aldrig "vi tar det senare".
2. **Migrationsdisciplin vinner.** En migration som spar 30 min nu men korrumperar produktionsdata kostar dagar.
3. **Typsäkerhet vinner.** `as any` förbjudet — det är där buggar lägger sig.
4. **Tester vinner för permissions och RLS.** Andra tester kan ibland skippas under press; permissions-tester kan inte.
5. **Tempo vinner över "perfekt struktur".** Hellre välja en sane default i Fas 0 och refaktorera i Fas 5 än att paralys-analysera.

---

*Slut på 06-conventions. Tillsammans med 01–05 utgör detta CareKompass v6.0 kompletta överlämningsdokumentation.*
