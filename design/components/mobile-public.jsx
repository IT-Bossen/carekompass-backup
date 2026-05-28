/* MOBILE PUBLIC — Landing, Pricing, Module, News, FAQ, Status */

const MPublicHeader = () => (
  <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--ck-surface)", borderBottom: "1px solid var(--ck-border)", flexShrink: 0 }}>
    <Logo />
    <button style={{ background: "transparent", border: 0, padding: 8, color: "var(--ck-ink-2)" }}>
      <Icon name="menu" size={22} />
    </button>
  </div>
);

const MPublicFooter = () => (
  <div style={{ padding: "28px 18px 22px", borderTop: "1px solid var(--ck-border)", background: "var(--ck-surface)" }}>
    <Logo />
    <p style={{ fontSize: 12, color: "var(--ck-ink-3)", marginTop: 12, lineHeight: 1.5 }}>
      Ledningssystem för svenska kliniker enligt SOSFS 2011:9. EU-hostad data.
    </p>
    <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
      <span className="ck-badge ck-badge--ok" style={{ fontSize: 10 }}>GDPR-anpassad</span>
      <span className="ck-badge" style={{ fontSize: 10 }}>EU-hostad</span>
    </div>
    <hr className="ck-hr" style={{ margin: "20px 0" }} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, fontSize: 12, color: "var(--ck-ink-2)" }}>
      {[
        ["Produkt", ["Avvikelser", "Dokument", "Compliance"]],
        ["Företag", ["Om oss", "Nyheter", "Kontakt"]],
        ["Resurser", ["GDPR", "IVO", "Säkerhet"]],
        ["Juridik", ["Villkor", "Integritet", "DPA"]],
      ].map(([t, items]) => (
        <div key={t}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ck-ink-3)", marginBottom: 8 }}>{t}</div>
          {items.map(i => <div key={i} style={{ padding: "3px 0" }}>{i}</div>)}
        </div>
      ))}
    </div>
    <div style={{ marginTop: 22, fontSize: 11, color: "var(--ck-ink-3)" }} className="ck-mono">© 2026 CareKompass AB · v6.0</div>
  </div>
);

