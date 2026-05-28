/* MOBILE SPECIAL — Inspector mobile, Cookie banner, Admin "not optimized" */

/* ── INSPECTOR MOBILE (tablet/phone — read-only token) ── */
const MInspector = () => (
  <div className="ck" style={{ width: "100%", height: "100%", overflow: "hidden", background: "var(--ck-bg)", display: "flex", flexDirection: "column" }}>
    <MStatusBar light />

    {/* Inspector banner */}
    <div style={{
      background: "oklch(0.35 0.10 60)", color: "#fff",
      padding: "10px 18px 14px", flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: "oklch(1 0 0 / 0.15)", display: "grid", placeItems: "center" }}>
          <Icon name="eye" size={14} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Inspektörsläge · read-only</div>
          <div style={{ fontSize: 10, opacity: 0.8 }}>Utfärdad av Derma Beauty AB · giltig till 10 jun 17:00</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, opacity: 0.8 }} className="ck-mono">
        <span>i-7K4P-9DR2</span>
        <span>Maria Sjöberg · IVO</span>
        <span>Östermalm</span>
      </div>
    </div>

    <MScroll>
      <div style={{ padding: "18px 18px 4px" }}>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 6 }}>DERMA BEAUTY AB · TILLSYNSVY</div>
        <h1 className="ck-serif" style={{ fontSize: 28, lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: 8 }}>
          Översikt av kliniken
        </h1>
        <p style={{ fontSize: 13, color: "var(--ck-ink-2)", lineHeight: 1.5 }}>
          Read-only-vy inför IVO-tillsyn 8 juni 2026. CareKompass förmedlar bevis men gör ingen egen bedömning.
        </p>
      </div>

      <div style={{ padding: "16px 18px 4px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          ["Verksamhetstid", "3.2 år"],
          ["Aktiva delegeringar", "14"],
          ["Audit-händelser 90d", "1 482"],
          ["Hygienkontroller 90d", "84 / 90"],
        ].map(([l, v]) => (
          <div key={l} className="ck-card" style={{ padding: 12 }}>
            <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{l}</div>
            <div className="ck-tnum" style={{ fontSize: 22, fontWeight: 600, marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>

      <MSection label="SNABBSTART FÖR INSPEKTIONEN">
        <div style={{ background: "var(--ck-surface)" }}>
          {[
            ["Avvikelser · senaste 30d ≥ hög", "12"],
            ["Lex Maria-anmälningar 2025–2026", "2"],
            ["Läkemedelsuttag · 90d spårbara", "417"],
            ["Hygienkontroller utförda 90d", "84 / 90"],
            ["Riskanalys · senaste översyn", "2026-04-12"],
            ["Personal med utgånget certifikat", "0"],
          ].map(([k, v]) => (
            <div key={k} style={{ padding: "13px 18px", borderBottom: "1px solid var(--ck-divider)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>{k}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="ck-mono" style={{ fontSize: 12, fontWeight: 600 }}>{v}</span>
                <Icon name="chev-right" size={14} />
              </span>
            </div>
          ))}
        </div>
      </MSection>

      <div style={{ padding: 18 }}>
        <button className="ck-btn" style={{ width: "100%", height: 48, justifyContent: "center", borderRadius: 12 }}>
          <Icon name="download" size={16} />Ladda ner audit-paket (PDF)
        </button>
      </div>
    </MScroll>
  </div>
);


/* ── COOKIE CONSENT (mobile bottom sheet) ── */
const MCookieConsent = () => (
  <div className="ck" style={{ width: "100%", height: "100%", overflow: "hidden", background: "var(--ck-bg)", position: "relative", display: "flex", flexDirection: "column" }}>
    <MStatusBar />
    {/* Faded landing behind */}
    <div style={{ flex: 1, padding: "20px 18px", opacity: 0.35, pointerEvents: "none" }}>
      <Logo />
      <h1 className="ck-serif" style={{ fontSize: 38, lineHeight: 1, letterSpacing: "-0.03em", marginTop: 32 }}>
        Compliance som inte stjäl din tid.
      </h1>
      <p style={{ fontSize: 13, color: "var(--ck-ink-2)", marginTop: 14, lineHeight: 1.5 }}>
        Ledningssystemet som låter dig äga ditt kvalitetsarbete.
      </p>
    </div>

    {/* Bottom sheet */}
    <div style={{
      background: "var(--ck-surface)",
      borderTopLeftRadius: 22, borderTopRightRadius: 22,
      boxShadow: "0 -20px 50px oklch(0.22 0.015 60 / 0.18)",
      padding: "12px 18px 26px",
      flexShrink: 0,
    }}>
      <div style={{ width: 40, height: 4, borderRadius: 999, background: "var(--ck-border-strong)", margin: "0 auto 16px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Icon name="leaf" size={16} />
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em" }}>COOKIES & INTEGRITET</div>
      </div>
      <h3 className="ck-serif" style={{ fontSize: 20, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 8 }}>
        Vi använder bara cookies som behövs.
      </h3>
      <p style={{ fontSize: 12, color: "var(--ck-ink-2)", lineHeight: 1.5, marginBottom: 16 }}>
        Allt utöver autentisering är opt-in. GA4 körs med Consent Mode v2. Inga cookies i den inloggade appen.
        <a style={{ color: "var(--ck-primary)", textDecoration: "underline", marginLeft: 4 }}>Läs cookie-policyn</a>
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {[
          { label: "Nödvändiga", on: true, locked: true },
          { label: "Funktionella + Analytiska", on: false },
          { label: "Marketing", on: false },
        ].map(c => (
          <div key={c.label} style={{ padding: 12, border: "1px solid var(--ck-border)", borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{c.label}</div>
              {c.locked && <div className="ck-mono" style={{ fontSize: 9, color: "var(--ck-ink-3)" }}>ALLTID PÅ</div>}
            </div>
            <span style={{
              width: 36, height: 22, borderRadius: 999,
              background: c.on ? "var(--ck-primary)" : "var(--ck-border-strong)",
              position: "relative", flexShrink: 0,
              opacity: c.locked ? 0.6 : 1,
            }}>
              <span style={{ position: "absolute", width: 16, height: 16, borderRadius: 999, background: "#fff", top: 3, left: c.on ? 17 : 3 }} />
            </span>
          </div>
        ))}
      </div>

      <MPrimaryAction label="Acceptera alla" large />
      <div style={{ height: 8 }} />
      <MSecondaryAction label="Spara mina val" />
      <div style={{ marginTop: 12, textAlign: "center" }}>
        <a style={{ fontSize: 12, color: "var(--ck-ink-3)" }}>Avvisa alla</a>
      </div>
    </div>
  </div>
);


/* ── ADMIN MOBILE NOTICE (CK-admin is desktop-only) ── */
const MAdminNotice = () => (
  <MobileShell active="more" noTabs topbar={<MTopbar back title="System Admin" />} >
    <div style={{ flex: 1, padding: "60px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", justifyContent: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: 18, background: "var(--ck-primary-soft)", color: "var(--ck-primary)", display: "grid", placeItems: "center", marginBottom: 22 }}>
        <Icon name="settings" size={32} />
      </div>
      <h2 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 12 }}>
        Admin-panelen kräver desktop
      </h2>
      <p style={{ fontSize: 14, color: "var(--ck-ink-2)", lineHeight: 1.5, marginBottom: 28, maxWidth: 320 }}>
        CK-admin är byggt för cross-tenant-arbete på storskärm — företagsgodkännanden,
        impersonation med ärende-ID, PII-avmaskering, system health. På mobil kan vi
        bara visa nödläges-genvägar.
      </p>

      <div style={{ width: "100%", maxWidth: 340, background: "var(--ck-surface)", border: "1px solid var(--ck-border)", borderRadius: 12, overflow: "hidden", textAlign: "left" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--ck-border)", fontSize: 12, fontWeight: 600, color: "var(--ck-ink-2)" }}>NÖDÅTGÄRDER PÅ MOBIL</div>
        <MRow icon="alert" iconColor="var(--ck-warning-soft)" title="Pausa företag" sub="Tillgängligt på mobil" />
        <MRow icon="users" title="Sök användare" sub="Read-only" />
        <MRow icon="bell" title="Mina supportärenden" sub="3 öppna" badge={<span className="ck-badge" style={{ fontSize: 9 }}>3</span>} />
      </div>

      <div style={{ marginTop: 22, padding: 14, background: "var(--ck-warning-soft)", borderRadius: 10, fontSize: 12, color: "var(--ck-ink-2)" }}>
        <strong style={{ color: "oklch(0.45 0.12 80)" }}>Säkerhet:</strong> Impersonation och PII-avmaskering kräver desktop (kameran inte tillförlitlig för revisionsspår).
      </div>
    </div>
  </MobileShell>
);

Object.assign(window, { MInspector, MCookieConsent, MAdminNotice });
