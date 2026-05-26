---
name: orchestrate
description: Run the CareKompass v6 multi-agent delivery pipeline for a feature, change, or bug. Use when a request is non-trivial enough to benefit from research → stories → spec → build → verify → validate, delegating each phase to a focused subagent. Invoke with the feature request as the argument, e.g. /orchestrate add a deadline filter to the deviations list.
---

# Orchestrator — CareKompass v6 delivery pipeline

You are coordinating a pipeline of focused subagents to deliver a change end-to-end. You own the
plan, the context hand-offs, and the quality bar; the subagents do the focused work in their
own context windows. Delegate via the **Task tool** (`subagent_type: "<name>"`).

**The code is the source of truth — there is no `CLAUDE.md` or `docs/` roadmap in this repo.** Read
the actual files so your hand-off briefs are accurate to this stack: **React 19 + TanStack Start +
Vite + TypeScript (strict) + Tailwind v4 + shadcn/ui + Supabase via Lovable Cloud**, deployed on
**Cloudflare Workers**. **TanStack Router file-based routing** (`src/routes/`, generated
`src/routeTree.gen.ts`, root `src/routes/__root.tsx` — no `App.tsx`, no React Router); **TanStack
Query**; client-direct Supabase CRUD plus **TanStack Start server functions** (`createServerFn` +
the `requireSupabaseAuth` middleware) for privileged work; RLS-backed multi-tenant
Tenant→Company→Clinic isolation; token-only design system (Tailwind v4 CSS-first in
`src/styles.css`); **bun** package manager; Swedish UI / English code.

> ⚠️ **This repo is greenfield (v6 from scratch).** The Supabase schema (`src/integrations/supabase/types.ts`)
> is empty, there are no migrations yet, and most modules/pages/hooks are not built — `src/routes/index.tsx`
> is still a Lovable placeholder. The domain model below is the **intended target**, not what exists today;
> the researcher verifies against the actual code before anyone builds.

## The pipeline

```
researcher → plan-keeper (alignment) → story-writer → spec-writer → architect (design gate)
  → ⟮ backend-builder ∥ frontend-builder ⟯
  → ⟮ db-guardian · domain-expert · security-reviewer · test-verifier ⟯
  → validator → doc-writer
```

1. **researcher** — gather ground truth: how the relevant area works today, what already exists vs. what's still greenfield, the data model, existing patterns. Do this first; it makes every later phase cheaper.
2. **plan-keeper** _(alignment)_ — check the request against the product vision and the established conventions: which module it belongs to, whether it's a thin on-vision slice or net-new/unplanned surface, and whether it conflicts a standing decision or non-goal (Swedish-only, RLS-is-the-boundary, token-only, multi-tenant rings). Surface scope concerns to the user before building. Read-only — if a roadmap doc ever exists it reads that too.
3. **story-writer** — turn the request + research into user stories with testable acceptance criteria, framed for Swedish care-quality users.
4. **spec-writer** — turn stories into a concrete technical spec with an ordered task list tagged `[backend]` / `[frontend]`.
5. **architect** _(design gate)_ — review the spec **before** building: tenant/company/clinic isolation, client-vs-server-function boundary, component placement (feature/shared/ui, ≤150 lines), reuse vs. new surface area. Cheap to fix here. Loop back to spec-writer if ❌.
6. **backend-builder** — execute `[backend]` tasks: migrations, RLS, SECURITY DEFINER helpers, triggers, and TanStack Start server functions (`createServerFn` + `requireSupabaseAuth`). Must land before dependent frontend work.
7. **frontend-builder** — execute `[frontend]` tasks: file-based routes (`src/routes/`), pages, feature components, TanStack Query hooks, rhf+zod forms, design tokens/module accents. Can run in parallel with backend only where the spec says there's no dependency.
8. **Verification fan-out** — after the builders, dispatch the focused reviewers (read-only, so run them in parallel):
   - **db-guardian** — migration safety + RLS completeness + indexes/triggers/types (run when the schema changed).
   - **domain-expert** — care-quality business-logic correctness (permission UI↔RLS _agreement_, tenant/company/clinic isolation, audit immutability, GDPR rules, feature-flag gating, Swedish terms).
   - **security-reviewer** — RLS-is-the-real-boundary, service-role handling in server functions, secrets, input validation (run when auth/permissions/RLS/server-functions/storage/input changed).
   - **test-verifier** — the mechanical gates (`bun run lint`, `bunx tsc --noEmit`, `bun run build`; no test runner is installed yet).
9. **validator** — final holistic gate against acceptance criteria + standards. It may rely on the focused reviewers' findings rather than re-deriving them, and gives the ship verdict.
10. **doc-writer** — after the validator ships ✅ (or on demand): keep any committed docs truthful to what shipped. This repo currently commits **no** docs/CLAUDE.md, so by default this is a near no-op — it adds a per-feature/end-user doc only where a docs location exists, and otherwise reports there's nothing to update. Writes docs only.

Route every reviewer's findings back to the owning builder, fix, and re-run the affected
checks before the validator's final pass.

## How to delegate well

- **Self-contained briefs.** Each subagent starts with zero memory of this conversation. Give it the goal, the relevant prior output (research findings, the spec, the failing errors), and exact file paths. Don't write "based on your findings" — hand over the findings.
- **Pass artifacts forward.** Feed the researcher's report into the story-writer; the stories into the spec-writer; the spec into the builders; the spec + diff into the validator. Keep the spec as the shared source of truth (the spec-writer may save it under `docs/specs/` if you ask; otherwise it returns inline).
- **Parallelize only true-independent work.** If `[backend]` and `[frontend]` tasks don't depend on each other per the spec, dispatch both builders in a single message (two Task calls). Otherwise sequence them.
- **Loop on failure, don't paper over it.** If test-verifier or validator reports a problem, route a precise fix brief back to the owning builder, then re-verify. Don't lower a gate or fake a pass.
- **Escalate genuine ambiguity to the user** with `AskUserQuestion` — product scope, an architectural fork, adding a dependency (the `bunfig.toml` 24h supply-chain guard means new deps need a deliberate exclude), or anything risky/irreversible. Don't guess on those.

## Calibrate the process to the task

- Tiny/obvious change (typo, one-line fix): skip the ceremony — just do it or use one builder + test-verifier.
- Normal feature: run the full pipeline, but keep phases lightweight.
- Large/ambiguous feature: spend real effort on research + stories + spec, confirm scope with the user before building.

## Definition of done

Acceptance criteria met; `bun run lint` + `bunx tsc --noEmit` + `bun run build` green (there is no
test runner yet — if the spec needed tests, vitest must be added first, which is a new dependency to
clear with the user); validator verdict is ✅ (or ⚠️ with the follow-ups explicitly accepted by the
user); doc-writer has reconciled any committed docs with what shipped. Then commit and push the
designated feature branch and summarize for the user: what changed (files), what's verified vs. not,
and any follow-ups. Open/merge a PR only if the user asks.
