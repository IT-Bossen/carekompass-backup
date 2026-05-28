/* CareKompass — Deviations module: list + detail + new */

const DeviationsList = () => (
  <AppShell active="deviations" topbarProps={{
    breadcrumbs: ["Derma Beauty AB", "Östermalm", "Avvikelser"],
  }}>
    <div style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <div>
          <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Avvikelser</h1>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>
            54 totalt · 7 öppna · 2 över SLA · audit-export 30 d retention
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ck-btn ck-btn--secondary"><Icon name="download" size={14} />Exportera CSV</button>
          <button className="ck-btn"><Icon name="plus" size={14} />Rapportera <span className="ck-kbd" style={{ marginLeft: 6, background: "oklch(1 0 0 / 0.15)", color: "currentColor", borderColor: "transparent" }}>R</span></button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "0 0 280px" }}>
          <Icon name="search" size={14} />
          <input className="ck-input" placeholder="Sök titel, AVV-nr, kategori…" style={{ paddingLeft: 30 }} />
          <span style={{ position: "absolute", left: 10, top: 9, color: "var(--ck-ink-3)" }}><Icon name="search" size={14} /></span>
        </div>
        <button className="ck-btn ck-btn--secondary">Status: Öppna <Icon name="chev-down" size={12} /></button>
        <button className="ck-btn ck-btn--secondary">Severity: Alla <Icon name="chev-down" size={12} /></button>
        <button className="ck-btn ck-btn--secondary">Kategori: Alla <Icon name="chev-down" size={12} /></button>
        <button className="ck-btn ck-btn--secondary">Klinik: Östermalm <Icon name="chev-down" size={12} /></button>
        <button className="ck-btn ck-btn--secondary">Datum: Sen. 30 d <Icon name="chev-down" size={12} /></button>
        <div style={{ flex: 1 }} />
        <button className="ck-btn ck-btn--ghost"><Icon name="filter" size={14} />Avancerad</button>
      </div>

      {/* Table */}
      <div className="ck-card" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <table className="ck-table">
          <thead>
            <tr>
              <th style={{ width: 32 }}><input type="checkbox" /></th>
              <th>AVV-NR</th>
              <th>RUBRIK</th>
              <th>KATEGORI</th>
              <th>SEVERITY</th>
              <th>STATUS</th>
              <th>TILLDELAD</th>
              <th>SLA</th>
              <th>SKAPAD</th>
              <th style={{ width: 32 }}></th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "AVV-2026-0142", title: "Vaskulär ocklusion vid filler — nasolabialveck", cat: "Komplikation", sev: "critical", st: "investigating", who: "Anna L.", sla: { txt: "12h kvar", color: "warn" }, when: "23 maj 14:08" },
              { id: "AVV-2026-0141", title: "Hyalase-administration — patient stabil 30 min", cat: "Komplikation", sev: "high", st: "closed", who: "Toni K.", sla: { txt: "—", color: null }, when: "23 maj 14:55" },
              { id: "AVV-2026-0140", title: "Temperaturavvikelse läkemedelskyl — 9.4°C", cat: "Hygien", sev: "high", st: "action", who: "System", sla: { txt: "2d kvar", color: null }, when: "22 maj 22:14" },
              { id: "AVV-2026-0139", title: "Felaktigt utfyllt samtycke — botulinumtoxin", cat: "Dokumentation", sev: "medium", st: "closed", who: "Erik B.", sla: { txt: "—", color: null }, when: "22 maj 11:32" },
              { id: "AVV-2026-0138", title: "Brist i delegering — sjuksköterska", cat: "Personal", sev: "high", st: "investigating", who: "Toni K.", sla: { txt: "Förfallen 9h", color: "danger" }, when: "21 maj 16:45" },
              { id: "AVV-2026-0137", title: "Stickskada — användning av redan använt instrument", cat: "Hygien", sev: "medium", st: "action", who: "Maria S.", sla: { txt: "8d kvar", color: null }, when: "20 maj 09:18" },
              { id: "AVV-2026-0136", title: "Patientklagomål — ojämnt resultat botox", cat: "Klagomål", sev: "low", st: "open", who: "—", sla: { txt: "82d kvar", color: null }, when: "18 maj 13:01" },
              { id: "AVV-2026-0135", title: "Lex Maria — anmälan utförd", cat: "Komplikation", sev: "critical", st: "closed", who: "Toni K.", sla: { txt: "—", color: null }, when: "15 maj 09:00" },
              { id: "AVV-2026-0134", title: "Allergisk reaktion på topikalt bedövningsmedel", cat: "Komplikation", sev: "medium", st: "closed", who: "Anna L.", sla: { txt: "—", color: null }, when: "12 maj 15:22" },
              { id: "AVV-2026-0133", title: "Batch-spårning saknas — Profhilo 2ml", cat: "Dokumentation", sev: "low", st: "closed", who: "Erik B.", sla: { txt: "—", color: null }, when: "10 maj 17:40" },
            ].map(r => (
              <tr key={r.id}>
                <td><input type="checkbox" /></td>
                <td><span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-2)" }}>{r.id}</span></td>
                <td><span style={{ fontWeight: 500 }}>{r.title}</span></td>
                <td><span style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>{r.cat}</span></td>
                <td><Severity level={r.sev} /></td>
                <td><Status level={r.st} /></td>
                <td>
                  {r.who === "—" ? <span style={{ color: "var(--ck-ink-3)" }}>—</span> : (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Avatar initials={r.who.split(" ").map(s => s[0]).join("")} />
                      <span style={{ fontSize: 12 }}>{r.who}</span>
                    </div>
                  )}
                </td>
                <td><span style={{ fontSize: 12, color: r.sla.color === "danger" ? "var(--ck-danger)" : r.sla.color === "warn" ? "var(--ck-warning)" : "var(--ck-ink-3)", fontWeight: r.sla.color ? 600 : 400 }}>{r.sla.txt}</span></td>
                <td><span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{r.when}</span></td>
                <td><button className="ck-btn ck-btn--ghost" style={{ width: 24, height: 24, padding: 0 }}><Icon name="more" size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--ck-border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--ck-ink-3)" }}>
          <span>Visar 1–10 av 54</span>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="ck-btn ck-btn--ghost" style={{ height: 26 }}>‹</button>
            <button className="ck-btn ck-btn--secondary" style={{ height: 26, minWidth: 26, padding: 0 }}>1</button>
            <button className="ck-btn ck-btn--ghost" style={{ height: 26, minWidth: 26, padding: 0 }}>2</button>
            <button className="ck-btn ck-btn--ghost" style={{ height: 26, minWidth: 26, padding: 0 }}>3</button>
            <button className="ck-btn ck-btn--ghost" style={{ height: 26, minWidth: 26, padding: 0 }}>4</button>
            <button className="ck-btn ck-btn--ghost" style={{ height: 26, minWidth: 26, padding: 0 }}>5</button>
            <button className="ck-btn ck-btn--ghost" style={{ height: 26 }}>›</button>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);

