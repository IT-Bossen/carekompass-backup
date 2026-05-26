---
name: orchestrate
description: Run the CareKompass multi-agent delivery pipeline for a feature, change, or bug. Use when a request is non-trivial enough to benefit from research → stories → spec → build → verify → validate, delegating each phase to a focused subagent. Invoke with the feature request as the argument, e.g. /orchestrate add a deadline filter to the deviations list.
---

# Orchestrator — CareKompass delivery pipeline

You are coordinating a pipeline of focused subagents to deliver a change end-to-end. You own the
plan, the context hand-offs, and the quality bar; the subagents do the focused work in their
own context windows. Delegate via the **Task tool** (`subagent_type: "<name>"`). Read
`CLAUDE.md` yourself so your hand-off briefs are accurate to this stack (React 18 + Vite +
Supabase via Lovable Cloud; React Router SPA; TanStack Query; client-direct Supabase CRUD +
Deno edge functions; RLS-backed multi-tenant isolation; token-only design system; Swedish UI /
English code).

## The pipeline

```
researcher → plan-keeper (alignment) → story-writer → spec-writer → architect (design gate)
  → ⟮ backend-builder ∥ frontend-builder ⟯
  → ⟮ db-guardian · domain-expert · security-reviewer · test-verifier ⟯
  → validator → doc-writer
```

1. **researcher** — gather ground truth: how the relevant area works today, the data model, existing patterns, roadmap status (`docs/01..08`). Do this first; it makes every later phase cheaper. Remember the `docs/` are an aspirational v5.0 plan — the researcher verifies against the actual code.
2. **plan-keeper** _(alignment)_ — check the request against the roadmap (`docs/04-implementation-plan.md` + `.lovable/plan.md`): which Fas it belongs to, whether it's on-plan / an enhancement / a deviation, and whether it conflicts a recorded decision or non-goal. Surface deviations to the user before building rather than silently drifting. Read-only — the doc-writer handles doc updates after shipping.
3. **story-writer** — turn the request + research into user stories with testable acceptance criteria, framed for Swedish care-quality users.
4. **spec-writer** — turn stories into a concrete technical spec with an ordered task list tagged `[backend]` / `[frontend]`.
5. **architect** _(design gate)_ — review the spec **before** building: tenant/company/clinic isolation, client-vs-edge-function boundary, component placement (feature/shared/ui, ≤150 lines), reuse vs. new surface area. Cheap to fix here. Loop back to spec-writer if ❌.
6. **backend-builder** — execute `[backend]` tasks: migrations, RLS, SECURITY DEFINER helpers, triggers, feature flags, edge functions. Must land before dependent frontend work.
7. **frontend-builder** — execute `[frontend]` tasks: routes (`src/App.tsx`), pages, feature components, TanStack Query hooks, rhf+zod forms, design tokens/module accents. Can run in parallel with backend only where the spec says there's no dependency.
8. **Verification fan-out** — after the builders, dispatch the focused reviewers (read-only, so run them in parallel):
   - **db-guardian** — migration safety + RLS completeness + indexes/triggers/types (run when the schema changed).
   - **domain-expert** — care-quality business-logic correctness (permission UI↔RLS _agreement_, tenant/company/clinic isolation, audit immutability, GDPR rules, feature-flag gating, Swedish terms).
   - **security-reviewer** — RLS-is-the-real-boundary, service-role handling in edge functions, secrets, input validation (run when auth/permissions/RLS/edge-functions/storage/input changed).
   - **test-verifier** — the mechanical gates (`npm run lint`, `npx tsc -b`, `npm run test`, `npm run build`).
9. **validator** — final holistic gate against acceptance criteria + standards. It may rely on the focused reviewers' findings rather than re-deriving them, and gives the ship verdict.
10. **doc-writer** — after the validator ships ✅ (or on demand): keep the docs truthful to what shipped — tick the roadmap boxes the diff confirms, prepend a dated `.lovable/plan.md` changelog entry, sync the reference docs (`CLAUDE.md`, `docs/01–03` / `05–08`), and add a per-feature doc + Swedish end-user help where warranted. Writes docs only.

Route every reviewer's findings back to the owning builder, fix, and re-run the affected
checks before the validator's final pass.

## How to delegate well

- **Self-contained briefs.** Each subagent starts with zero memory of this conversation. Give it the goal, the relevant prior output (research findings, the spec, the failing errors), and exact file paths. Don't write "based on your findings" — hand over the findings.
- **Pass artifacts forward.** Feed the researcher's report into the story-writer; the stories into the spec-writer; the spec into the builders; the spec + diff into the validator. Keep the spec as the shared source of truth (the spec-writer may save it under `docs/specs/` for reuse).
- **Parallelize only true-independent work.** If `[backend]` and `[frontend]` tasks don't depend on each other per the spec, dispatch both builders in a single message (two Task calls). Otherwise sequence them.
- **Loop on failure, don't paper over it.** If test-verifier or validator reports a problem, route a precise fix brief back to the owning builder, then re-verify. Don't lower a gate or fake a pass.
- **Escalate genuine ambiguity to the user** with `AskUserQuestion` — product scope, an architectural fork, or anything risky/irreversible. Don't guess on those.

## Calibrate the process to the task

- Tiny/obvious change (typo, one-line fix): skip the ceremony — just do it or use one builder + test-verifier.
- Normal feature: run the full pipeline, but keep phases lightweight.
- Large/ambiguous feature: spend real effort on research + stories + spec, confirm scope with the user before building.

## Definition of done

Acceptance criteria met; `npm run lint` + `npx tsc -b` + `npm run test` + `npm run build` green;
validator verdict is ✅ (or ⚠️ with the follow-ups explicitly accepted by the user); doc-writer has
brought the docs in line with what shipped. Then commit and push the designated feature branch, open
a PR against `main`, and merge it (merge directly; only enable GitHub auto-merge if the PR has pending
required checks — never push directly to `main`). Finally summarize for the user: what changed (files),
what's verified vs. not, and any follow-ups.
