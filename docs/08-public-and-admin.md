# CareKompass v6.0 — Publika sidor & System Admin

> **Serie:** 01-system-spec · 02-database-api · 03-frontend-guide · 04-implementation-plan · 05-domain-content · 06-conventions · 07-v4-mapping-and-overrides · **08-public-and-admin**
> **Syfte:** Täcker områden som saknades i 01-06 — publika sidor (marknadsföring/legal), SEO-strategi, PWA, system admin-panel (CK-admin), onboarding med systemadmin-godkännande, impersonation och PII-maskering. Bygger på v4-strukturen från 07.

---

## Innehåll

1. Publika sidor — översikt
2. Marknadsföringssidor
3. Modulvisningar (per-modul-marknadsföring)
4. Legal-sidor
5. Resurser & support
6. SEO-strategi
7. PWA (Service Worker, manifest, cache)
8. System Admin (CK-admin) — översikt
9. CK-admin: 10 flikar i detalj
10. Onboarding-flöde med systemadmin-godkännande
11. Impersonation
12. PII-maskering
13. News, status-sida, support-ärenden
14. Acceptance-kriterier per område
15. Fas-placering

---

## 1. Publika sidor — översikt

Publika sidor ligger under `src/routes/` på toppnivå (utanför `_app`):

```
src/routes/
├── index.tsx                       # Landing
├── about.tsx
├── pricing.tsx
├── news.tsx
├── news.$slug.tsx
├── faq.tsx
├── contact.tsx
├── public/                         # Modul-marknadsföring
│   ├── deviations.tsx
│   ├── hygiene.tsx
│   ├── medication.tsx
│   ├── policy-documents.tsx
│   ├── risk-management.tsx
│   ├── compliance.tsx
│   ├── ordination-delegation.tsx
│   ├── reports.tsx
│   ├── customers.tsx
│   └── users.tsx                   # "Roller & behörigheter"
├── legal/
│   ├── terms.tsx
│   ├── privacy.tsx
│   ├── cookies.tsx
│   ├── dpa.tsx                     # Personuppgiftsbiträdesavtal
│   └── compliance.tsx              # "Vi följer dessa lagar/standarder"
├── resources/
│   ├── api.tsx
│   ├── gdpr.tsx
│   ├── ivo.tsx
│   ├── security.tsx
│   └── training.tsx
└── support/
    ├── help.tsx
    ├── guides.tsx
    ├── technical.tsx
    └── status.tsx                  # Uptime-status (publik)
```

### 1.1 Layout

`__root.tsx` har root-layout. För publika sidor används en separat `PublicLayout`-komponent (header + footer för publik) — inte `_app.tsx` (som är för authed).

```tsx
// src/components/app/PublicLayout.tsx
export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </>
  )
}
```

Varje publik route wrappar sin komponent i `PublicLayout`.

### 1.2 Header & Footer

**PublicHeader:** logo + nav (Funktioner, Priser, Resurser, Support, Logga in / Skapa konto). Sticky.

**PublicFooter:** fyra kolumner:
- Produkt (länkar till modulvisningar)
- Företag (Om, News, Kontakt)
- Resurser (GDPR, IVO, Säkerhet, Träning)
- Juridik (Villkor, Integritet, Cookies, DPA)

Plus språkväljare (sv default, en FUTURE) och social-länkar.

---

## 2. Marknadsföringssidor

### 2.1 Landing (`/`)

Struktur:
1. **Hero** — "Compliance som inte stjäl din tid" + CTA (Starta gratis trial / Boka demo)
2. **Problemet** — "Pärmar, Excel-filer, lösa rutiner — och en tillsyn nästa vecka."
3. **Lösningen** — översikt över vad CareKompass gör
4. **Modulkort** — 6 kort med ikoner (Avvikelser, Dokument, Läkemedel, Ordination, Hygien, Compliance) → länkar till modulvisningar
5. **Branscher vi stöttar** — logos + branschnamn
6. **Hur det fungerar** — tre steg (Skapa konto → Ansök → Aktivera moduler)
7. **Pricing-utdrag** + CTA till `/pricing`
8. **Social proof** — testimonials, kundlogos (när det finns)
9. **FAQ-utdrag** + CTA till `/faq`
10. **Slut-CTA** — "Starta din 14-dagars trial"

### 2.2 About (`/about`)

- Visionen
- Toni + grundarteamet
- Varför vi startade CareKompass
- Var vi är på vägen
- Värderingar

### 2.3 Pricing (`/pricing`)

**Plan-jämförelsetabell:**

