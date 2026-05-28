# ADR 0002 — Hybrid server-fn + Edge Functions

## Status
Proposed

## Context
`createServerFn` (TanStack Start) täcker ~80 % av server-logiken för CareKompass v6:
CRUD, validering, workflows, audit-skrivningar, alla server-fn körs på Cloudflare
Workers-runtime med samma Bearer-token-passthrough mot Supabase (RLS-respekterande).
Men Workers-runtime kan inte köra Deno-bibliotek (t.ex. `pdf-lib` för `audit-export`),
och vissa endpoints måste fungera utan JWT (BankID-callback, `send-contact-email`,
pg_cron-triggrade jobb). Två primära alternativ utvärderades: (a) flytta allt till
Supabase Edge Functions (Deno), eller (b) lösa Deno-bara biblioteken med
Workers-kompatibla ersättare. Spårning: `docs/02 §8.1` + `docs/07 §5`.

## Decision
<Toni fyller — vald: hybrid. `createServerFn` är default; Supabase Edge Functions
används endast för: `audit-export` (pdf-lib), `bankid-callback` (extern POST utan JWT),
pg_cron-jobb, AI-anrop via Lovable AI Gateway, och `send-contact-email`. Stripe-webhook
levereras av Lovable Stripe-payments — vi bygger ingen egen.>

## Consequences
<Toni fyller.>

## Date
2026-05-28

## Author
Toni Kazarian
