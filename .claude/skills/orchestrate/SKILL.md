---
name: orchestrate
description: Run the CareKompass v6 multi-agent delivery pipeline for a feature, change, or bug. Use when a request is non-trivial enough to benefit from research → stories → spec → build → verify → validate, delegating each phase to a focused subagent. Invoke with the feature request as the argument, e.g. /orchestrate add a deadline filter to the deviations list.
---

# Orchestrator — CareKompass v6 delivery pipeline

You are coordinating a pipeline of focused subagents to deliver a change end-to-end. You own the
plan, the context hand-offs, and the quality bar; the subagents do the focused work in their
own context windows. Delegate via the **Task tool** (`subagent_type: "<name>"`).

**Read `CLAUDE.md` yourself first** — it has the v6 stack, the multi-tenant + RLS model, the
critical override (`docs/07` wins over `01–06` on table names / audit / roles / helpers / AI /
Stripe), the design system, and the docs index. Your hand-off briefs must be accurate to it.

> ⚠️ **v6 is greenfield.** Schema (`src/integrations/supabase/types.ts`) is empty, no migrations
> exist yet, and most modules aren't built (`src/routes/index.tsx` is a Lovable placeholder).
> `docs/01–08` describe the **target**; the researcher verifies what actually exists before
> anyone builds. Phase status: **Fas 0** (Bootstrap) — see `docs/04 §2`.

## The pipeline

```
researcher → plan-keeper (alignment) → story-writer → spec-writer → architect (design gate)
  → ⟮ backend-builder ∥ edge-function-builder ∥ frontend-builder ⟯           (build)
  → ⟮ rls-test-author ∥ e2e-author ⟯                                          (test authoring)
  → ⟮ db-guardian · domain-expert · regulatory-reviewer · security-reviewer
      · a11y-reviewer · performance-reviewer · test-verifier ⟯               (verification fan-out)
  → validator → doc-writer
```

