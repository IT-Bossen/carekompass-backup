/* MOBILE AUTH — Login, Onboarding wizard */

const MLogin = () => (
  <div className="ck" style={{ width: "100%", height: "100%", overflow: "hidden", background: "var(--ck-bg)", display: "flex", flexDirection: "column" }}>
    <MStatusBar />
    <div style={{ flex: 1, padding: "32px 22px 22px", display: "flex", flexDirection: "column" }}>
      <Logo size={26} />

      <div style={{ marginTop: 48 }}>
        <h1 className="ck-serif" style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: 8 }}>
          Välkommen tillbaka.
        </h1>
        <p style={{ fontSize: 14, color: "var(--ck-ink-2)", marginBottom: 28 }}>
          Logga in på din klinik. IVO-inspektör? <a style={{ color: "var(--ck-primary)", textDecoration: "underline" }}>Använd token</a>.
        </p>

        <label className="ck-label">E-post</label>
        <input className="ck-input" defaultValue="toni@dermabeauty.se" style={{ height: 48, fontSize: 15, marginBottom: 16, borderRadius: 10 }} />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label className="ck-label">Lösenord</label>
          <a style={{ fontSize: 12, color: "var(--ck-primary)" }}>Glömt?</a>
        </div>
        <input className="ck-input" type="password" defaultValue="•••••••••••" style={{ height: 48, fontSize: 15, marginBottom: 20, borderRadius: 10 }} />

        <MPrimaryAction label="Logga in" large />

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0", color: "var(--ck-ink-3)", fontSize: 11 }}>
          <hr className="ck-hr" style={{ flex: 1 }} />ELLER<hr className="ck-hr" style={{ flex: 1 }} />
        </div>

        <MSecondaryAction label="Logga in med BankID" icon="shield" />
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--ck-ink-3)" }}>
          Ny här? <a style={{ color: "var(--ck-primary)", textDecoration: "underline", fontWeight: 500 }}>Skapa konto</a>
        </p>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", marginTop: 16 }}>v6.carekompass.se · EU · GDPR</div>
      </div>
    </div>
  </div>
);

/* ── ONBOARDING (mobile, step 3 of 6) ── */
const MOnboarding = () => (
  <div className="ck" style={{ width: "100%", height: "100%", overflow: "hidden", background: "var(--ck-bg)", display: "flex", flexDirection: "column" }}>
    <MStatusBar />

    {/* Header */}
    <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--ck-border)", background: "var(--ck-surface)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button style={{ background: "transparent", border: 0, padding: 4, color: "var(--ck-ink-2)", display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name="chev-down" size={20} style={{ transform: "rotate(90deg)" }} />
        </button>
        <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>STEG 3 / 6</div>
        <button style={{ background: "transparent", border: 0, padding: 4, color: "var(--ck-ink-3)", fontSize: 12 }}>Hjälp</button>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 4 }}>
        {[true, true, "active", false, false, false].map((s, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 999,
            background: s === true ? "var(--ck-primary)"
                      : s === "active" ? "var(--ck-primary)"
                      : "var(--ck-surface-sunken)",
            opacity: s === "active" ? 1 : s === true ? 1 : 1,
          }} />
        ))}
      </div>
    </div>

    {/* Body */}
    <div style={{ flex: 1, overflow: "hidden", padding: "22px 18px" }}>
      <h1 className="ck-serif" style={{ fontSize: 28, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 8 }}>
        Vilken bransch är ni i?
      </h1>
      <p style={{ fontSize: 13, color: "var(--ck-ink-2)", marginBottom: 20, lineHeight: 1.5 }}>
        Vi anpassar terminologi, mallar och hygienchecklistor. Kan inte ändras efteråt.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { name: "Estetisk injektion", reg: "IVO", selected: true },
          { name: "Estetisk kirurgi", reg: "IVO · lag 2021:363" },
          { name: "Tandvård · estetik", reg: "IVO + Socialst." },
          { name: "Medicinsk fotvård", reg: "Miljöförv. + IVO" },
          { name: "Piercing & tatuering", reg: "Miljöförvaltningen" },
          { name: "Klinikkedja", reg: "Per klinik" },
        ].map(b => (
          <div key={b.name} style={{
            padding: 16, borderRadius: 12,
            border: b.selected ? "2px solid var(--ck-primary)" : "1px solid var(--ck-border)",
            background: b.selected ? "var(--ck-primary-soft)" : "var(--ck-surface)",
            display: "flex", alignItems: "center", gap: 12, minHeight: 56,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{b.name}</div>
              <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginTop: 2 }}>
                <Icon name="flag" size={10} /> {b.reg}
              </div>
            </div>
            <div style={{
              width: 22, height: 22, borderRadius: 999,
              border: b.selected ? 0 : "1.5px solid var(--ck-border-strong)",
              background: b.selected ? "var(--ck-primary)" : "transparent",
              color: "#fff", display: "grid", placeItems: "center",
            }}>{b.selected && <Icon name="check" size={12} />}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: "var(--ck-info-soft)", display: "flex", gap: 10 }}>
        <Icon name="circle-q" size={14} />
        <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>
          En kvalitetsansvarig måste utses i steg 5 innan onboardingen kan slutföras.
        </div>
      </div>
    </div>

    {/* Sticky bottom actions */}
    <div style={{ padding: "14px 18px 24px", background: "var(--ck-surface)", borderTop: "1px solid var(--ck-border)" }}>
      <MPrimaryAction label="Fortsätt till plan" icon="arrow-r" large />
    </div>
  </div>
);

Object.assign(window, { MLogin, MOnboarding });
