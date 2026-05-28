/* CareKompass — Design System overview card */

const Swatch = ({ name, value, cssVar, dark }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <div style={{
      height: 64, borderRadius: 8,
      background: `var(${cssVar})`,
      border: "1px solid var(--ck-border)",
    }} />
    <div>
      <div style={{ fontSize: 12, fontWeight: 600 }}>{name}</div>
      <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)" }}>{value}</div>
    </div>
  </div>
);

const TypeRow = ({ label, sample, style }) => (
  <div style={{ display: "flex", alignItems: "baseline", borderBottom: "1px solid var(--ck-divider)", padding: "12px 0" }}>
    <div style={{ width: 160, color: "var(--ck-ink-3)", fontSize: 11 }} className="ck-mono">{label}</div>
    <div style={{ flex: 1, ...style }}>{sample}</div>
  </div>
);

const DesignSystem = () => (
  <div className="ck" style={{ padding: 36, background: "var(--ck-surface)", height: "100%", overflow: "hidden" }}>
    {/* Header */}
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
      <div>
        <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 6, letterSpacing: "0.06em" }}>
          DESIGN SYSTEM · v6.0
        </div>
        <h1 className="ck-serif" style={{ fontSize: 42, lineHeight: 1, marginBottom: 8 }}>
          Klinisk, varmt neutral, exporterbar.
        </h1>
        <p style={{ fontSize: 15, color: "var(--ck-ink-2)", maxWidth: 640 }}>
          Anchors trust without screaming. Dampened forest-teal som primärfärg —
          en lugn, läkande ton som lämnar utrymme för status-färger att betyda något.
          Hög densitet, tydlig hierarki, monospace för data och spårbarhet.
        </p>
      </div>
      <Logo size={28} />
    </div>

    <hr className="ck-hr" style={{ marginBottom: 24 }} />

    {/* Two-column grid */}
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 36 }}>
      {/* Colors */}
      <div>
        <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 12, letterSpacing: "0.06em" }}>01 / FÄRG</div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 8, fontWeight: 500 }}>Primär · Forest-teal</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <Swatch name="Primary" value="0.42 0.06 175" cssVar="--ck-primary" />
            <Swatch name="Hover" value="0.36 0.07 175" cssVar="--ck-primary-hover" />
            <Swatch name="Soft" value="0.95 0.025 175" cssVar="--ck-primary-soft" />
            <Swatch name="On-primary" value="0.985 / 175" cssVar="--ck-primary-foreground" />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 8, fontWeight: 500 }}>Status</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <Swatch name="Success" value="0.55 0.13 152" cssVar="--ck-success" />
            <Swatch name="Warning" value="0.72 0.14 75" cssVar="--ck-warning" />
            <Swatch name="Danger" value="0.55 0.17 25" cssVar="--ck-danger" />
            <Swatch name="Info" value="0.55 0.13 235" cssVar="--ck-info" />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 8, fontWeight: 500 }}>Yta & bläck (warm neutrals)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <Swatch name="Bg" value="0.985 / 80" cssVar="--ck-bg" />
            <Swatch name="Surface" value="1.0 / 0" cssVar="--ck-surface" />
            <Swatch name="Border" value="0.925 / 70" cssVar="--ck-border" />
            <Swatch name="Ink" value="0.22 / 60" cssVar="--ck-ink" />
          </div>
        </div>
      </div>

      {/* Type */}
      <div>
        <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 12, letterSpacing: "0.06em" }}>02 / TYPOGRAFI</div>
        <div>
          <TypeRow label="Display · Newsreader" sample="Compliance som inte stjäl din tid" style={{ fontFamily: "var(--ck-font-serif)", fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.025em" }} />
          <TypeRow label="H1 · Inter 600" sample="Avvikelse #2026-0142" style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }} />
          <TypeRow label="H2 · Inter 600" sample="Veckokontroll — läkemedelskyl" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.015em" }} />
          <TypeRow label="Body · Inter 400" sample="Vaskulär ocklusion vid filler-injektion i nasolabialveck. Patient stabiliserad efter hyalase." style={{ fontSize: 14, lineHeight: 1.45 }} />
          <TypeRow label="Small · Inter 500" sample="Tilldelad till Anna Lundqvist · 23 maj 14:08" style={{ fontSize: 12, color: "var(--ck-ink-2)" }} />
          <TypeRow label="Caption" sample="SKA STÄNGAS INOM 24H · LEX MARIA-TRÖSKEL" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em" }} />
          <TypeRow label="Mono · JetBrains" sample="AVV-2026-0142 · batch L23F0214 · 19800101-XXXX" style={{ fontFamily: "var(--ck-font-mono)", fontSize: 12, color: "var(--ck-ink-2)" }} />
        </div>
      </div>
    </div>

    <hr className="ck-hr" style={{ margin: "28px 0 24px" }} />

    {/* Components row */}
    <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 14, letterSpacing: "0.06em" }}>03 / KOMPONENTER</div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
      {/* Buttons */}
      <div>
        <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 10, fontWeight: 500 }}>Buttons</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <button className="ck-btn">Spara</button>
          <button className="ck-btn ck-btn--secondary">Avbryt</button>
          <button className="ck-btn ck-btn--ghost">Mer</button>
          <button className="ck-btn ck-btn--danger">Radera</button>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button className="ck-btn ck-btn--lg"><Icon name="plus" size={14} />Ny avvikelse</button>
        </div>
      </div>

      {/* Badges & severity */}
      <div>
        <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 10, fontWeight: 500 }}>Severity & status</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <Severity level="critical" />
          <Severity level="high" />
          <Severity level="medium" />
          <Severity level="low" />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 12 }}>
          <Status level="open" /><Status level="investigating" /><Status level="closed" /><Status level="overdue" />
        </div>
      </div>

      {/* Inputs */}
      <div>
        <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 10, fontWeight: 500 }}>Input</div>
        <input className="ck-input" placeholder="Sökord, AVV-nummer…" />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <span className="ck-badge ck-badge--primary">IVO</span>
          <span className="ck-badge ck-badge--info">Estetisk injektion</span>
          <span className="ck-badge ck-badge--ok">RLS aktivt</span>
        </div>
      </div>
    </div>

    <hr className="ck-hr" style={{ margin: "24px 0" }} />

    {/* Principles */}
    <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 14, letterSpacing: "0.06em" }}>04 / PRINCIPER</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
      {[
        ["Lugn, inte tråkig",
         "Status-färger sparas till när de behövs. Brand-tonen bär dagen."],
        ["Tät, inte trång",
         "32px-radhöjder, monospace för ID och datum. Kliniker skannar mycket."],
        ["Spårbart per default",
         "Allt har request_id, version, actor. Audit-log följer varje mutation."],
        ["Verktyg, inte granskare",
         "Copy är aldrig \"vi godkänner\". Kliniken äger sitt kvalitetsarbete."],
      ].map(([h, b]) => (
        <div key={h}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{h}</div>
          <div style={{ fontSize: 12, color: "var(--ck-ink-2)", lineHeight: 1.5 }}>{b}</div>
        </div>
      ))}
    </div>
  </div>
);

Object.assign(window, { DesignSystem });
