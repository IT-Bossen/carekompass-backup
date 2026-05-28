# CareKompass v6.0 — Öppna frågor & beslut

> **Datum för senaste uppdatering:** 2026-05-27
> **Serie:** 01-system-spec · 02-database-api · 03-frontend-guide · 04-implementation-plan · 05-domain-content · 06-conventions · 07-v4-mapping-and-overrides · 08-public-and-admin · **09-oppna-fragor-och-beslut**
> **Status:** 20/26 frågor besvarade. **6 öppna frågor återstår — alla 🟢 (innehåll & affär), defaultbara, blockerar ingen fas-start.**

---

## Hur denna fil fungerar

Detta dokument innehåller **endast de frågor som ännu inte fått ett direkt svar.** Besvarade beslut har flödat in i respektive doc (01, 03, 06, 07, 08) och sammanfattas i **beslutsloggen** längst ned (för spårbarhet).

De 6 återstående frågorna är alla 🟢 — innehåll och affärsbeslut. Inget av dem blockerar Fas 0–6. Flera kan inte ens slutföras nu (jurist krävs för legal, marknadstest för priser), så de har rimliga defaults och kan hanteras löpande när respektive fas närmar sig.

**För Claude Code:** Om en av dessa frågor är obesvarad när dess fas startar — använd default-förslaget och notera valet i beslutsloggen.

---

## TL;DR — Status

| Prioritet | Besvarade | Status |
|---|---|---|
| 🔴 Blockerar Fas 0 | 7/7 | ✅ Klar |
| 🟠 Blockerar specifik fas | 8/8 | ✅ Klar |
| 🟡 Bra att besvara tidigt | 5/5 | ✅ Klar |
| 🟢 Innehåll & affär | 0/6 | ⚠ Öppna (defaultbara) |
| **Totalt** | **20/26** | |

✅ **Alla blockerande frågor är besvarade. Claude Code kan köra Fas 0 → Fas 6 utan att vänta på något.**

---

# 🟢 Öppna frågor (innehåll & affär)

## Fråga 21 — Pris-kalibrering

**Status:** 🟢 ÖPPEN

**Kontext:** Föreslagna priser i 07 §3.6 (seat-baserad modell): Starter 495 kr/mån (3 seats + 1 klinik), Pro 1295 kr/mån (5 seats + 1 klinik), Enterprise offert. Extra seats 95-145 kr, extra kliniker 295-395 kr. Consulting practitioners räknas inte som seats.

**Korsa-referens:** 07 §3.6

**Default-förslag:** Använd föreslagna priser i MVP. Kalibrera efter 3-6 månaders sales-data. Backend är pris-agnostisk — siffror lever i `subscription_plans`-tabellen och ändras utan kod-deploy.

**Blockar:** Fas 7 (kan defaultas)

**Svar:**
```
Starter bas/seats/extra:           _____
Pro bas/seats/extra:               _____
Extra klinik:                      _____
Trial-längd:                       _____ dagar (beslutat: 14, fråga 16)
```

---

## Fråga 22 — Sakkunnig granskning av domain content

**Status:** 🟢 ÖPPEN

**Kontext:** 05 §12 listar vad som kräver sakkunnig granskning innan produktionsanvändning: hygienchecklistor (vårdhygien-expert), dokumentmallarnas faktiska innehåll (kvalitetskonsult per bransch), avvikelsekategorier (patientsäkerhetsansvarig). Strukturen finns i 05 — men textinnehållet i mallarna är inte juridiskt/kliniskt validerat.

**Korsa-referens:** 05 §12

**Default-förslag:** Toni granskar själv för `estetisk_injektion` (egna Derma-erfarenheter). För andra branscher: rekrytera sakkunnig när respektive pilotkund-onboarding börjar. Seed-mallar märks tydligt "utkast — kräver granskning" tills validerade.

**Blockar:** Fas 2 (dokumentmallar), Fas 4 (hygienchecklistor) — kan defaultas

**Svar:**
```
Hygienchecklistor estetisk_injektion:  _____
Dokumentmallarnas innehåll:            _____
Övriga branscher:                      _____
```

---

## Fråga 23 — Legal-texter

**Status:** 🟢 ÖPPEN

**Kontext:** Terms, Privacy, Cookies, DPA behöver juridisk granskning innan public launch (08 §4). CareKompass ger inga juridiska råd — en jurist måste granska minst Terms, Privacy och DPA. Cookie-policy med 3-nivå-consent är redan specificerad (08 §4.3, beslut fråga 19).

**Korsa-referens:** 08 §4

**Default-förslag:** Egen jurist anlitas i Fas 2. Mallar (Termly/Iubenda) som start, anpassas till svensk lag + CareKompass datahantering + GA4-consent (fråga 19).

**Blockar:** Public launch (inte tidigare faser)

**Svar:**
```
Jurist:                            _____
Mall-källa (om någon):             _____
```

---

## Fråga 24 — Branscher beyond de tre fyllda

**Status:** 🟢 ÖPPEN

**Kontext:** 05 §4 har fullt utfyllda industry_templates för `estetisk_injektion`, `piercing_tatuering`, `fotvard`. Övriga är skissade i §4.4. Eftersom pilot är Derma (`estetisk_injektion`, fråga 7) är den prioriterade redan klar.

**Korsa-referens:** 05 §4.4, 05 §12

