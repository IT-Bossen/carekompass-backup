# CareKompass v6.0 — Design Spec

> **Serie:** 01–09 (produkt-/teknik-doc) · **10-design-spec** (denna fil — visuell sanning och översättningskontrakt till kod)
> **Status:** Greenfield design 2026-05. Levereras som single-file React-canvas (`index.html`) med ~57 artboards (30 desktop + 27 mobile). Filerna i `components/` är *designartefakter* — inte produktionskod, men ska översättas direkt till TanStack Start + shadcn/ui enligt mappningen i §6.
> **Spårbarhet:** Varje skärm är förankrad i 01–09. Inga moduler, roller eller fält är uppfunna; se §10 för spårbarhetstabell.

---

## Innehåll

1. Designfilosofi & röst
2. Designsystem — tokens
3. Typografi
4. Färg
5. Komponentmönster
6. Översättning till shadcn/ui
7. Layoutkonventioner (desktop)
8. Mobile-konventioner (touch-first)
9. Filstruktur i designprojektet
10. Spårbarhet — skärm → kod-mål → docs-källa
11. Tweaks / brandbarhet
12. Mock-data — vad är design vs påhitt
13. Vad är medvetet inte gjort
14. Öppna designbeslut

---

## 1. Designfilosofi & röst

CareKompass är **ett verktyg, inte en granskare** (01 §7.0). Det är icke-förhandlingsbart och styr varje copy-val och visuell signal:

- **Aldrig** "CareKompass godkänner", "vi har granskat", "vår bedömning är"
- **Alltid** "din kvalitetsansvariga", "ni äger", "ert ledningssystem"
- Compliance-score formuleras alltid med *"hjälpmedel för din kvalitetsansvariga — inte ett myndighetsutlåtande"*
- IVO och Miljöförvaltningen är kundens motpart, inte CK:s. CK *förmedlar bevis* (audit-paket, inspector mode), bedömer inte.

Tonen i UI:
- **Lugn, klinisk, vuxen.** Ingen SaaS-bling, inga gradienter på UI-kromen (heroes på publika sidor får ha gradient — de är marknadsföring).
- **Hög densitet utan trängsel.** Kliniker hanterar mycket info; tabeller med 12 kolumner är *funktionen*, inte ett problem.
- **Skandinaviskt avskalat:** mycket whitespace runt rubriker, snäva radhöjder i tabeller, monospace för IDs och tidsstämplar.

---

## 2. Designsystem — tokens

Alla tokens definieras i `styles.css` som CSS custom properties under `:root`. De är medvetet shadcn-kompatibla i namnformat (t.ex. `--ck-primary`, `--ck-primary-foreground`) så de mappas 1:1 till shadcn slate-tema vid implementation (03-frontend-guide §6).

### Yt-stack

```
--ck-bg              Page-bakgrund (warm off-white)
--ck-surface         Kort, panel, dialog
--ck-surface-2       Hover, alt rows
--ck-surface-sunken  Inputs i nest, sub-paneler
```

### Bläck-stack (text)

```
--ck-ink     Primär text (warm near-black, oklch 0.22 / 60)
--ck-ink-2   Sekundär (0.40)
--ck-ink-3   Muted (0.55)
--ck-ink-4   Placeholder / disabled (0.70)
```

### Linjer

```
--ck-border          Standard 1px linjer
--ck-border-strong   Input-ramar, knappar
--ck-divider         Hairlines mellan tabellrader
```

### Radier

`--ck-r-xs (4)`, `--ck-r-sm (6)`, `--ck-r-md (8)`, `--ck-r-lg (12)`, `--ck-r-xl (16)`.

### Skuggor

```
--ck-shadow-1   1px liner (subtil card-elevation)
--ck-shadow-2   Card med lift
--ck-shadow-pop Dropdown, popover, dialog
```

Inga tjocka skuggor (03-frontend-guide §6.2). Skuggor ska *antyda* lager, inte deklarera det.

---

## 3. Typografi

**Tre fonter, tydliga roller:**

| Font | Roll | Användning |
|---|---|---|
| **Newsreader** (serif) | Display | H1 på publika sidor och inom appen ("God morgon, Toni.", "Compliance Center"). Aldrig på listrader, knappar eller meta. |
| **Inter** | UI / brödtext | Allt i appen som inte är display eller mono. Default body 14px line-height 1.45. |
| **JetBrains Mono** | Data, IDs, tider | AVV-nummer, batch-id, tidsstämplar, request_id, personnummer, kpi-tal med `tabular-nums`. |