| | Trial | Starter | Pro | Enterprise |
|---|---|---|---|---|
| Pris | Gratis 14d | 495 kr/mån | 1295 kr/mån | Offert |
| Inkluderade användare | 10 | 3 | 5 | 25+ |
| Extra användare | – | 95 kr | 145 kr | Offert |
| Inkluderade kliniker | 1 | 1 | 1 | 5+ |
| Extra klinik | – | 295 kr | 395 kr | Offert |
| Avvikelser | ✓ | ✓ | ✓ | ✓ |
| Styrdokument | ✓ | ✓ | ✓ | ✓ |
| Hygien (basic) | ✓ | ✓ | ✓ | ✓ |
| Läkemedel | ✓ | – | ✓ | ✓ |
| Ordination & Delegation | ✓ | – | ✓ | ✓ |
| Risk | ✓ | – | ✓ | ✓ |
| Compliance Center | ✓ | – | ✓ | ✓ |
| BankID-signering | ✓ | – | – | ✓ |
| BokaDirekt-integration | – | – | – | ✓ |
| Audit-export | ✓ | – | ✓ | ✓ |
| SLA & support | E-post | E-post | E-post + chat | Dedikerad |

**Konsulter (externa läkare):** "Räknas inte mot ditt seat-count."

**Säkerhetsavsnitt:** kort om RLS, audit, GDPR, IVO-anpassning.

**CTA:** "Starta trial" + "Boka demo".

### 2.4 News (`/news` och `/news/<slug>`)

- Lista av nyhets-/blogginlägg
- Slug-baserade detaljsidor
- Kategorier (Produkt, Bransch, Compliance, Allmänt)
- RSS-feed på `/news/rss.xml`
- Skrivs i admin (`NewsTab`, §9.8)

Tabell:
```sql
create table public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body_md text not null,
  category text,
  cover_image_path text,
  published_at timestamptz,
  author_user_id uuid,
  is_public boolean not null default true,    -- false = endast inloggade
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 2.5 FAQ (`/faq`)

- 15-20 frågor i accordion
- Kategoriserade: Kom igång, Compliance, Säkerhet, Billing, Tekniskt

### 2.6 Contact (`/contact`)

- Formulär: namn, email, företag, ämne, meddelande
- Skickas via Edge Function `send-contact-email`
- Honeypot + Cloudflare Turnstile (om missbruk)
- Bekräftelse-toast + auto-svars-mail

---

## 3. Modulvisningar (per-modul-marknadsföring)

En sida per modul under `/public/<module>`. Identisk struktur:

```
1. Hero — "Modul-namn: en mening om vad den löser"
2. Problemet — vad gör kliniker idag, vad är ont
3. Funktioner — 4-6 punkter med ikoner
4. Skärmdumpar / GIF av faktisk modul
5. Branschfit — vilka branscher passar
6. Compliance-vinst — vilka krav/lagar adresseras
7. Pricing-nivå — "Ingår i Pro och Enterprise" + jämför-länk
8. CTA — "Starta trial" / "Se demo"
```

### 3.1 Lista över alla modulvisningar

| Sida | Modul |
|---|---|
| `/public/deviations` | Avvikelsehantering |
| `/public/policy-documents` | Styrdokument |
| `/public/medication` | Läkemedelslogg |
| `/public/ordination-delegation` | Ordination & Delegation |
| `/public/hygiene` | Miljö & Hygien |
| `/public/risk-management` | Riskhantering |
| `/public/compliance` | Compliance Center |
| `/public/reports` | Statistik & Rapporter |
| `/public/customers` | Kunder |
| `/public/users` | Roller & Behörigheter |

---

## 4. Legal-sidor

### 4.1 Innehåll

| Sida | Innehåll |
|---|---|
| `/legal/terms` | Användarvillkor (B2B SaaS-avtal: definitioner, åtaganden, begränsningar, ansvar, uppsägning, ändringsklausul) |
| `/legal/privacy` | Integritetspolicy enligt GDPR (vilka uppgifter, varför, rättsgrund, lagring, dina rättigheter, DPO-kontakt) |
| `/legal/cookies` | Cookie-policy + cookie-tabell (vad varje cookie gör, lagringstid) + länk till cookie-inställningar |
| `/legal/dpa` | Personuppgiftsbiträdesavtal — mall som genereras med kundens uppgifter vid onboarding (§10) |
| `/legal/compliance` | "Vi följer dessa lagar/standarder": GDPR, SOSFS 2011:9, Patientsäkerhetslag, Lag 2021:363, IVO:s tillsynspraxis, Miljöbalken, Avfallsförordningen, HSLF-FS 2017:37 |

### 4.2 Krav

- **Inga juridiska råd från Claude.** Toni måste låta en jurist granska minst Terms, Privacy och DPA innan publicering.
- Dokument har version + uppdaterat-datum högst upp
- Historiska versioner sparas (Wayback-style — eller bara länkar till tidigare i Git-history)
- Cookie-consent-dialog visas första besöket, lagras i cookie `ck_consent`

### 4.3 Cookie-policy & samtyckesmodell (09 §19)

**Tre-nivå-samtycke**, byggs i **Fas 1**. Samtycke lagras i **localStorage** (snabb klient-läsning) **+ DB** (`cookie_consents`-tabell, för spårbarhet/revision).

| Nivå | Innehåll | Default | Kan stängas av? |
|---|---|---|---|
| **Nödvändiga** | Auth-session, vald klinik, samtyckesval | På | Nej (krävs för drift) |
| **Funktionella + Analytiska** | GA4, UX-preferenser | Av | Ja |
| **Marketing** | Ev. framtida marknadsföringspixlar | Av | Ja |

```yaml
cookies:
  necessary:                         # alltid på
    - { name: "sb-access-token", purpose: "Auth-session", duration: "1h" }
    - { name: "sb-refresh-token", purpose: "Auth-refresh", duration: "30d" }
    - { name: "ck_active_clinic", purpose: "Vald klinik", duration: "session" }
    - { name: "ck_consent", purpose: "Cookie-samtycke (nivåval)", duration: "12 mån" }
  functional_analytics:              # endast vid samtycke
    - { name: "_ga", purpose: "Google Analytics 4 — besöksmätning", duration: "13 mån" }
    - { name: "_ga_*", purpose: "GA4 session", duration: "13 mån" }
  marketing:                         # endast vid samtycke; default inga i v6.0 MVP