**Default-förslag:** Prioritera `tandvard_estetik` (etablerad IVO-reglerad marknad) och `klinikkedja` (uthyrning, relevant för framtida Derma-expansion) som nästa fyllda. Övriga branscher får placeholder-templates som fylls vid efterfrågan.

**Blockar:** Inget (kan defaultas)

**Svar:**
```
Fjärde bransch:                    _____ (default: tandvard_estetik)
Femte bransch:                     _____ (default: klinikkedja)
```

---

## Fråga 25 — News-modul i v6 MVP

**Status:** 🟢 ÖPPEN

**Kontext:** v4 har News. Egen modul (admin-flik + publik `/news`, 08 §2.4 + §9.8) eller extern blog (Ghost/Substack)?

**Korsa-referens:** 08 §2.4, 08 §9.8

**Default-förslag:** Enkel egen News-modul i Fas 5. Schema finns redan specificerat (08 §2.4). Räcker för 1-4 inlägg/månad. Ghost/Substack är overkill.

**Blockar:** Fas 5 (kan defaultas)

**Svar:**
```
_____________________________________________________________
```

---

## Fråga 26 — Compliance-score-vikter

**Status:** 🟢 ÖPPEN

**Kontext:** 05 §11 har default-vikter (dokument 15%, avvikelser 20%, hygien 20%, läkemedel 10%, ordination 15%, risk 10%, personal 10%). Dessa är gissningar och bör kalibreras mot riktig data.

**Korsa-referens:** 05 §11, 04 §13

**Default-förslag:** Använd default-vikter i Fas 5. Kalibrera efter 3 månader baserat på riktig pilot-data från Derma. Justeras via CK-admin-konfig (`compliance_score_config`) utan kod-deploy.

**Blockar:** Fas 5 (kan defaultas)

**Svar:**
```
_____________________________________________________________
```

---

# 📜 Beslutslogg (besvarade frågor 1–20)

Besluten nedan är redan inarbetade i respektive doc. Här som kompakt spårbar historik.

| Datum | # | Beslut | Doc-konsekvens |
|---|---|---|---|
| 2026-05-27 | 1 | Scaffolding finns, kör inte `bun create` | 04 §2.3 |
| 2026-05-27 | 2 | DNS konfigurerad mot Lovable | – |
| 2026-05-27 | 3 | Supabase aktivt, nycklar i env vars | – |
| 2026-05-27 | 4 | Väg A — Clean cutover | 07 §10 |
| 2026-05-27 | 5 | Samma kodbas, `_admin` route-grupp | 08 §8 |
| 2026-05-27 | 6 | Inter + shadcn slate-default, placeholder-logo | 03 §6.1 |
| 2026-05-27 | 7 | Derma Beauty Clinic, estetisk_injektion, dogfooding tills Fas 5 | – |
| 2026-05-27 | 8 | customer_records Väg A (500-tecken, PDL-disclaimer), ingen v4-historikimport | 04 Fas 8, 02 §6.8 |
| 2026-05-27 | 9 | Lovable AI Gateway: gemini-3-flash-preview + gemini-2.5-pro, ingen AI-secret | 07 §5.4 |
| 2026-05-27 | 10 | Lovable Cloud Email primär, Resend backup, skippa MS365 | 07 §5.4 |
| 2026-05-27 | 11 | BankID: utvärdera Signicat/Criipto i Fas 9 | – |
| 2026-05-27 | 12 | BokaDirekt: förbered Fas 4+ (external_id redo), ej spikat avtal | 04 Fas 4 |
| 2026-05-27 | 13 | Org.nr manuell inmatning MVP, extern verifiering (Bolagsverket) FUTURE | 08 §10.5 |
| 2026-05-27 | 14 | Lovable Stripe-payments (`enable_stripe_payments`), inga egna webhooks, test direkt/live senare | 07 §5.4 |
| 2026-05-27 | 15 | Supabase native MFA/TOTP | – |
| 2026-05-27 | 16 | Auto-trial 14d för alla; quality_manager per bolag (valbart per klinik); CK = verktyg ej granskare | 08 §10.1, 01 §7.0, 07 §2.2 |
| 2026-05-27 | 17 | Sentry i Fas 1 (frontend + backend) | 06 §2.1 |
| 2026-05-27 | 18 | BetterStack (sajt + backend + API-endpoints) | 06 §2.1 |
| 2026-05-27 | 19 | GA4 consent-gated + 3-nivå cookie-banner (Fas 1), Consent Mode v2, Plausible/Fathom GDPR-backup | 06 §5.2, 08 §4.3-4.5 |
| 2026-05-27 | 20 | Placeholder-logo Fas 0, designad logo + bildbank Fas 2-3 | – |

---

# 🗂 Snabb-referens — öppna frågor

| # | Titel | Blockar | Default |
|---|---|---|---|
| 21 | Pris-kalibrering | Fas 7 | Priser i 07 §3.6 |
| 22 | Sakkunnig granskning domain content | Fas 2, 4 | Toni granskar Derma-content |
| 23 | Legal-texter | Public launch | Jurist i Fas 2 |
| 24 | Branscher beyond de tre | Inget | tandvard_estetik + klinikkedja |
| 25 | News-modul | Fas 5 | Egen enkel modul |
| 26 | Compliance-score-vikter | Fas 5 | Default-vikter, kalibrera efter Fas 5 |

---

*Uppdaterad 2026-05-27. 20/26 besvarade (se beslutslogg). 6 öppna 🟢-frågor kvar — inga blockerar fas-start.*