**Type-skala (desktop):**

```
Display-XL  Newsreader 80px / 0.98 / -0.035em   Landing-hero
Display-L   Newsreader 56px / 1.00 / -0.030em   Pricing-hero
Display-M   Newsreader 36px / 1.05 / -0.025em   Sektionsrubriker
Display-S   Newsreader 28px / 1.10 / -0.025em   Sid-rubriker i appen
H1          Inter 600  24px / 1.20 / -0.015em   Avvikelse-rubrik etc.
H2          Inter 600  18px / 1.20
Body        Inter 400  14px / 1.45
Body-S      Inter 500  12px                     Captions, meta
Caption     Inter 500  11px / 0.06em uppercase  Etiketter ("METADATA")
Mono-S      JetBrains  11px                     IDs, dates
KPI         Inter 600  32–56px / -0.02em        Stora siffror
```

**Mobile** (override): Display-XL blir 38px; H1 blir 20–24px; allt annat behåller skala (touch-targets är vad som ökas, inte typen).

---

## 4. Färg

### Primär: forest-teal

`--ck-primary: oklch(0.42 0.06 175)` — dämpad mörk teal/grön. Anchors trust utan att skrika. Den valdes över shadcn slate eftersom slate är *placeholder*-färg (03-frontend §6); forest har:

- Hälso-konnotation utan att vara medicinglassig
- Bra kontrast mot warm off-white-bakgrund
- Tål dark mode (ljusas upp via tweak)

**Tweak-alternativ:** Forest (default), Nordic (deep blue), Clay (warm rust), Slate (placeholder från docs). Byt prim-färg = appen ändras instantly, alla soft-varianter, hover etc.

### Status

| Token | Hex-ish | Användning |
|---|---|---|
| `--ck-success` | grön (oklch 0.55 / 152) | OK-banner, godkända, stängda |
| `--ck-warning` | amber (0.72 / 75) | SLA-varning, "närma sig deadline", drift |
| `--ck-danger` | clay-röd (0.55 / 25) | Kritisk severity, förfallen SLA, destructive |
| `--ck-info` | blå (0.55 / 235) | Neutral notis, "pågår", banners |

Varje status har en `-soft` variant för fyllning av badges, banners.

**Severity → färg-mappning** (gäller överallt i appen):

- `critical` → `--ck-danger`
- `high` → orange (0.50 / 40, egen variant — mellan warning och danger)
- `medium` → `--ck-warning`
- `low` → `--ck-success` (lugn-grön — låg severity är *bra* i feed-skanning)

### Bransch-/scope-färger

- Internt arbete (interna behandlare) → `--ck-primary-soft`
- Externt arbete (rumsuthyrning) → `oklch(0.93 0.04 200)` blå-tonad
- Inspector mode → `oklch(0.35 0.10 60)` warm amber (separerar från app-kromen)
- CK-admin / system → mörk slate (`oklch(0.20 0.013 240)`) sidebar (kontrast mot kund-appens warm whites)

---

## 5. Komponentmönster

### Buttons

```
.ck-btn               Primary (solid prim-färg)
.ck-btn--secondary    Border + surface
.ck-btn--ghost        Transparent, hover surface-2
.ck-btn--danger       Solid danger
.ck-btn--lg           Höjd 40 istället för 32
```

**Touch-target på mobil:** alla primary actions ska vara 44–56px höga. Använd `MPrimaryAction` / `MSecondaryAction` (mobile-shell.jsx) — inte vanliga `.ck-btn` med större höjd, av tydlighetsskäl.

### Inputs

`.ck-input` 32px desktop, 48px mobile. Border `--ck-border-strong`. Fokus = `--ck-primary` ring 3px med soft-fill.

### Badges

`.ck-badge` är basklass. Variant via `--ok`, `--medium`, `--critical`, `--high`, `--low`, `--info`, `--primary`. Höjd 20px (16px för inline-i-rad).

`.ck-badge--dot` ger en färgad prick före texten — används för severity i listor.

### Status

Två varianter:

- **Severity** (`<Severity level="critical" />`) — *hur allvarlig* är saken
- **Status** (`<Status level="investigating" />`) — *vart i flödet* befinner sig saken

Båda används parallellt i avvikelse-detalj-headern och listrader.