/* ── Deviation detail ── */
const DeviationDetail = () => (
  <AppShell active="deviations" topbarProps={{
    breadcrumbs: ["Derma Beauty AB", "Avvikelser", "AVV-2026-0142"],
  }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
      {/* Main */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
        {/* Header */}
        <div className="ck-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <Severity level="critical" />
            <Status level="investigating" />
            <span className="ck-badge"><Icon name="flag" size={10} />Lex Maria-tröskel</span>
            <span className="ck-badge ck-badge--info">Komplikation</span>
            <div style={{ flex: 1 }} />
            <span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", alignSelf: "center" }}>AVV-2026-0142</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6, letterSpacing: "-0.015em" }}>
            Vaskulär ocklusion vid filler-injektion i nasolabialveck
          </h1>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>
            Rapporterad av Erik B. · 23 maj 14:08 · Östermalm · Behandlingsrum 2
          </div>

          {/* SLA banner */}
          <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--ck-warning-soft)", borderRadius: 8, display: "flex", gap: 10, alignItems: "center" }}>
            <Icon name="clock" size={14} />
            <div style={{ flex: 1, fontSize: 12, color: "var(--ck-ink-2)" }}>
              <strong style={{ color: "oklch(0.45 0.12 80)" }}>12 timmar kvar</strong> till SLA-utgång (kritisk · 24h). Rapportering till IVO påbörjad.
            </div>
            <button className="ck-btn ck-btn--secondary" style={{ height: 28 }}>Förläng SLA</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="ck-card" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div className="ck-tabs" style={{ padding: "0 18px" }}>
            <div className="ck-tab is-active">Översikt</div>
            <div className="ck-tab">Tidslinje <span className="ck-badge" style={{ height: 16, fontSize: 10 }}>8</span></div>
            <div className="ck-tab">Åtgärder <span className="ck-badge" style={{ height: 16, fontSize: 10 }}>3</span></div>
            <div className="ck-tab">Relaterat</div>
            <div className="ck-tab">Audit-log</div>
          </div>
          <div style={{ padding: 20, overflow: "hidden", flex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 6 }}>BESKRIVNING</div>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ck-ink)", marginBottom: 14 }}>
                  Patient (kvinna, 41) fick filler-injektion (Restylane Lyft) i höger nasolabialveck.
                  Inom 30 sek noterades blanching och kraftig smärta. Misstänkt vaskulär ocklusion.
                  Akut hyalase-protokoll initierades omedelbart. Patient stabiliserad efter 18 minuter.
                  Hänvisad till akut undersökning på SÖS.
                </p>

                <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 6 }}>OMEDELBAR ÅTGÄRD</div>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ck-ink)" }}>
                  Hyalase 1500 IE administrerat enligt protokoll. Värmebehandling + massage.
                  Aspirin 325 mg givet. Patient stannade 90 min för observation. Uppföljning 24h + 7d.
                </p>
              </div>

              <div>
                <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 10 }}>METADATA</div>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 14px", fontSize: 12 }}>
                  <span style={{ color: "var(--ck-ink-3)" }}>Patient</span>
                  <span className="ck-mono" style={{ color: "var(--ck-ink-2)" }}>P-44217 (PII maskerad)</span>
                  <span style={{ color: "var(--ck-ink-3)" }}>Behandling</span>
                  <span>Filler — nasolabialveck</span>
                  <span style={{ color: "var(--ck-ink-3)" }}>Produkt</span>
                  <span>Restylane Lyft 1ml</span>
                  <span style={{ color: "var(--ck-ink-3)" }}>Batch</span>
                  <span className="ck-mono">L23F0214</span>
                  <span style={{ color: "var(--ck-ink-3)" }}>Utförare</span>
                  <span>Anna Lundqvist (sjuksköterska)</span>
                  <span style={{ color: "var(--ck-ink-3)" }}>Delegering</span>
                  <span className="ck-mono">DEL-0042 ✓ giltig</span>
                  <span style={{ color: "var(--ck-ink-3)" }}>Ordinatör</span>
                  <span>Dr. Hedman (konsult)</span>
                  <span style={{ color: "var(--ck-ink-3)" }}>Kategori</span>
                  <span>Vaskulär händelse</span>
                  <span style={{ color: "var(--ck-ink-3)" }}>IVO-anmälan</span>
                  <span className="ck-badge ck-badge--info" style={{ fontSize: 10 }}>Pågår</span>
                </div>
              </div>
            </div>

            <hr className="ck-hr" style={{ margin: "20px 0" }} />

            <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 10 }}>BIFOGAT</div>
            <div style={{ display: "flex", gap: 10 }}>
              <div className="ck-img-ph" style={{ width: 120, height: 90 }}>foto · t+0</div>
              <div className="ck-img-ph" style={{ width: 120, height: 90 }}>foto · t+18min</div>
              <div style={{ width: 120, height: 90, border: "1px solid var(--ck-border)", borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Icon name="doc" size={16} />
                <div style={{ fontSize: 11 }}>SÖS-rapport.pdf</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
        <div className="ck-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Tilldelad</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Avatar initials="AL" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Anna Lundqvist</div>
              <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>Verksamhetschef</div>
            </div>
            <button className="ck-btn ck-btn--ghost" style={{ width: 24, height: 24, padding: 0 }}><Icon name="chev-down" size={12} /></button>
          </div>

          <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 6 }}>BEVAKARE (3)</div>
          <div style={{ display: "flex", gap: -6 }}>
            <Avatar initials="TK" /><Avatar initials="EB" /><Avatar initials="DH" />
          </div>
        </div>

        <div className="ck-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Beslut</div>
          <button className="ck-btn" style={{ width: "100%", justifyContent: "center", marginBottom: 8 }}><Icon name="check" size={14} />Markera som åtgärdad</button>
          <button className="ck-btn ck-btn--secondary" style={{ width: "100%", justifyContent: "center", marginBottom: 8 }}>Eskalera</button>
          <button className="ck-btn ck-btn--secondary" style={{ width: "100%", justifyContent: "center" }}>Skapa Lex Maria-anmälan</button>
        </div>

        <div className="ck-card" style={{ padding: 16, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Tidslinje</div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            {[
              ["nu", "Hyalase-rapport bifogad", "Anna L."],
              ["1h", "Eskalerat till kritisk", "Toni K."],
              ["1h", "Tilldelad till Anna L.", "Toni K."],
              ["2h", "IVO-anmälan påbörjad", "Toni K."],
              ["2h", "Status: under utredning", "System"],
              ["3h", "Avvikelse skapad", "Erik B."],
            ].map(([t, what, who], i, arr) => (
              <div key={i} style={{ display: "flex", gap: 10, position: "relative", paddingBottom: i < arr.length - 1 ? 12 : 0 }}>
                <div style={{ position: "relative", width: 8, flexShrink: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 999, background: "var(--ck-primary)", marginTop: 5 }} />
                  {i < arr.length - 1 && <div style={{ position: "absolute", top: 14, left: 3, bottom: -2, width: 2, background: "var(--ck-divider)" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{what}</div>
                  <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{who} · {t}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);

/* ── Create new deviation (modal-like, but full page) ── */
const DeviationNew = () => (
  <AppShell active="deviations" topbarProps={{
    breadcrumbs: ["Avvikelser", "Ny"],
  }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 760 }}>
        <div style={{ marginBottom: 20 }}>
          <h1 className="ck-serif" style={{ fontSize: 28, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Rapportera avvikelse</h1>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>
            Ta det viktiga först — du kan komplettera detaljer senare.
            <span className="ck-kbd" style={{ marginLeft: 8 }}>⌘</span><span className="ck-kbd">↵</span> sparar utkast.
          </div>
        </div>

        <div className="ck-card" style={{ padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label className="ck-label">Kategori *</label>
              <button className="ck-input" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 32 }}>
                <span>Komplikation</span><Icon name="chev-down" size={14} />
              </button>
            </div>
            <div>
              <label className="ck-label">Severity *</label>
              <div style={{ display: "flex", gap: 4 }}>
                {[
                  ["Låg", "low", false],
                  ["Medel", "medium", false],
                  ["Hög", "high", false],
                  ["Kritisk", "critical", true],
                ].map(([n, lvl, on]) => (
                  <button key={n} style={{
                    flex: 1, height: 32, borderRadius: 6, fontSize: 12, fontWeight: 500,
                    border: on ? `1.5px solid var(--ck-danger)` : "1px solid var(--ck-border-strong)",
                    background: on ? "var(--ck-danger-soft)" : "var(--ck-surface)",
                    color: on ? "var(--ck-danger)" : "var(--ck-ink-2)",
                  }}>{n}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="ck-label">Rubrik *</label>
            <input className="ck-input" defaultValue="Vaskulär ocklusion vid filler-injektion i nasolabialveck" />
            <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginTop: 4 }}>62 / 200 tecken</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="ck-label">Beskrivning</label>
            <textarea className="ck-input ck-textarea" defaultValue="Patient fick filler-injektion (Restylane Lyft) i höger nasolabialveck. Inom 30 sek noterades blanching och kraftig smärta. Misstänkt vaskulär ocklusion. Akut hyalase-protokoll initierades omedelbart."></textarea>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label className="ck-label">Klinik</label>
              <button className="ck-input" style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Östermalm</span><Icon name="chev-down" size={14} />
              </button>
            </div>
            <div>
              <label className="ck-label">Patient (valfritt)</label>
              <button className="ck-input" style={{ display: "flex", justifyContent: "space-between", color: "var(--ck-ink-2)" }}>
                <span className="ck-mono">P-44217</span><Icon name="chev-down" size={14} />
              </button>
            </div>
            <div>
              <label className="ck-label">Produkt-batch</label>
              <button className="ck-input" style={{ display: "flex", justifyContent: "space-between", color: "var(--ck-ink-2)" }}>
                <span className="ck-mono">L23F0214</span><Icon name="chev-down" size={14} />
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="ck-label">Bifoga foto eller dokument</label>
            <div style={{ border: "1px dashed var(--ck-border-strong)", borderRadius: 8, padding: "20px 16px", textAlign: "center", color: "var(--ck-ink-3)", background: "var(--ck-surface-sunken)" }}>
              <Icon name="upload" size={16} />
              <div style={{ fontSize: 12, marginTop: 6 }}>Dra hit eller <a style={{ color: "var(--ck-primary)", textDecoration: "underline" }}>klicka för att välja</a></div>
              <div style={{ fontSize: 11, marginTop: 2 }}>PNG, JPG, PDF · max 10 MB · sparas i EU</div>
            </div>
          </div>

          {/* Severity-triggered warning */}
          <div style={{ padding: "12px 14px", borderRadius: 8, background: "var(--ck-danger-soft)", display: "flex", gap: 10, marginBottom: 20 }}>
            <Icon name="alert" size={14} />
            <div style={{ fontSize: 12, color: "var(--ck-danger)" }}>
              <strong>Kritisk severity</strong> — Lex Maria-bedömning krävs inom 24h.
              SLA-klocka startar vid spara. Vill du även påbörja IVO-anmälan?
              <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, color: "var(--ck-ink-2)", fontWeight: 500 }}>
                <input type="checkbox" defaultChecked /> Ja, koppla en IVO-anmälan-checklista
              </label>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="ck-btn ck-btn--ghost">Avbryt</button>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="ck-btn ck-btn--secondary">Spara utkast</button>
              <button className="ck-btn">Rapportera & tilldela →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);

Object.assign(window, { DeviationsList, DeviationDetail, DeviationNew });
