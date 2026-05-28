# CareKompass v6 — agent guide (CLAUDE.md)

CareKompass v6 is a Swedish SaaS for **quality management & patient safety** in care
businesses (estetiska/injektions­kliniker, hälso- & sjukvård, tandvård, tatueringsstudios).
Modules: Avvikelser, Styrdokument/Policydokument, Riskhantering, Kundregister, Hygien,
Ordination & Delegation, Läkemedel, Compliance, Notifieringar, Rapporter, Personal &
legitimation. Regulatory backdrop: IVO, Socialstyrelsen, Lex Maria, GDPR, PDL, immutable
audit (7 års retention).

> **UI copy is Swedish; code identifiers are English.** Non-negotiable.

> **CareKompass is a *tool*, never a grader.** The customer (vårdgivare) bears the legal
> quality-of-care responsibility, not CK. Every bolag must have ≥1 `quality_manager`
> before onboarding completes. UI copy never says "CK godkänner". See `docs/01 §7.0`.

## ⚠️ Read this before relying on anything else

- **`docs/07-v4-mapping-and-overrides.md` is the override layer.** Where 01–06 conflict with 07, **07 wins.** Specifically:
  - **Table names (v4-consistent):** `company_users` + `clinic_assignments` (not `memberships`); `policy_documents` + `policy_document_versions` + `policy_document_signatures` + `policy_categories` (not `documents`); `medication_items` + `medication_batches` + `medication_logs` + `medication_temperature_logs` (not `medications`/`medication_usages`); `checklist_templates` + `checklist_categories` + `checklists` + `checklist_items` + `checklist_responses` + `recurring_checklists` (not `hygiene_*`); `subscription_plans` + `plan_features` + `company_modules` (not `plans`/`plan_feature_defaults`/`company_features`).
  - **Audit (two tables):** `audit_logs` (platform-wide) + `module_audit_logs` (per-module entity history) + `delegation_audits` (dedicated). All append-only.
  - **Role model:** hierarchical roles (company-level `owner | manager | quality_manager | member` + clinic-level `clinic_manager | staff | auditor`) + capability flags (`is_licensed_practitioner | is_medication_custodian | is_hygiene_lead | is_consulting_practitioner`) + extensible `staff_subroles` per industry. **Not** 13 separate roles.
  - **Helpers (SECURITY DEFINER):** `is_member_of_company(_user_id, _company_id)`, `is_assigned_to_clinic(_user_id, _clinic_id)`, `has_company_role(_user_id, _company_id, _role)`, `has_capability(_user_id, _company_id, _capability)`. (Supersedes `current_company_ids`/`has_role`/`has_permission` in `02 §2`.)
  - **AI** via **Lovable AI Gateway** (Gemini `flash-preview` + `2.5-pro`) — no own `AI_API_KEY` secret.
  - **Payments** via **Lovable Stripe-payments** (`enable_stripe_payments`) — no own Stripe webhook, no own `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET`.
  - **Onboarding** default = **auto-trial** (Läge B, 14 days, all Pro modules on); manual approval (Läge A) is a feature-flag spärr.
- **v6 is in Fas 1 (greenfield).** Fas 0 scaffolding is complete — `src/integrations/supabase/types.ts` exists (empty schema), `src/lib/_helpers.ts` establishes `ApiResult`/`createApiHandler`, `/health` proves the SSR+createServerFn+Query pattern. `supabase/migrations/` doesn't exist yet, most modules/pages/hooks aren't built, and `src/routes/index.tsx` is still a Lovable placeholder. The docs describe the **target**; **verify against the actual code** before relying on anything.
- **Open product questions live in `docs/09-oppna-fragor-och-beslut.md`** — 20/26 answered, 6 open (all 🟢 innehåll & affär, defaultable, block no phase).

## Stack & commands