/* ── MOBILE LANDING ── */
const MLanding = () => (
  <div className="ck" style={{ width: "100%", height: "100%", overflow: "hidden", background: "var(--ck-bg)", display: "flex", flexDirection: "column" }}>
    <MStatusBar />
    <MPublicHeader />
    <div style={{ flex: 1, overflow: "hidden" }}>
      {/* Hero */}
      <section style={{ padding: "36px 22px 28px", position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", right: -80, top: 0, opacity: 0.06 }} width="280" height="280" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M50 4 L54 50 L50 96 L46 50 Z" fill="currentColor" />
        </svg>

        <span className="ck-badge ck-badge--primary"><Icon name="compass" size={10} />v6.0 — öppen pilot</span>
        <h1 className="ck-serif" style={{ fontSize: 38, lineHeight: 1, letterSpacing: "-0.03em", marginTop: 16, marginBottom: 14 }}>
          Compliance som inte stjäl din tid.
        </h1>
        <p style={{ fontSize: 14, color: "var(--ck-ink-2)", lineHeight: 1.5, marginBottom: 24 }}>
          Ledningssystemet som låter dig äga ditt kvalitetsarbete — avvikelser, läkemedel, hygien
          och delegeringar på en plats, IVO-spårbart från dag ett.
        </p>

        <MPrimaryAction label="Starta 14-dagars trial" icon="arrow-r" large />
        <div style={{ height: 10 }} />
        <MSecondaryAction label="Boka 20-min demo" />

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 18, fontSize: 12, color: "var(--ck-ink-3)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="check" size={14} />Inget kort krävs</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="check" size={14} />Datan stannar i EU</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="check" size={14} />Audit-export på 30s</span>
        </div>
      </section>

      {/* App preview */}
      <section style={{ padding: "0 22px 32px" }}>
        <div style={{ borderRadius: 14, border: "1px solid var(--ck-border)", background: "var(--ck-surface)", overflow: "hidden", boxShadow: "var(--ck-shadow-2)" }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--ck-border)", display: "flex", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "oklch(0.85 0.06 25)" }} />
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "oklch(0.85 0.06 80)" }} />
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "oklch(0.85 0.06 150)" }} />
          </div>
          <div style={{ padding: 16, background: "var(--ck-bg)" }}>
            <div className="ck-mono" style={{ fontSize: 9, color: "var(--ck-ink-3)" }}>COMPLIANCE · MAJ</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
              <span className="ck-tnum" style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em" }}>87</span>
              <span style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>/100</span>
              <span className="ck-badge ck-badge--ok" style={{ marginLeft: 6, fontSize: 9 }}>GRÖNT</span>
            </div>
            <div style={{ marginTop: 12, height: 4, borderRadius: 999, background: "var(--ck-surface-sunken)", overflow: "hidden" }}>
              <div style={{ width: "87%", height: "100%", background: "var(--ck-primary)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Modules grid */}
      <section style={{ padding: "32px 22px", background: "var(--ck-surface)" }}>
        <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 10 }}>MODULER</div>
        <h2 className="ck-serif" style={{ fontSize: 28, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 24 }}>
          Allt på ett ställe, ingenting i vägen.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["alert", "Avvikelser"], ["doc", "Dokument"],
            ["pill", "Läkemedel"], ["stethoscope", "Ordination"],
            ["sparkle", "Hygien"], ["scale", "Risk"],
            ["shield", "Compliance"], ["graduation", "Personal"],
          ].map(([icon, name]) => (
            <div key={name} style={{ padding: 14, border: "1px solid var(--ck-border)", borderRadius: 12, background: "var(--ck-surface)" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--ck-primary-soft)", color: "var(--ck-primary)", display: "grid", placeItems: "center", marginBottom: 8 }}>
                <Icon name={icon} size={16} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Positionering */}
      <section style={{ padding: "40px 22px", textAlign: "center" }}>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 10 }}>VAR VI DRAR LINJEN</div>
        <h2 className="ck-serif" style={{ fontSize: 30, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 14 }}>
          Du äger ditt kvalitetsarbete.<br />Vi är verktyget.
        </h2>
        <p style={{ fontSize: 13, color: "var(--ck-ink-2)", lineHeight: 1.55 }}>
          CareKompass tar aldrig över vårdgivarens lagstadgade ansvar. Vi ger strukturen,
          spårbarheten och tidsstämplarna.
        </p>
      </section>

      {/* CTA */}
      <section style={{ padding: "20px 22px 40px" }}>
        <div style={{
          padding: 28, borderRadius: 16, textAlign: "center",
          background: "linear-gradient(180deg, var(--ck-primary) 0%, oklch(0.32 0.06 175) 100%)",
          color: "var(--ck-primary-foreground)",
        }}>
          <h3 className="ck-serif" style={{ fontSize: 28, lineHeight: 1, letterSpacing: "-0.025em", marginBottom: 12 }}>
            Sov bättre inför nästa tillsyn.
          </h3>
          <p style={{ fontSize: 13, opacity: 0.85, marginBottom: 20 }}>14 dagar gratis. Allt i Pro öppet.</p>
          <button className="ck-btn ck-btn--lg" style={{ background: "var(--ck-surface)", color: "var(--ck-ink)", height: 48, width: "100%", justifyContent: "center" }}>
            Starta trial<Icon name="arrow-r" size={16} />
          </button>
        </div>
      </section>

      <MPublicFooter />
    </div>
  </div>
);

