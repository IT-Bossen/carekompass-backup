/* Hygiene mobile, Inspector mode, CK-admin companies */

/* ── Phone frame ── */
const Phone = ({ children, width = 360, height = 740 }) => (
  <div style={{
    width: width + 16, height: height + 16,
    background: "oklch(0.22 0.015 60)",
    borderRadius: 38, padding: 8,
    boxShadow: "0 20px 50px oklch(0.22 0.015 60 / 0.18)",
    position: "relative",
  }}>
    <div style={{
      width, height, borderRadius: 30, background: "var(--ck-bg)", overflow: "hidden", position: "relative",
    }}>
      {/* status bar */}
      <div style={{
        height: 38, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", fontSize: 12, fontWeight: 600,
        position: "relative", zIndex: 2,
      }}>
        <span className="ck-tnum">9:41</span>
        <div style={{ position: "absolute", left: "50%", top: 8, transform: "translateX(-50%)", width: 90, height: 22, borderRadius: 18, background: "oklch(0.22 0.015 60)" }} />
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <svg width="14" height="10" viewBox="0 0 14 10"><path d="M0 8h2v2H0zm3-2h2v4H3zm3-2h2v6H6zm3-2h2v8H9zm3-3h2v11h-2z" fill="currentColor" /></svg>
          <svg width="14" height="10" viewBox="0 0 14 10"><path d="M7 1.3a8 8 0 0 1 5 1.7l1-1.3a10 10 0 0 0-12 0l1 1.3A8 8 0 0 1 7 1.3zm0 3a5 5 0 0 1 3 1l1-1.3a7 7 0 0 0-8 0l1 1.3a5 5 0 0 1 3-1zm0 2.7a2 2 0 0 0-1.8 1.2L7 10l1.8-1.8A2 2 0 0 0 7 7z" fill="currentColor"/></svg>
          <svg width="22" height="10" viewBox="0 0 22 10"><rect x="0.5" y="0.5" width="18" height="9" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.4" /><rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor" /><rect x="19" y="3" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.4" /></svg>
        </div>
      </div>
      {children}
    </div>
  </div>
);

const HygieneMobile = () => (
  <Phone>
    <div className="ck" style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--ck-bg)" }}>
      {/* Header */}
      <div style={{ padding: "8px 16px 14px", background: "var(--ck-surface)", borderBottom: "1px solid var(--ck-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button style={{ background: "transparent", border: 0, color: "var(--ck-ink-2)", padding: 0, display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            <Icon name="chev-down" size={16} /> Tillbaka
          </button>
          <span className="ck-badge ck-badge--primary">PÅGÅR</span>
        </div>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 4 }}>DAGLIG ÖPPNING · ÖSTERMALM</div>
        <h2 className="ck-serif" style={{ fontSize: 22, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
          Behandlingsklinik — morgon
        </h2>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "var(--ck-ink-3)" }}>
          <span>27 maj 2026 · 08:42</span>
          <span className="ck-mono">7 / 10 klara</span>
        </div>
        {/* progress */}
        <div style={{ height: 4, background: "var(--ck-surface-sunken)", borderRadius: 999, marginTop: 8, overflow: "hidden" }}>
          <div style={{ width: "70%", height: "100%", background: "var(--ck-primary)" }} />
        </div>
      </div>

      {/* Items */}
      <div style={{ flex: 1, padding: 12, overflow: "hidden", display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { n: 1, label: "Behandlingsrum dammtorkat & tomt", state: "ok", who: "Maria S." },
          { n: 2, label: "Ytdesinfektion alla horisontella ytor", state: "ok", who: "Maria S." },
          { n: 3, label: "Handdesinfektion påfylld alla rum", state: "ok", who: "Maria S." },
          { n: 4, label: "Engångshandskar — S/M/L finns", state: "ok", who: "Maria S." },
          { n: 5, label: "Akutväska kontrollerad och förseglad", state: "ok", who: "Maria S." },
          { n: 6, label: "Adrenalin — utgång > 30d kvar", state: "ok", who: "Maria S." },
          { n: 7, label: "Sopkärl stick/skär tömt & rent", state: "ok", who: "Maria S." },
          { n: 8, label: "Läkemedelskyl — temperatur", state: "active" },
          { n: 9, label: "Tvättställ — tvål + papper + funktion", state: "todo" },
          { n: 10, label: "Övriga anmärkningar", state: "todo", optional: true },
        ].map(it => (
          <div key={it.n} style={{
            padding: "10px 12px",
            background: it.state === "active" ? "var(--ck-surface)" : "var(--ck-surface)",
            border: it.state === "active" ? "1.5px solid var(--ck-primary)" : "1px solid var(--ck-border)",
            borderRadius: 10,
            opacity: it.state === "todo" ? 0.6 : 1,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                background: it.state === "ok" ? "var(--ck-success)" : it.state === "active" ? "var(--ck-primary-soft)" : "transparent",
                border: it.state === "ok" ? "0" : "1.5px solid var(--ck-border-strong)",
                color: "#fff", display: "grid", placeItems: "center", marginTop: 1,
              }}>
                {it.state === "ok" && <Icon name="check" size={12} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: it.state === "active" ? 600 : 500, color: "var(--ck-ink)" }}>
                  <span className="ck-mono" style={{ color: "var(--ck-ink-3)", marginRight: 6, fontSize: 11 }}>{it.n}.</span>
                  {it.label}
                  {it.optional && <span style={{ marginLeft: 6, fontSize: 11, color: "var(--ck-ink-3)" }}>(valfritt)</span>}
                </div>
                {it.state === "ok" && <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginTop: 2 }}>OK · {it.who}</div>}
                {it.state === "active" && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 4 }}>Avläst värde</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input className="ck-input" defaultValue="4.2" style={{ flex: 1, fontSize: 18, fontWeight: 600, textAlign: "center", height: 44 }} />
                      <span style={{ fontSize: 14, color: "var(--ck-ink-2)", fontWeight: 500 }}>°C</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "var(--ck-ink-3)" }} className="ck-mono">
                      <span>min 2.0</span><span>OK-intervall</span><span>max 8.0</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                      <button className="ck-btn ck-btn--secondary" style={{ flex: 1, justifyContent: "center", height: 34 }}><Icon name="upload" size={14} />Foto</button>
                      <button className="ck-btn" style={{ flex: 1, justifyContent: "center", height: 34 }}>Bekräfta OK</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom safe area */}
      <div style={{ height: 16, background: "var(--ck-surface)", borderTop: "1px solid var(--ck-border)", display: "grid", placeItems: "center" }}>
        <div style={{ width: 80, height: 4, borderRadius: 999, background: "var(--ck-ink-4)" }} />
      </div>
    </div>
  </Phone>
);


