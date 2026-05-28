# ADR 0003 — JWT-passthrough → RLS som single source of truth

## Status
Proposed

## Context
CareKompass v6 är multi-tenant (`tenant → company → clinic → moduldata`) med strikt
isolation. Två alternativ för server-fn-auth utvärderades: (a) `supabaseAdmin`
(service_role) i alla server-fn + manuell `tenant_id`/`company_id`-filtrering i
varje query, eller (b) vidarebefordra användarens Bearer-token från klient via
`attachSupabaseAuth` → `requireSupabaseAuth` skapar en RLS-respekterande
Supabase-klient där PostgreSQL själv håller säkerhetsgränsen via `auth.uid()` i
policies. Spårning: `docs/02 §2` + `docs/07 §2.5`.

## Decision
<Toni fyller — vald: JWT-passthrough → RLS. `supabaseAdmin` (service_role) tillåts
endast för cross-tenant maintenance (impersonation, pg_cron-jobb, schema-migrationer)
i server-only moduler (`*.server.ts`) och kräver manuell re-check av authorization.>

## Consequences
<Toni fyller.>

## Date
2026-05-28

## Author
Toni Kazarian