/* ── MOBILE PRICING ── */
const MPricing = () => (
  <div className="ck" style={{ width: "100%", height: "100%", overflow: "hidden", background: "var(--ck-bg)", display: "flex", flexDirection: "column" }}>
    <MStatusBar />
    <MPublicHeader />
    <div style={{ flex: 1, overflow: "hidden" }}>
      <section style={{ padding: "32px 22px 22px", textAlign: "center" }}>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 8 }}>PRISER</div>
        <h1 className="ck-serif" style={{ fontSize: 36, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 12 }}>
          Betala per klinik.<br />Inte per pärm.
        </h1>
        <p style={{ fontSize: 13, color: "var(--ck-ink-2)", lineHeight: 1.5 }}>
          14 dagars trial · alla planer EU-hostat · konsulter räknas inte
        </p>
      </section>

      <section style={{ padding: "0 22px 40px", display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { name: "Trial", price: "0 kr", per: "14 dagar", cta: "Starta trial" },
          { name: "Starter", price: "495 kr", per: "/ mån / klinik", cta: "Välj Starter", feats: ["Avvikelser", "Dokument", "Hygien (basic)", "3 användare"] },
          { name: "Pro", price: "1 295 kr", per: "/ mån / klinik", cta: "Välj Pro", featured: true, feats: ["Allt i Starter", "Läkemedel & batch", "Ordination & delegering", "Risk + Compliance Center", "5 användare"] },
          { name: "Enterprise", price: "Offert", per: "skalad pris", cta: "Kontakta oss", feats: ["BankID-signering", "BokaDirekt", "Dedikerad SLA"] },
        ].map(p => (
          <div key={p.name} className="ck-card" style={{ padding: 20, border: p.featured ? "2px solid var(--ck-primary)" : "1px solid var(--ck-border)", position: "relative" }}>
            {p.featured && <span className="ck-badge ck-badge--primary" style={{ position: "absolute", top: -8, left: 18 }}>POPULÄR</span>}
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 14 }}>
              <span className="ck-serif" style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.03em" }}>{p.price}</span>
              <span style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{p.per}</span>
            </div>
            <button className={`ck-btn ${p.featured ? "" : "ck-btn--secondary"}`} style={{ width: "100%", justifyContent: "center", height: 42, marginBottom: p.feats ? 14 : 0 }}>{p.cta}</button>
            {p.feats && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {p.feats.map(f => <div key={f} style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--ck-ink-2)" }}><Icon name="check" size={14} />{f}</div>)}
              </div>
            )}
          </div>
        ))}
      </section>

      <MPublicFooter />
    </div>
  </div>
);

/* ── MOBILE MODULE PAGE ── */
const MModulePage = () => (
  <div className="ck" style={{ width: "100%", height: "100%", overflow: "hidden", background: "var(--ck-bg)", display: "flex", flexDirection: "column" }}>
    <MStatusBar />
    <MPublicHeader />
    <div style={{ flex: 1, overflow: "hidden" }}>
      <section style={{ padding: "28px 22px 20px", textAlign: "center" }}>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 8 }}>MODUL · AVVIKELSEHANTERING</div>
        <h1 className="ck-serif" style={{ fontSize: 34, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 14 }}>
          Avvikelsen som blev en lärdom.
        </h1>
        <p style={{ fontSize: 13, color: "var(--ck-ink-2)", lineHeight: 1.5, marginBottom: 22 }}>
          Strukturerad rapportering, SLA-klocka per severity, Lex Maria-checklista,
          full audit-trail från rapport till stängning.
        </p>
        <MPrimaryAction label="Starta trial" />
      </section>

      <section style={{ padding: "0 22px 32px" }}>
        <div className="ck-img-ph" style={{ height: 200 }}>screenshot · detalj</div>
      </section>

      <section style={{ padding: "8px 22px 28px", background: "var(--ck-surface)" }}>
        <h2 className="ck-serif" style={{ fontSize: 24, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 18, marginTop: 18 }}>
          Vad du får
        </h2>
        {[
          { icon: "alert", title: "Severity → SLA", body: "Kritisk 24h · Hög 7d · Medel 30d · Låg 90d. SLA-klocka tickar." },
          { icon: "flag", title: "Lex Maria-tröskel", body: "Vid kritisk severity erbjuds checklista. IVO-formuläret förbereds." },
          { icon: "users", title: "Tilldelning + bevakare", body: "Ansvarig + bevakare, status-byte triggar notiser." },
          { icon: "clock", title: "Tidslinje + audit", body: "Append-only med request_id. Före/efter-värden." },
          { icon: "download", title: "Export till tillsyn", body: "PDF-paket på 30s. Filtrera period + severity." },
        ].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--ck-divider)" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--ck-primary-soft)", color: "var(--ck-primary)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name={f.icon} size={18} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "var(--ck-ink-2)", lineHeight: 1.5 }}>{f.body}</div>
            </div>
          </div>
        ))}
      </section>

      <section style={{ padding: "28px 22px 40px" }}>
        <div className="ck-card" style={{ padding: 22, textAlign: "center" }}>
          <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)" }}>INGÅR I</div>
          <div className="ck-serif" style={{ fontSize: 22, margin: "8px 0 14px" }}>Starter · Pro · Enterprise</div>
          <MPrimaryAction label="Jämför planer" icon="arrow-r" />
        </div>
      </section>

      <MPublicFooter />
    </div>
  </div>
);

