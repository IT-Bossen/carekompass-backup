# ADR 0004 — Loader + TanStack Query hybrid SSR

## Status
Proposed

## Context
CareKompass v6 SSR:ar authed views med Supabase RLS. Tre alternativ utvärderades:
(a) loaders-only — TanStack Router-loader fetchar all data, klient läser via
`Route.useLoaderData()`, ingen klient-cache; (b) Query-only — client-side fetching
med TanStack Query, ingen SSR-data; (c) React Server Components (ej stödd i TanStack
Start v1). Loaders-only saknar realtime + optimistic updates + mutation-koordination;
Query-only förlorar SSR-fördelar (snabbare first paint, SEO, no FOUC). Spårning:
`docs/03 §3` + `docs/04 §2.2` AC5.

## Decision
<Toni fyller — vald: hybrid. Route-`loader` anropar `createServerFn` → komponent får
data via `Route.useLoaderData()` → TanStack Query tar över med samma `queryKey` +
`initialData` för mutations, optimistic updates och realtime-invalidering. Bevis-route
`/health` levereras i Fas 0 (`docs/specs/fas-0-bootstrap.md` Task 10).>

## Consequences
<Toni fyller.>

## Date
2026-05-28

## Author
Toni Kazarian
