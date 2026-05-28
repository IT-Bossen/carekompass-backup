/* Documents · Hygiene desktop · Risk · Staff · Audit · Notifications */

/* ── DOCUMENTS ── */
const Documents = () => (
  <AppShell active="documents" topbarProps={{ breadcrumbs: ["Derma Beauty AB", "Styrdokument"] }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
      {/* Categories */}
      <div>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 8 }}>KATEGORIER</div>
        {[
          ["Alla", 47, true],
          ["Policy", 8],
          ["Rutin", 21],
          ["Mall (form)", 9],
          ["Checklista", 6],
          ["Riktlinje", 3],
        ].map(([label, n, active]) => (
          <div key={label} style={{
            padding: "7px 10px", borderRadius: 6, marginBottom: 1,
            background: active ? "var(--ck-primary-soft)" : "transparent",
            color: active ? "var(--ck-primary)" : "var(--ck-ink-2)",
            fontWeight: active ? 600 : 500, fontSize: 13,
            display: "flex", justifyContent: "space-between",
          }}>
            <span>{label}</span>
            <span style={{ fontSize: 11, color: "var(--ck-ink-3)" }} className="ck-tnum">{n}</span>
          </div>
        ))}

        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", margin: "20px 0 8px" }}>STATUS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}><input type="checkbox" defaultChecked /> Publicerat</label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}><input type="checkbox" /> Utkast</label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}><input type="checkbox" /> Arkiverat</label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}><input type="checkbox" /> Väntar signering</label>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Styrdokument</h1>
            <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>47 dokument · 2 väntar signering · senaste publicering 22 maj</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="ck-btn ck-btn--secondary"><Icon name="upload" size={14} />Importera mall</button>
            <button className="ck-btn"><Icon name="plus" size={14} />Nytt dokument</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input className="ck-input" placeholder="Sök i titel, innehåll, taggar…" style={{ flex: 1 }} />
          <button className="ck-btn ck-btn--secondary">Sortera: Senast ändrad <Icon name="chev-down" size={12} /></button>
          <button className="ck-btn ck-btn--secondary">Vy: Tabell <Icon name="chev-down" size={12} /></button>
        </div>

        <div className="ck-card" style={{ flex: 1, overflow: "hidden" }}>
          <table className="ck-table">
            <thead>
              <tr><th>TITEL</th><th>KATEGORI</th><th>VERSION</th><th>STATUS</th><th>SIGNERAT</th><th>UPPDATERAD</th><th>ÄGARE</th><th></th></tr>
            </thead>
            <tbody>
              {[
                { t: "Lex Maria — inrapportering", c: "Rutin", v: "v2.1", st: "needs_sig", sign: "5 / 7", up: "22 maj", own: "Toni K.", new: true },
                { t: "Hygienrutin — bashygien & handhygien", c: "Rutin", v: "v3.0", st: "published", sign: "12 / 12", up: "18 maj", own: "Maria S." },
                { t: "Hygienrutin — behandlingsrum & instrument", c: "Rutin", v: "v2.4", st: "published", sign: "12 / 12", up: "18 maj", own: "Maria S." },
                { t: "Komplikationshantering — vaskulär ocklusion", c: "Rutin", v: "v1.8", st: "published", sign: "8 / 8", up: "5 maj", own: "Dr. Hedman" },
                { t: "Samtycke — botulinumtoxin", c: "Mall", v: "v1.2", st: "published", sign: "—", up: "12 apr", own: "Toni K." },
                { t: "Ledningssystem för systematiskt kvalitetsarbete", c: "Policy", v: "v1.0", st: "published", sign: "3 / 3", up: "20 jan", own: "Toni K." },
                { t: "GDPR / personuppgiftshantering", c: "Policy", v: "v1.1", st: "published", sign: "12 / 12", up: "8 feb", own: "Toni K." },
                { t: "Akutväska — innehållskontroll", c: "Checklista", v: "v1.0", st: "draft", sign: "—", up: "26 maj", own: "Anna L." },
                { t: "Komplikationshantering — allergisk reaktion", c: "Rutin", v: "v1.5", st: "published", sign: "8 / 8", up: "3 feb", own: "Dr. Hedman" },
                { t: "Daglig öppning av lokal", c: "Checklista", v: "v2.0", st: "published", sign: "—", up: "12 jan", own: "Maria S." },
              ].map(r => (
                <tr key={r.t}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon name="doc" size={14} />
                      <span style={{ fontWeight: 500 }}>{r.t}</span>
                      {r.new && <span className="ck-badge ck-badge--primary" style={{ fontSize: 10 }}>NY</span>}
                    </div>
                  </td>
                  <td><span className="ck-badge">{r.c}</span></td>
                  <td><span className="ck-mono" style={{ fontSize: 11 }}>{r.v}</span></td>
                  <td>{r.st === "needs_sig" ? <span className="ck-badge ck-badge--medium">Signering krävs</span> : r.st === "draft" ? <span className="ck-badge">Utkast</span> : <span className="ck-badge ck-badge--ok">Publicerad</span>}</td>
                  <td><span className="ck-mono" style={{ fontSize: 11, color: r.sign !== "—" && !r.sign.startsWith(r.sign.split(" / ")[1]) ? "var(--ck-warning)" : "var(--ck-ink-2)" }}>{r.sign}</span></td>
                  <td><span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{r.up}</span></td>
                  <td><div style={{ display: "flex", gap: 6, alignItems: "center" }}><Avatar initials={r.own.split(" ").map(s=>s[0]).join("")} /><span style={{ fontSize: 12 }}>{r.own}</span></div></td>
                  <td><button className="ck-btn ck-btn--ghost" style={{ width: 24, height: 24, padding: 0 }}><Icon name="more" size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppShell>
);


/* ── HYGIENE DESKTOP (schedule view) ── */
const HygieneDesktop = () => (
  <AppShell active="hygiene" topbarProps={{ breadcrumbs: ["Derma Beauty AB", "Östermalm", "Hygien & egenkontroll"] }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Hygien & egenkontroll</h1>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>Vecka 22 · 18 / 21 utförda · 3 missade · 2 ej OK utlöste avvikelse</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ck-btn ck-btn--secondary"><Icon name="settings" size={14} />Hantera mallar</button>
          <button className="ck-btn"><Icon name="plus" size={14} />Schemalägg ny</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <KpiCard label="Utförda denna v." value="18 / 21" delta="85.7%" dot="warn" sub="3 missade morgonkontroller" />
        <KpiCard label="Ej OK den här månaden" value="4" delta="↓ 2 vs förra" dot="info" sub="auto-skapad avvikelse" />
        <KpiCard label="Aktiva scheman" value="9" dot="ok" sub="2 dagliga · 4 vecko · 3 månads" />
        <KpiCard label="Foto-evidens" value="124" sub="senaste 30 dagar · 1.2 GB" />
      </div>

      {/* Week schedule */}
      <div className="ck-card" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Vecka 22 · 25–31 maj 2026</div>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="ck-btn ck-btn--ghost" style={{ width: 28, height: 28, padding: 0 }}><Icon name="chev-down" size={14} style={{ transform: "rotate(90deg)" }} /></button>
            <button className="ck-btn ck-btn--secondary" style={{ height: 28 }}>Idag</button>
            <button className="ck-btn ck-btn--ghost" style={{ width: 28, height: 28, padding: 0 }}><Icon name="chev-right" size={14} /></button>
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflow: "hidden", display: "grid", gridTemplateRows: "auto 1fr" }}>
          <div style={{ display: "grid", gridTemplateColumns: "200px repeat(7, 1fr)", borderBottom: "1px solid var(--ck-border)" }}>
            <div style={{ padding: "10px 14px", fontSize: 11, color: "var(--ck-ink-3)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>KONTROLL</div>
            {["Mån 25", "Tis 26", "Ons 27", "Tor 28", "Fre 29", "Lör 30", "Sön 31"].map((d, i) => (
              <div key={d} style={{
                padding: "10px 8px", textAlign: "center", fontSize: 11,
                color: i === 2 ? "var(--ck-primary)" : "var(--ck-ink-3)",
                fontWeight: i === 2 ? 600 : 500, textTransform: "uppercase", letterSpacing: "0.04em",
              }}>{d}</div>
            ))}
          </div>

          <div>
            {[
              { name: "Daglig öppning — behandlingsklinik", freq: "Dagligen", who: "Morgon-team", states: ["ok","ok","active","todo","todo","na","na"] },
              { name: "Behandlingsrum efter patient", freq: "Per event", who: "Behandlare", states: ["ok-mini","ok-mini","ok-mini","na","na","na","na"], multi: true },
              { name: "Veckokontroll — läkemedelskyl", freq: "Veckovis", who: "Maria S.", states: ["na","na","miss","na","na","na","na"] },
              { name: "Avfall stick/skär — tömning", freq: "2× per vecka", who: "Maria S.", states: ["ok","na","na","na","todo","na","na"] },
              { name: "Akutväska — kontroll & försegling", freq: "Månadsvis", who: "Anna L.", states: ["na","na","na","na","todo","na","na"] },
              { name: "Sporprov autoklav", freq: "Veckovis", who: "Maria S.", states: ["ok","na","na","na","na","na","na"] },
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "200px repeat(7, 1fr)", borderBottom: "1px solid var(--ck-divider)", minHeight: 56 }}>
                <div style={{ padding: "10px 14px" }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{row.name}</div>
                  <div style={{ fontSize: 10, color: "var(--ck-ink-3)" }}>{row.freq} · {row.who}</div>
                </div>
                {row.states.map((st, j) => (
                  <div key={j} style={{ padding: 6, display: "grid", placeItems: "center" }}>
                    {st === "ok" && <div style={{ width: "100%", height: 36, borderRadius: 6, background: "var(--ck-success-soft)", color: "var(--ck-success)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600 }}>OK</div>}
                    {st === "ok-mini" && <div style={{ width: "100%", height: 36, borderRadius: 6, background: "var(--ck-success-soft)", color: "var(--ck-success)", display: "flex", gap: 2, alignItems: "center", justifyContent: "center", fontSize: 10 }}>OK ×4</div>}
                    {st === "active" && <div style={{ width: "100%", height: 36, borderRadius: 6, background: "var(--ck-primary-soft)", color: "var(--ck-primary)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600 }}>Pågår</div>}
                    {st === "todo" && <div style={{ width: "100%", height: 36, borderRadius: 6, background: "var(--ck-surface-sunken)", color: "var(--ck-ink-3)", display: "grid", placeItems: "center", fontSize: 11, border: "1px dashed var(--ck-border)" }}>—</div>}
                    {st === "miss" && <div style={{ width: "100%", height: 36, borderRadius: 6, background: "var(--ck-danger-soft)", color: "var(--ck-danger)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600 }}>Miss</div>}
                    {st === "na" && <div style={{ width: "100%", height: 36 }} />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);


/* ── RISK (5×5 matrix + list) ── */
const RISK_CELLS = [
  [{ s: 5, n: 0 }, { s: 10, n: 1 }, { s: 15, n: 0 }, { s: 20, n: 0 }, { s: 25, n: 0 }],
  [{ s: 4, n: 2 }, { s: 8,  n: 1 }, { s: 12, n: 1 }, { s: 16, n: 1 }, { s: 20, n: 0 }],
  [{ s: 3, n: 3 }, { s: 6,  n: 4 }, { s: 9,  n: 2 }, { s: 12, n: 0 }, { s: 15, n: 0 }],
  [{ s: 2, n: 1 }, { s: 4,  n: 5 }, { s: 6,  n: 2 }, { s: 8,  n: 1 }, { s: 10, n: 0 }],
  [{ s: 1, n: 0 }, { s: 2,  n: 2 }, { s: 3,  n: 1 }, { s: 4,  n: 0 }, { s: 5,  n: 0 }],
];
const riskColor = s => s <= 4 ? "var(--ck-success)" : s <= 9 ? "var(--ck-warning)" : s <= 15 ? "oklch(0.65 0.16 50)" : "var(--ck-danger)";
const riskSoft  = s => s <= 4 ? "var(--ck-success-soft)" : s <= 9 ? "var(--ck-warning-soft)" : s <= 15 ? "oklch(0.95 0.04 50)" : "var(--ck-danger-soft)";

const RiskAnalysis = () => (
  <AppShell active="risk" topbarProps={{ breadcrumbs: ["Derma Beauty AB", "Riskanalys"] }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16 }}>
      {/* Left: list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Riskanalys</h1>
            <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>SOSFS 2011:9 · 28 identifierade risker · 2 mycket höga · senaste översyn 12 apr</div>
          </div>
          <button className="ck-btn"><Icon name="plus" size={14} />Ny risk</button>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <button className="ck-btn ck-btn--secondary" style={{ height: 28 }}>Område: Alla</button>
          <button className="ck-btn ck-btn--secondary" style={{ height: 28 }}>Status: Aktiv</button>
          <button className="ck-btn ck-btn--secondary" style={{ height: 28 }}>Ägare: Alla</button>
          <button className="ck-btn ck-btn--ghost" style={{ height: 28 }}>Återställ filter</button>
        </div>

        <div className="ck-card" style={{ flex: 1, overflow: "hidden" }}>
          <table className="ck-table">
            <thead><tr><th>RISK</th><th>OMRÅDE</th><th>P × K</th><th>SCORE</th><th>ÅTGÄRD</th><th>ÄGARE</th><th>ÖVERSYN</th></tr></thead>
            <tbody>
              {[
                { name: "Vaskulär ocklusion vid filler", area: "Komplikation", p: 4, k: 4, own: "Dr. Hedman", review: "Förfallen", reviewWarn: true },
                { name: "Anafylaxi vid topisk anestesi", area: "Komplikation", p: 2, k: 5, own: "Dr. Hedman", review: "12 jul" },
                { name: "Produktförväxling — botox / hyalase", area: "Läkemedel", p: 3, k: 4, own: "Anna L.", review: "1 sep" },
                { name: "Bristande sterilisering", area: "Hygien", p: 2, k: 4, own: "Maria S.", review: "8 aug" },
                { name: "Felaktig dosering — patient med Eaton-Lambert", area: "Behandling", p: 1, k: 5, own: "Dr. Hedman", review: "21 nov" },
                { name: "Bristfälligt samtycke — minderårig", area: "Dokumentation", p: 2, k: 3, own: "Toni K.", review: "30 jul" },
                { name: "Stickskada — personal", area: "Personal", p: 3, k: 2, own: "Maria S.", review: "1 dec" },
                { name: "Felaktig temperatur läkemedelskyl", area: "Läkemedel", p: 4, k: 2, own: "Maria S.", review: "5 jul" },
                { name: "Patientdata-läckage", area: "GDPR", p: 1, k: 5, own: "Toni K.", review: "1 okt" },
              ].map(r => {
                const s = r.p * r.k;
                return (
                  <tr key={r.name}>
                    <td><span style={{ fontWeight: 500 }}>{r.name}</span></td>
                    <td><span style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>{r.area}</span></td>
                    <td className="ck-mono" style={{ fontSize: 12 }}>{r.p} × {r.k}</td>
                    <td>
                      <span style={{
                        display: "inline-grid", placeItems: "center",
                        width: 28, height: 22, borderRadius: 4,
                        background: riskSoft(s), color: riskColor(s),
                        fontSize: 12, fontWeight: 600,
                      }} className="ck-tnum">{s}</span>
                    </td>
                    <td><span className="ck-badge">{s >= 16 ? "Omedelbar" : s >= 10 ? "Plan obl." : s >= 5 ? "Rekommenderad" : "Bevaka"}</span></td>
                    <td><div style={{ display: "flex", gap: 6, alignItems: "center" }}><Avatar initials={r.own.split(" ").map(x=>x[0]).join("")} /><span style={{ fontSize: 12 }}>{r.own}</span></div></td>
                    <td><span className="ck-mono" style={{ fontSize: 11, color: r.reviewWarn ? "var(--ck-danger)" : "var(--ck-ink-3)", fontWeight: r.reviewWarn ? 600 : 400 }}>{r.review}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: matrix */}
      <div className="ck-card" style={{ padding: 22, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ marginBottom: 16 }}>
          <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 4 }}>RISKMATRIS · 5×5</div>
          <h2 style={{ fontSize: 17, fontWeight: 600 }}>Probability × Konsekvens</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "30px 1fr", gap: 8, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 11, color: "var(--ck-ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Probability →</div>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "30px repeat(5, 1fr)", gap: 4 }}>
              <div />
              {[1,2,3,4,5].map(k => <div key={k} style={{ textAlign: "center", fontSize: 11, color: "var(--ck-ink-3)", fontWeight: 600 }} className="ck-mono">K{k}</div>)}
              {RISK_CELLS.map((row, ri) => (
                <React.Fragment key={ri}>
                  <div style={{ display: "grid", placeItems: "center", fontSize: 11, color: "var(--ck-ink-3)", fontWeight: 600 }} className="ck-mono">P{5 - ri}</div>
                  {row.map((cell, ci) => (
                    <div key={ci} style={{
                      aspectRatio: "1.4",
                      borderRadius: 6, background: riskSoft(cell.s),
                      border: `1px solid ${riskColor(cell.s)}`,
                      display: "flex", alignItems: "center", justifyContent: "center", padding: 6,
                      position: "relative",
                    }}>
                      <span style={{ fontSize: 18, fontWeight: 600, color: riskColor(cell.s) }} className="ck-tnum">{cell.s}</span>
                      {cell.n > 0 && <span style={{
                        position: "absolute", top: 4, right: 4,
                        background: riskColor(cell.s), color: "#fff",
                        width: 18, height: 18, borderRadius: 999, display: "grid", placeItems: "center",
                        fontSize: 10, fontWeight: 700,
                      }} className="ck-tnum">{cell.n}</span>}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 8, fontSize: 11, color: "var(--ck-ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>← Konsekvens</div>
          </div>
        </div>

        <hr className="ck-hr" style={{ margin: "16px 0" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {[
            { label: "Mycket hög (16–25)", n: 2, color: "var(--ck-danger)" },
            { label: "Hög (10–15)", n: 1, color: "oklch(0.65 0.16 50)" },
            { label: "Medel (5–9)", n: 9, color: "var(--ck-warning)" },
            { label: "Låg (1–4)", n: 13, color: "var(--ck-success)" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
              <span style={{ flex: 1, color: "var(--ck-ink-2)" }}>{l.label}</span>
              <span className="ck-mono" style={{ fontWeight: 600 }}>{l.n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </AppShell>
);


/* ── STAFF & legitimation ── */
const Staff = () => (
  <AppShell active="staff" topbarProps={{ breadcrumbs: ["Derma Beauty AB", "Personal & legitimation"] }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Personal & legitimation</h1>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>14 medarbetare · 1 certifikat går ut inom 30d · 0 utgångna</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ck-btn ck-btn--secondary"><Icon name="users" size={14} />Bjud in</button>
          <button className="ck-btn"><Icon name="plus" size={14} />Lägg till</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <KpiCard label="Aktiva" value="14" sub="3 leg. läkare · 4 ssk · 6 behandlare · 1 admin" dot="ok" />
        <KpiCard label="Med delegering" value="6" sub="alla giltiga" dot="ok" />
        <KpiCard label="Cert. utgång < 30d" value="1" sub="Erik B. — sjuksköterskeleg." dot="warn" />
        <KpiCard label="Konsulter (cross-tenant)" value="2" sub="Dr. Hedman, Dr. Östberg" dot="info" />
      </div>

      <div className="ck-card" style={{ flex: 1, overflow: "hidden" }}>
        <table className="ck-table">
          <thead><tr><th>NAMN</th><th>ROLL</th><th>KAPABILITETER</th><th>LEGITIMATION</th><th>UTGÅNG</th><th>DELEGERING</th><th>SENAST INLOGG</th><th></th></tr></thead>
          <tbody>
            {[
              { n: "Toni Kazarian", r: "Verksamhetschef", caps: ["quality_manager"], leg: "—", exp: "—", del: "—", last: "12 min" },
              { n: "Anna Lundqvist", r: "Verksamhetschef", caps: ["quality_manager", "licensed_practitioner"], leg: "Sjuksköterska 19720114-XXXX", exp: "2031-04-12", del: "DEL-0040 · giltig", last: "1h" },
              { n: "Dr. Eva Hedman", r: "Consulting practitioner", caps: ["consulting"], leg: "Läkare 19651101-XXXX", exp: "Tillsvidare", del: "Delegerar 4 ssk", last: "32 min" },
              { n: "Maria Sjöberg", r: "Sjuksköterska", caps: ["licensed", "hygiene_lead"], leg: "Sjuksköterska 19880322-XXXX", exp: "2029-08-30", del: "DEL-0042 · giltig", last: "4h" },
              { n: "Erik Berg", r: "Sjuksköterska", caps: ["licensed"], leg: "Sjuksköterska 19850519-XXXX", exp: "2026-06-26", expWarn: true, del: "DEL-0044 · giltig", last: "2h" },
              { n: "Lisa Hellman", r: "Behandlare", caps: ["medication_custodian"], leg: "Hudterapeut SHR", exp: "2028-10-15", del: "—", last: "6h" },
              { n: "Stefan Norén", r: "Extern behandlare", caps: ["external"], leg: "Skönhetsterapeut", exp: "2027-05-20", del: "Per kontrakt", last: "1d" },
            ].map(p => (
              <tr key={p.n}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar initials={p.n.split(" ").map(s=>s[0]).join("").slice(0,2)} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{p.n}</div>
                      <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{p.r === "Consulting practitioner" ? "extern · 3 bolag" : "Östermalm"}</div>
                    </div>
                  </div>
                </td>
                <td>{p.r}</td>
                <td>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {p.caps.map(c => <span key={c} className="ck-badge" style={{ fontSize: 10 }}>{c}</span>)}
                  </div>
                </td>
                <td><span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-2)" }}>{p.leg}</span></td>
                <td><span className="ck-mono" style={{ fontSize: 11, color: p.expWarn ? "var(--ck-warning)" : "var(--ck-ink-3)", fontWeight: p.expWarn ? 600 : 400 }}>{p.exp}{p.expWarn && " ⚠"}</span></td>
                <td><span style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>{p.del}</span></td>
                <td><span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{p.last}</span></td>
                <td><button className="ck-btn ck-btn--ghost" style={{ width: 24, height: 24, padding: 0 }}><Icon name="more" size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AppShell>
);


/* ── AUDIT LOG ── */
const AuditLog = () => (
  <AppShell active="audit" topbarProps={{ breadcrumbs: ["Derma Beauty AB", "Audit log"] }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Audit log</h1>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>
            Append-only · 7 års retention · <span className="ck-mono">1 482 händelser senaste 90d</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ck-btn ck-btn--secondary"><Icon name="download" size={14} />Export CSV</button>
          <button className="ck-btn ck-btn--secondary"><Icon name="download" size={14} />PDF-paket</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input className="ck-input" placeholder="Sök actor, entity, request_id…" style={{ flex: 1 }} />
        <button className="ck-btn ck-btn--secondary">Entity: alla</button>
        <button className="ck-btn ck-btn--secondary">Action: alla</button>
        <button className="ck-btn ck-btn--secondary">Tidsperiod: 30 d</button>
      </div>

      <div className="ck-card" style={{ flex: 1, overflow: "hidden" }}>
        <table className="ck-table">
          <thead><tr><th>TIDSSTÄMPEL</th><th>ACTOR</th><th>ROLL</th><th>ACTION</th><th>ENTITY</th><th>BEFORE → AFTER</th><th>REQUEST</th></tr></thead>
          <tbody>
            {[
              { ts: "27 maj 09:18:42.114", actor: "Anna Lundqvist", role: "manager", action: "deviation.update", entity: "AVV-2026-0142", change: "status: open → investigating", req: "req-7K4P-9aF3", impersonated: false },
              { ts: "27 maj 09:14:08.812", actor: "Anna Lundqvist", role: "manager", action: "deviation.assign", entity: "AVV-2026-0142", change: "assignee: null → Anna L.", req: "req-7K4P-9aF2" },
              { ts: "27 maj 09:12:22.701", actor: "Erik Berg", role: "staff", action: "deviation.create", entity: "AVV-2026-0142", change: "severity: critical", req: "req-7K4P-9aF1" },
              { ts: "27 maj 08:42:15.330", actor: "Maria Sjöberg", role: "staff", action: "hygiene.check.submit", entity: "HYG-2026-0521", change: "result: ok (7/10 items)", req: "req-7K4P-9aE9" },
              { ts: "27 maj 03:00:01.244", actor: "system", role: "system", action: "compliance.recalc", entity: "company:db-001", change: "score: 84 → 87", req: "cron-comp-20260527" },
              { ts: "26 maj 22:14:18.901", actor: "system", role: "system", action: "medication.temperature_breach", entity: "Kyl-2", change: "temp: 8.0 → 9.4", req: "iot-evt-2025051" },
              { ts: "26 maj 19:42:08.402", actor: "Dr. Eva Hedman", role: "consulting", action: "order.approve", entity: "ORD-2026-0088", change: "status: pending → approved", req: "req-6T2H-1bC4", note: "BankID signing" },
              { ts: "26 maj 14:08:22.110", actor: "Toni Kazarian", role: "owner", action: "document.publish", entity: "Lex Maria-rutin v2.1", change: "version: 2.0 → 2.1", req: "req-5N1J-8aB2" },
              { ts: "26 maj 11:32:18.992", actor: "[impersonated:Sofia Andersson]", role: "impersonated_admin", action: "company.read", entity: "Derma Beauty AB", change: "—", req: "imp-9F2K-7aA1", impersonated: true },
            ].map((r, i) => (
              <tr key={i} style={{ background: r.impersonated ? "var(--ck-warning-soft)" : undefined }}>
                <td><span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{r.ts}</span></td>
                <td><span style={{ fontSize: 12, color: r.impersonated ? "var(--ck-warning)" : "var(--ck-ink)", fontWeight: r.impersonated ? 600 : 400 }}>{r.actor}</span></td>
                <td><span className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)" }}>{r.role}</span></td>
                <td><span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-primary)", fontWeight: 500 }}>{r.action}</span></td>
                <td><span style={{ fontSize: 12 }}>{r.entity}</span></td>
                <td><span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-2)" }}>{r.change}</span></td>
                <td><span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{r.req}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AppShell>
);


/* ── NOTIFICATIONS DROPDOWN ── */
const NotificationsView = () => (
  <AppShell active="dashboard" topbarProps={{ breadcrumbs: ["Översikt"] }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", position: "relative" }}>
      <h1 className="ck-serif" style={{ fontSize: 22, lineHeight: 1.1, letterSpacing: "-0.02em" }}>Notifieringar (preview)</h1>
      <p style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>Klockan i topbar öppnar denna dropdown. 34 typer · realtime via Supabase channel.</p>

      {/* Mock dropdown */}
      <div style={{ position: "absolute", top: 70, right: 24, width: 420, background: "var(--ck-surface)", border: "1px solid var(--ck-border)", borderRadius: 12, boxShadow: "var(--ck-shadow-pop)", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--ck-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Notifieringar</div>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="ck-btn ck-btn--ghost" style={{ height: 26, fontSize: 11 }}>Markera alla lästa</button>
            <button className="ck-btn ck-btn--ghost" style={{ height: 26, padding: 0, width: 26 }}><Icon name="settings" size={12} /></button>
          </div>
        </div>

        <div className="ck-tabs" style={{ padding: "0 16px" }}>
          <div className="ck-tab is-active">Alla <span className="ck-badge ck-badge--primary" style={{ fontSize: 10, height: 16 }}>5</span></div>
          <div className="ck-tab">Brådskande <span className="ck-badge ck-badge--medium" style={{ fontSize: 10, height: 16 }}>2</span></div>
          <div className="ck-tab">Mina</div>
        </div>

        <div style={{ maxHeight: 540 }}>
          {[
            { type: "deviation.escalated", prio: "urgent", title: "Avvikelse eskalerad till kritisk", body: "AVV-2026-0142 — vaskulär ocklusion · 12h kvar SLA", time: "12 min", unread: true },
            { type: "delegation.expiring_7d", prio: "urgent", title: "Delegering går ut om 4 dagar", body: "Maria S. — sjuksköterskedelegering (DEL-0042)", time: "1h", unread: true },
            { type: "medication.temperature_breach", prio: "urgent", title: "Temperaturavvikelse läkemedelskyl", body: "Kyl-2 · 9.4°C (max 8°C) · Östermalm", time: "10h", unread: true },
            { type: "order.pending", prio: "warning", title: "Ordination väntar din signatur", body: "Botulinumtoxin 100E — patient P-44217", time: "1d", unread: true },
            { type: "subscription.trial_ending_7d", prio: "warning", title: "Trial slut om 9 dagar", body: "Aktivera Pro så slipper appen falla tillbaka", time: "1d", unread: true },
            { type: "document.signature_required", prio: "info", title: "Signering krävs", body: "Lex Maria-rutin v2.1 (5/7 har signerat)", time: "2d" },
            { type: "hygiene.check_failed", prio: "warning", title: "Hygienkontroll ej OK", body: "Veckokontroll läkemedelskyl — auto-skapad avvikelse", time: "5d" },
          ].map((n, i) => (
            <div key={i} style={{
              padding: "12px 16px", borderBottom: "1px solid var(--ck-divider)",
              display: "flex", gap: 12,
              background: n.unread ? "var(--ck-primary-soft)" : "transparent",
              opacity: n.unread ? 1 : 0.85,
            }}>
              <span className={`ck-dot ck-dot--${n.prio === "urgent" ? "danger" : n.prio === "warning" ? "warn" : "info"}`} style={{ marginTop: 5, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>{n.body}</div>
                <div style={{ fontSize: 10, color: "var(--ck-ink-3)", marginTop: 4 }} className="ck-mono">{n.type} · {n.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 16px", textAlign: "center", borderTop: "1px solid var(--ck-border)" }}>
          <a style={{ fontSize: 12, color: "var(--ck-primary)", fontWeight: 500 }}>Visa alla notifieringar →</a>
        </div>
      </div>
    </div>
  </AppShell>
);

Object.assign(window, { Documents, HygieneDesktop, RiskAnalysis, Staff, AuditLog, NotificationsView });