/* ── MOBILE NEWS ── */
const MNews = () => (
  <div className="ck" style={{ width: "100%", height: "100%", overflow: "hidden", background: "var(--ck-bg)", display: "flex", flexDirection: "column" }}>
    <MStatusBar />
    <MPublicHeader />
    <div style={{ flex: 1, overflow: "hidden" }}>
      <section style={{ padding: "24px 22px 18px" }}>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 8 }}>NYHETER</div>
        <h1 className="ck-serif" style={{ fontSize: 36, lineHeight: 1, letterSpacing: "-0.03em" }}>
          Vad händer i CareKompass
        </h1>
        <div style={{ display: "flex", gap: 6, marginTop: 18, overflow: "hidden" }}>
          {["Alla", "Produkt", "Bransch", "Compliance"].map((c, i) => (
            <button key={c} className={i === 0 ? "ck-btn" : "ck-btn ck-btn--secondary"} style={{ height: 30, flexShrink: 0 }}>{c}</button>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 22px 28px" }}>
        {/* Featured */}
        <div className="ck-card" style={{ overflow: "hidden", marginBottom: 16 }}>
          <div className="ck-img-ph" style={{ height: 160, borderRadius: 0, border: 0 }}>cover</div>
          <div style={{ padding: 18 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              <span className="ck-badge ck-badge--primary" style={{ fontSize: 10 }}>PRODUKT</span>
              <span className="ck-badge" style={{ fontSize: 10 }}>FEATURED</span>
            </div>
            <h3 className="ck-serif" style={{ fontSize: 22, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 8 }}>
              CareKompass v6.0 — öppen pilot
            </h3>
            <p style={{ fontSize: 12, color: "var(--ck-ink-2)", lineHeight: 1.5, marginBottom: 10 }}>
              Ny stack, full audit-trail, consulting-inbox och inspector mode för IVO.
            </p>
            <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>2026-05-26 · 6 min</div>
          </div>
        </div>

        {/* List */}
        {[
          ["Compliance", "Lex Maria på 30 sekunder", "2026-05-22"],
          ["Bransch", "IVO:s tillsynspraxis 2026", "2026-05-14"],
          ["Produkt", "Cross-tenant inbox för konsulter", "2026-05-08"],
          ["Bransch", "Hyalase-protokoll vid komplikation", "2026-04-30"],
          ["Produkt", "Inspector mode — IVO via token", "2026-04-22"],
        ].map(([cat, title, date]) => (
          <div key={title} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid var(--ck-divider)" }}>
            <div className="ck-img-ph" style={{ width: 88, height: 70, flexShrink: 0, fontSize: 9 }}>cover</div>
            <div style={{ flex: 1 }}>
              <span className="ck-badge" style={{ fontSize: 9, marginBottom: 6 }}>{cat.toUpperCase()}</span>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, marginTop: 4 }}>{title}</div>
              <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", marginTop: 4 }}>{date}</div>
            </div>
          </div>
        ))}
      </section>

      <MPublicFooter />
    </div>
  </div>
);

/* ── MOBILE FAQ ── */
const MFAQ = () => (
  <div className="ck" style={{ width: "100%", height: "100%", overflow: "hidden", background: "var(--ck-bg)", display: "flex", flexDirection: "column" }}>
    <MStatusBar />
    <MPublicHeader />
    <div style={{ flex: 1, overflow: "hidden" }}>
      <section style={{ padding: "24px 22px 14px", textAlign: "center" }}>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 8 }}>FAQ</div>
        <h1 className="ck-serif" style={{ fontSize: 34, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 8 }}>
          Vanliga frågor
        </h1>
      </section>

      <section style={{ padding: "12px 22px 6px", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 6, overflow: "hidden" }}>
          {["Kom igång", "Compliance", "Säkerhet", "Billing", "Tekniskt"].map((c, i) => (
            <button key={c} className={i === 0 ? "ck-btn" : "ck-btn ck-btn--secondary"} style={{ height: 30, flexShrink: 0, fontSize: 12 }}>{c}</button>
          ))}
        </div>
      </section>

      <section style={{ padding: "8px 22px 32px", borderTop: "1px solid var(--ck-border)", marginTop: 12 }}>
        {[
          ["Är CareKompass ett journalsystem?", "Nej. Behandlingsanteckningar är strukturerade och begränsade — riktig journal förs i godkänt PDL-system."],
          ["Vilken data hostas var?", "All data inom EU på Lovable Cloud (Supabase). RLS, signerade URL:er, kryptering at-rest/in-transit.", true],
          ["Vad händer efter trialen?", "Bolaget faller tillbaka till read-only. Data bevaras minst 90 dagar."],
          ["Räknas konsulterande läkare som användare?", "Nej — egen kontotyp som inte räknas mot ert seat-count."],
          ["Hur fungerar inspector mode?", "Tidsbegränsad token, read-only via /inspect/<token>, allt loggas i inspection_views."],
          ["Vad är compliance-score?", "Internt hjälpmedel viktat över 7 områden. Inte ett myndighetsutlåtande."],
          ["Stödjer ni BankID?", "Avtalssignering och stark auth via BankID rullas ut i Fas 10."],
        ].map(([q, a, expanded]) => (
          <div key={q} style={{ borderBottom: "1px solid var(--ck-border)", padding: "16px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{q}</div>
              <Icon name={expanded ? "chev-down" : "chev-right"} size={16} />
            </div>
            {expanded && <div style={{ fontSize: 12, color: "var(--ck-ink-2)", lineHeight: 1.55, marginTop: 8 }}>{a}</div>}
          </div>
        ))}
      </section>

      <MPublicFooter />
    </div>
  </div>
);

/* ── MOBILE STATUS ── */
const MStatusPage = () => (
  <div className="ck" style={{ width: "100%", height: "100%", overflow: "hidden", background: "var(--ck-bg)", display: "flex", flexDirection: "column" }}>
    <MStatusBar />
    <MPublicHeader />
    <div style={{ flex: 1, overflow: "hidden" }}>
      <section style={{ padding: "24px 22px 14px" }}>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 6 }}>SYSTEM STATUS</div>
        <h1 className="ck-serif" style={{ fontSize: 30, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 18 }}>
          Allt på topp idag
        </h1>

        <div style={{ padding: "14px 16px", borderRadius: 12, background: "var(--ck-success-soft)", display: "flex", gap: 12, alignItems: "center", border: "1px solid oklch(0.85 0.08 150)" }}>
          <span style={{ width: 28, height: 28, borderRadius: 999, background: "var(--ck-success)", color: "#fff", display: "grid", placeItems: "center" }}><Icon name="check" size={14} /></span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ck-success)" }}>All systems operational</div>
            <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-2)" }}>27 maj 09:42</div>
          </div>
        </div>
      </section>

      <section style={{ padding: "12px 22px 24px" }}>
        <div className="ck-card" style={{ overflow: "hidden" }}>
          {[
            ["TanStack Worker", "99.98%"],
            ["Postgres", "99.99%"],
            ["Storage", "99.97%"],
            ["Realtime", "99.92%"],
            ["Edge: Stripe webhook", "99.99%"],
            ["BankID-callback", "100%"],
            ["Lovable Email", "99.96%"],
          ].map(([n, u]) => (
            <div key={n} style={{ padding: "12px 16px", borderBottom: "1px solid var(--ck-divider)", display: "flex", alignItems: "center", gap: 12 }}>
              <span className="ck-dot ck-dot--ok" />
              <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{n}</div>
              <span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-success)", fontWeight: 600 }}>{u}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 22px 32px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>90 dagar — uptime</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(45, 1fr)", gap: 2 }}>
          {Array.from({ length: 90 }, (_, i) => {
            const incident = i === 17 || i === 51 || i === 78;
            return <div key={i} style={{ height: 22, borderRadius: 2, background: incident ? "var(--ck-warning)" : "var(--ck-success)" }} />;
          })}
        </div>
      </section>

      <MPublicFooter />
    </div>
  </div>
);

Object.assign(window, { MLanding, MPricing, MModulePage, MNews, MFAQ, MStatusPage });
