# ADR 0006 — i18n-strategi (sv-default, en-future via `t()`)

## Status
Proposed

## Context
CareKompass v6 är primärt en svensk SaaS för svenska vårdgivare; lagstiftning (IVO,
Socialstyrelsen, Lex Maria, PDL) refererar svenska termer. Engelska kan bli aktuellt
för internationella expansioner i framtiden. Tre alternativ utvärderades: (a)
hårdkoda svenska strängar i komponenter (snabbast nu, dyrt att retrofitta), (b)
installera `react-i18next` direkt i Fas 0 (overhead när bara `sv` används), (c)
egen lättviktig `t("key")`-funktion som etableras i Fas 1 och alla nya strängar
går genom från dag 1 (retrofitting är mångdubbelt dyrare). Spårning: `docs/06 §9`.

## Decision
<Toni fyller — vald: alla UI-strängar går genom en `t("key")`-funktion etablerad
i Fas 1 (när första modul har dynamisk copy). Translation files i `src/i18n/sv.ts`
(+ `en.ts` när behov uppstår). Datum via `date-fns` + `sv`-locale; belopp via
`Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" })`. I Fas 0 kan
hårdkodade strängar markeras med `// TODO i18n` för spårning.>

## Consequences
<Toni fyller.>

## Date
2026-05-28

## Author
Toni Kazarian