/* ── Inspector mode (read-only token) ── */
const Inspector = () => (
  <div className="ck" style={{ height: "100%", background: "var(--ck-bg)", display: "flex", flexDirection: "column" }}>
    {/* Banner */}
    <div style={{
      padding: "12px 24px", background: "oklch(0.35 0.10 60)", color: "var(--ck-primary-foreground)",
      display: "flex", alignItems: "center", gap: 14, flexShrink: 0,
    }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "oklch(1 0 0 / 0.15)", display: "grid", placeItems: "center" }}>
        <Icon name="eye" size={16} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Inspektörsläge — read-only</div>
        <div style={{ fontSize: 11, opacity: 0.8 }}>Token utfärdad av Derma Beauty AB · giltig till 2026-06-10 17:00 · alla visningar loggas</div>
      </div>
      <div style={{ display: "flex", gap: 18, fontSize: 12, alignItems: "center" }}>
        <span><span style={{ opacity: 0.6 }}>Inspektör: </span>Maria Sjöberg, IVO</span>
        <span><span style={{ opacity: 0.6 }}>Scope: </span>Östermalm</span>
        <span><span style={{ opacity: 0.6 }}>Token: </span><span className="ck-mono" style={{ background: "oklch(1 0 0 / 0.15)", padding: "2px 6px", borderRadius: 4 }}>i-7K4P-9DR2</span></span>
      </div>
      <button className="ck-btn ck-btn--secondary" style={{ background: "oklch(1 0 0 / 0.15)", color: "currentColor", borderColor: "oklch(1 0 0 / 0.3)" }}><Icon name="download" size={14} />Audit-paket</button>
    </div>

    {/* Body */}
    <div style={{ flex: 1, padding: 32, display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, overflow: "hidden" }}>
      {/* Side nav */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Logo />
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", marginTop: 18, marginBottom: 8, letterSpacing: "0.06em" }}>VISA</div>
        {[
          ["Översikt", "home", true],
          ["Styrdokument", "doc", false],
          ["Avvikelser & Lex Maria", "alert", false],
          ["Ordinationer & delegeringar", "stethoscope", false],
          ["Läkemedel & spårbarhet", "pill", false],
          ["Hygien & egenkontroll", "sparkle", false],
          ["Riskanalys", "scale", false],
          ["Personal & legitimation", "graduation", false],
          ["Audit-log", "clock", false],
        ].map(([label, icon, active]) => (
          <div key={label} style={{
            padding: "8px 12px", borderRadius: 6, fontSize: 13,
            display: "flex", alignItems: "center", gap: 10,
            background: active ? "var(--ck-primary-soft)" : "transparent",
            color: active ? "var(--ck-primary)" : "var(--ck-ink-2)",
            fontWeight: active ? 600 : 500,
          }}>
            <Icon name={icon} size={15} />{label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ overflow: "hidden" }}>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 8 }}>DERMA BEAUTY AB · ÖSTERMALM · TILLSYNSVY</div>
        <h1 className="ck-serif" style={{ fontSize: 36, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 8 }}>
          Översikt av kliniken
        </h1>
        <p style={{ fontSize: 14, color: "var(--ck-ink-2)", maxWidth: 720, lineHeight: 1.5, marginBottom: 24 }}>
          Det här är en tidsbegränsad, read-only-vy av Derma Beauty AB:s ledningssystem,
          öppnad åt dig av kliniken inför IVO-tillsyn 2026-06-08. CareKompass förmedlar bevis
          men gör ingen egen bedömning av om kliniken uppfyller kraven.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 18 }}>
          <KpiCard label="Verksamhetstid" value="3.2 år" sub="Anmäld 2023-02-14" />
          <KpiCard label="Aktiva delegeringar" value="14" sub="alla giltiga" dot="ok" />
          <KpiCard label="Audit-händelser 90d" value="1 482" sub="komplett spårbart" />
        </div>

        <div className="ck-card" style={{ padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Snabbstart för inspektionen</div>
          {[
            ["Senaste 30 dagars avvikelser med severity ≥ hög", "12"],
            ["Lex Maria-anmälningar 2025–2026", "2"],
            ["Läkemedelsuttag (spårbara) senaste 90 dagar", "417"],
            ["Hygienkontroller utförda senaste 90 dagar", "84 / 90 schemalagda"],
            ["Riskanalys — senaste översyn", "2026-04-12"],
            ["Personal med utgånget certifikat", "0"],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--ck-divider)", fontSize: 13 }}>
              <span style={{ color: "var(--ck-ink-2)" }}>{label}</span>
              <span style={{ fontWeight: 500 }} className="ck-mono">{val} <Icon name="chev-right" size={12} /></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);


/* ── CK Admin: Companies + Impersonation modal ── */
const AdminCompanies = () => (
  <div className="ck" style={{ height: "100%", background: "var(--ck-bg)", display: "flex" }}>
    {/* Admin sidebar */}
    <aside style={{ width: 220, background: "oklch(0.20 0.013 240)", color: "oklch(0.95 0.005 200)", padding: "16px 12px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
        <span className="ck-logo-glyph" style={{ background: "var(--ck-primary)" }}>
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.8" />
            <path d="M6 1.5 L7 6 L6 10.5 L5 6 Z" fill="currentColor" /><circle cx="6" cy="6" r="0.7" fill="currentColor" />
          </svg>
        </span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>CareKompass</div>
          <div className="ck-mono" style={{ fontSize: 10, opacity: 0.6, letterSpacing: "0.06em" }}>SYSTEM ADMIN</div>
        </div>
      </div>

      {[
        ["Företag", "shield", true, "3"],
        ["Användare", "users", false],
        ["Billing", "scale", false],
        ["Compliance", "shield", false],
        ["Moduler", "settings", false],
        ["Planer", "doc", false],
        ["Mallar", "doc", false],
        ["Nyheter", "leaf", false],
        ["Support", "circle-q", false, "12"],
        ["System", "settings", false],
      ].map(([label, icon, active, badge]) => (
        <div key={label} style={{
          padding: "7px 10px", borderRadius: 6, fontSize: 13,
          display: "flex", alignItems: "center", gap: 10, marginBottom: 1,
          background: active ? "oklch(0.30 0.020 240)" : "transparent",
          color: active ? "oklch(0.98 0.005 200)" : "oklch(0.75 0.008 200)",
          fontWeight: active ? 600 : 500,
        }}>
          <Icon name={icon} size={14} />
          <span style={{ flex: 1 }}>{label}</span>
          {badge && <span style={{ fontSize: 10, background: "var(--ck-primary)", color: "var(--ck-primary-foreground)", padding: "2px 6px", borderRadius: 999, fontWeight: 600 }}>{badge}</span>}
        </div>
      ))}

      <div style={{ flex: 1 }} />
      <div style={{ padding: 10, borderRadius: 8, background: "oklch(0.25 0.015 240)", display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar initials="SA" color="oklch(0.5 0.15 30)" />
        <div style={{ flex: 1, minWidth: 0, fontSize: 12 }}>
          <div style={{ fontWeight: 600 }}>Sofia A.</div>
          <div className="ck-mono" style={{ fontSize: 10, opacity: 0.7 }}>super_admin</div>
        </div>
      </div>
    </aside>

    {/* Main */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{ height: 56, borderBottom: "1px solid var(--ck-border)", background: "var(--ck-surface)", display: "flex", alignItems: "center", padding: "0 24px", gap: 12 }}>
        <div style={{ color: "var(--ck-ink-3)", fontSize: 13 }}>System Admin / <span style={{ color: "var(--ck-ink)", fontWeight: 600 }}>Företag</span></div>
        <div style={{ flex: 1 }} />
        <span className="ck-badge ck-badge--medium"><span className="ck-dot ck-dot--warn" />Du tittar cross-tenant</span>
        <button className="ck-btn ck-btn--secondary"><Icon name="search" size={14} />Sök företag (⌘K)</button>
      </div>

      <div style={{ padding: 24, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Företag</h1>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>
            312 aktiva · 3 ansökningar väntar · 8 trials utgår denna vecka · auto-trial flagga: <span className="ck-mono" style={{ color: "var(--ck-success)" }}>på</span>
          </div>
        </div>

        <div className="ck-tabs">
          <div className="ck-tab is-active">Väntar godkännande <span className="ck-badge ck-badge--medium" style={{ height: 16, fontSize: 10 }}>3</span></div>
          <div className="ck-tab">Aktiva <span className="ck-badge" style={{ height: 16, fontSize: 10 }}>312</span></div>
          <div className="ck-tab">Pausade</div>
          <div className="ck-tab">Avregistrerade</div>
        </div>

        <div className="ck-card" style={{ flex: 1, overflow: "hidden" }}>
          <table className="ck-table">
            <thead>
              <tr>
                <th>FÖRETAG</th><th>ORG.NR</th><th>BRANSCH</th><th>SÖKANDE</th><th>KLINIKER</th><th>PLAN</th><th>ANSÖKT</th><th>AVTAL</th><th></th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Stockholm Estetik AB", org: "559234-1188", ind: "Estetisk injektion", who: "Linda Holm", n: 2, plan: "Pro", when: "26 maj 09:14", contract: "Signerat", new: true },
                { name: "Tattoo Studio Söder", org: "559811-4422", ind: "Piercing & tatuering", who: "Petter Vik", n: 1, plan: "Starter", when: "25 maj 16:42", contract: "Signerat" },
                { name: "Footcare Norrtull", org: "559002-8839", ind: "Fotvård", who: "Annika Larsen", n: 3, plan: "Pro", when: "24 maj 11:08", contract: "Väntar" },
              ].map((c, i) => (
                <tr key={c.org}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg, var(--ck-primary), oklch(0.55 0.10 200))", color: "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700 }}>
                        {c.name.split(" ").map(s=>s[0]).slice(0,2).join("")}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                          {c.name}
                          {c.new && <span className="ck-badge ck-badge--primary" style={{ fontSize: 10 }}>NY</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{c.who}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="ck-mono" style={{ fontSize: 11 }}>{c.org}</span></td>
                  <td><span className="ck-badge">{c.ind}</span></td>
                  <td><span style={{ color: "var(--ck-ink-2)" }}>j***@s***.se</span></td>
                  <td>{c.n}</td>
                  <td><span className="ck-badge ck-badge--primary">{c.plan}</span></td>
                  <td className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{c.when}</td>
                  <td>
                    {c.contract === "Signerat"
                      ? <span className="ck-badge ck-badge--ok"><Icon name="check" size={10} />{c.contract}</span>
                      : <span className="ck-badge ck-badge--medium">{c.contract}</span>
                    }
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="ck-btn" style={{ height: 26 }}>Godkänn</button>
                      <button className="ck-btn ck-btn--ghost" style={{ height: 26 }}>Avslå</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PII / Impersonation note */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="ck-card" style={{ padding: 14, display: "flex", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--ck-info-soft)", color: "var(--ck-info)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name="lock" size={16} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>PII-maskerad som default</div>
              <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>
                E-post, telefon, personnummer döljs i admin-vyer. Avmaskning kräver ärende-ID och loggas i <span className="ck-mono">pii_unmask_audits</span>.
              </div>
            </div>
          </div>
          <div className="ck-card" style={{ padding: 14, display: "flex", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--ck-warning-soft)", color: "var(--ck-warning)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name="users" size={16} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Impersonation kräver ärende-ID</div>
              <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>
                Maxlängd 15–60 min. Banner alltid synlig. Kund får mailnotis. Aldrig destruktiva åtgärder.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { HygieneMobile, Inspector, AdminCompanies });