```

### 4.4 GA4 + Consent Mode v2 (GDPR-hänsyn)

> **⚠ GDPR-flagga:** GA4 innebär dataöverföring till Google/USA. Efter Schrems II har flera EU-tillsynsmyndigheter funnit GA i standardform problematiskt. För en vårdnära svensk SaaS är detta extra känsligt. Mitigeringar nedan är **obligatoriska**, inte valfria. Plausible/Fathom (EU-hostad, cookielös) finns som **GDPR-backup** om GA4 blir för komplext eller riskfyllt.

Obligatoriska GA4-inställningar i v6.0:
- **Google Consent Mode v2** — GA-taggen laddas men skickar inga mätdata förrän `analytics_storage = granted`. Ingen GA-cookie sätts före samtycke.
- **IP-anonymisering** aktiverad.
- **Inga PII** skickas till GA4 någonsin — ingen email, personnummer, kundnamn, klinik-id som kan identifiera individ.
- GA4 körs **bara på publika sidor** (`/`, `/pricing`, modulvisningar, etc.) — **aldrig** i `/_app/*` (authed appen) eller `/_admin/*`. Authed-ytor mäts inte med GA.
- Consent-bannern måste tillåta granulärt val (inte bara "Acceptera alla") och ett lika framträdande "Avvisa alla" enligt EDPB-praxis.

Om GA4 bedöms för riskfyllt vid juridisk granskning (09 §23): byt till **Plausible** eller **Fathom** — EU-hostade, cookielösa, kräver inget samtycke för basmätning. Då förenklas bannern och CSP byts (06 §5.2).

### 4.5 `cookie_consents`-tabell

Följer konventionerna i 02. Speglar localStorage-valet för revision:

```sql
create table public.cookie_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),     -- null om ej inloggad
  anonymous_id text,                                -- för ej inloggade besökare
  necessary boolean not null default true,
  functional_analytics boolean not null default false,
  marketing boolean not null default false,
  consent_version text not null,                    -- för spårning vid policy-ändring
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);
```

Ny consent-rad skrivs vid varje ändring (append-only historik, inte UPDATE) — så man kan visa vad användaren samtyckte till vid en given tidpunkt.

---

## 5. Resurser & support

### 5.1 Resurser

| Sida | Syfte |
|---|---|
| `/resources/api` | API-dokumentation (FUTURE för publik API; v6.0 har bara intern) |
| `/resources/gdpr` | GDPR i CareKompass — hur vi hjälper kliniker uppfylla GDPR |
| `/resources/ivo` | IVO-anpassning — hur audit-export används vid tillsyn |
| `/resources/security` | Säkerhetsöversikt — RLS, kryptering, hosting (Cloudflare + Supabase EU), pen-tester |
| `/resources/training` | Träningsresurser — videoguider, kommande webinars |

### 5.2 Support

| Sida | Syfte |
|---|---|
| `/support/help` | Hjälpcenter — sökbar lista av artiklar |
| `/support/guides` | Steg-för-steg-guider (sökt vid onboarding) |
| `/support/technical` | Teknisk dokumentation för admins |
| `/support/status` | Publik status-sida — uptime senaste 90d, pågående incidenter |

### 5.3 Hjälp-artiklar

Tabell:
```sql
create table public.help_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body_md text not null,
  category text,
  tags text[],
  view_count int not null default 0,
  helpful_count int not null default 0,
  not_helpful_count int not null default 0,
  published boolean not null default false,
  updated_at timestamptz not null default now()
);
```

Skrivs i admin (`SupportTab`, §9.9).

### 5.4 Status-sida (`/support/status`)

- Komponentlista: API, Database, Edge Functions, Email, Storage, Realtime
- Status per komponent: Operational / Degraded / Outage
- Senaste 90d uptime-graf
- Pågående/historik incidenter

Data hämtas från BetterStack (eller liknande uptime-provider) via API och cachas. Inte realtime.

---

## 6. SEO-strategi

### 6.1 Per-sida-SEO

```tsx
// src/routes/public/deviations.tsx
export const Route = createFileRoute("/public/deviations")({
  head: () => ({
    meta: [
      { title: "Avvikelsehantering för kliniker | CareKompass" },
      { name: "description", content: "Rapportera, utreda och stäng avvikelser med full spårbarhet. IVO-redo audit-trail. Starta din 14-dagars trial." },
      { property: "og:title", content: "Avvikelsehantering för kliniker" },
      { property: "og:description", content: "..." },
      { property: "og:image", content: "https://v6.carekompass.se/og/deviations.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://v6.carekompass.se/public/deviations" },
    ],
  }),
  component: DeviationsPublicPage,
})
```

### 6.2 JSON-LD strukturerad data

Lägg till på relevanta sidor:

- Landing: `Organization`-schema
- Pricing: `Product` med `Offer` per plan
- News-artiklar: `Article`
- FAQ: `FAQPage`
- Status: `WebPage`

### 6.3 sitemap.xml + robots.txt

`public/sitemap.xml` — auto-genererad via build-script som listar alla publika routes. Re-genereras vid build.

`public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /app/
Disallow: /inspect/
Disallow: /admin/

Sitemap: https://v6.carekompass.se/sitemap.xml
```

### 6.4 Indexering-kontroller

Authed routes (`/_app/*`) och inspector (`/inspect/*`) får `<meta name="robots" content="noindex,nofollow">` i sin layout.

### 6.5 Performance som SEO-faktor

Performance-budgets från 06 §7 gäller. Lighthouse SEO-score ska vara ≥ 95 på alla publika sidor.

---

## 7. PWA

### 7.1 Manifest

`public/manifest.json`:
```json
{
  "name": "CareKompass",
  "short_name": "CareKompass",
  "description": "Ledningssystem för kliniker",
  "start_url": "/app",
  "display": "standalone",
  "theme_color": "#1e3a5f",
  "background_color": "#ffffff",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### 7.2 Service Worker

`public/sw.js` — använd **Workbox** för cache-strategier (skrivs inte från grunden):

| Resource | Strategi | Anmärkning |
|---|---|---|
| App shell (HTML, CSS, JS) | StaleWhileRevalidate | Snabb start, uppdateras i bakgrunden |
| API-anrop (`/api/*`, `supabase`) | NetworkOnly | Aldrig cacha auth-data eller affärsdata |
| Bilder | CacheFirst, 30d TTL | |
| Fonts | CacheFirst, 1y TTL | |
| Realtime WebSocket | NetworkOnly | |

### 7.3 Offline-stöd

v6.0 MVP har **inte** full offline-funktionalitet. Service Worker visar enklare offline-page (`/offline.html`) om nätverket tappas och ingen cache finns.

Full offline (skapa avvikelse offline → synka senare) är FUTURE.

### 7.4 Update-strategi

När ny version deployas:
- Service Worker installeras i bakgrunden
- Användaren ser banner "Ny version tillgänglig — ladda om" när Sentry-baserat versions-check ser nyare deploy
- Klick på banner → `skipWaiting` + reload

### 7.5 Install-prompt

På publika sidor (när användaren visar engagemang — t.ex. besökt 3 sidor): "Installera CareKompass som app". Använder `beforeinstallprompt`-event.

---

## 8. System Admin (CK-admin) — översikt

**`pages/SystemAdminPanel.tsx` → `src/routes/_admin/index.tsx` med 10 flikar.**

### 8.1 Åtkomstkontroll

- Skild route-grupp `_admin` med beforeLoad-guard
- Kräver `is_super_admin = true` på profilen
- Egen layout (`AdminLayout`) — separat sidebar med admin-specifik nav
- All åtkomst loggas i `audit_logs` med `action='admin.viewed'` / `action='admin.action.*'`

### 8.2 `is_super_admin`-flagga

```sql
alter table public.profiles
  add column is_super_admin boolean not null default false;
```

Default false. Sätts manuellt i Supabase Dashboard för CK-personal. Endast `super_admin` kan sätta `super_admin` på annan användare (via SQL eller dedikerad admin-action med dubbel autentisering).

### 8.3 RLS för admin

`super_admin` får läs-åtkomst till **alla** tenants via en separat policy:

```sql
create policy "super_admin_read_all"
  on public.<table> for select
  using (
    deleted_at is null
    and exists (
      select 1 from public.profiles p
      where p.id = public.current_profile_id() and p.is_super_admin = true
    )
  );
```

Skrivåtgärder kräver **impersonation-session** (§11) eller dedikerade admin-Edge Functions.

---

## 9. CK-admin: 10 flikar i detalj

Routes under `src/routes/_admin/`:

```
_admin/
├── index.tsx           → redirect till /admin/companies
├── companies.tsx       (Företag-flik)
├── users.tsx           (Användare)
├── billing.tsx         (Billing)
├── compliance.tsx      (Compliance)
├── modules.tsx         (Moduler)
├── plans.tsx           (Planer)
├── templates.tsx       (Mallar)
├── news.tsx            (Nyheter)
├── support.tsx         (Support)
└── system.tsx          (System)
```

### 9.1 Företag (`/admin/companies`)

**Vyer:**
- Pending applications (väntar på godkännande) — knapp Godkänn / Avslå
- Aktiva företag — sök, filter, klick → detalj
- Pausade/avregistrerade — historik

**Dialoger:**
- `ApproveCompanyDialog` — godkänner, triggar provisionering (`create-company` Edge Function), skapar avtal
- `RejectCompanyDialog` — avslår med motivering
- `SuspendCompanyDialog` — pausar (RLS-läge: read-only)
- `CompanyDetailsModal` — full info: kontakt, klinik-antal, användarantal, billing-status, anteckningar

**Anteckningar** (`company_notes`-tabell):
- CK-personal kan lägga interna noteringar per företag (inte synligt för kunden)

### 9.2 Användare (`/admin/users`)

- Sökbar lista över alla `profiles` (cross-tenant)
- Filter: senast inloggad, har företag, har klinik, super_admin
- Klick → detalj med company-memberships, clinic-assignments, capabilities, sessions
- Åtgärder:
  - Återställ lösenord (skickar reset-mail)
  - Tvinga utloggning (revoke alla sessions)
  - **Impersonera** (öppnar impersonation-flöde, §11)
  - Markera/avmarkera `is_super_admin`

### 9.3 Billing (`/admin/billing`)

**Undermoduler:**
- `BillingStats` — totala intäkter, MRR, ARR, churned, top kunder
- `InvoicesTab` — alla fakturor, sök, filter, klick → detalj
- `PaymentsTab` — alla betalningar
- `SubscriptionsTab` — alla aktiva prenumerationer

**Åtgärder:**
- `CreateInvoiceDialog` — manuell faktura (för Enterprise eller justering)
- `ProcessRefundDialog`
- `RetryPaymentDialog`
- `VoidInvoiceDialog`

### 9.4 Compliance (`/admin/compliance`)

- Plattformsövergripande audit-logs
- `UserSessionsSection` — aktiva sessioner cross-tenant, kan termineras
- Exporthistorik — alla `compliance_exports` från alla företag
- Datasubject-requests — GDPR-begäranden (om/när vi vill ha en kö för dem)

### 9.5 Moduler (`/admin/modules`)

- Aktivera/deaktivera moduler per företag
- Override `company_modules` direkt (för Enterprise-deals)
- Bulk-uppdatering vid plan-ändringar

### 9.6 Planer (`/admin/plans`)

- CRUD på `subscription_plans`
- Editera priser, included_seats, extra_seat_price, included_clinics
- **Inte** påverkar befintliga abonnemang (prislåsning — kunden behåller priset de signade på)
- Plan-byte föreslås nästa förnyelseperiod

### 9.7 Mallar (`/admin/templates`)

- Hantera **systemmallar** (publiceras till alla nya företag):
  - Checklist-mallar (hygien)
  - Dokumentmallar (styrdokument)
  - Industry templates (terminologi, default-mallar)
- Komponenter:
  - `ChecklistCategoriesSection`, `ChecklistTemplatesSection`
  - `DocumentCategoriesSection`, `DocumentTemplatesSection`
  - `IndustryTemplatesSection`
  - `DeleteTemplatesDialog` (med safety-check: räknar antal företag som använder)
  - `ViewChecklistTemplateDialog`

### 9.8 Nyheter (`/admin/news`)

- CRUD `news`-tabell
- Rich text-editor med samma sanitization som styrdokument
- Publicera / spara som utkast
- Schemalägg publicering
- Tagga som "Publik" (visas på `/news`) eller "Endast inloggad" (visas i app)

### 9.9 Support (`/admin/support`)

- Inkommande supportärenden (från `/support/help` form eller direkt email)
- Tabell `support_tickets`:
  ```sql
  create table public.support_tickets (
    id uuid primary key default gen_random_uuid(),
    ticket_no text not null unique,           -- 'SUP-2026-0001'
    company_id uuid references public.companies(id),
    user_id uuid references public.profiles(id),
    subject text not null,
    body_md text not null,
    status text not null,                     -- 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed'
    priority text not null,                   -- 'low' | 'medium' | 'high' | 'urgent'
    assigned_to_user_id uuid,
    created_at timestamptz not null default now(),
    resolved_at timestamptz
  );
  ```
- Också CRUD på `help_articles`

### 9.10 System (`/admin/system`)

- `SystemHealthCard` — status över Edge Functions (via uptime-data), DB connection, Storage, Realtime
- `SecretExpiryCard` — varningar för utgående secrets (driven av `secret-expiry-check`)
- Cron job status (senaste körning, success/fail)
- Database stats (totala rader per tabell, growth-trend)
- Feature flags / ship-flags-konfiguration (06 §15.4)

---

## 10. Onboarding-flöde med systemadmin-godkännande

### 10.1 Onboarding-läge

> **Beslut (09 §16b):** v6.0 använder **auto-trial som default** — alla nya bolag får 14 dagars trial direkt utan manuell godkännande som spärr. CK-admin kan retro-granska och stänga av missbruk i efterhand. Manuell godkännande (Läge A nedan) finns kvar i koden som en valbar spärr som kan aktiveras via flagga om missbruk skulle bli ett problem.

**Läge B: Auto-trial (DEFAULT i v6.0)**

```
1. Skapa konto (Supabase Auth)
2. Onboarding-wizard — välj plan, bransch
3. Fyll i företagsuppgifter — namn, org.nr (manuell inmatning, 09 §13), kliniker, kontaktperson
4. Avtal genereras (Terms + DPA, kund-uppgifter ifyllda)
5. Signera digitalt (click v6.0 / BankID Fas 10)
6. → Auto-provisioneras direkt → trial-läge i 14 dagar (alla Pro-moduler på)
7. KRAV (01 §7.0): minst en quality_manager måste tilldelas innan onboarding räknas som slutförd
8. Provisionerad-vy: skapa kliniker, bjuda in personal
9. CK-admin ser bolaget i /admin/companies men har inget action-krav — kan retro-granska och stänga av missbruk
```

**Läge A: Manuell godkännande (valbar spärr, ej default)**

```
Samma som Läge B steg 1-5, men:
6. → Ansökan väntar — kunden ser "PendingApprovalModal"
7. CK-admin granskar i /admin/companies → Godkänner / Avslår
8. Vid godkänt → provisioneras → trial-läge
```

Aktiveras via flagga `feature.manual_onboarding_approval` (default av). Notera: detta är **affärsmässig** gatekeeping (legitim kund?), aldrig en kvalitetsbedömning av klinikens vård (01 §7.0).

Default i Fas 1: **Läge B (auto-trial)**.

### 10.2 Tabeller

```sql
create table public.company_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_user_id uuid not null references public.profiles(id),
  company_name text not null,
  org_nr text,
  industry_template_id uuid references public.industry_templates(id),
  plan_id uuid references public.subscription_plans(id),
  expected_clinic_count int,
  expected_user_count int,
  contact_email text not null,
  contact_phone text,
  application_note text,                  -- fri text från sökanden
  status text not null default 'pending', -- 'pending' | 'approved' | 'rejected' | 'withdrawn'
  reviewed_by_user_id uuid,
  reviewed_at timestamptz,
  rejection_reason text,
  agreement_signed_at timestamptz,
  agreement_signature_method text,
  agreement_pdf_path text,
  created_company_id uuid references public.companies(id),  -- fylls vid approve
  created_at timestamptz not null default now()
);
```

### 10.3 PendingApprovalModal

Visas i `/app`-layout när användaren är inloggad men har en `pending` application och inga andra company-memberships:

- "Din ansökan granskas — vi hör av oss inom 1-2 arbetsdagar"
- Visar status-progress
- Kan se / ladda ner signerat avtal
- Knapp "Avbryt ansökan" → status `withdrawn`

### 10.4 Avtals-generering

Edge Function `generate-onboarding-agreement`:
- Input: application-data
- Genererar PDF (Deno + pdf-lib) från mall i `agreement_templates`-tabell
- Lägger i Storage, returnerar signed URL
- Mall innehåller placeholders: `{{company_name}}`, `{{org_nr}}`, `{{applicant_name}}`, etc.

### 10.5 Validering före godkännande

CK-admin går igenom:
- [ ] Org.nr giltigt (lookup mot Bolagsverket — manuellt i v6 MVP, API-integration FUTURE)
- [ ] Email-domän rimligt (inte spam)
- [ ] Industry-template matchar verksamheten
- [ ] Avtal signerat
- [ ] Ingen tidigare pausad/avregistrerad version av samma företag

Checklistan är intern; godkännande-knappen markerar den implicit.

---

## 11. Impersonation

### 11.1 Mål

Låta CK-personal logga in som en kund-användare för felsökning, support och provisioneringshjälp — **utan** att exponera kundens lösenord och **med** full audit-loggning.

### 11.2 Krav (icke-förhandlingsbara)

- Endast `is_super_admin = true` kan starta impersonation
- Kräver **ärende-ID** (eller fri ärendebeskrivning) som skrivs i `audit_logs`
- Session är **tidsbegränsad** (15 min default, max 60 min)
- All aktivitet under impersonation loggas med `actor_role='impersonated_admin'` och `impersonated_by_user_id` i `audit_logs`
- Kunden får mail-notifiering: "En CK-administrator använde ditt konto för support kl X, ärende #Y"
- Inga destruktiva åtgärder under impersonation (delete-knappar disabled)
- Impersonation kan inte avslutas av imiterad användare (de märker inte aktiv impersonation utan loggas in normalt vid nästa session)

### 11.3 Implementering

```sql
create table public.impersonation_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.profiles(id),
  target_user_id uuid not null references public.profiles(id),
  case_reference text not null,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  ended_at timestamptz,
  end_reason text,                            -- 'manual' | 'expired' | 'admin_logout'
  ip_address inet,
  user_agent text
);
```

Flöde:
1. Admin på `/admin/users/<id>` klickar Impersonera
2. Modal — case_reference (obligatoriskt), duration (15/30/60 min)
3. Edge Function `start-impersonation` validerar admin, skapar `impersonation_sessions`-rad, returnerar special-JWT med claim `act_as: <target_user_id>` (kort giltighetstid)
4. Klient byter session till impersonations-JWT
5. Banner högst upp: "🛡 IMPERSONATING <user.name> — Ärende #<ref> — <countdown>"
6. Knapp "Avsluta impersonation" → tillbaka till admin-JWT
7. Tidsut → automatisk återgång + force-redirect till `/admin`

### 11.4 Loggning

Varje `createServerFn` / RLS-action under impersonation:
- `actor_user_id = target_user_id` (för RLS-konsekvens)
- `actor_role = 'impersonated_admin'`
- `metadata.impersonation_session_id = <id>`
- `metadata.impersonator_user_id = <admin_id>`
- `metadata.case_reference = <ref>`

Detta gör att audit-loggen är **dubbel-spårbar**: man kan filtrera på antingen den imiterade användaren eller den faktiska admin som agerade.

---

## 12. PII-maskering

### 12.1 Default-maskering

I admin-vyer (alla flikar under `/admin/*`) maskeras PII som default:

| Typ | Visning maskerad | Visning avmaskad |
|---|---|---|
| Personnummer | `19800101-XXXX` | `19800101-1234` |
| Email | `j***@e***.com` | `john@example.com` |
| Telefon | `070-XXX XX XX` | `070-123 45 67` |
| Adress | `<kommun>` | Full adress |

### 12.2 Avmaskning

Admin klickar "Visa fullständigt" på en post:
- Modal — case_reference + motivering
- Edge Function `unmask-pii` loggar förfrågan + returnerar avmaskad data
- Avmaskning gäller **bara den specifika posten**, inte hela vyn
- Auto-mask igen efter 5 min eller vid sid-byte

### 12.3 Logg

```sql
create table public.pii_unmask_audits (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null,
  target_entity_type text not null,           -- 'profile' | 'customer' | 'customer_record'
  target_entity_id uuid not null,
  fields_unmasked text[] not null,            -- ['personnummer', 'phone']
  case_reference text not null,
  reason text,
  unmasked_at timestamptz not null default now()
);
```

### 12.4 Kunden ser också

Customer detail-sida för **vanliga användare** kan inte maska/avmaska — de ser alltid full data om de har permission att läsa kunden. PII-maskering är specifikt för **admin cross-tenant view**.

### 12.5 Notifiering

Kunden får **inte** notifiering varje gång CK-admin avmaskar PII (skulle ge brus). Däremot logged och tillgängligt vid revision på begäran.

---

## 13. News, status-sida, support-ärenden

### 13.1 News-publicering

CK-admin skriver i `/admin/news`:
- Slug (auto-genererad från titel, ändringsbar)
- Titel, excerpt
- Body i markdown med rich text-editor
- Cover image (Storage upload)
- Kategori (Produkt | Bransch | Compliance | Allmänt)
- Publicering: utkast / publicerat / schemalagt
- Sichtbarhet: publik (`/news`) eller endast inloggad (visas i topbar-feed för inloggade)

Inloggade-news visas i topbar dropdown (med olästa-räknare).

### 13.2 Status-sida

`/support/status` läser från:
- BetterStack uptime API (uptime per komponent)
- Egen `incidents`-tabell (om vi vill manuellt rapportera incidenter)

```sql
create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null,                       -- 'investigating' | 'identified' | 'monitoring' | 'resolved'
  severity text not null,                     -- 'minor' | 'major' | 'critical'
  affected_components text[],                 -- ['api', 'database', 'edge_functions']
  description_md text,
  started_at timestamptz not null,
  resolved_at timestamptz,
  updates jsonb not null default '[]'::jsonb  -- [{ ts, status, message }, ...]
);
```

Auto-publicerad. Inga authed-routes på status-sidan (även när Sentry larmar visas inga internals).

### 13.3 Support-tickets

Skapas från:
1. Kontaktformulär (`/contact`) → manuellt categorized av admin
2. Mail till `support@carekompass.se` → manuell skapas (eller integrerat senare via Resend webhook)
3. In-app "Behöver hjälp?"-knapp → direkt skapad ticket

Hanteras i `/admin/support` enligt §9.9.

---

## 14. Acceptance-kriterier per område

### 14.1 Publika sidor (Fas 2 / 5)

- [ ] Landing renderar SSR med Core Web Vitals i grönt
- [ ] Alla 10 modulvisningar publicerade
- [ ] Legal-sidor publicerade (Toni har juristgranskat)
- [ ] News-modul fungerar (publicera, läs publikt)
- [ ] FAQ med 15+ frågor
- [ ] Contact-formulär skickar mail
- [ ] sitemap.xml inkluderar alla publika routes
- [ ] Lighthouse SEO ≥ 95 på alla publika sidor
- [ ] robots.txt blockerar authed-routes

### 14.2 PWA (Fas 5)

- [ ] Manifest valid
- [ ] Service Worker installerad och uppdaterar
- [ ] Lighthouse PWA-test 100%
- [ ] Install-prompt visas på publika sidor (efter engagemang)
- [ ] Offline-page fungerar

### 14.3 System admin (Fas 5 / 6)

- [ ] Alla 10 flikar implementerade
- [ ] `is_super_admin`-flagga + RLS read-all-policies
- [ ] Cross-tenant search fungerar
- [ ] Audit-logg skrivs på alla admin-åtgärder
- [ ] Helsidan kan inte nås av icke-super_admin (302 till `/app`)

### 14.4 Onboarding-flöde (Fas 1)

- [ ] Ansökningsflöde komplett (formulär, avtals-PDF, signering)
- [ ] PendingApprovalModal visas i rätt situation
- [ ] CK-admin approve-flow provisionerar korrekt
- [ ] Reject-mail skickas
- [ ] Auto-trial ship-flag fungerar (när aktiverad)

### 14.5 Impersonation (Fas 5)

- [ ] Endast super_admin kan starta
- [ ] Kräver case_reference
- [ ] Tidsgräns 15-60 min
- [ ] Banner alltid synlig under impersonation
- [ ] Alla actions loggas dubbelt (target + impersonator)
- [ ] Kund får mail-notifiering

### 14.6 PII-maskering (Fas 5)

- [ ] Default-maskering aktiv i alla admin-vyer
- [ ] Avmaskning kräver case_reference
- [ ] `pii_unmask_audits` skrivs
- [ ] Auto-re-mask efter 5 min eller sid-byte

---

## 15. Fas-placering

Det här innehållet sprids över fas-indelningen från 04 §1 så här:

| Innehåll | Fas | Anmärkning |
|---|---|---|
| Publika sidor (landing, pricing, modulvisningar, FAQ, contact) | **2** | Behövs vid första demo / lansering till piloter |
| Legal-sidor | **2** | Måste finnas före public launch |
| News-modul (publik + admin) | **5** | Inte blockerande, men trevligt vid lansering |
| Resurser/support-sidor | **5** | Innehåll fylls in löpande |
| SEO-grund (per-sida meta, sitemap, robots) | **2** | Med publika sidor |
| JSON-LD strukturerad data | **5** | Sökmotor-bonus, inte kritisk |
| PWA (manifest, sw) | **5** | Trevligt men inte kritiskt för MVP |
| Service Worker offline-page | **5** | |
| System admin Företag-flik | **1** | Onboarding-godkännande krävs |
| System admin Användare-flik | **5** | Inkl. impersonation |
| System admin Billing-flik | **7** | Med Stripe-aktivering |
| System admin Compliance-flik | **5** | Med Compliance Center |
| System admin Moduler-flik | **5** | Override för Enterprise |
| System admin Planer-flik | **7** | Med Stripe-aktivering |
| System admin Mallar-flik | **2** | Default-mallar måste hanteras tidigt |
| System admin Nyheter-flik | **5** | |
| System admin Support-flik | **5** | |
| System admin System-flik | **5** | Health, secrets, cron-status |
| Onboarding manuell godkännande | **1** | Default-flöde |
| Onboarding auto-trial (ship-flag) | **7** | Aktiveras när Toni är redo |
| Impersonation | **5** | |
| PII-maskering | **5** | |

---

## Sammanfattning

Med 07 och 08 har dokumentationen följande täckning:

| Område | Dokumentation |
|---|---|
| Stack & arkitektur | 01 |
| Databas, RLS, API | 02 + 07 (overrides) |
| Frontend | 03 |
| Implementation-faser | 04 + 08 §15 (fas-placering) |
| Domain content (roller, mallar, terminologi) | 05 + 07 §2 (override) |
| Tekniska konventioner | 06 |
| v4-mapping & overrides | 07 |
| Publika sidor, SEO, PWA, admin | 08 |

Resterande gap som **inte** är dokumentation utan beslut/innehåll:
- Mallarnas faktiska text (juridiskt granskat) — Toni + jurist
- Sakkunnig granskning av hygienchecklistor — vårdhygien-expert
- Industry templates beyond de tre fyllda — Toni + branschexperter
- Pris-kalibrering (Starter/Pro/Enterprise) — Toni + marknadstest
- BankID-leverantörsval — Toni
- Migrationsscript v4→v6 per kund — skrivs vid första migrationen

---

*Slut på 08-public-and-admin. Detta är slutet av dokumentationsserien för CareKompass v6.0.*