### Cards

`.ck-card` = surface + 1px border + 12px radius. Padding sätts inline (16/18/20/24 beroende på densitet). Aldrig skuggade som default — bara dialoger och dropdowns lyfter.

### Tables

Desktop: `.ck-table` med 8px y-padding header, 10px y-padding row, hairline mellan rader. Hover = `--ck-surface-2`. Sticky header om listan är paginerad.

Mobile: ALDRIG tabell. Använd `<MRow>` med 64px höjd, ikon + titel + sub + chev.

### Image placeholders

`.ck-img-ph` — diagonalt randad bakgrund med monospace-text i mitten ("foto · t+0", "screenshot · detalj"). Används överallt där användaren förväntas ladda in egen bild senare. Aldrig handritade SVGs som låtsas vara foto.

---

## 6. Översättning till shadcn/ui

Designen är gjord med **shadcn slate base + Inter som default** i åtanke (03-frontend §6). När den implementeras:

| Design-klass | shadcn-komponent |
|---|---|
| `.ck-btn` | `Button` (variant=`default`/`secondary`/`ghost`/`destructive`) |
| `.ck-btn--lg` | `Button size="lg"` |
| `.ck-input` | `Input` |
| `.ck-textarea` | `Textarea` |
| `.ck-card` | `Card` + `CardContent` |
| `.ck-badge` | `Badge` (custom variants — shadcn har inte alla våra) |
| `.ck-tabs` + `.ck-tab` | `Tabs` + `TabsList` + `TabsTrigger` |
| `.ck-table` | `Table` + custom row component med vår densitet |
| AppShell + Sidebar | Custom layout-komponenter i `src/components/app/` (03-frontend §1) |
| Severity / Status chip | Custom på toppen av `Badge` |
| `MPhone` (mobile preview) | **Behövs ej** — mobila vyer är samma komponenter med responsive breakpoints |

**Token-mappning:** ersätt `--ck-*` med shadcn-variabler enligt:

```
--ck-bg          → --background
--ck-surface     → --card / --popover
--ck-ink         → --foreground
--ck-ink-2,3,4   → --muted-foreground (variantskala via opacity om man vill)
--ck-border      → --border
--ck-primary     → --primary
--ck-primary-foreground → --primary-foreground
--ck-success/warning/danger/info → egna custom (shadcn har bara --destructive)
```

shadcn slate genererar `--primary: oklch(0.208 0.042 265.755)`; ersätt med vår `oklch(0.42 0.06 175)` för forest-teal.

**Tailwind v4 är CSS-driven** (03-frontend §6.1). Tokens läggs i `@theme inline { ... }` direkt i `app.css` — ingen `tailwind.config.js`.

---

## 7. Layoutkonventioner (desktop)

### AppShell

```
┌──────────────────────────────────────────────────────────┐
│ Sidebar 232px │  Topbar 56px (sticky)                    │
│  - Logo       ├──────────────────────────────────────────┤
│  - Klinik-    │                                          │
│    switcher   │  Content                                 │
│  - Modul-nav  │  - Sid-rubriker: Display-S serif         │
│  - Översyn    │  - Subtitle: 13px ink-2                  │
│  - Konto      │  - Page actions top-right                │
│  - Trial-     │  - Filter row 12px gap                   │
│    banner     │  - Main card                             │
│  - User       │                                          │
└──────────────────────────────────────────────────────────┘
```

**Topbar** = breadcrumbs (alltid `Bolag › Klinik › Sida`) + Cmd+K search + bell + actions.

**Sidebar** är fast 232px — inte kollapsbar i v6.0 (06-conventions §15.4 har ev. flagga FUTURE).

### List → detail-mönster

Standardrouting för CRUD-moduler:

```
/_app/<modul>/index.tsx   → <ModulList />     (lista med filter)
/_app/<modul>/$id.tsx     → <ModulDetail />   (detalj-vy med tabs)
/_app/<modul>/new.tsx     → <ModulForm />     (skapa, full sida ej modal)
```

**Detalj-vyn** har alltid:
1. Header-card med severity/status-badges, titel, meta-rad
2. Tabs (Översikt · Tidslinje · Audit · Relaterat)
3. Sidopanel höger (320px): tilldelning, beslut-actions, mini-tidslinje

**Sidor med flera filter** har filter-bar ovanför listan (knappar med "Status: Öppna ▾" syntax). Aldrig fältnamn + dropdown — alltid det aktiva värdet synligt.