- **React 19 + TanStack Start v1 + Vite 7 + TypeScript (strict)** + **Tailwind v4** (CSS-first via `@theme inline` in `src/styles.css` — **no `tailwind.config.ts`**) + **shadcn/ui** (style "new-york", base color **slate**, font **Inter**) + **Supabase (Lovable Cloud)**, deployed on **Cloudflare Workers** (`wrangler.jsonc` points at `src/server.ts`).
- **Routing:** **TanStack Router file-based** in `src/routes/`. Root: `src/routes/__root.tsx`; router config: `src/router.tsx`. Generated `src/routeTree.gen.ts` — **never hand-edit**. **No `src/App.tsx`, no React Router.**
- **Data:** **TanStack Query**. **Standard SSR pattern (etableras i Fas 0):** route loader calls a `createServerFn` → component receives `initialData` via `Route.useLoaderData()` → TanStack Query takes over (mutations, optimistic updates, realtime invalidation). See `docs/03 §3`.
- **Forms:** **react-hook-form + zod** via shadcn `<Form>`. **The same zod schema is shared between the client form and the server function** — single source of truth, in `src/lib/<module>.schemas.ts`.
- **Package manager:** **bun**. `bunfig.toml` enforces a **24h supply-chain guard** on new packages (`minimumReleaseAge = 86400`) — adding a dep is a deliberate choice that needs the user's OK.
- **Path alias:** `@/*` → `src/*`.

```bash
bun install            # node_modules not committed; respects the 24h supply-chain guard
bun run dev            # vite dev
bun run lint           # eslint . (flat config; lenient — no-unused-vars off)
bunx tsc --noEmit      # full TypeScript typecheck — tsconfig is STRICT, noEmit; NO `tsc -b` (project isn't composite); NO typecheck script yet
bun run build          # vite build for Cloudflare (esbuild does NOT typecheck — that's why tsc runs above)
bun run format         # prettier --write .
```

**No test runner is installed yet.** `docs/06 §1` requires **vitest** (unit + integration + RLS) + **Playwright** (E2E); adding them is a Fas 0/1 task (new deps — clear with the user per the supply-chain guard). Until then test-verifier runs lint + typecheck + build.

## Architecture — where logic lives (`docs/01 §2`, `02 §8`)

