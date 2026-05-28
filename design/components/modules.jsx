/* Compliance Center, Ordination consulting inbox, Medications */

const ComplianceCenter = () => (
  <AppShell active="compliance" topbarProps={{ breadcrumbs: ["Derma Beauty AB", "Compliance Center"] }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Compliance Center</h1>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>
            Hjälpmedel för din kvalitetsansvariga — inte ett myndighetsutlåtande från CareKompass.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ck-btn ck-btn--secondary"><Icon name="clock" size={14} />Historik</button>
          <button className="ck-btn"><Icon name="download" size={14} />Generera audit-paket</button>
        </div>
      </div>

      {/* Score banner */}
      <div className="ck-card" style={{ padding: 24, display: "grid", gridTemplateColumns: "260px 1fr 300px", gap: 28, alignItems: "center" }}>
        <div style={{ position: "relative", width: 200, height: 200, justifySelf: "center" }}>
          <svg viewBox="0 0 100 100" width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--ck-surface-sunken)" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--ck-primary)" strokeWidth="8"
                    strokeDasharray={`${87 * 2.64} 1000`} strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div>
              <div className="ck-tnum" style={{ fontSize: 56, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>87</div>
              <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginTop: 4 }}>av 100</div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <span className="ck-badge ck-badge--ok">GRÖNT</span>
            <span className="ck-badge">↑ 3 vs. förra månaden</span>
            <span className="ck-badge">SOSFS 2011:9</span>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Stabil compliance över hela bolaget</h2>
          <p style={{ fontSize: 13, color: "var(--ck-ink-2)", lineHeight: 1.5, marginBottom: 14 }}>
            Era avvikelser stängs i tid, läkemedelsspårningen är komplett och styrdokumenten signerade.
            Det som drar ner är 3 missade hygienkontroller den här veckan och 1 delegering som behöver förnyas.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {[
              ["Dokument", 92, 0.15], ["Avvikelser", 88, 0.20], ["Hygien", 71, 0.20], ["Läkemedel", 95, 0.10],
              ["Ord./Deleg.", 89, 0.15], ["Risk", 84, 0.10], ["Personal", 90, 0.10],
            ].map(([name, score, weight]) => (
              <div key={name} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "var(--ck-ink-3)", marginBottom: 4 }}>{name}</div>
                <div style={{ height: 60, background: "var(--ck-surface-sunken)", borderRadius: 4, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${score}%`, background: score >= 80 ? "var(--ck-success)" : score >= 50 ? "var(--ck-warning)" : "var(--ck-danger)" }} />
                </div>
                <div className="ck-tnum" style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{score}</div>
                <div className="ck-mono" style={{ fontSize: 9, color: "var(--ck-ink-3)" }}>×{weight}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: 16, background: "var(--ck-surface-sunken)", borderRadius: 10 }}>
          <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 8 }}>SENASTE BERÄKNING</div>
          <div style={{ fontSize: 12, lineHeight: 1.8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ck-ink-3)" }}>Senaste körning</span><span className="ck-mono">2026-05-27 03:00</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ck-ink-3)" }}>Nästa</span><span className="ck-mono">2026-05-28 03:00</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ck-ink-3)" }}>Frekvens</span><span>Dygnsvis (pg_cron)</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ck-ink-3)" }}>Period</span><span>Senaste 90d</span></div>
          </div>
          <button className="ck-btn ck-btn--secondary" style={{ width: "100%", marginTop: 12, justifyContent: "center", height: 30 }}>Räkna om nu</button>
        </div>
      </div>

      {/* Action items */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1, overflow: "hidden" }}>
        <div className="ck-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Vad behöver åtgärdas</div>
              <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>Sorterat efter scorepåverkan</div>
            </div>
            <span className="ck-badge ck-badge--medium">7 punkter</span>
          </div>
          <div style={{ overflow: "hidden" }}>
            {[
              { icon: "sparkle", title: "3 missade hygienkontroller — Östermalm", note: "Daglig öppning + 2 \"efter patient\". −4.2 score.", level: "danger" },
              { icon: "shield", title: "Delegering går ut om 4 dagar", note: "Maria S. — sjuksköterskedelegering. −1.8 om utgången.", level: "warning" },
              { icon: "alert", title: "AVV-2026-0138 över SLA", note: "Brist i delegering — förfallen 9h. −2.4 score.", level: "danger" },
              { icon: "scale", title: "Risk \"Vaskulär ocklusion\" — översyn förfallen", note: "Score 16 (mycket hög). Översyn skulle gjorts 1 maj.", level: "warning" },
              { icon: "graduation", title: "Legitimation utgång 30d — Erik B.", note: "Sjuksköterskelegitimation går ut 26 juni.", level: "info" },
              { icon: "doc", title: "Lex Maria-rutin osignerad", note: "v2.1 publicerad 22 maj. 2 personer kvar att signera.", level: "info" },
            ].map((it, i) => (
              <div key={i} style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-divider)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, background: `var(--ck-${it.level === "danger" ? "danger" : it.level === "warning" ? "warning" : "info"}-soft)`, color: `var(--ck-${it.level === "danger" ? "danger" : it.level === "warning" ? "warning" : "info"})`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon name={it.icon} size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{it.title}</div>
                  <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>{it.note}</div>
                </div>
                <button className="ck-btn ck-btn--ghost" style={{ height: 26 }}>Åtgärda →</button>
              </div>
            ))}
          </div>
        </div>

        <div className="ck-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-border)" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Trend · 90 dagar</div>
            <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>Score-utveckling, alla kliniker</div>
          </div>
          <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Mini chart */}
            <svg viewBox="0 0 400 140" style={{ width: "100%", height: 140 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--ck-primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--ck-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* grid */}
              {[0, 35, 70, 105].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="var(--ck-divider)" strokeWidth="0.5" />)}
              {/* score line */}
              <path d="M0 60 L40 50 L80 55 L120 42 L160 48 L200 35 L240 40 L280 28 L320 32 L360 26 L400 18" fill="none" stroke="var(--ck-primary)" strokeWidth="2" />
              <path d="M0 60 L40 50 L80 55 L120 42 L160 48 L200 35 L240 40 L280 28 L320 32 L360 26 L400 18 L400 140 L0 140 Z" fill="url(#grad)" />
              {/* dots */}
              {[[0,60],[80,55],[160,48],[240,40],[320,32],[400,18]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r="3" fill="var(--ck-primary)" />
              ))}
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ck-ink-3)", marginTop: 4 }}>
              <span>1 mar</span><span>15 mar</span><span>1 apr</span><span>15 apr</span><span>1 maj</span><span>idag</span>
            </div>

            <hr className="ck-hr" style={{ margin: "20px 0" }} />

            <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 10 }}>FÖRRA AUDIT-PAKET</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "var(--ck-surface-sunken)", borderRadius: 8 }}>
              <Icon name="doc" size={16} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>audit-2026-04-30.zip</div>
                <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>Genererat 30 apr · 14.2 MB · giltigt till 7 maj</div>
              </div>
              <button className="ck-btn ck-btn--secondary" style={{ height: 28 }}><Icon name="download" size={12} />Ladda ner</button>
            </div>

            <div style={{ marginTop: 16, padding: 12, background: "var(--ck-warning-soft)", borderRadius: 8, fontSize: 12, color: "var(--ck-ink-2)" }}>
              <strong style={{ color: "oklch(0.45 0.12 80)" }}>Påminnelse:</strong> Compliance-score är ett verktyg för er kvalitetsansvariga.
              Den är inte ett godkännande från CareKompass eller en myndighet.
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);


/* ── Ordination Inbox (consulting practitioner cross-tenant) ── */
const OrdinationInbox = () => (
  <AppShell active="orders" topbarProps={{ breadcrumbs: ["Dr. Eva Hedman", "Konsulterande läkare", "Inbox"] }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "grid", gridTemplateColumns: "320px 1fr", gap: 12 }}>
      {/* Left: tenant list */}
      <div className="ck-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--ck-border)" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Inkommande ordinationer</div>
          <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>Konsulterande över 4 bolag · 7 väntar</div>
        </div>

        <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--ck-border)" }}>
          <input className="ck-input" placeholder="Sök patient, läkemedel, klinik…" />
        </div>

        <div style={{ overflow: "hidden", flex: 1 }}>
          {[
            { sel: true, who: "Derma Beauty AB", clinic: "Östermalm", patient: "P-44217", med: "Botulinumtoxin 100E", urgency: "Idag", color: "warn", n: 3 },
            { who: "Stockholm Estetik", clinic: "Vasastan", patient: "P-91044", med: "Restylane Lyft 1ml", urgency: "Imorgon", color: "info", n: 2 },
            { who: "Aesthetic Lab", clinic: "Östermalm", patient: "P-12903", med: "Profhilo 2ml", urgency: "Imorgon", color: "info", n: 1 },
            { who: "Skin & Co", clinic: "Kungsholmen", patient: "P-77441", med: "Botulinumtoxin 50E", urgency: "Fre 29 maj", color: null, n: 1 },
          ].map((t, i) => (
            <div key={i} style={{
              padding: "12px 16px",
              background: t.sel ? "var(--ck-primary-soft)" : "transparent",
              borderLeft: t.sel ? "3px solid var(--ck-primary)" : "3px solid transparent",
              borderBottom: "1px solid var(--ck-divider)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: t.sel ? "var(--ck-primary)" : "var(--ck-ink)" }}>{t.who}</span>
                <span style={{ fontSize: 11, color: t.color === "warn" ? "var(--ck-warning)" : "var(--ck-ink-3)", fontWeight: 600 }}>{t.urgency}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--ck-ink-2)" }}>{t.clinic} · <span className="ck-mono">{t.patient}</span></div>
              <div style={{ fontSize: 12, color: "var(--ck-ink-2)", marginTop: 2 }}>{t.med}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, alignItems: "center" }}>
                <span className="ck-badge" style={{ fontSize: 10 }}>{t.n} ordination{t.n > 1 ? "er" : ""}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
        <div className="ck-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span className="ck-badge ck-badge--primary"><Icon name="external" size={10} />Cross-tenant</span>
              <span className="ck-badge ck-badge--medium">Väntar din signatur</span>
              <span className="ck-badge">Derma Beauty AB</span>
            </div>
            <span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>ORD-DB-2026-0089</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6, letterSpacing: "-0.015em" }}>
            Botulinumtoxin 100E — panna + glabella
          </h2>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>
            Begärd av Anna Lundqvist · Östermalm · för patient <span className="ck-mono">P-44217</span> (kvinna, 41)
          </div>
        </div>

        <div className="ck-card" style={{ padding: 20, flex: 1, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 10 }}>BEHANDLINGSPLAN</div>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 14px", fontSize: 12 }}>
                <span style={{ color: "var(--ck-ink-3)" }}>Läkemedel</span><span>Botulinumtoxin typ A (Botox® 100E)</span>
                <span style={{ color: "var(--ck-ink-3)" }}>Dos</span><span className="ck-mono">20E panna · 24E glabella</span>
                <span style={{ color: "var(--ck-ink-3)" }}>Område</span><span>Frontalis + corrugator + procerus</span>
                <span style={{ color: "var(--ck-ink-3)" }}>Injektionspunkter</span><span>11 punkter</span>
                <span style={{ color: "var(--ck-ink-3)" }}>Utförare</span><span>Anna Lundqvist (sjuksköterska)</span>
                <span style={{ color: "var(--ck-ink-3)" }}>Delegering</span><span className="ck-mono">DEL-0042 ✓ giltig till 2026-09-30</span>
                <span style={{ color: "var(--ck-ink-3)" }}>Behandlingstid</span><span>27 maj 2026 14:30</span>
                <span style={{ color: "var(--ck-ink-3)" }}>Förra behandling</span><span>17 mar 2026 (samma område)</span>
              </div>

              <hr className="ck-hr" style={{ margin: "16px 0" }} />

              <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 10 }}>HÄLSODEKLARATION (UTDRAG)</div>
              <div style={{ fontSize: 12, lineHeight: 1.6, color: "var(--ck-ink-2)" }}>
                Inga kända allergier mot albumin eller botulinumtoxin.
                Ej gravid / ammande. Inga muskulära sjukdomar. Inga blodförtunnande
                läkemedel senaste 7 dagarna. <a style={{ color: "var(--ck-primary)", textDecoration: "underline" }}>Visa fullständig deklaration →</a>
              </div>
            </div>

            <div>
              <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 10 }}>SÄKERHETSKOLL · AUTOMATISK</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  ["Patient över 18 år", true],
                  ["Delegering giltig för utförare", true],
                  ["Hälsodeklaration uppdaterad (< 6 mån)", true],
                  ["Samtycke signerat", true],
                  ["Inga aktiva varningar i patientens historik", true],
                  ["Tidigare ordination med samma läkemedel — utan komplikation", true],
                  ["Tillräcklig batch på lager", true, "L23F0214 · utgång 2027-03"],
                ].map(([label, ok, sub]) => (
                  <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 10px", background: "var(--ck-success-soft)", borderRadius: 6 }}>
                    <Icon name="check" size={14} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ck-ink)" }}>{label}</div>
                      {sub && <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)" }}>{sub}</div>}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, padding: 12, background: "var(--ck-info-soft)", borderRadius: 8, fontSize: 12, color: "var(--ck-ink-2)" }}>
                <strong style={{ color: "var(--ck-info)" }}>Stark autentisering:</strong> Godkännande kräver BankID-signering. SLA per ordination = 7d.
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="ck-btn ck-btn--ghost"><Icon name="x" size={14} />Begär komplettering</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="ck-btn ck-btn--secondary">Avslå</button>
            <button className="ck-btn ck-btn--lg"><Icon name="shield" size={14} />Godkänn med BankID</button>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);


/* ── Medications ── */
const Medications = () => (
  <AppShell active="medications" topbarProps={{ breadcrumbs: ["Derma Beauty AB", "Östermalm", "Läkemedel"] }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Läkemedel & produkter</h1>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>42 batchar · 2 utgång &lt; 30d · temperaturlogg uppdaterad 14 min sedan</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ck-btn ck-btn--secondary"><Icon name="thermometer" size={14} />Temperaturlogg</button>
          <button className="ck-btn"><Icon name="plus" size={14} />Registrera batch</button>
        </div>
      </div>

      {/* Temp graph + KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 }}>
        <div className="ck-card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Läkemedelskyl 1 — Östermalm</div>
              <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>2.0 – 8.0 °C tillåtet · 24h fönster</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <span className="ck-badge ck-badge--ok"><span className="ck-dot ck-dot--ok" />Kyl 1 OK</span>
              <span className="ck-badge ck-badge--medium"><span className="ck-dot ck-dot--warn" />Kyl 2 — 9.4°C</span>
            </div>
          </div>

          <svg viewBox="0 0 400 120" style={{ width: "100%", height: 120 }}>
            <rect x="0" y="36" width="400" height="48" fill="var(--ck-success-soft)" opacity="0.5" />
            <text x="4" y="34" fontSize="9" fill="var(--ck-ink-3)" fontFamily="var(--ck-font-mono)">8°C</text>
            <text x="4" y="92" fontSize="9" fill="var(--ck-ink-3)" fontFamily="var(--ck-font-mono)">2°C</text>
            <path d="M0 60 L40 58 L80 62 L120 55 L160 60 L200 64 L240 56 L280 60 L320 58 L360 62 L400 60" fill="none" stroke="var(--ck-primary)" strokeWidth="2" />
            {/* spike for kyl 2 */}
            <path d="M0 60 L40 58 L80 56 L120 50 L160 44 L200 38 L240 28 L260 22 L280 30 L320 42 L360 50 L400 56" fill="none" stroke="var(--ck-warning)" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="260" cy="22" r="4" fill="var(--ck-warning)" />
            <text x="266" y="20" fontSize="9" fill="var(--ck-warning)" fontFamily="var(--ck-font-mono)">9.4°C @ 22:14</text>
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ck-ink-3)" }}>
            <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>23:59</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <KpiCard label="Aktiva batchar" value="42" dot="ok" sub="över 6 produkter" />
          <KpiCard label="Utgång < 30 d" value="2" dot="warn" sub="Restylane Lyft, Profhilo" />
          <KpiCard label="Kassationer Q2" value="3" dot="info" sub="prod-felaktig · utgång · spill" />
          <KpiCard label="Spårbarhet" value="100%" dot="ok" sub="alla uttag loggade" />
        </div>
      </div>

      {/* Inventory table */}
      <div className="ck-card" style={{ flex: 1, overflow: "hidden" }}>
        <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Aktivt lager</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="ck-btn ck-btn--secondary" style={{ height: 28 }}>Visa kassationer</button>
            <button className="ck-btn ck-btn--ghost" style={{ height: 28 }}><Icon name="download" size={12} />Export</button>
          </div>
        </div>
        <table className="ck-table">
          <thead>
            <tr>
              <th>PRODUKT</th>
              <th>BATCH</th>
              <th>KVARANTAL</th>
              <th>UTGÅNG</th>
              <th>FÖRVARING</th>
              <th>SENAST UTTAG</th>
              <th>SPÅRBARHET</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[
              { p: "Botulinumtoxin (Botox® 100E)", b: "B45L2025", qty: "8 / 12 fl.", exp: "2027-03-15", st: "Kyl 1 · 4°C", last: "23 maj", trace: "OK" },
              { p: "Restylane Lyft 1ml", b: "L23F0214", qty: "11 / 20", exp: "2026-06-08", st: "Rumstemp", last: "23 maj", trace: "OK", warn: true },
              { p: "Profhilo 2ml", b: "PR-2025-A14", qty: "3 / 10", exp: "2026-06-22", st: "Rumstemp", last: "22 maj", trace: "OK", warn: true },
              { p: "Skinbooster Vital", b: "SV-04-26", qty: "6 / 8", exp: "2027-01-30", st: "Rumstemp", last: "20 maj", trace: "OK" },
              { p: "Hyalase 1500 IE", b: "HY-2025-091", qty: "5 / 5", exp: "2026-12-30", st: "Kyl 1 · 4°C", last: "23 maj", trace: "OK" },
              { p: "Lidokain 1% inj.", b: "LID-25-883", qty: "14 / 20", exp: "2027-04-10", st: "Rumstemp", last: "23 maj", trace: "OK" },
              { p: "Adrenalin 1mg/ml", b: "AD-25-441", qty: "4 / 4", exp: "2026-08-12", st: "Akutväska", last: "—", trace: "OK" },
            ].map(r => (
              <tr key={r.b}>
                <td><span style={{ fontWeight: 500 }}>{r.p}</span></td>
                <td><span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-2)" }}>{r.b}</span></td>
                <td>{r.qty}</td>
                <td>
                  <span className="ck-mono" style={{ fontSize: 11, color: r.warn ? "var(--ck-warning)" : "var(--ck-ink-2)", fontWeight: r.warn ? 600 : 400 }}>{r.exp}</span>
                  {r.warn && <span className="ck-badge ck-badge--medium" style={{ marginLeft: 6, fontSize: 10 }}>&lt; 30d</span>}
                </td>
                <td>{r.st}</td>
                <td><span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{r.last}</span></td>
                <td><span className="ck-badge ck-badge--ok" style={{ fontSize: 10 }}>{r.trace}</span></td>
                <td><button className="ck-btn ck-btn--ghost" style={{ width: 24, height: 24, padding: 0 }}><Icon name="more" size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AppShell>
);

Object.assign(window, { ComplianceCenter, OrdinationInbox, Medications });
