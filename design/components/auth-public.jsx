/* Pricing page + Login + Onboarding wizard */

const Pricing = () => (
  <div className="ck" style={{ background: "var(--ck-bg)", paddingBottom: 60 }}>
    <PublicHeader />

    <section style={{ padding: "72px 36px 32px", textAlign: "center" }}>
      <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 12 }}>PRISER</div>
      <h1 className="ck-serif" style={{ fontSize: 56, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 16 }}>
        Betala per klinik.<br />Inte per pärm.
      </h1>
      <p style={{ fontSize: 16, color: "var(--ck-ink-2)", maxWidth: 560, margin: "0 auto" }}>
        Alla planer inkluderar GDPR-anpassad EU-hosting, audit-export, RLS-säkrade roller och 14 dagars trial.
        Konsulterande läkare räknas inte mot ditt seat-count.
      </p>
    </section>

    <section style={{ padding: "20px 36px 60px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, maxWidth: 1280, margin: "0 auto" }}>
        {[
          { name: "Trial", price: "0", per: "kr / 14 dagar", seats: "10 användare · 1 klinik", cta: "Starta trial", ctaStyle: "secondary", featured: false,
            features: ["Allt i Pro öppet", "Inget kort krävs", "Auto-fallback till read-only"] },
          { name: "Starter", price: "495", per: "kr / mån / klinik", seats: "3 användare · 1 klinik", cta: "Välj Starter", ctaStyle: "secondary", featured: false,
            features: ["Avvikelser", "Styrdokument", "Hygien (basic)", "Audit-log", "E-post-support"] },
          { name: "Pro", price: "1 295", per: "kr / mån / klinik", seats: "5 användare · 1 klinik", cta: "Välj Pro", ctaStyle: "primary", featured: true,
            features: ["Allt i Starter", "Läkemedel & batch", "Ordination & delegering", "Risk + Compliance Center", "Audit-export", "Chat-support"] },
          { name: "Enterprise", price: "Offert", per: "skalad pris", seats: "25+ användare · 5+ kliniker", cta: "Kontakta oss", ctaStyle: "secondary", featured: false,
            features: ["Allt i Pro", "BankID-signering", "BokaDirekt-integration", "Dedikerad SLA", "Custom integrationer"] },
        ].map(plan => (
          <div key={plan.name} className="ck-card" style={{
            padding: 24,
            border: plan.featured ? "2px solid var(--ck-primary)" : "1px solid var(--ck-border)",
            position: "relative",
            background: plan.featured ? "var(--ck-surface)" : "var(--ck-surface)",
          }}>
            {plan.featured && (
              <span className="ck-badge ck-badge--primary" style={{ position: "absolute", top: -10, left: 24 }}>POPULÄR</span>
            )}
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{plan.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
              <span className="ck-serif" style={{ fontSize: 40, fontWeight: 500, letterSpacing: "-0.03em" }}>{plan.price}</span>
              <span style={{ fontSize: 12, color: "var(--ck-ink-3)" }}>{plan.per}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--ck-ink-3)", marginBottom: 18 }}>{plan.seats}</div>
            <button className={`ck-btn ${plan.ctaStyle === "primary" ? "" : "ck-btn--secondary"}`} style={{ width: "100%", height: 38, justifyContent: "center", marginBottom: 18 }}>{plan.cta}</button>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--ck-ink-2)" }}>
                  <Icon name="check" size={14} /> {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    <section style={{ padding: "40px 36px 80px", maxWidth: 880, margin: "0 auto" }}>
      <h3 className="ck-serif" style={{ fontSize: 22, marginBottom: 18, textAlign: "center" }}>Vanliga frågor om pris</h3>
      {[
        ["Vad händer efter trialen?", "Bolaget fortsätter i read-only-läge tills ni väljer en plan. Data bevaras minst 90 dagar."],
        ["Räknas konsulterande läkare som användare?", "Nej. Konsulterande läkare har egen kontotyp som inte räknas mot ert seat-count."],
        ["Kan vi byta plan?", "Ja, när som helst. Stripe Customer Portal hanterar uppgradering, nedgradering och uppsägning."],
      ].map(([q, a]) => (
        <div key={q} style={{ padding: "16px 0", borderBottom: "1px solid var(--ck-border)" }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{q}</div>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>{a}</div>
        </div>
      ))}
    </section>

    <PublicFooter />
  </div>
);


/* ── LOGIN ── */
const Login = () => (
  <div className="ck" style={{ background: "var(--ck-bg)", height: "100%", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
    <div style={{ padding: "60px 60px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Logo size={28} />

      <div style={{ maxWidth: 380 }}>
        <h1 className="ck-serif" style={{ fontSize: 36, lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: 10 }}>
          Välkommen tillbaka.
        </h1>
        <p style={{ fontSize: 14, color: "var(--ck-ink-2)", marginBottom: 28 }}>
          Logga in på din klinik. Är du IVO-inspektör? <a style={{ color: "var(--ck-primary)", textDecoration: "underline" }}>Använd din inspector-token</a> istället.
        </p>

        <div style={{ marginBottom: 14 }}>
          <label className="ck-label">E-post</label>
          <input className="ck-input" defaultValue="toni@dermabeauty.se" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label className="ck-label">Lösenord</label>
            <a style={{ fontSize: 11, color: "var(--ck-primary)" }}>Glömt?</a>
          </div>
          <input className="ck-input" type="password" defaultValue="•••••••••••" />
        </div>

        <button className="ck-btn ck-btn--lg" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>Logga in</button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0", color: "var(--ck-ink-3)", fontSize: 11 }}>
          <hr className="ck-hr" style={{ flex: 1 }} />ELLER<hr className="ck-hr" style={{ flex: 1 }} />
        </div>

        <button className="ck-btn ck-btn--secondary" style={{ width: "100%", height: 40, justifyContent: "center" }}>
          <Icon name="shield" size={14} />Logga in med BankID
        </button>

        <p style={{ fontSize: 12, color: "var(--ck-ink-3)", marginTop: 24, textAlign: "center" }}>
          Ny här? <a style={{ color: "var(--ck-primary)", textDecoration: "underline" }}>Skapa konto</a>
        </p>
      </div>

      <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)" }}>v6.carekompass.se · EU-hostat · GDPR</div>
    </div>

    {/* Right: warm panel */}
    <div style={{
      background: "linear-gradient(160deg, var(--ck-primary) 0%, oklch(0.30 0.06 195) 100%)",
      color: "var(--ck-primary-foreground)",
      padding: "60px 60px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      position: "relative", overflow: "hidden",
    }}>
      <svg style={{ position: "absolute", right: -120, bottom: -100, opacity: 0.12 }} width="500" height="500" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="0.4" />
        <path d="M50 4 L54 50 L50 96 L46 50 Z" fill="currentColor" />
      </svg>

      <div className="ck-mono" style={{ fontSize: 11, letterSpacing: "0.08em", opacity: 0.7 }}>FRÅN PILOTKUNDEN</div>

      <div style={{ position: "relative" }}>
        <div className="ck-serif" style={{ fontSize: 30, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 24 }}>
          "Förra tillsynen tog tre dagar att förbereda. Den här genererade jag på 30 sekunder."
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="ck-avatar" style={{ background: "oklch(1 0 0 / 0.2)", color: "#fff" }}>AL</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Anna Lundqvist</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Verksamhetschef · Derma Beauty Östermalm</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);


/* ── ONBOARDING WIZARD ── */
const OnboardingStep = ({ n, label, active, done }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{
      width: 24, height: 24, borderRadius: 999,
      display: "grid", placeItems: "center",
      background: done ? "var(--ck-primary)" : active ? "var(--ck-primary-soft)" : "var(--ck-surface-sunken)",
      color: done ? "var(--ck-primary-foreground)" : active ? "var(--ck-primary)" : "var(--ck-ink-3)",
      fontSize: 11, fontWeight: 600,
      border: active ? "1px solid var(--ck-primary)" : "1px solid var(--ck-border)",
    }}>
      {done ? <Icon name="check" size={12} /> : n}
    </div>
    <span style={{ fontSize: 12, color: active ? "var(--ck-ink)" : done ? "var(--ck-ink-2)" : "var(--ck-ink-3)", fontWeight: active ? 600 : 500 }}>{label}</span>
  </div>
);

const Onboarding = () => (
  <div className="ck" style={{ background: "var(--ck-bg)", height: "100%", display: "flex", flexDirection: "column" }}>
    {/* Slim header */}
    <header style={{ height: 60, borderBottom: "1px solid var(--ck-border)", background: "var(--ck-surface)", display: "flex", alignItems: "center", padding: "0 28px", justifyContent: "space-between" }}>
      <Logo />
      <div style={{ fontSize: 12, color: "var(--ck-ink-3)" }}>Behöver du hjälp? <a style={{ color: "var(--ck-primary)" }}>support@carekompass.se</a></div>
    </header>

    {/* Progress rail */}
    <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--ck-border)", background: "var(--ck-surface)" }}>
      <div style={{ display: "flex", gap: 28, alignItems: "center", maxWidth: 880, margin: "0 auto" }}>
        <OnboardingStep n={1} label="Konto" done />
        <div style={{ flex: 1, height: 1, background: "var(--ck-primary)" }} />
        <OnboardingStep n={2} label="Bolag" done />
        <div style={{ flex: 1, height: 1, background: "var(--ck-primary)" }} />
        <OnboardingStep n={3} label="Bransch" active />
        <div style={{ flex: 1, height: 1, background: "var(--ck-border)" }} />
        <OnboardingStep n={4} label="Plan" />
        <div style={{ flex: 1, height: 1, background: "var(--ck-border)" }} />
        <OnboardingStep n={5} label="Klinik" />
        <div style={{ flex: 1, height: 1, background: "var(--ck-border)" }} />
        <OnboardingStep n={6} label="Avtal" />
      </div>
    </div>

    {/* Body */}
    <div style={{ flex: 1, padding: "40px 28px", overflow: "hidden" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 8 }}>STEG 3 AV 6</div>
        <h1 className="ck-serif" style={{ fontSize: 34, lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: 8 }}>
          Vilken bransch är ni i?
        </h1>
        <p style={{ fontSize: 14, color: "var(--ck-ink-2)", marginBottom: 28, maxWidth: 580 }}>
          Vi anpassar terminologi, default-mallar och hygienchecklistor efter er bransch.
          Detta går inte att ändra efteråt utan migrationsstöd — välj noga.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {[
            { code: "estetisk_injektion", name: "Estetisk injektion", desc: "Botox, fillers, skinboosters, PRP, hyalase", reg: "IVO", selected: true, terms: "\"Patient\" · \"Ordination\" · \"Behandlingsanteckning\"" },
            { code: "estetisk_kirurgi", name: "Estetisk kirurgi", desc: "Operationsverksamhet enligt lag 2021:363", reg: "IVO", terms: "\"Patient\" · \"Operation\"" },
            { code: "tandvard_estetik", name: "Tandvård · estetik", desc: "Tandblekning, bonding, ortodonti", reg: "IVO + Socialstyrelsen", terms: "\"Patient\" · \"Behandling\"" },
            { code: "fotvard", name: "Medicinsk fotvård", desc: "Nagelvård, diabetesfot, ortonyxi", reg: "Miljöförvaltningen + IVO", terms: "\"Klient\" · \"Behandlingsplan\"" },
            { code: "piercing_tatuering", name: "Piercing & tatuering", desc: "Tatuering, piercing, smycksbyte", reg: "Miljöförvaltningen", terms: "\"Kund\" · \"Behandlingsprotokoll\"" },
            { code: "klinikkedja", name: "Klinikkedja (multi-bransch)", desc: "Branschen sätts per klinik", reg: "Beror på bransch", terms: "Per klinik" },
          ].map(b => (
            <div key={b.code} style={{
              padding: 18, borderRadius: 10,
              border: b.selected ? "2px solid var(--ck-primary)" : "1px solid var(--ck-border)",
              background: b.selected ? "var(--ck-primary-soft)" : "var(--ck-surface)",
              cursor: "pointer", position: "relative",
            }}>
              {b.selected && <div style={{ position: "absolute", top: 14, right: 14, width: 20, height: 20, borderRadius: 999, background: "var(--ck-primary)", color: "var(--ck-primary-foreground)", display: "grid", placeItems: "center" }}><Icon name="check" size={12} /></div>}
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{b.name}</div>
              <div style={{ fontSize: 12, color: "var(--ck-ink-2)", marginBottom: 10 }}>{b.desc}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <span className="ck-badge"><Icon name="flag" size={9} />{b.reg}</span>
                <span className="ck-badge" style={{ fontFamily: "var(--ck-font-mono)", fontSize: 10 }}>{b.terms}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
          <button className="ck-btn ck-btn--secondary">← Tillbaka</button>
          <button className="ck-btn ck-btn--lg">Fortsätt till plan<Icon name="arrow-r" size={14} /></button>
        </div>

        <div style={{ marginTop: 20, padding: "12px 14px", borderRadius: 8, background: "var(--ck-info-soft)", color: "var(--ck-info)", fontSize: 12, display: "flex", gap: 10 }}>
          <Icon name="circle-q" size={14} />
          <div style={{ color: "var(--ck-ink-2)" }}>
            <strong style={{ color: "var(--ck-info)" }}>Heads-up:</strong> En kvalitetsansvarig måste utses innan onboarding kan slutföras. Du gör det i steg 5.
          </div>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { Pricing, Login, Onboarding });