**Browser (SSR'd TanStack Start) → `createServerFn` on Cloudflare Workers → Supabase Postgres (RLS).**

**Two primary server paths + a narrow third:**

1. **Client-direct Supabase CRUD** for simple authenticated reads — `supabase.from(...)` from a TanStack Query hook. RLS gates everything.
2. **TanStack Start server functions** (`createServerFn` in `src/lib/<module>.functions.ts`) — **the common path** for CRUD, workflows, validation, privileged writes. Always guarded by `requireSupabaseAuth` middleware (`@/integrations/supabase/auth-middleware`), which validates the caller JWT and provides an **RLS-respecting** `supabase` client + `userId` / `tenantId` / `profileId` / `requestId`. Service-role `supabaseAdmin` (`@/integrations/supabase/client.server`) is allowed for cross-tenant/admin work but must re-check authorization manually and only live in server-only modules (`*.server.ts`).
3. **Supabase Deno edge functions** for the narrow set that needs Deno or external POST:
   - `audit-export` (PDF via `pdf-lib` needs Deno)
   - `bankid-callback` (external POST without JWT)
   - pg_cron jobs: `compliance-recalc`, `delegation-expiry-check`, `medication-expiry-check`, `hygiene-schedule-tick`, `audit-log-archive`, `secret-expiry-check`, `subscription-seat-sync`, `checklist-renewal`
   - AI calls (`categorize-checkpoints`, `analyze-hygiene-priorities`) — via **Lovable AI Gateway**, no own key
   - Public no-JWT endpoints (`send-contact-email`)
   - **Stripe webhook is handled by Lovable Stripe-payments — we don't build one.**

See `docs/07 §5` for the full v4→v6 edge-function mapping.

**Standardized API response (always):**
```ts
type ApiResult<T> =
  | { ok: true;  data: T; request_id: string; meta?: Record<string, JsonValue> }
  | { ok: false; error: string; error_code?: string; request_id: string; field_errors?: Record<string, string> }
```
`meta` uses `JsonValue` (not `unknown`) — TanStack Start validates server-fn return values are JSON-serializable at compile time. `JsonValue` is defined in `src/lib/_helpers.ts:17`. `error_code` is machine-readable (`version_conflict`, `forbidden`, `feature_disabled`, `subscription_read_only`, `validation_failed`, `internal`); the client maps it to a Swedish toast via `translateError()` (`docs/06 §12`). Server-fn handlers never throw to the client — wrap in `createApiHandler`.

## Multi-tenant + auth + RLS

- **Hierarchy:** `tenant → company (bolag) → clinic (klinik) → module data`. Customers are company-scoped (shared across the bolag's clinics); cross-bolag sharing only via opt-in `tenants.shared_customers`.
- **Roles (`docs/07 §2` — overrides `05 §1`):** Company-level role in `company_users.role` (`owner | manager | quality_manager | member`) + clinic-level role in `clinic_assignments.role` (`clinic_manager | staff | auditor`) + per-user capability flags in `user_capabilities` + branch-specific subroles in `staff_subroles`. A user has **one** company role per company + **0..N** clinic roles. Owner/Manager have implicit full-clinic access. **Consulting practitioners** are a capability flag (`is_consulting_practitioner`) on top of `is_licensed_practitioner`, scoped via `consulting_assignments`; they do **not** count toward seat-billing.
- **`quality_manager` is required:** Every bolag must have ≥1 before onboarding completes (`01 §7.0`). Egenkontroll får aldrig vara herrelös. This person — not CK — does the internal quality grading.
- **Helpers (`docs/07 §2.5`):** `is_member_of_company`, `is_assigned_to_clinic`, `has_company_role`, `has_capability`. SECURITY DEFINER + STABLE + `SET search_path = public`. Capabilities are **decision** checks (in server functions), not access checks (RLS uses the membership/role helpers).
- **RLS is the only real security boundary.** Frontend `usePermissions()`, feature flags and route guards are UX only. Every gated read/write needs a matching policy. Per-operation policies: `<table>_<select|insert|update|delete>_<scope>`, `TO authenticated`. Mutation policies use the `company_users` role check; immutable/log tables get deny policies (`USING (false)`). See `docs/02 §2`.
- **Three frontend gates that must all agree with backend** (`docs/03 §4`):
  1. `useSubscriptionStatus().writable` — `trialing` | `active` ⇒ writable; `past_due` | `canceled` ⇒ read-only.
  2. `useFeatureFlags().isEnabled("module.<x>_enabled")` — `company_modules` row.
  3. `usePermissions(module).canCreate/canUpdate/canApprove/canDelete` — role + capability.
  Backend mirrors via `requireSupabaseAuth` + `requirePermission` (or `has_capability`) + `requireWritableSubscription` + RLS.

## Data model — key conventions (`docs/02 §1`, `07 §4`)

- Every domain table has `id`, `tenant_id`, `company_id`, `clinic_id?` (null = bolagsnivå), `created_at` + `created_by`, `updated_at` + `updated_by`, `deleted_at` (**soft delete** — DELETE is blocked, hard delete only via maintenance jobs), `version` (**optimistic locking** — bumped by trigger; UPDATE checks current version → 0 rows = `version_conflict` returned to client).
- Standard `update_updated_at_column()` trigger on every table. FK columns indexed. Isolation column (`tenant_id`/`company_id`/`clinic_id`) indexed.
- **Audit (two tables — `docs/07 §4.2`):** `audit_logs` for platform-wide (auth, company lifecycle, impersonation, role grants) + `module_audit_logs` for per-module entity history (`module`, `action`, `entity_id`, `before`, `after`) + dedicated `delegation_audits`. **All append-only (no UPDATE/DELETE policies). 7-year retention. Never join in realtime queries — they have their own paginated views.** Action naming: `<module>.<action>` (e.g. `deviation.created`, `medication.attested`, `impersonation.start`).
- **Enums are minimal.** Statuses/severities/categories are plain `text` (+ optional `CHECK`).
- **Generated, do NOT hand-edit:** `src/integrations/supabase/types.ts`, `client.ts`, `client.server.ts`, `auth-middleware.ts`, `auth-attacher.ts`, and `src/routeTree.gen.ts`. Schema change → regenerate types: `bunx supabase gen types typescript > src/integrations/supabase/types.ts`.
- **Migrations (`docs/02 §12` + `06 §4`):** `supabase/migrations/<YYYYMMDDHHMMSS>_<snake_case>.sql`. **One per logical change**, new files only, additive/forward-only, idempotent where possible. RLS for a table ships in the same migration as the table. Seeds in `seed_*.sql`. Destructive changes (DROP COLUMN/TABLE, type change, enum-value removal, policy removal without replacement) require ADR + 24h cooling.

## Design system (`docs/03 §6` + `docs/10`)

- **Full design spec is `docs/10-design-spec.md`** — visual tone, token system (with the v4-style `--ck-*` names + shadcn token mapping in `§6`), typography scale, component patterns, desktop + mobile layout conventions, screen → code-target traceability (`§10`), and the 9 open design decisions Toni still owns (`§14`).
- **Design artifact lives in `design/`** at the repo root — a single-file React canvas with ~57 artboards (30 desktop + 27 mobile), the `styles.css` token source, a design-system showcase (`components/ds.jsx`), and 19 page/module components. **It's reference material — not production code.** Translate it per `docs/10 §6` (token rename + shadcn primitives + ≤150-line component split).
- **Tokens only** in `src/styles.css` (Tailwind v4 `@theme inline` + `:root` / `.dark`). Tokens are oklch CSS custom properties.
- **Brand color (current best):** **forest-teal `oklch(0.42 0.06 175)`** — the designer's recommendation in `docs/10 §4` + `§14`, kept as tentative default pending Fas 5 confirmation (`docs/09 §6b`). The Tweak-panel in `design/index.html` swaps it live among Forest/Nordic/Clay/Slate. The original `docs/09 §6` decision (shadcn slate placeholder) is superseded by this tentative choice.
- **Typography:** Inter (UI / body) + Newsreader serif (display / hero / page headers) + JetBrains Mono (IDs, batch numbers, timestamps, request_id). Per `docs/10 §3`.
- Healthcare statuses: `success` / `warning` / `destructive` / `info` (+ per-severity tokens for `critical`/`high`/`medium`/`low`). No literal `#hex`/`rgb`/`oklch` in components, no `text-white`/`bg-gray-*`. Token-based opacity is allowed.
- Compose with `cn()` from `@/lib/utils`. **Mobile-first**, 44px tap targets (48–56px for primary on mobile), **dark mode**, **WCAG 2.1 AA** (status = icon + text + color, never color alone).
- shadcn primitives in `src/components/ui/` — add via `bunx shadcn@latest add <name>`, don't hand-author. Map design-classes per `docs/10 §6` (`ck-btn` → `Button`, `ck-card` → `Card`, etc.).

## Conventions you must follow (`docs/06`)

- **TS strict.** No `as any` (regenerate types instead). No `// @ts-ignore` — use `// @ts-expect-error` with a reason. Functions > 50 lines / files > 400 lines trigger lint warnings — break up.
- **Naming:** Components `PascalCase`. Hooks `useCamelCase`. Server functions `camelCase`. Files: `kebab-case.ts` for utility, `PascalCase.tsx` for components, `<module>.functions.ts` for server functions, `<module>.schemas.ts` for shared zod. Types `PascalCase` (no `I`-prefix).
- **Observability (`docs/06 §2`):** Sentry (PII-stripped in `beforeSend`), BetterStack uptime, GA4 **consent-gated** (Consent Mode v2; IP-anonymized; only on public routes — never in `/_app/*` or `/_admin/*`). All three in **Fas 1**. Cookie consent has 3 levels (necessary / functional+analytics / marketing), stored in localStorage + `cookie_consents` (append-only).
- **Security (`docs/06 §5`):** HSTS, CSP (no `'unsafe-inline'` after Fas 5 — nonce-based), `X-Content-Type-Options`, `X-Frame-Options: DENY`. `SUPABASE_SERVICE_ROLE_KEY` is **server-only** — never in client, never `VITE_*`-prefixed. Lovable handles Stripe + AI secrets — **no own** `STRIPE_*` or `AI_API_KEY`. Never log PII (personnummer, email, customer name, batch+person, IP-with-PII).
- **Error handling (`docs/06 §12`):** Server functions return `ApiResult` via `createApiHandler` wrapper; never throw to the client. Client `ErrorBoundary` per route; topbar offline banner; toast via `translateError(error_code)`.
- **i18n (`docs/06 §9`):** sv-default, en-future. **All UI text goes through `t("key")` even though only `sv` exists today** — retrofitting is mångdubbelt dyrare. Datum via `date-fns` + `sv` locale; belopp via `Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" })`.
- **Git (`docs/06 §11`):** Conventional Commits (`feat:`, `fix:`, `refactor:`, `perf:`, `test:`, `docs:`, `chore:` …). Branches: `feature/<name>`, `fix/<name>`, `chore/<name>`. PR mall in `.github/pull_request_template.md`. Squash-merge.
- **ADR (`docs/06 §14`):** architectural decisions go in `docs/decisions/NNNN-titel.md`. First six are listed in `06 §14.3`.

## Phase status

**Fas 0 levererad** (commit `36cc07e`, 2026-05-28 — validator ✅ Ship with follow-ups, alla AC1–AC6 met). v6 går in i **Fas 1** (multi-tenant + RBAC + onboarding). See `docs/04 §2` for the Fas 0 acceptance and `docs/09 §24` for the delivery record and 8 Fas 1 follow-ups. Order: ~~Fas 0~~ → **Fas 1** (multi-tenant + RBAC + onboarding) → 2 (documents + deviations) → 3 (medications + orders/delegations) → 4 (hygiene + risk) → 5 (compliance + admin tools) → 6 (staff & legitimation) → 7 (Stripe activation) → 8 (treatment log, PDL-gated) → 9 (rentals/external) → 10 (BankID + BokaDirekt).

## Docs index

| Doc | What's in it |
|---|---|
| `docs/01-system-spec.md` | Vision, stack, multi-tenant hierarchy, modules, billing/seats, branscher, **ansvarsgräns (§7.0)**, RLS overview, PDL, audit, BankID, integrations. |
| `docs/02-database-api.md` | Schema patterns, table conventions, **helpers (overridden by 07)**, RLS pattern + tests, bas-schema, feature flags, industry templates, module tables, audit, **createServerFn pattern + `_helpers.ts`**, ApiResult shape, edge-function catalog, pg_cron, migrations discipline. |
| `docs/03-frontend-guide.md` | File structure, file-based routing, **SSR pattern (loaders + Query)**, auth/guards, **5 hooks**, Tailwind v4 + design system, shadcn setup, component taxonomy, **rhf+zod forms**, realtime, error/loading/empty states, onboarding, command palette, inspector mode. |
| `docs/04-implementation-plan.md` | Fas 0–10 with acceptance + verbatim prompts, **compliance-score algorithm (§13)**, cutover checklist v4→v6 (§14), 12 questions that blocked Fas 0 (now resolved in 09). |
| `docs/05-domain-content.md` | Roll × permission matris (**overridden by 07 §2** — permissions self gäller), **permission catalog (62)**, terminology keys, **3 filled industry templates**, default document templates per industry, hygiene checklist templates, deviation/risk categories, severity SLA, **34 notification types**, compliance-score weights. |
| `docs/06-conventions.md` | Test strategy (vitest unit/integration/RLS + Playwright), observability, CI/CD, migrations pipeline, security (CSP, headers, secrets), rate limit, performance budgets, a11y, i18n, code style + naming, git, error handling, backup/DR, ADR format, release management. |
| `docs/07-v4-mapping-and-overrides.md` | **THE OVERRIDE LAYER.** Hierarkisk rollmodell, seat-prismodell, **v4-konsistenta tabellnamn**, **two-table audit**, edge-function v4→v6 mapping, Lovable AI/Stripe/Email, hooks mapping, module template pattern, feature parity per module, migration strategy. |
| `docs/08-public-and-admin.md` | Public marketing pages, **modulvisningar**, legal (terms/privacy/cookies/DPA), cookie consent + GA4 consent-mode, resurser/support, SEO, PWA, **CK-admin (10 flikar)**, onboarding flow (auto-trial default), **impersonation**, **PII masking**, news/status/support tickets. |
| `docs/09-oppna-fragor-och-beslut.md` | **20/26 answered (decision log)** + 6 open 🟢-questions (pricing, sakkunnig granskning, legal, branscher beyond 3, news, compliance weights — all defaultable, block no phase). |
| `docs/10-design-spec.md` | **Visual sanning + översättningskontrakt till kod.** Design filosofi, tokens, typografi (Inter + Newsreader + JetBrains Mono), färg (forest-teal primär), komponentmönster, **shadcn-översättningstabell (§6)**, desktop + mobile-konventioner, **skärm → kod-mål traceability (§10)**, mock-data-gränsdragning (§12), och **9 öppna designbeslut Toni äger (§14)** — forest-teal, serif display, logo, terminologi, bottom-bar layout, m.fl. |

## Reference material

- **`design/`** — design-artefakten som React-canvas (`index.html` + `components/` + `styles.css` + en `tweaks-panel.jsx` som byter brand-färg live). Referensmaterial, inte produktionskod. Översättning till produktion per `docs/10 §6`.

## Definition of done

Acceptance criteria met (per phase in `docs/04`, per area in `docs/08 §14`); `bun run lint` + `bunx tsc --noEmit` + `bun run build` green; RLS-tester pass (once vitest is added — `docs/06 §1.3`); validator verdict ✅ (or ⚠ with explicit follow-ups the user accepted); doc-writer has reconciled `docs/04` checkboxes + any ADRs + this CLAUDE.md with what shipped. Then commit + push the designated feature branch. Open or merge a PR only if the user asks; never push directly to `main`.