### Modal vs full-page

- **Modal** (overlay): bekräftelse, snabb-redigering, impersonation-start, PII-avmaskning
- **Full-page**: skapa nytt (även "ny avvikelse" — det är ingen popup)
- **Sheet** (slide från höger): aldrig i v6.0 (inte etablerat mönster ännu — kan adderas senare)

---

## 8. Mobile-konventioner (touch-first)

### Phone-mått

**390 × 844** (iPhone 14/15/16 base) som referens. Phone-frame i designkanvasen är `MPhone` (~406×860 med bezel).

Hygien-mobilen som byggdes tidigt använder 360×740 — får stå kvar som "lite äldre device", inte tas som mall.

### Bottom tab bar (5 platser + center FAB)

```
[ Hem ]  [ Avvikelser·badge ]  [ + FAB ]  [ Hygien ]  [ Mer ]
```

- **Center FAB** är *kontextuell* — på dashboard öppnar "rapportera avvikelse" (vanligaste primärhandling), på andra sidor primary action för sidan
- **"Mer"** är hubsidan där moduler som inte rymdes i tab-bar bor (Ordinationer, Läkemedel, Dokument, Risk, Personal, Audit, Compliance, Patienter, Externa, Inställningar)
- Badge på Avvikelser visar antal öppna >= medium severity tilldelade till mig

### Top bar

Två varianter (`MTopbar`):
- **Standard** (50px): tillbaka-chev vänster, titel centrerad, action höger
- **Large** (90px+): tillbaka + meta-knapp översta raden, stor Display-S serif-rubrik nedan + subtitle 13px

Använd `large={true}` när sidan är ett *huvudgrepp* (dashboard, en modul-startsida); standard när det är detaljvy eller wizard-steg.

### Sticky bottom action bar

Primära beslut (Godkänn med BankID, Markera som åtgärdad, Rapportera & tilldela) ligger i en sticky bar längst ned, ovanför tab-bar (eller istället för den vid `noTabs`).

**Touch-targets:** 44px minimum, 48–56px för primärknappar.

### Mönster vi använt

| Pattern | När |
|---|---|
| **Bottom sheet** | Cookie consent, sortering, filter-val |
| **Full-page modal** | Wizard-steg, skapa-nytt, inspector mode |
| **List + chevron** | Allt i Mer-hubben + listvyer |
| **Card-grid 2 kol** | KPI-rader, dashboard-översikter |
| **Pill-filter row** (horisontellt scroll) | "Öppna · 7 | Alla | Mitt | Kritiska · 1" ovanför listor |
| **Foto-direkt** | Avvikelse-formulär (knapp som öppnar kamera) |
| **Read-only banner** | Inspector mode (warm amber överst, alltid synlig) |

### Vad jag medvetet INTE byggde på mobil

- **CK-admin** — `MAdminNotice` visar bara "kräver desktop" + 3 nödåtgärder. Cross-tenant + impersonation är fel risk-/säkerhetsprofil för mobil.
- **Hygien-veckomatris** (desktop grid 7×N) — på mobil blir det `MHygieneSchedule` med dag-staplar + "idag-lista". Mobilen är där man **utför** kontroller, inte planerar dem.
- **Audit-tabell med 7 kolumner** — på mobil reduceras till action + entity + meta-rad, ej fullt request_id i listan.

---

## 9. Filstruktur i designprojektet

