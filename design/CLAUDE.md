# CareKompass v6 — projektkontext

Detta projekt innehåller **designartefakten** för CareKompass v6.0 — ett ledningssystem för svenska kliniker (estetisk injektion, fotvård, tatuering m.fl.) enligt SOSFS 2011:9, patientsäkerhetslagen och IVO-praxis.

## Vad finns här

1. **`../docs/01-09`** — produktteknik-dokumentation (system, databas, frontend, fasplan, domain content, conventions, v4-mappning, publika sidor & admin, öppna frågor). **Sanning för domän, scope, schema, RLS.**
2. **`../docs/10-design-spec.md`** (kopia även här i denna mapp för designartefaktens internal context) — design-spec. **Sanning för visuell ton, tokens, mönster, mobile-konventioner, mapping till shadcn.**
3. **`index.html`** + `components/` + `styles.css` — designartefakten som React-canvas med ~57 artboards (30 desktop + 27 mobile). Kör direkt i webbläsare; pan/zoom-canvas. **Detta är referensmaterial — produktionskoden bor i `../src/`.**

## Stack målbild (för implementation)

React 19 + TanStack Start v1 + TanStack Router (filbaserad) · Vite 7 · Tailwind v4 (CSS-driven, ingen `tailwind.config.js`) · shadcn/ui (slate base, override `--primary` till forest-teal) · Inter + Newsreader + JetBrains Mono · bun · Supabase (Lovable Cloud) · Cloudflare Workers. Se 01-system-spec §2 och 03-frontend-guide.

## Ton (icke-förhandlingsbar)

CareKompass är **ett verktyg, inte en granskare** (01 §7.0). Aldrig "vi godkänner / vi har bedömt / vår compliance-stämpel". Alltid "din kvalitetsansvariga / ni äger / ert ledningssystem". Compliance-score = internt hjälpmedel, inte myndighetsutlåtande.

## När du jobbar i detta projekt

- **Innan du designar något nytt:** läs 10-design-spec.md för tokens, mönster, mobile-konventioner.
- **Innan du bygger ny domänfunktion:** verifiera att den faktiskt finns i 01–09. Hitta INTE på moduler, roller, fält eller permissions.
- **När du adderar en ny skärm:** följ mappningen i 10-design-spec §10 — varje skärm har route-mål och docs-källa.
- **Tweaks-panelen** (✦ ikonen i preview-toolbar) byter primärfärg (Forest/Nordic/Clay/Slate) och dark mode. Allt rebound:ar via CSS-tokens.

## Estetisk default

Forest-teal (`oklch(0.42 0.06 175)`) som primär, warm off-whites (`oklch(0.985 0.005 80)`) som bas, JetBrains Mono för IDs och tider. Aldrig SaaS-gradienter i UI-kromen — bara på publika hero-ytor.
