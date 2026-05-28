/* CareKompass — Dashboard */

const KpiCard = ({ label, value, delta, dot, sub }) => (
  <div className="ck-card" style={{ padding: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
      {dot && <span className={`ck-dot ck-dot--${dot}`} />}
      <span style={{ fontSize: 11, color: "var(--ck-ink-3)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span className="ck-tnum" style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em" }}>{value}</span>
      {delta && <span style={{ fontSize: 12, color: "var(--ck-ink-3)" }}>{delta}</span>}
    </div>
    {sub && <div style={{ fontSize: 12, color: "var(--ck-ink-2)", marginTop: 6 }}>{sub}</div>}
  </div>
);

const Dashboard = () => (
  <AppShell active="dashboard" topbarProps={{
    breadcrumbs: ["Derma Beauty AB", "Östermalm", "Översikt"],
  }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden" }}>
      {/* Welcome + actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <div>
          <h1 className="ck-serif" style={{ fontSize: 28, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>God morgon, Toni.</h1>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>
            Onsdag 27 maj 2026 · 2 saker väntar din uppmärksamhet idag.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ck-btn ck-btn--secondary"><Icon name="download" size={14} />Audit-paket</button>
          <button className="ck-btn"><Icon name="plus" size={14} />Ny avvikelse <span className="ck-kbd" style={{ marginLeft: 6, background: "oklch(1 0 0 / 0.15)", color: "currentColor", borderColor: "transparent" }}>R</span></button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
        <KpiCard label="Compliance-score" value="87" delta="↑ 3 vs. förra månaden" dot="ok" sub="Grönt · stabilt" />
        <KpiCard label="Öppna avvikelser" value="7" delta="2 över SLA" dot="warn" sub="1 kritisk · 4 medel · 2 låg" />
        <KpiCard label="Delegeringar" value="14" delta="1 utgår om 4d" dot="warn" sub="aktiva · 2 personal" />
        <KpiCard label="Hygien denna v." value="18/21" delta="3 missade" dot="danger" sub="Östermalm + Vasastan" />
      </div>

      {/* Main grid: feed + activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12, height: "calc(100% - 200px)" }}>
        {/* Left col */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Today's queue */}
          <div className="ck-card">
            <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--ck-border)" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Idag på din lott</div>
                <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>4 av dem behöver beslut · sorterat efter SLA</div>
              </div>
              <div className="ck-tabs" style={{ border: 0 }}>
                <div className="ck-tab is-active">Mitt</div>
                <div className="ck-tab">Klinik</div>
                <div className="ck-tab">Bolag</div>
              </div>
            </div>

            <table className="ck-table">
              <tbody>
                {[
                  { id: "AVV-2026-0142", icon: "alert", title: "Vaskulär ocklusion vid filler — nasolabialveck", who: "Anna L.", sla: "12h kvar", sev: "critical" },
                  { id: "ORD-2026-0089", icon: "stethoscope", title: "Ordination väntar godkännande — Botulinumtoxin", who: "Dr. Hedman (konsult)", sla: "3d kvar", sev: "medium" },
                  { id: "DEL-0042", icon: "shield", title: "Delegering går ut — Maria S. (sjuksköterska)", who: "Du", sla: "4d kvar", sev: "high" },
                  { id: "HYG-2026-0521", icon: "sparkle", title: "Veckokontroll läkemedelskyl missad — Östermalm", who: "Du", sla: "Förfallen 1d", sev: "high" },
                  { id: "DOC-2026-0033", icon: "doc", title: "Signering krävs — Lex Maria-rutin v2.1", who: "Toni K.", sla: "Inget SLA", sev: "low" },
                ].map(r => (
                  <tr key={r.id}>
                    <td style={{ width: 32 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 6, background: "var(--ck-surface-sunken)", display: "grid", placeItems: "center", color: "var(--ck-ink-2)" }}>
                        <Icon name={r.icon} size={14} />
                      </span>
                    </td>
                    <td style={{ width: 130 }}><span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{r.id}</span></td>
                    <td><span style={{ fontWeight: 500 }}>{r.title}</span></td>
                    <td style={{ width: 120, color: "var(--ck-ink-2)" }}>{r.who}</td>
                    <td style={{ width: 100 }}><Severity level={r.sev} /></td>
                    <td style={{ width: 90, color: "var(--ck-ink-3)", fontSize: 12 }}>{r.sla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trial banner */}
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--ck-primary-soft)", border: "1px solid var(--ck-primary)", display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="sparkle" size={16} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ck-primary)" }}>9 dagar kvar på Pro-trialen</div>
              <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>Aktivera prenumeration nu så slipper appen falla tillbaka till read-only.</div>
            </div>
            <button className="ck-btn">Välj plan</button>
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Activity feed */}
          <div className="ck-card" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--ck-border)" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Aktivitet</div>
              <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>Realtid · senaste 24h</div>
            </div>
            <div style={{ padding: "10px 18px", flex: 1, overflow: "hidden" }}>
              {[
                { who: "Anna L.", what: "stängde avvikelse", subject: "AVV-2026-0139", when: "12 min", color: "ok" },
                { who: "Dr. Hedman", what: "godkände ordination", subject: "ORD-2026-0088", when: "32 min", color: "info" },
                { who: "Maria S.", what: "rapporterade hygienavvikelse", subject: "HYG-2026-0520", when: "1h", color: "warn" },
                { who: "Toni K.", what: "uppdaterade rutin", subject: "Hygien — Vårdhandboken v2.1", when: "3h", color: null },
                { who: "System", what: "noterade temperaturavvikelse", subject: "Kyl-2 · 9.4°C", when: "5h", color: "danger" },
                { who: "Erik B.", what: "loggade läkemedelsuttag", subject: "Restylane Lyft · batch L23F0214", when: "7h", color: null },
                { who: "System", what: "skickade påminnelse", subject: "Delegering för Maria S. går ut", when: "1d", color: "warn" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < 6 ? "1px solid var(--ck-divider)" : "0" }}>
                  <div style={{ width: 6, height: 6, borderRadius: 999, background: a.color ? `var(--ck-${a.color === "danger" ? "danger" : a.color === "warn" ? "warning" : a.color === "ok" ? "success" : "info"})` : "var(--ck-ink-4)", marginTop: 7, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>
                      <strong style={{ color: "var(--ck-ink)" }}>{a.who}</strong> {a.what} <span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{a.subject}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ck-ink-3)", flexShrink: 0 }}>{a.when}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Onboarding checklist */}
          <div className="ck-card" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Kom igång (4/6)</div>
              <span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>67%</span>
            </div>
            <div style={{ height: 4, borderRadius: 999, background: "var(--ck-surface-sunken)", overflow: "hidden", marginBottom: 12 }}>
              <div style={{ width: "67%", height: "100%", background: "var(--ck-primary)" }} />
            </div>
            {[
              ["Skapa din första klinik", true],
              ["Bjud in en medarbetare", true],
              ["Tilldela kvalitetsansvarig", true],
              ["Ladda upp ett styrdokument", true],
              ["Rapportera testavvikelse", false],
              ["Konfigurera hygienschema", false],
            ].map(([label, done]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", fontSize: 12, color: done ? "var(--ck-ink-3)" : "var(--ck-ink)" }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, border: "1px solid var(--ck-border-strong)", background: done ? "var(--ck-primary)" : "transparent", display: "grid", placeItems: "center", color: "#fff" }}>
                  {done && <Icon name="check" size={10} />}
                </div>
                <span style={{ textDecoration: done ? "line-through" : "none" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);

Object.assign(window, { Dashboard });