```
index.html                      ← canvas + Tweaks-panel
styles.css                      ← alla tokens + bas-klasser
design-canvas.jsx               ← starter (pan/zoom/artboards)
tweaks-panel.jsx                ← starter (host-protokoll)

components/
├── shell.jsx              Logo, Icon-set (47 ikoner), Avatar, Sidebar,
│                          Topbar, AppShell, Severity, Status
├── ds.jsx                 Design system-kortet (artboard 1)
│
├── landing.jsx            Public Landing + PublicHeader/Footer (delas)
├── auth-public.jsx        Pricing, Login, Onboarding (desktop)
├── public-extras.jsx      ModulePage, News, FAQ, StatusPage, CookieConsent
│
├── dashboard.jsx          Dashboard (desktop)
├── deviations.jsx         DeviationsList, Detail, New
├── modules.jsx            ComplianceCenter, OrdinationInbox, Medications
├── modules-2.jsx          Documents, HygieneDesktop, RiskAnalysis,
│                          Staff, AuditLog, NotificationsView
├── modules-3.jsx          Customers, ExternalPractitioners,
│                          SettingsBilling, SettingsCompany
├── specialized.jsx        HygieneMobile (befintlig), Inspector,
│                          AdminCompanies, Phone-wrapper
├── admin-extra.jsx        AdminUsers, AdminBilling, AdminTemplates,
│                          AdminSystem, AdminSupport, AdminShell
│
├── mobile-shell.jsx       MPhone, MStatusBar, MTopbar, MTabBar,
│                          MobileShell, MRow, MSection, MCard, MScroll,
│                          MPrimaryAction, MSecondaryAction
├── mobile-public.jsx      MLanding, MPricing, MModulePage, MNews,
│                          MFAQ, MStatusPage
├── mobile-auth.jsx        MLogin, MOnboarding
├── mobile-app.jsx         MDashboard, MDeviationsList, MDeviationDetail,
│                          MDeviationNew, MNotifications
├── mobile-app2.jsx        MDocuments, MMedications, MOrdinationInbox,
│                          MOrdinationDetail, MCompliance, MHygieneSchedule
├── mobile-app3.jsx        MRisk, MStaff, MAudit, MCustomers,
│                          MExternals, MSettings, MMore
└── mobile-special.jsx     MInspector, MCookieConsent, MAdminNotice
```

**Komponent-exportmönster (för Babel-scope, ej produktion):**
```jsx
Object.assign(window, { ComponentA, ComponentB, ... });
```
Detta gäller bara designartefakten. I produktion = vanlig `export` enligt 03-frontend §1.

---

## 10. Spårbarhet — skärm → kod-mål → docs-källa

> *Kod-mål* = där den motsvarande filen ska bo i `src/routes/` enligt 03-frontend §1.

### Publika sidor (Fas 2)

| Designartboard | Komponent | Kod-mål | Docs |
|---|---|---|---|
| Landing | `Landing` | `src/routes/index.tsx` | 08 §2.1 |
| Pricing | `Pricing` | `src/routes/pricing.tsx` | 08 §2.3 |
| Modulvisning | `ModulePage` | `src/routes/public/deviations.tsx` (mönster för alla 10) | 08 §3 |
| News | `News` | `src/routes/news.tsx` | 08 §2.4 |
| FAQ | `FAQ` | `src/routes/faq.tsx` | 08 §2.5 |
| Status | `StatusPage` | `src/routes/support/status.tsx` | 08 §5.4 |
| Cookie consent | `CookieConsent` | Global komponent + `cookie_consents` tabell | 08 §4.3, §4.5 |

### Auth & onboarding (Fas 1)

| | | | |
|---|---|---|---|
| Login | `Login` | `src/routes/login.tsx` | 03 §4 |
| Onboarding (steg 3/6) | `Onboarding` | `src/routes/_app/onboarding.tsx` + wizard-steps | 03 §12, 08 §10 |

### AppShell + kärnmoduler (Fas 1–3)

| | | | |
|---|---|---|---|
| AppShell | `AppShell` (sidebar+topbar) | `src/routes/_app.tsx` + `components/app/AppShell.tsx` | 03 §1, §2.2 |
| Dashboard | `Dashboard` | `src/routes/_app/dashboard.tsx` | (egen) |
| Avvikelser lista | `DeviationsList` | `src/routes/_app/deviations/index.tsx` | 03 §2.1 (exempel), 05 §7 |
| Avvikelse detalj | `DeviationDetail` | `src/routes/_app/deviations/$id.tsx` | (mönster) |
| Avvikelse skapa | `DeviationNew` | `src/routes/_app/deviations/new.tsx` | 03 §9 |
| Styrdokument | `Documents` | `src/routes/_app/documents/index.tsx` | 05 §5 |
| Läkemedel | `Medications` | `src/routes/_app/medications/index.tsx` | 01 §4.1, 05 §6.1 |
| Ordination-inbox | `OrdinationInbox` | `src/routes/_app/inbox.tsx` (Global Consulting Inbox) | 01 §4.1 |
| Hygien-schema | `HygieneDesktop` | `src/routes/_app/hygiene/index.tsx` | 01 §4.2 |
| Risk | `RiskAnalysis` | `src/routes/_app/risks/index.tsx` | 05 §8 |
| Personal | `Staff` | `src/routes/_app/staff/index.tsx` | 07 §2 |
| Audit log | `AuditLog` | `src/routes/_app/audit/index.tsx` | 01 §7.2 |
| Notifieringar | `NotificationsView` | Topbar dropdown + `/_app/notifications` | 05 §10 |
| Compliance Center | `ComplianceCenter` | `src/routes/_app/compliance/index.tsx` | 05 §11 |
| Patienter | `Customers` | `src/routes/_app/customers/index.tsx` (Fas 8) | 01 §7.3 |
| Externa & rum | `ExternalPractitioners` | `src/routes/_app/external-practitioners/index.tsx` (Fas 9) | 01 §4.3 |
| Inställningar / bolag | `SettingsCompany` | `src/routes/_app/settings/company.tsx` | 03 §1 |
| Inställningar / billing | `SettingsBilling` | `src/routes/_app/settings/billing.tsx` | 01 §5, 08 §9.3 |

