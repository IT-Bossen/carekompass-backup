/* Customers (Fas 8) · External practitioners (Fas 9) · Settings · Billing */

/* ── CUSTOMERS ── */
const Customers = () => (
  <AppShell active="users" topbarProps={{ breadcrumbs: ["Derma Beauty AB", "Patienter"] }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Patienter</h1>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>
            1 204 patienter · 412 aktiva senaste 12 mån · 3 GDPR-begäranden pågående
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ck-btn ck-btn--secondary"><Icon name="download" size={14} />GDPR-export</button>
          <button className="ck-btn"><Icon name="plus" size={14} />Lägg till patient</button>
        </div>
      </div>

      {/* PDL banner — must always be visible */}
      <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--ck-warning-soft)", display: "flex", gap: 12, border: "1px solid oklch(0.85 0.08 80)" }}>
        <Icon name="alert" size={16} />
        <div style={{ flex: 1, fontSize: 12, color: "var(--ck-ink-2)" }}>
          <strong style={{ color: "oklch(0.45 0.12 80)" }}>PDL-disclaimer aktiv:</strong> CareKompass är <em>inte</em> ett journalsystem enligt patientdatalagen.
          Behandlingsanteckningar är strukturerade (max 500 tecken, inga bilagor) — riktig journal förs i godkänt system.
          <span className="ck-mono" style={{ marginLeft: 8, color: "var(--ck-ink-3)" }}>accepterad 2026-01-22 av Toni K.</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input className="ck-input" placeholder="Sök patient (namn, personnummer, telefon)…" style={{ flex: 1 }} />
        <button className="ck-btn ck-btn--secondary">Status: Aktiv</button>
        <button className="ck-btn ck-btn--secondary">Sorterad: Senaste besök</button>
      </div>

      <div className="ck-card" style={{ flex: 1, overflow: "hidden" }}>
        <table className="ck-table">
          <thead><tr><th>PATIENT</th><th>PERSONNR</th><th>FÖRSTA BESÖK</th><th>SENASTE BESÖK</th><th>BEHANDLINGAR</th><th>HÄLSODEKL.</th><th>SAMTYCKE</th><th>VARNINGAR</th></tr></thead>
          <tbody>
            {[
              { id: "P-44217", n: "K***** S*****", pn: "19850214-XXXX", first: "2023-08-14", last: "Idag 14:30", visits: 14, h: "uppdat. 2026-02", c: "Botox + Filler", warn: ["Vaskulär ocklusion AVV-2026-0142"] },
              { id: "P-91044", n: "M*** L***", pn: "19720801-XXXX", first: "2024-03-22", last: "2026-05-22", visits: 6, h: "uppdat. 2026-05", c: "Botox" },
              { id: "P-12903", n: "E*** B*****", pn: "19901103-XXXX", first: "2025-01-08", last: "2026-05-18", visits: 4, h: "förfallen", hWarn: true, c: "Filler", warn: ["Hälsodek. > 6 mån"] },
              { id: "P-77441", n: "J**** N*****", pn: "19770421-XXXX", first: "2022-11-30", last: "2026-04-12", visits: 22, h: "uppdat. 2026-04", c: "Botox + PRP" },
              { id: "P-08812", n: "S*** A*****", pn: "19661205-XXXX", first: "2023-02-14", last: "2026-03-30", visits: 9, h: "uppdat. 2026-03", c: "Skinbooster" },
              { id: "P-22019", n: "A*** K***", pn: "19920718-XXXX", first: "2025-08-04", last: "2026-02-20", visits: 2, h: "uppdat. 2025-08", c: "Filler" },
            ].map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar initials="••" color="oklch(0.85 0.02 60)" />
                    <div>
                      <div style={{ fontWeight: 500 }}>{p.n}</div>
                      <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{p.id}</div>
                    </div>
                  </div>
                </td>
                <td><span className="ck-mono" style={{ fontSize: 11 }}>{p.pn}</span></td>
                <td><span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{p.first}</span></td>
                <td><span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{p.last}</span></td>
                <td className="ck-tnum">{p.visits}</td>
                <td><span style={{ fontSize: 12, color: p.hWarn ? "var(--ck-warning)" : "var(--ck-ink-2)", fontWeight: p.hWarn ? 600 : 400 }}>{p.h}</span></td>
                <td><span style={{ fontSize: 12 }}>{p.c}</span></td>
                <td>{p.warn ? p.warn.map(w => <span key={w} className="ck-badge ck-badge--medium" style={{ fontSize: 10 }}>{w}</span>) : <span style={{ color: "var(--ck-ink-3)" }}>—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AppShell>
);


/* ── EXTERNAL PRACTITIONERS / ROOM RENTAL (Fas 9) ── */
const ExternalPractitioners = () => (
  <AppShell active="users" topbarProps={{ breadcrumbs: ["Derma Beauty AB", "Externa behandlare & uthyrning"] }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Externa behandlare & rumsuthyrning</h1>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>
            4 externa kontrakt aktiva · 2 rum uthyrda · nästa förfallodatum 30 sep
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ck-btn ck-btn--secondary"><Icon name="doc" size={14} />Mall: hyresavtal</button>
          <button className="ck-btn"><Icon name="plus" size={14} />Nytt kontrakt</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, flex: 1, overflow: "hidden" }}>
        {/* Practitioners */}
        <div className="ck-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--ck-border)" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Externa behandlare</div>
            <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>Hyr rum, egen försäkring, separat ansvarsfördelning</div>
          </div>
          {[
            { n: "Stefan Norén", role: "Skönhetsterapeut SHR", room: "Rum 3", treats: "Hudvård, peelings", contract: "2025-09-01 → 2026-08-31", insurance: "If P&C · ok", status: "ok" },
            { n: "Cecilia Roos", role: "Massör", room: "Rum 4", treats: "Klassisk massage", contract: "2025-11-15 → 2026-11-14", insurance: "Trygg-Hansa · ok", status: "ok" },
            { n: "Daniel Lund", role: "Tatuerare", room: "Studio A (egen plan)", treats: "Cover-up + linework", contract: "2025-06-01 → 2026-05-31", insurance: "Saknas", status: "warn" },
            { n: "Petra Sand", role: "Permanent makeup", room: "Rum 3 · delad", treats: "Microblading, lipblush", contract: "Förfallodatum 30 sep 2026", insurance: "Folksam · ok", status: "ok" },
          ].map(p => (
            <div key={p.n} style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-divider)", display: "flex", gap: 12 }}>
              <Avatar initials={p.n.split(" ").map(s => s[0]).join("")} color="oklch(0.55 0.12 200)" />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.n}</div>
                  {p.status === "warn"
                    ? <span className="ck-badge ck-badge--medium">Försäkring saknas</span>
                    : <span className="ck-badge ck-badge--ok">Komplett</span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--ck-ink-2)", marginBottom: 6 }}>{p.role} · {p.room}</div>
                <div style={{ fontSize: 11, color: "var(--ck-ink-3)", display: "grid", gridTemplateColumns: "auto 1fr", gap: "2px 10px" }} className="ck-mono">
                  <span>BEHANDL.</span><span>{p.treats}</span>
                  <span>AVTAL</span><span>{p.contract}</span>
                  <span>FÖRSÄK.</span><span style={{ color: p.status === "warn" ? "var(--ck-danger)" : "inherit" }}>{p.insurance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rooms */}
        <div className="ck-card" style={{ padding: 18, overflow: "hidden" }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Rum & beläggning</div>
          <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 16 }}>Östermalm · 5 behandlingsrum + 1 studio</div>

          {/* Floor plan-ish grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
            {[
              { id: "Rum 1", who: "Intern", color: "var(--ck-primary-soft)", text: "var(--ck-primary)", treats: "Botox / Filler" },
              { id: "Rum 2", who: "Intern", color: "var(--ck-primary-soft)", text: "var(--ck-primary)", treats: "Botox / Filler" },
              { id: "Rum 3", who: "Stefan N. · Petra S.", color: "oklch(0.93 0.04 200)", text: "oklch(0.45 0.12 200)", treats: "Hudvård · PMU" },
              { id: "Rum 4", who: "Cecilia R.", color: "oklch(0.93 0.04 200)", text: "oklch(0.45 0.12 200)", treats: "Massage" },
              { id: "Rum 5", who: "Intern", color: "var(--ck-primary-soft)", text: "var(--ck-primary)", treats: "PRP / Skinbooster" },
              { id: "Studio A", who: "Daniel L.", color: "var(--ck-warning-soft)", text: "oklch(0.45 0.12 80)", treats: "Tatuering" },
            ].map(r => (
              <div key={r.id} style={{ padding: 12, borderRadius: 8, background: r.color, minHeight: 80 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: r.text }} className="ck-mono">{r.id.toUpperCase()}</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 6, color: r.text }}>{r.who}</div>
                <div style={{ fontSize: 11, color: "var(--ck-ink-2)", marginTop: 2 }}>{r.treats}</div>
              </div>
            ))}
          </div>

          <hr className="ck-hr" style={{ margin: "16px 0" }} />

          <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 10 }}>ANSVARSFÖRDELNING</div>
          <div style={{ fontSize: 12, color: "var(--ck-ink-2)", lineHeight: 1.6 }}>
            Vid extern behandlare:
            <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
              <li>Egen försäkring krävs (verifierad av Toni K.)</li>
              <li>Hygienrutiner följer kliniken — extern behandlare signerar</li>
              <li>Egna behandlingsanteckningar i CareKompass · separat scope</li>
              <li>Egen avvikelsehantering med koppling till klinikens compliance-score</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);


/* ── SETTINGS / BILLING ── */
const SettingsBilling = () => (
  <AppShell active="settings" topbarProps={{ breadcrumbs: ["Derma Beauty AB", "Inställningar", "Billing"] }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
      <div>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 8 }}>INSTÄLLNINGAR</div>
        {[
          ["Bolag", false], ["Kliniker", false], ["Användare & roller", false],
          ["Billing & abonnemang", true], ["Integrationer", false],
          ["Notifieringar", false], ["Säkerhet & loggning", false], ["Branding (Enterprise)", false],
        ].map(([l, a]) => (
          <div key={l} style={{ padding: "7px 10px", borderRadius: 6, fontSize: 13, marginBottom: 1, background: a ? "var(--ck-primary-soft)" : "transparent", color: a ? "var(--ck-primary)" : "var(--ck-ink-2)", fontWeight: a ? 600 : 500 }}>{l}</div>
        ))}
      </div>

      <div style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Billing & abonnemang</h1>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>Stripe-prenumeration · ditt eget kassasystem för patienter berörs inte</div>
        </div>

        {/* Plan card */}
        <div className="ck-card" style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          <div>
            <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 6 }}>NUVARANDE PLAN</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <span className="ck-serif" style={{ fontSize: 28, fontWeight: 500 }}>Pro</span>
              <span className="ck-badge ck-badge--primary">TRIAL</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>9 dagar kvar · prenumeration ej aktiverad</div>
            <button className="ck-btn" style={{ marginTop: 14 }}>Aktivera nu</button>
          </div>

          <div>
            <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 6 }}>VID AKTIVERING</div>
            <div style={{ fontSize: 12, lineHeight: 1.7 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ck-ink-3)" }}>Pro plan</span><span>1 295 kr / klinik</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ck-ink-3)" }}>2 kliniker</span><span className="ck-mono">× 2</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ck-ink-3)" }}>Extra användare (3)</span><span>+ 435 kr</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ck-ink-3)" }}>Moms 25%</span><span>+ 756 kr</span></div>
              <hr className="ck-hr" style={{ margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}><span>Totalt / mån</span><span className="ck-tnum">3 781 kr</span></div>
            </div>
          </div>

          <div>
            <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 6 }}>BETALMETOD</div>
            <div style={{ padding: 12, border: "1px dashed var(--ck-border-strong)", borderRadius: 8, fontSize: 12, color: "var(--ck-ink-3)", marginBottom: 8 }}>
              Ej kopplad. Stripe Customer Portal öppnas vid aktivering.
            </div>
            <button className="ck-btn ck-btn--secondary" style={{ width: "100%", justifyContent: "center" }}><Icon name="external" size={14} />Öppna Stripe Portal</button>
            <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginTop: 10 }}>
              Stripe webhook uppdaterar feature flags i realtid.
            </div>
          </div>
        </div>

        {/* Invoices + features */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, flex: 1, overflow: "hidden" }}>
          <div className="ck-card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-border)" }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Fakturahistorik</div>
              <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>Genereras av Stripe · sparas 7 år</div>
            </div>
            <table className="ck-table">
              <thead><tr><th>FAKTURA</th><th>BELOPP</th><th>STATUS</th><th>DATUM</th><th></th></tr></thead>
              <tbody>
                {[
                  ["INV-2026-0014", "3 781 kr", "Aktuell — autodrag 5 jun", "warn"],
                  ["INV-2026-0009", "3 781 kr", "Betald", "ok"],
                  ["INV-2026-0004", "3 781 kr", "Betald", "ok"],
                  ["INV-2025-0411", "3 545 kr", "Betald", "ok"],
                ].map(([id, amt, st, c]) => (
                  <tr key={id}>
                    <td><span className="ck-mono" style={{ fontSize: 11 }}>{id}</span></td>
                    <td className="ck-tnum">{amt}</td>
                    <td>{c === "warn" ? <span className="ck-badge ck-badge--medium">{st}</span> : <span className="ck-badge ck-badge--ok">{st}</span>}</td>
                    <td className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>2026-05-05</td>
                    <td><button className="ck-btn ck-btn--ghost" style={{ height: 24 }}><Icon name="download" size={12} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ck-card" style={{ padding: 18, overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Aktiva feature flags (Pro)</div>
            {[
              ["module.deviations_enabled", true],
              ["module.documents_enabled", true],
              ["module.medications_enabled", true],
              ["module.orders_enabled", true],
              ["module.hygiene_enabled", true],
              ["module.risk_enabled", true],
              ["module.compliance_enabled", true],
              ["module.staff_enabled", true],
              ["module.customers_enabled", true],
              ["integration.bankid_enabled", false],
              ["integration.bokadirekt_enabled", false],
            ].map(([k, on]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12 }}>
                <span className="ck-mono" style={{ color: "var(--ck-ink-2)", fontSize: 11 }}>{k}</span>
                <span style={{ width: 26, height: 14, borderRadius: 999, background: on ? "var(--ck-primary)" : "var(--ck-border-strong)", position: "relative", flexShrink: 0 }}>
                  <span style={{ position: "absolute", width: 10, height: 10, borderRadius: 999, background: "#fff", top: 2, left: on ? 14 : 2, transition: "left 150ms" }} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);


/* ── SETTINGS / COMPANY ── */
const SettingsCompany = () => (
  <AppShell active="settings" topbarProps={{ breadcrumbs: ["Derma Beauty AB", "Inställningar", "Bolag"] }}>
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
      <div>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 8 }}>INSTÄLLNINGAR</div>
        {[
          ["Bolag", true], ["Kliniker", false], ["Användare & roller", false],
          ["Billing & abonnemang", false], ["Integrationer", false],
          ["Notifieringar", false], ["Säkerhet & loggning", false], ["Branding (Enterprise)", false],
        ].map(([l, a]) => (
          <div key={l} style={{ padding: "7px 10px", borderRadius: 6, fontSize: 13, marginBottom: 1, background: a ? "var(--ck-primary-soft)" : "transparent", color: a ? "var(--ck-primary)" : "var(--ck-ink-2)", fontWeight: a ? 600 : 500 }}>{l}</div>
        ))}
      </div>

      <div style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Bolagsuppgifter</h1>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>Företagsdata, bransch och kvalitetsansvarig</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="ck-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Juridisk info</div>
            {[
              ["Bolagsnamn", "Derma Beauty AB"],
              ["Org.nr", "559123-4567", "mono"],
              ["F-skatt", "Ja · verifierad 2023-02-14", "mono"],
              ["Bransch (industry_template)", "estetisk_injektion", "mono"],
              ["Reglerande myndighet", "IVO"],
              ["Tenant", "tenant-db-001", "mono"],
            ].map(([l, v, m]) => (
              <div key={l} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--ck-divider)", fontSize: 12 }}>
                <span style={{ color: "var(--ck-ink-3)" }}>{l}</span>
                <span className={m === "mono" ? "ck-mono" : ""} style={{ color: "var(--ck-ink)" }}>{v}</span>
              </div>
            ))}
            <button className="ck-btn ck-btn--secondary" style={{ marginTop: 14 }}>Begär migration av bransch</button>
          </div>

          <div className="ck-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Kvalitetsansvariga · KRAV per 01 §7.0</div>
            <div style={{ padding: 12, background: "var(--ck-success-soft)", borderRadius: 8, marginBottom: 14, fontSize: 12, color: "var(--ck-ink-2)", display: "flex", gap: 10 }}>
              <Icon name="check" size={14} />
              <div>
                <strong style={{ color: "var(--ck-success)" }}>Minst en kvalitetsansvarig finns.</strong> Bolaget uppfyller CK:s grundkrav: egenkontrollen är inte "herrelös".
              </div>
            </div>
            {[
              ["Toni Kazarian", "Verksamhetschef · kvalitetsansvarig", "Sedan 2023-02-14", true],
              ["Anna Lundqvist", "Kvalitetsansvarig (sekundär)", "Sedan 2024-08-20"],
            ].map(([n, r, since, primary]) => (
              <div key={n} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--ck-divider)" }}>
                <Avatar initials={n.split(" ").map(s=>s[0]).join("")} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>{n} {primary && <span className="ck-badge ck-badge--primary" style={{ fontSize: 9 }}>PRIMÄR</span>}</div>
                  <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{r} · {since}</div>
                </div>
              </div>
            ))}
            <button className="ck-btn ck-btn--ghost" style={{ marginTop: 8, height: 28 }}><Icon name="plus" size={12} />Lägg till</button>
          </div>
        </div>

        {/* Integrations preview row */}
        <div className="ck-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Integrationer (snabböversikt)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { name: "Stripe", desc: "Prenumeration", st: "Trial — ej kopplad", color: "warn" },
              { name: "BankID", desc: "Signering & stark auth", st: "Inaktiv (Fas 10)", color: null },
              { name: "BokaDirekt", desc: "Bokningssynk", st: "Inaktiv (Fas 10)", color: null },
              { name: "Lovable Email", desc: "Transaktionsmail", st: "Aktiv", color: "ok" },
            ].map(i => (
              <div key={i.name} style={{ padding: 14, border: "1px solid var(--ck-border)", borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{i.name}</div>
                <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 8 }}>{i.desc}</div>
                <span className={i.color === "ok" ? "ck-badge ck-badge--ok" : i.color === "warn" ? "ck-badge ck-badge--medium" : "ck-badge"} style={{ fontSize: 10 }}>{i.st}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);

Object.assign(window, { Customers, ExternalPractitioners, SettingsBilling, SettingsCompany });