1. **researcher** — ground truth: how the relevant area works today (or that it isn't built yet), data model, existing patterns. Reads `docs/01–08` AND the code. Always first.
2. **plan-keeper** _(alignment)_ — check the request against `docs/04` (phase + acceptance) + `docs/09` (open decisions) + standing principles (RLS-is-the-boundary, Swedish-only, token-only, CK-är-verktyg-`§7.0`, multi-tenant rings). Escalate real deviations to the user. Read-only.
3. **story-writer** — user stories + testable acceptance criteria framed for Swedish care-quality users (`docs/01`, `04`, `05`, `08`).
4. **spec-writer** — concrete technical spec with `[backend]`/`[edge]`/`[frontend]` task list, grounded in `docs/02` (schema/RLS/API) + `03` (frontend) + `06` (conventions) + **`07` (overrides — wins on conflicts)**. May save under `docs/specs/<feature>.md`.
5. **architect** _(design gate)_ — vet the spec before building: tenant/company/clinic isolation, **client-vs-serverFn-vs-edge-function boundary** (`docs/02 §8` + `07 §5`), file-based route placement, component sizing (≤150 lines), reuse vs. new surface, justification for any new dependency (bun supply-chain guard). Loop back to spec-writer on ❌.
6. **Builders (parallel where the spec confirms independence):**
   - **backend-builder** — `[backend]` tasks: migrations (v4-consistent names per `07 §4`, RLS per `02 §2`, two-table audit per `07 §4.2`), helpers (`is_member_of_company` / `has_company_role` / `has_capability` / `is_assigned_to_clinic`), `createServerFn` handlers in `src/lib/<module>.functions.ts` + shared zod in `*.schemas.ts`.
   - **edge-function-builder** — `[edge]` tasks: Deno edge functions in `supabase/functions/` for the narrow set in `docs/07 §5` (PDF via pdf-lib, BankID callback, pg_cron jobs, AI via Lovable AI Gateway, public no-JWT endpoints). **No own Stripe webhook — Lovable owns it.**
   - **frontend-builder** — `[frontend]` tasks: file-based routes (`src/routes/`), pages, feature components, hooks, **loader+Query SSR pattern** (`docs/03 §3`), rhf+zod forms (shared schema), token-only styling, three frontend gates agreeing with RLS.
7. **Test authoring (after relevant builders ship):**
   - **rls-test-author** — `tests/rls/<area>.test.ts` per `docs/06 §1.3`/`§1.5`. **100% RLS-policy coverage**. Run after any backend-builder migration that adds or changes RLS.
   - **e2e-author** — `tests/e2e/<flow>.spec.ts` per `docs/06 §1.4`/`§1.5`. Run when a critical user flow is feature-complete.
8. **Verification fan-out** — read-only reviewers, run in parallel **only the ones the change actually needs** (see triggers below):
   - **db-guardian** — migration safety + RLS completeness + indexes/triggers/types/prerequisites.
   - **domain-expert** — care-quality correctness (permission UI↔RLS agreement, isolation, **`quality_manager`-kravet**, feature/plan gating, audit immutability, GDPR, Swedish terms, ansvarsgräns).
   - **regulatory-reviewer** — paragraph-level Swedish-regulation depth (HSLF-FS 2017:37, SOSFS 2011:9, PDL, lag 2021:363, miljöbalken, SSMFS 2020:9).
   - **security-reviewer** — RLS boundary, service-role only in server modules + `requireSupabaseAuth`, secrets (Lovable owns Stripe + AI), input validation, impersonation/PII.
   - **a11y-reviewer** — WCAG 2.1 AA depth (keyboard, screen reader, contrast, focus, semantic HTML, status-not-only-color, 44px targets).
   - **performance-reviewer** — `docs/06 §7` budgets (TTFB, FCP, LCP, INP, CLS, bundle sizes, serverFn p95).
   - **test-verifier** — `bun run lint`, `bunx tsc --noEmit`, `bun run build` (and `bun test` once vitest is installed).
9. **validator** — final holistic gate vs. acceptance criteria + standards. May rely on the focused reviewers' findings rather than re-deriving; gives the ship verdict.
10. **doc-writer** — after ✅ (or on demand): **active maintainer** — tick `- [ ]`→`- [x]` in `docs/04`, write ADRs in `docs/decisions/NNNN-*.md` for non-trivial decisions, sync `CLAUDE.md` + relevant `docs/01–08` sections with what shipped, move resolved questions in `docs/09` to the beslutslogg. Writes docs only — never source, migrations, or generated files.

Route each reviewer's findings back to the owning builder, fix, and re-run the affected checks
before the validator's pass.

## When to dispatch which agent (triggers)

Don't run all reviewers every time. Pick based on what the change actually touches:

| Change type | Builders triggered | Test authors | Reviewers triggered |
|---|---|---|---|
| **Schema change (migration / RLS)** | backend-builder | **rls-test-author** | db-guardian, domain-expert, security-reviewer, test-verifier |
| **Server function (createServerFn)** | backend-builder | (rls-test-author if RLS policy added too) | domain-expert, security-reviewer, test-verifier |
| **Edge function (Deno)** | edge-function-builder | – | security-reviewer (signature / authz / secrets), test-verifier |
| **UI change (routes/pages/components)** | frontend-builder | (e2e-author when flow complete) | **a11y-reviewer**, domain-expert (if it surfaces business rules), test-verifier |
| **Regulated module** (läkemedel, ordination, hygien, risk, audit-export, customer_records) | per spec | per spec | + **regulatory-reviewer** (paragraph-level lag/föreskrift) |
| **Public marketing pages** (`docs/08`) | frontend-builder | e2e-author | **a11y-reviewer**, **performance-reviewer** (SEO + bundle), test-verifier |
| **Cookie consent / GA4 / Sentry** | frontend-builder + backend-builder | – | security-reviewer (PII/consent), domain-expert (GDPR), test-verifier |
| **Impersonation / PII flows** | backend-builder + frontend-builder | rls-test-author | **security-reviewer** (`docs/08 §11-12`), domain-expert (ansvarsgräns), test-verifier |
| **Pre-release / cutover** | – | rls-test-author, e2e-author | **performance-reviewer**, security-reviewer, a11y-reviewer, regulatory-reviewer, validator |
| **Tiny obvious fix** | one builder | – | test-verifier only |

`domain-expert` is the catch-all care-quality gate — dispatch it whenever a change has business
semantics, not just on schema changes. `test-verifier` runs on every non-trivial change.

## How to delegate well

- **Self-contained briefs.** Subagents start with zero memory of this conversation. Give the goal, the relevant prior output (research findings, the spec, exact failing errors), and exact file paths + doc pointers (`docs/07 §4.2`, not "the audit doc"). Never write "based on your findings" — hand over the findings.
- **Pass artifacts forward.** Feed researcher's report into story-writer; stories into spec-writer; the spec into the builders, the test authors, and the validator. Keep the spec as the shared source of truth.
- **Parallelize only true-independent work.** Dispatch independent builders (backend-builder ∥ edge-function-builder ∥ frontend-builder) together when the spec says no dependency; otherwise sequence. The verification fan-out is read-only so always parallel-safe — but only dispatch the reviewers the change needs (see triggers above).
- **Loop on failure, don't paper over it.** Route precise fix briefs back to the owning builder, then re-verify. Don't lower a gate or fake a pass. **rls-test-author finding a gap in RLS is blocking** — it goes back to backend-builder.
- **Escalate genuine ambiguity to the user** with `AskUserQuestion` — product scope, an architectural fork, a new dependency (bun supply-chain guard), or anything risky/irreversible.

## Calibrate the process

- Tiny/obvious change (typo, one-line fix) → skip ceremony — just do it or use one builder + test-verifier.
- Normal feature → full but lightweight pipeline; pick reviewers per the triggers table.
- Large/ambiguous feature → invest in research + stories + spec; confirm scope with the user before building. For greenfield modules in Fas 1–6, check `docs/04` for the verbatim phase prompt.
- Pre-release → run the full reviewer fan-out (incl. performance-reviewer + e2e-author + regulatory-reviewer) regardless of which files changed; this is the moment to catch what per-change reviews missed.

## Definition of done

Acceptance criteria met (per phase in `docs/04`, per area in `docs/08 §14`); `bun run lint` +
`bunx tsc --noEmit` + `bun run build` green; RLS tests pass (once vitest is added — `docs/06 §1.3`);
E2E flows pass (once Playwright is added — `06 §1.4`); validator verdict is ✅ (or ⚠ with the
follow-ups explicitly accepted by the user); doc-writer has updated `docs/04` checkboxes + any
ADRs + `CLAUDE.md`. Then commit and push the designated feature branch and summarize: what
changed (files), what's verified vs. not, follow-ups. Open/merge a PR only if the user asks.