### CK-admin (Fas 1, 5, 7)

| | | | |
|---|---|---|---|
| Företag | `AdminCompanies` | `src/routes/_admin/companies.tsx` | 08 §9.1 |
| Användare + impersonation | `AdminUsers` | `src/routes/_admin/users.tsx` | 08 §9.2, §11 |
| Billing | `AdminBilling` | `src/routes/_admin/billing.tsx` | 08 §9.3 |
| Mallar | `AdminTemplates` | `src/routes/_admin/templates.tsx` | 08 §9.7 |
| System health | `AdminSystem` | `src/routes/_admin/system.tsx` | 08 §9.10 |
| Support | `AdminSupport` | `src/routes/_admin/support.tsx` | 08 §9.9 |

### Specialvyer

| | | | |
|---|---|---|---|
| Inspector mode | `Inspector` | `src/routes/inspect.$token.tsx` (egen layout, ingen `_app`) | 01 §7.5, 03 §14 |

### Mobile (parallell)

Mobile-komponenter är **inte separata routes**. De är *responsive overrides* — samma routes, men med media-queries / `useMediaQuery`-hook som byter layout under ~768px. Vid implementation:

```tsx
// Pseudo:
function DeviationsListPage() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  return isMobile ? <MDeviationsList /> : <DeviationsList />;
}
```

Eller (cleanare): TanStack Start kan rendera olika under-komponenter beroende på user-agent + `prefers-mobile`-flagga, men shared data-loader.

**Bottom tab bar + center FAB** är mobile-specifik UI; renderas inuti `_app.tsx`-layoutens responsive branch.

---

## 11. Tweaks / brandbarhet

Indexens **Tweaks-panel** är en designtool, *inte* en feature. Det demonstrerar att tokens är bytbara:

- **Primärfärg-tweak** byter `--ck-primary` (+ hover + soft). Allt övrigt anpassar sig automatiskt.
- **Dark mode-tweak** lägger `.ck-dark` på `<html>` — alla `oklch()`-värden för bg/surface/border har dark-variant.

**När Toni beslutar brand-färg** (09 §6) — byt bara dessa fyra tokens:

```
--ck-primary: <ny>;
--ck-primary-hover: <ny -8% L>;
--ck-primary-soft: <ny +50% L, 0.025 C>;
--ck-primary-foreground: <off-white eller off-black beroende på L>;
```

Ingen annan ändring behövs. Skiss inte ny ikonografi mot ny färg — testa befintliga ikoner först.

**Logo** är placeholder (kompass-glyph i `Logo`-komponenten). Vid riktig logotyp: ersätt SVG i `components/shell.jsx` `Logo` — det är ett enda ställe, alla andra ärver.

---

## 12. Mock-data — vad är design vs påhitt

**Design-sanning (kommer från docs):**
- Roller, kapabiliteter, permissions: 05 §1–2, 07 §2
- Industry templates + terminologi: 05 §3–4
- Avvikelse-kategorier, severity, SLA-timmar: 05 §7, §11
- Hygien-checklistor: 05 §6
- Risk-kategorier + 5×5-matrisens trösklar: 05 §8
- Notifieringstyper (34 koder): 05 §10
- Compliance-score-vikter: 05 §11
- Default-dokumentmallar: 05 §5

