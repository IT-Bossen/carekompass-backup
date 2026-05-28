# Architecture Decision Records

Architecture Decision Records (ADR) för CareKompass v6. Formatet följer `docs/06 §14.2`
(Status / Context / Decision / Consequences / Date / Author).

Skapa nya ADR:er som `NNNN-titel.md` (zero-padded sekvens, kebab-case titel) per
`docs/06 §14.1`. Status börjar `Proposed` och flyttas till `Accepted` / `Rejected` /
`Superseded by NNNN` när beslut tas.

## Index

| Nr | Titel | Status | Datum |
|---|---|---|---|
| [0001](./0001-tanstack-start-vs-nextjs.md) | TanStack Start vs Next.js | Proposed | 2026-05-28 |
| [0002](./0002-hybrid-server-fn-edge-functions.md) | Hybrid server-fn + Edge Functions | Proposed | 2026-05-28 |
| [0003](./0003-jwt-passthrough-rls.md) | JWT-passthrough → RLS som single source of truth | Proposed | 2026-05-28 |
| [0004](./0004-loaders-plus-tanstack-query.md) | Loader + TanStack Query hybrid SSR | Proposed | 2026-05-28 |
| [0005](./0005-tailwind-v4-shadcn.md) | Tailwind v4 + shadcn (slate base, forest-teal override) | Accepted (Tailwind v4 + shadcn-arkitektur). Brand-färg forest-teal är Proposed pending Fas 5 (docs/09 §6b). | 2026-05-28 |
| [0006](./0006-i18n-strategy.md) | i18n-strategi (sv-default, en-future via `t()`) | Proposed | 2026-05-28 |
