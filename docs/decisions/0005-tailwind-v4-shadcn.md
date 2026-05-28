# ADR 0005 — Tailwind v4 + shadcn (slate base, forest-teal override)

## Status
Accepted (Tailwind v4 + shadcn-arkitektur). Brand-färg forest-teal är Proposed pending Fas 5 (docs/09 §6b).

## Context
shadcn/ui dokumenterar `tailwind.config.ts` (Tailwind v3-mönstret) med tokens via
`theme.extend.colors`. Tailwind v4 är CSS-first och stödjer inte `tailwind.config.ts`
som primär konfig. Alternativ: (a) downgrade till Tailwind v3 (men v4 har bättre
prestanda och cleaner DX), (b) fork shadcn-primitiver med v4-anpassningar, (c)
acceptera shadcn CLI med `@theme inline`-style i `src/styles.css`. För brand-färg
utvärderades shadcn slate, Nordic blue, Clay, och forest-teal (designerns rekommendation).
Spårning: `docs/03 §6` + `docs/10 §4` + `docs/09 §6b`.

## Decision
<Toni fyller — vald: Tailwind v4 + shadcn med tokens i `src/styles.css` via
`@theme inline`. shadcn slate som teknisk base; forest-teal `oklch(0.42 0.06 175)`
som tentativ default override pending Fas 5-konfirmering. Healthcare-tokens
(`--success`, `--warning`, `--info`) läggs till utöver shadcn-standard. Fonter:
Inter (sans), Newsreader (serif), JetBrains Mono (mono).>

## Consequences
<Toni fyller.>

## Date
2026-05-28

## Author
Toni Kazarian