**Mock-data (påhittad demo, ersätt vid implementation):**
- Personer: Toni Kazarian, Anna Lundqvist, Dr. Eva Hedman, Maria Sjöberg, Erik Berg, etc. — alla påhittade personas
- Bolagsnamn: Derma Beauty AB, Stockholm Estetik, Aesthetic Lab, Skin & Co, Tattoo Studio Söder, Footcare Norrtull — påhittade
- IDs: `AVV-2026-0142`, `ORD-DB-2026-0089`, `L23F0214` (Restylane Lyft-batch), `DEL-0042` — format följer 06-conventions §6 men värdena är påhittade
- Datum & tider, KPI-värden (87, 312 företag, 1 482 audit-händelser, 1.2 GB foto) — påhittade men rimliga
- Trial-bannerns "9 dagar kvar" — påhittat

**Vid handover till Claude Code:** all mock-data ska behållas som *visuella exempel* i Storybook eller fixtures, men i appen drivs allt av faktiska Supabase-queries via `createServerFn`.

---

## 13. Vad är medvetet inte gjort

| Område | Status | Anledning |
|---|---|---|
| Mobile CK-admin | Bara notis-sida | Cross-tenant + impersonation är fel risk för mobil |
| About/Kontakt/Legal-sidor | Skelett-rutter saknas | Innehåll ska juristgranskas (08 §4.2) — jag skissar inte juridiskt |
| Resurser/Support-undersidor | Inte ritade | Mönstret är samma som FAQ |
| Inställningar / Kliniker · Användare · Integrationer · Notifieringar | Inte ritade | Settings/Bolag och Settings/Billing visar mönstret — övriga är samma |
| Onboarding steg 1, 2, 4, 5, 6 | Bara steg 3 | Wizard-mönstret är etablerat — fyll i resten |
| CK-admin Compliance · Moduler · Planer · Nyheter | Inte ritade | Företag/Användare/Billing/Templates/System/Support visar admin-mönstret |
| Animation- & motion-spec | Saknas | Behövs inte i v6 MVP; CSS transitions räcker |
| Tablet-layout (768–1023px) | Saknas | Föreslå att appen *behandlar tablet som desktop* — kliniker använder iPad sittande |
| BankID-modal med pågående signering | Skissad i ordination-detalj | Inte egen flow-skärm — kan adderas vid implementation |
| Stripe Checkout-redirect | Skissad i Settings/Billing | Real-flow hanteras av Stripe-domän |
| Inspector audit-pkt-PDF-mall | Saknas | Genereras av `audit-export` Edge Function (01 §7.5) |

---

## 14. Öppna designbeslut

Punkter där jag tagit ett val som Toni behöver bekräfta:

1. **Primärfärg = forest-teal.** Docs säger slate-placeholder. Jag har gått längre. Toni bekräftar eller byter via Tweak-panelen.
2. **Display-font = Newsreader (serif).** Docs säger Inter only. Jag använder serif för hero/sid-rubriker — kan tas bort om Toni vill ha all-sans (byt `--ck-font-serif` till `var(--ck-font-sans)` i styles.css).
3. **Logo-glyph = kompass-rose.** Bara en placeholder. Behöver riktig logotyp innan launch.
4. **"Patient" som default-terminologi.** Bygger på estetisk_injektion-piloten. När en kund med tatuering-bransch loggar in ska `useTerminology()`-hooken byta till "Kund" överallt — jag har inte simulerat det visuellt i designen.
5. **Bottom-tab-bar lay-out** (5 platser + center FAB). Andra mönstret skulle vara 4 platser utan FAB och separat "rapportera"-action i topbar. FAB vinner på vanligaste action-frekvens, men test med riktig personal.
6. **Inspector mode = warm amber banner.** Docs säger inte färg — jag valde amber för att signalera "extern access, varför tittar du, tidsbegränsat". Kan vara annan färg om Toni föredrar.
7. **Compliance-score-cirkel snarare än stapel/linje.** Visualiseringsval; cirkel ger bättre "score-känsla" på liten yta, men en linjär stapel kunde också funkat.
8. **Severity-knappar i avvikelse-formuläret** — touch-stora färgade knappar snarare än dropdown. Snabbare på mobil, men avgör tonen "akut" vid rapportering. Kan göras mer neutral.
9. **PDL-disclaimer som varningsbanner** (warm amber) på Patient-listan. Bra synlighet men risk att kunden blint klickar bort den. Kan göras mer integrerad/blanare om för aggressiv.

---

*Slut på 10-design-spec. Vidare till implementation enligt 04-implementation-plan med stöd av denna fil.*
