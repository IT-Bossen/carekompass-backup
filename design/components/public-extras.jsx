/* Public extras: Module page, News, FAQ, Status, Cookie consent banner */

const ModulePage = () => (
  <div className="ck" style={{ background: "var(--ck-bg)" }}>
    <PublicHeader />

    <section style={{ padding: "72px 36px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 12 }}>MODUL · AVVIKELSEHANTERING</div>
      <h1 className="ck-serif" style={{ fontSize: 56, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 18 }}>
        Avvikelsen som blev<br />en lärdom — inte en pärm.
      </h1>
      <p style={{ fontSize: 16, color: "var(--ck-ink-2)", maxWidth: 640, margin: "0 auto 28px" }}>
        Strukturerad rapportering, automatisk SLA-klocka per severity, Lex Maria-checklista
        för det som passerar tröskeln, och full audit-trail från första rapport till stängning.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button className="ck-btn ck-btn--lg">Starta trial</button>
        <button className="ck-btn ck-btn--secondary ck-btn--lg">Boka demo</button>
      </div>
    </section>

    {/* Screenshot */}
    <section style={{ padding: "0 36px 60px" }}>
      <div className="ck-card" style={{ overflow: "hidden", boxShadow: "0 24px 60px oklch(0.22 0.015 60 / 0.08)" }}>
        <div style={{ background: "var(--ck-surface-sunken)", padding: "10px 14px", borderBottom: "1px solid var(--ck-border)", display: "flex", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.85 0.06 25)" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.85 0.06 80)" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.85 0.06 150)" }} />
        </div>
        <div className="ck-img-ph" style={{ height: 320, border: 0, borderRadius: 0 }}>screenshot · avvikelse-detalj</div>
      </div>
    </section>

    {/* Features */}
    <section style={{ padding: "60px 36px", background: "var(--ck-surface)" }}>
      <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 12, textAlign: "center" }}>VAD DU FÅR</div>
      <h2 className="ck-serif" style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.025em", textAlign: "center", marginBottom: 40 }}>
        Sex saker som gör skillnad
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 1100, margin: "0 auto" }}>
        {[
          { icon: "alert", title: "Severity → SLA", body: "Kritisk 24h · Hög 7d · Medel 30d · Låg 90d. SLA-klocka tickar, eskalering automatisk." },
          { icon: "flag", title: "Lex Maria-tröskel", body: "Vid kritisk severity erbjuds checklista för anmälan. IVO-formuläret förbereds." },
          { icon: "users", title: "Tilldelning + bevakare", body: "Tilldela ansvarig, lägg till bevakare, status-byte triggar notiser." },
          { icon: "clock", title: "Tidslinje + audit", body: "Allt loggas append-only med request_id. Före/efter-värden vid varje ändring." },
          { icon: "compass", title: "Kategorier per bransch", body: "Estetisk: vaskulär ocklusion. Tatuering: sterilization_failure. Fotvård: wound_complication." },
          { icon: "download", title: "Exportera till tillsyn", body: "Filtrera period + severity, exportera som PDF-paket. Klart på 30 sekunder." },
        ].map(f => (
          <div key={f.title} style={{ padding: 22 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--ck-primary-soft)", color: "var(--ck-primary)", display: "grid", placeItems: "center", marginBottom: 12 }}>
              <Icon name={f.icon} size={18} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: "var(--ck-ink-2)", lineHeight: 1.5 }}>{f.body}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Compliance value */}
    <section style={{ padding: "60px 36px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 12 }}>COMPLIANCE-VINST</div>
        <h2 className="ck-serif" style={{ fontSize: 30, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 24 }}>
          Vilka krav adresseras
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[
            ["SOSFS 2011:9", "Ledningssystem för systematiskt kvalitetsarbete · 5 kap. avvikelsehantering"],
            ["Patientsäkerhetslagen 2010:659", "Lex Maria — vårdskador anmäls inom 24h"],
            ["Lag 2021:363", "Estetiska behandlingar — anmälningspliktiga komplikationer"],
            ["GDPR Art. 33", "Personuppgiftsincidenter — 72h notifikation"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 12 }}>
              <Icon name="check" size={16} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{k}</div>
                <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>{v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Pricing nudge */}
    <section style={{ padding: "40px 36px 80px" }}>
      <div className="ck-card" style={{ padding: 28, maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 4 }}>INGÅR I</div>
          <div className="ck-serif" style={{ fontSize: 22, marginBottom: 6 }}>Starter · Pro · Enterprise</div>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>Avvikelsehantering är kärnmodul — finns i alla planer.</div>
        </div>
        <button className="ck-btn ck-btn--lg">Jämför planer<Icon name="arrow-r" size={14} /></button>
      </div>
    </section>

    <PublicFooter />
  </div>
);


/* ── NEWS / BLOG ── */
const News = () => (
  <div className="ck" style={{ background: "var(--ck-bg)" }}>
    <PublicHeader />

    <section style={{ padding: "60px 36px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 10 }}>NYHETER</div>
      <h1 className="ck-serif" style={{ fontSize: 56, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 14 }}>
        Vad händer i CareKompass
      </h1>
      <p style={{ fontSize: 15, color: "var(--ck-ink-2)", maxWidth: 580 }}>
        Produktnyheter, branschanalyser, compliance-tips och uppdateringar från teamet.
      </p>

      <div style={{ display: "flex", gap: 6, marginTop: 24 }}>
        {["Alla", "Produkt", "Bransch", "Compliance", "Allmänt"].map((c, i) => (
          <button key={c} className={i === 0 ? "ck-btn" : "ck-btn ck-btn--secondary"} style={{ height: 30 }}>{c}</button>
        ))}
      </div>
    </section>

    <section style={{ padding: "20px 36px 80px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Featured */}
      <div className="ck-card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden", marginBottom: 32 }}>
        <div className="ck-img-ph" style={{ borderRadius: 0, border: 0, minHeight: 320 }}>cover · v6.0 lansering</div>
        <div style={{ padding: 36, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <span className="ck-badge ck-badge--primary">PRODUKT</span>
            <span className="ck-badge">FEATURED</span>
          </div>
          <h2 className="ck-serif" style={{ fontSize: 28, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 12 }}>
            CareKompass v6.0 — öppen pilot
          </h2>
          <p style={{ fontSize: 13, color: "var(--ck-ink-2)", lineHeight: 1.6, marginBottom: 16 }}>
            v6.0 ersätter v4.0 med ny stack (React 19 + TanStack Start), full audit-trail,
            consulting practitioner-inbox och inspector mode för IVO-tillsyn.
          </p>
          <div style={{ fontSize: 12, color: "var(--ck-ink-3)", marginBottom: 18 }}>
            <span className="ck-mono">2026-05-26</span> · Toni Kazarian · 6 min läsning
          </div>
          <a style={{ color: "var(--ck-primary)", fontSize: 13, fontWeight: 600, textDecoration: "underline" }}>Läs hela →</a>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {[
          { cat: "Compliance", title: "Lex Maria på 30 sekunder — så funkar checklistan", date: "2026-05-22", read: "4 min" },
          { cat: "Bransch", title: "IVO:s tillsynspraxis 2026 — vad granskar de nu?", date: "2026-05-14", read: "8 min" },
          { cat: "Produkt", title: "Konsulterande läkare får cross-tenant inbox", date: "2026-05-08", read: "3 min" },
          { cat: "Bransch", title: "Hyalase-protokoll vid filler-komplikation", date: "2026-04-30", read: "10 min" },
          { cat: "Produkt", title: "Inspector mode — IVO loggar in via token", date: "2026-04-22", read: "5 min" },
          { cat: "Allmänt", title: "Vi får Schrems II-frågorna — så svarar vi", date: "2026-04-12", read: "6 min" },
        ].map(n => (
          <div key={n.title} className="ck-card" style={{ overflow: "hidden" }}>
            <div className="ck-img-ph" style={{ borderRadius: 0, border: 0, height: 140 }}>cover</div>
            <div style={{ padding: 18 }}>
              <span className="ck-badge" style={{ marginBottom: 10, fontSize: 10 }}>{n.cat.toUpperCase()}</span>
              <h3 className="ck-serif" style={{ fontSize: 18, lineHeight: 1.2, letterSpacing: "-0.015em", margin: "8px 0" }}>{n.title}</h3>
              <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }} className="ck-mono">{n.date} · {n.read}</div>
            </div>
          </div>
        ))}
      </div>
    </section>

    <PublicFooter />
  </div>
);


/* ── FAQ ── */
const FAQ = () => (
  <div className="ck" style={{ background: "var(--ck-bg)" }}>
    <PublicHeader />
    <section style={{ padding: "60px 36px 80px", maxWidth: 880, margin: "0 auto" }}>
      <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 10, textAlign: "center" }}>FAQ</div>
      <h1 className="ck-serif" style={{ fontSize: 52, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 14, textAlign: "center" }}>
        Vanliga frågor
      </h1>
      <p style={{ fontSize: 15, color: "var(--ck-ink-2)", maxWidth: 540, margin: "0 auto 40px", textAlign: "center" }}>
        Hittar du inte svaret? <a style={{ color: "var(--ck-primary)" }}>Kontakta oss</a>.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 28, justifyContent: "center" }}>
        {["Kom igång", "Compliance", "Säkerhet & GDPR", "Billing", "Tekniskt"].map((c, i) => (
          <button key={c} className={i === 0 ? "ck-btn" : "ck-btn ck-btn--secondary"} style={{ height: 30 }}>{c}</button>
        ))}
      </div>

      <div style={{ borderTop: "1px solid var(--ck-border)" }}>
        {[
          ["Är CareKompass ett journalsystem?", "Nej. CareKompass är ett ledningssystem. Behandlingsanteckningar (om aktiverat) är strukturerade och begränsade — riktig journal förs i godkänt system enligt PDL."],
          ["Vilken data hostas var?", "All data hostas inom EU på Lovable Cloud (Supabase). Storage med RLS, signerade URL:er för åtkomst, kryptering at-rest och in-transit.", true],
          ["Vad händer om vi inte aktiverar prenumeration efter trialen?", "Bolaget faller tillbaka till read-only-läge. Ni kan läsa allt men inte skapa nytt. Data bevaras minst 90 dagar."],
          ["Räknas konsulterande läkare som användare?", "Nej, consulting practitioners har egen kontotyp som inte räknas mot ert seat-count."],
          ["Hur fungerar inspector mode?", "Bolaget genererar en tidsbegränsad token (max 30 dagar, scope = bolag/klinik). Inspektören öppnar `/inspect/<token>` och får read-only-vy. Allt loggas i `inspection_views`."],
          ["Vilka roller finns?", "Hierarkiska roller (owner / manager / quality_manager / staff) på bolagsnivå + kapabilitetsflaggor (licensed_practitioner, hygiene_lead, medication_custodian, consulting). Branschspecifika subroller kan adderas."],
          ["Vad är compliance-score?", "Ett internt hjälpmedel för er kvalitetsansvariga, viktat över sju områden (dokument 15%, avvikelser 20%, hygien 20%, läkemedel 10%, ordinationer 15%, risk 10%, personal 10%). Inte ett myndighetsutlåtande."],
          ["Kan vi byta industry_template senare?", "Inte automatiskt — det kräver migrationsstöd från CK eftersom det påverkar terminologi och seeded data. Hör av er om behov uppstår."],
          ["Stödjer ni BankID?", "Avtalssignering och stark autentisering med BankID rullas ut i Fas 10. Fram tills dess används click-signering med tidsstämpel och actor-id."],
          ["Hur lagras audit-loggen?", "Append-only i `audit_logs`-tabell. Ingen UPDATE/DELETE tillåten via RLS. Retention 7 år (svensk bokföring + IVO-praxis)."],
        ].map(([q, a, expanded]) => (
          <div key={q} style={{ borderBottom: "1px solid var(--ck-border)", padding: "20px 0", display: expanded ? "block" : "flex", justifyContent: "space-between", alignItems: expanded ? "flex-start" : "center", cursor: "pointer" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{q}</div>
              {expanded && <div style={{ fontSize: 14, color: "var(--ck-ink-2)", lineHeight: 1.6, marginTop: 10 }}>{a}</div>}
            </div>
            <Icon name="chev-down" size={16} />
          </div>
        ))}
      </div>
    </section>
    <PublicFooter />
  </div>
);


/* ── STATUS page ── */
const StatusPage = () => (
  <div className="ck" style={{ background: "var(--ck-bg)" }}>
    <PublicHeader />
    <section style={{ padding: "60px 36px", maxWidth: 980, margin: "0 auto" }}>
      <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 8 }}>SYSTEM STATUS</div>
      <h1 className="ck-serif" style={{ fontSize: 44, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 16 }}>
        Allt på topp idag
      </h1>

      <div style={{ padding: "14px 18px", background: "var(--ck-success-soft)", borderRadius: 10, display: "flex", gap: 12, marginBottom: 32, border: "1px solid oklch(0.85 0.08 150)" }}>
        <span style={{ width: 28, height: 28, borderRadius: 999, background: "var(--ck-success)", color: "#fff", display: "grid", placeItems: "center" }}><Icon name="check" size={14} /></span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ck-success)" }}>All systems operational</div>
          <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }} className="ck-mono">Senaste check: 27 maj 2026 09:42 · uppdateras varje minut</div>
        </div>
      </div>

      {/* Components */}
      <div className="ck-card" style={{ marginBottom: 24 }}>
        {[
          ["TanStack Start Worker (Cloudflare)", "ok", "99.98%"],
          ["Supabase Postgres", "ok", "99.99%"],
          ["Supabase Storage", "ok", "99.97%"],
          ["Realtime / Channels", "ok", "99.92%"],
          ["Edge Functions (Stripe webhook)", "ok", "99.99%"],
          ["Edge Functions (Audit export)", "ok", "99.95%"],
          ["BankID-callback", "ok", "100%"],
          ["Lovable Cloud Email", "ok", "99.96%"],
        ].map(([name, st, up]) => (
          <div key={name} style={{ padding: "14px 20px", borderBottom: "1px solid var(--ck-divider)", display: "flex", alignItems: "center", gap: 14 }}>
            <span className="ck-dot ck-dot--ok" />
            <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{name}</div>
            <span style={{ fontSize: 12, color: "var(--ck-success)", fontWeight: 600 }}>Operational</span>
            <span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", width: 80, textAlign: "right" }}>{up} · 90d</span>
          </div>
        ))}
      </div>

      {/* Uptime grid */}
      <div className="ck-card" style={{ padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>90 dagars historik</div>
        <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 16 }}>Varje stapel = 1 dag</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(90, 1fr)", gap: 2 }}>
          {Array.from({ length: 90 }, (_, i) => {
            const incident = i === 17 || i === 51 || i === 78;
            return <div key={i} style={{ height: 36, borderRadius: 2, background: incident ? "var(--ck-warning)" : "var(--ck-success)" }} />;
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ck-ink-3)", marginTop: 8 }} className="ck-mono">
          <span>90d sedan</span><span>idag</span>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Senaste incidenter</h2>
        {[
          ["2026-05-04 14:22", "Realtime — försämring", "Resolved", "47 min påverkan", "minor"],
          ["2026-04-08 03:14", "Postgres connection-pool — slow queries", "Resolved", "12 min påverkan", "minor"],
          ["2026-03-12 09:10", "Storage upload — fel 502 (Cloudflare)", "Resolved", "4 min påverkan", "minor"],
        ].map(([ts, title, st, dur, sev]) => (
          <div key={ts} style={{ padding: "14px 0", borderBottom: "1px solid var(--ck-divider)", display: "flex", gap: 16 }}>
            <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", width: 140, flexShrink: 0 }}>{ts}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
              <div style={{ fontSize: 12, color: "var(--ck-ink-3)" }}>{dur}</div>
            </div>
            <span className="ck-badge ck-badge--ok">{st}</span>
          </div>
        ))}
      </div>
    </section>
    <PublicFooter />
  </div>
);


/* ── COOKIE CONSENT BANNER (overlay) ── */
const CookieConsent = () => (
  <div className="ck" style={{ background: "var(--ck-bg)", height: "100%", position: "relative", padding: 24 }}>
    {/* Faded landing in background */}
    <div style={{ position: "absolute", inset: 24, borderRadius: 12, overflow: "hidden", opacity: 0.4, pointerEvents: "none" }}>
      <PublicHeader />
      <section style={{ padding: "60px 36px" }}>
        <h1 className="ck-serif" style={{ fontSize: 56, lineHeight: 1 }}>Compliance som inte<br />stjäl din tid.</h1>
      </section>
    </div>

    {/* Banner */}
    <div style={{
      position: "absolute", bottom: 24, left: 24, right: 24,
      background: "var(--ck-surface)", border: "1px solid var(--ck-border)",
      borderRadius: 14, padding: 24,
      boxShadow: "var(--ck-shadow-pop)",
      display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 36,
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Icon name="leaf" size={16} />
          <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em" }}>COOKIES & INTEGRITET</div>
        </div>
        <h3 className="ck-serif" style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 10 }}>
          Vi använder bara cookies som behövs.
        </h3>
        <p style={{ fontSize: 13, color: "var(--ck-ink-2)", lineHeight: 1.5 }}>
          Allt utöver autentisering är opt-in. GA4 körs med Consent Mode v2 — ingen mätdata
          skickas till Google innan du sagt ja. Inga cookies körs i den inloggade appen.
          <a style={{ color: "var(--ck-primary)", textDecoration: "underline", marginLeft: 4 }}>Läs cookie-policyn</a>
        </p>
      </div>

      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
          {[
            { label: "Nödvändiga", desc: "Auth-session, vald klinik, samtyckesval. Krävs för drift.", on: true, locked: true },
            { label: "Funktionella + Analytiska", desc: "GA4 (Consent Mode v2), UX-preferenser. EU-aggregerat.", on: false },
            { label: "Marketing", desc: "Inga pixlar aktiva i v6.0 MVP — opt-in om vi adderar.", on: false },
          ].map(c => (
            <div key={c.label} style={{ padding: 12, border: "1px solid var(--ck-border)", borderRadius: 8, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  {c.label}
                  {c.locked && <span className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", background: "var(--ck-surface-sunken)", padding: "1px 6px", borderRadius: 4 }}>ALLTID PÅ</span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>{c.desc}</div>
              </div>
              <span style={{
                width: 36, height: 20, borderRadius: 999,
                background: c.on ? "var(--ck-primary)" : "var(--ck-border-strong)",
                position: "relative", flexShrink: 0,
                opacity: c.locked ? 0.6 : 1,
              }}>
                <span style={{ position: "absolute", width: 14, height: 14, borderRadius: 999, background: "#fff", top: 3, left: c.on ? 19 : 3 }} />
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="ck-btn ck-btn--ghost">Avvisa alla</button>
          <button className="ck-btn ck-btn--secondary">Spara mina val</button>
          <button className="ck-btn">Acceptera alla</button>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { ModulePage, News, FAQ, StatusPage, CookieConsent });
