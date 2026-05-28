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
  → ⟮ backend-builder ∥ frontend-builder ⟯
  → ⟮ db-guardian · domain-expert · security-reviewer · test-verifier ⟯
  → validator → doc-writer
```

1. **researcher** — ground truth: how the relevant area works today (or that it isn't built yet), data model, existing patterns. Reads `docs/01–08` AND the code. Always first.
2. **plan-keeper** _(alignment)_ — check the request against `docs/04` (phase + acceptance) + `docs/09` (open decisions) + standing principles (RLS-is-the-boundary, Swedish-only, token-only, CK-är-verktyg-§7.0, multi-tenant rings). Escalate real deviations to the user. Read-only.
3. **story-writer** — user stories + testable acceptance criteria framed for Swedish care-quality users (`docs/01`, `04`, `05`, `08`).
4. **spec-writer** — concrete technical spec with `[backend]`/`[frontend]` task list, grounded in `docs/02` (schema/RLS/API) + `03` (frontend) + `06` (conventions) + **`07` (overrides — wins on conflicts)**. May save under `docs/specs/<feature>.md`.
5. **architect** _(design gate)_ — vet the spec before building: tenant/company/clinic isolation, **client-vs-serverFn-vs-edge-function boundary** (`docs/02 §8` + `07 §5`), file-based route placement, component sizing (≤150 lines), reuse vs. new surface, justification for any new dependency (bun supply-chain guard). Loop back to spec-writer on ❌.
6. **backend-builder** — execute `[backend]` tasks: migrations (one per logical change, v4-consistent names per `07 §4`, RLS per `02 §2`, two-table audit per `07 §4.2`), SECURITY DEFINER helpers (`is_member_of_company` / `has_company_role` / `has_capability` / `is_assigned_to_clinic`), `createServerFn` handlers in `src/lib/<module>.functions.ts` with shared zod in `*.schemas.ts`, edge functions only for the narrow set in `07 §5`. Lands before dependent UI.
7. **frontend-builder** — execute `[frontend]` tasks: file-based routes (`src/routes/`), pages, feature components, TanStack Query hooks, **loader+Query SSR pattern** (`docs/03 §3`), rhf+zod forms (shared schema), token-only styling in `src/styles.css`, the three frontend gates (subscription + feature + permission) agreeing with RLS.
8. **Verification fan-out** — dispatch the focused reviewers in parallel:
   - **db-guardian** — migration safety + RLS completeness + indexes/triggers/types/prerequisites (`docs/02` + `07 §4` + `06 §4`). Run when schema changed.
   - **domain-expert** — care-quality correctness (permission UI↔RLS agreement, isolation integrity, **`quality_manager` requirement (`01 §7.0`)**, feature/plan gating, audit immutability, GDPR, Swedish terminology). Reads `05` + `07 §2` + `08`.
   - **security-reviewer** — RLS boundary, service-role only in server modules + `requireSupabaseAuth`, secrets (`06 §5` — note Lovable owns Stripe + AI secrets), input validation, impersonation/PII (`08 §11-12`). Run when auth/permissions/RLS/server-functions/storage/input changed.
   - **test-verifier** — mechanical gates: `bun run lint`, `bunx tsc --noEmit`, `bun run build`. **No test runner installed yet** — `06 §1` requires vitest + Playwright; adding them is a Fas 0/1 task (new deps, clear with user).
9. **validator** — final holistic gate vs. acceptance criteria + standards. May rely on the focused reviewers' findings; gives the ship verdict.
10. **doc-writer** — after ✅ (or on demand): **active maintainer** — tick the relevant `- [ ]`→`- [x]` in `docs/04`, write or update an ADR in `docs/decisions/NNNN-*.md` for non-trivial decisions, keep `CLAUDE.md` and `docs/01–08` truthful to what shipped. Writes docs only — never source or migrations.

Route each reviewer's findings back to the owning builder, fix, and re-run the affected checks
before the validator's pass.

## How to delegate well

- **Self-contained briefs.** Subagents start with zero memory of this conversation. Give the goal, the relevant prior output (research findings, the spec, exact failing errors), and exact file paths + doc pointers (`docs/07 §4.2`, not "the audit doc"). Never write "based on your findings" — hand over the findings.
- **Pass artifacts forward.** Feed researcher's report into story-writer; stories into spec-writer; the spec into the builders and the validator. Keep the spec as the shared source of truth.
- **Parallelize only true-independent work.** Dispatch backend + frontend builders together (one message, two Task calls) only when the spec confirms no dependency; otherwise sequence.
- **Loop on failure, don't paper over it.** Route precise fix briefs back to the owning builder, then re-verify. Don't lower a gate or fake a pass.
- **Escalate genuine ambiguity to the user** with `AskUserQuestion` — product scope, an architectural fork, a new dependency (bun supply-chain guard), or anything risky/irreversible.

## Calibrate the process

- Tiny/obvious change (typo, one-line fix) → skip ceremony — just do it or use one builder + test-verifier.
- Normal feature → full but lightweight pipeline.
- Large/ambiguous feature → invest in research + stories + spec; confirm scope with the user before building. For greenfield modules in Fas 1–6, also check `docs/04` for the verbatim phase prompt.

## Definition of done

Acceptance criteria met (per phase in `docs/04`, per area in `docs/08 §14`); `bun run lint` +
`bunx tsc --noEmit` + `bun run build` green; RLS-tester pass (once vitest is added); validator ✅
(or ⚠ with the follow-ups explicitly accepted by the user); doc-writer has updated `docs/04`
checkboxes + any ADRs + `CLAUDE.md`. Then commit and push the designated feature branch and
summarize: what changed (files), what's verified vs. not, follow-ups. Open/merge a PR only if
the user asks.
