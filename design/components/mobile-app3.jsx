/* MOBILE MODULES 3 — Risk, Staff, Audit, Customers, Externals, Settings, More menu */

/* ── RISK ── */
const MRisk = () => (
  <MobileShell active="more" topbar={<MTopbar large back="Mer" title="Riskanalys" subtitle="SOSFS 2011:9 · 28 risker · 2 mycket höga" action={<button style={{ background: "transparent", border: 0, padding: 8, color: "var(--ck-primary)" }}><Icon name="plus" size={22} /></button>} />}>
    <MScroll>
      {/* Distribution + matrix mini */}
      <MCard p={16} style={{ marginTop: 14 }}>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 12 }}>FÖRDELNING</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            ["Mycket hög (16–25)", 2, "var(--ck-danger)"],
            ["Hög (10–15)", 1, "oklch(0.65 0.16 50)"],
            ["Medel (5–9)", 9, "var(--ck-warning)"],
            ["Låg (1–4)", 13, "var(--ck-success)"],
          ].map(([l, n, c]) => (
            <div key={l} style={{ padding: 12, borderRadius: 10, background: "var(--ck-surface-sunken)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
                <span style={{ fontSize: 11, color: "var(--ck-ink-2)" }}>{l}</span>
              </div>
              <div className="ck-tnum" style={{ fontSize: 22, fontWeight: 600 }}>{n}</div>
            </div>
          ))}
        </div>
      </MCard>

      {/* Compact matrix */}
      <MCard p={14}>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 10 }}>5×5 MATRIS</div>
        <div style={{ display: "grid", gridTemplateColumns: "16px repeat(5, 1fr)", gap: 3 }}>
          <div />
          {[1,2,3,4,5].map(k => <div key={k} className="ck-mono" style={{ fontSize: 9, color: "var(--ck-ink-3)", textAlign: "center", fontWeight: 600 }}>K{k}</div>)}
          {[5,4,3,2,1].map(p => (
            <React.Fragment key={p}>
              <div className="ck-mono" style={{ fontSize: 9, color: "var(--ck-ink-3)", display: "grid", placeItems: "center", fontWeight: 600 }}>P{p}</div>
              {[1,2,3,4,5].map(k => {
                const s = p * k;
                const n = (p === 4 && k === 4) ? 1 : (p === 3 && k === 4) ? 1 : (p === 2 && k === 5) ? 1 : 0;
                const color = s <= 4 ? "var(--ck-success)" : s <= 9 ? "var(--ck-warning)" : s <= 15 ? "oklch(0.65 0.16 50)" : "var(--ck-danger)";
                const soft  = s <= 4 ? "var(--ck-success-soft)" : s <= 9 ? "var(--ck-warning-soft)" : s <= 15 ? "oklch(0.95 0.04 50)" : "var(--ck-danger-soft)";
                return (
                  <div key={k} style={{ aspectRatio: "1", background: soft, borderRadius: 4, display: "grid", placeItems: "center", position: "relative" }}>
                    <span className="ck-tnum" style={{ fontSize: 10, color, fontWeight: 600 }}>{s}</span>
                    {n > 0 && <span style={{ position: "absolute", top: -3, right: -3, width: 14, height: 14, borderRadius: 999, background: color, color: "#fff", fontSize: 9, fontWeight: 700, display: "grid", placeItems: "center" }} className="ck-tnum">{n}</span>}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </MCard>

      <MSection label="MYCKET HÖGA RISKER · 2">
        <div style={{ background: "var(--ck-surface)" }}>
          {[
            { name: "Vaskulär ocklusion vid filler", area: "Komplikation", s: 16, p: 4, k: 4, own: "Dr. Hedman", review: "Förfallen", warn: true },
            { name: "Anafylaxi vid topisk anestesi", area: "Komplikation", s: 10, p: 2, k: 5, own: "Dr. Hedman", review: "12 jul" },
          ].map(r => (
            <div key={r.name} style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-divider)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{r.name}</span>
                <span style={{
                  display: "inline-grid", placeItems: "center",
                  width: 32, height: 24, borderRadius: 4,
                  background: r.s >= 16 ? "var(--ck-danger-soft)" : "oklch(0.95 0.04 50)",
                  color: r.s >= 16 ? "var(--ck-danger)" : "oklch(0.5 0.14 50)",
                  fontSize: 12, fontWeight: 700,
                }} className="ck-tnum">{r.s}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--ck-ink-3)", display: "flex", gap: 8, marginTop: 4 }}>
                <span>{r.area}</span>
                <span>·</span>
                <span className="ck-mono">P{r.p}×K{r.k}</span>
                <span>·</span>
                <span style={{ color: r.warn ? "var(--ck-danger)" : "inherit" }}>{r.review}</span>
              </div>
            </div>
          ))}
        </div>
      </MSection>

      <MSection label="MEDEL · TOPP 5">
        <div style={{ background: "var(--ck-surface)" }}>
          {[
            ["Produktförväxling — botox / hyalase", "Läkemedel", 9, "Anna L."],
            ["Bristande sterilisering", "Hygien", 8, "Maria S."],
            ["Felaktig temperatur läkemedelskyl", "Läkemedel", 8, "Maria S."],
            ["Bristfälligt samtycke — minderårig", "Dokumentation", 6, "Toni K."],
            ["Stickskada — personal", "Personal", 6, "Maria S."],
          ].map(([n, area, s, own]) => (
            <div key={n} style={{ padding: "11px 18px", borderBottom: "1px solid var(--ck-divider)", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 28, height: 22, borderRadius: 4, background: "var(--ck-warning-soft)", color: "oklch(0.45 0.12 80)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700 }} className="ck-tnum">{s}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{n}</div>
                <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{area} · {own}</div>
              </div>
            </div>
          ))}
        </div>
      </MSection>
    </MScroll>
  </MobileShell>
);


/* ── STAFF ── */
const MStaff = () => (
  <MobileShell active="more" topbar={<MTopbar large back="Mer" title="Personal" subtitle="14 medarbetare · 1 cert. utgång < 30d" action={<button style={{ background: "transparent", border: 0, padding: 8, color: "var(--ck-primary)" }}><Icon name="plus" size={22} /></button>} />}>
    <MScroll>
      <div style={{ padding: "12px 18px 4px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          ["Aktiva", "14", "ok"],
          ["Med delegering", "6", "ok"],
          ["Cert. utg. < 30d", "1", "warn"],
          ["Konsulter", "2", "info"],
        ].map(([l, v, c]) => (
          <div key={l} className="ck-card" style={{ padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className={`ck-dot ck-dot--${c === "warn" ? "warn" : "ok"}`} />
              <span style={{ fontSize: 10, color: "var(--ck-ink-3)" }}>{l}</span>
            </div>
            <div className="ck-tnum" style={{ fontSize: 22, fontWeight: 600, marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>

      <MSection label="MEDARBETARE">
        <div style={{ background: "var(--ck-surface)" }}>
          {[
            { n: "Toni Kazarian", r: "Verksamhetschef · QM", leg: "—", del: "—", warn: false },
            { n: "Anna Lundqvist", r: "Verksamhetschef · QM · ssk", leg: "Ssk · tillsvidare", del: "DEL-0040 ✓" },
            { n: "Dr. Eva Hedman", r: "Consulting practitioner", leg: "Läkare · tillsvidare", del: "Delegerar 4 ssk", consultant: true },
            { n: "Maria Sjöberg", r: "Sjuksköterska · hygiene_lead", leg: "Ssk · 2029-08-30", del: "DEL-0042 ✓" },
            { n: "Erik Berg", r: "Sjuksköterska", leg: "Ssk · 2026-06-26", del: "DEL-0044 ✓", warn: true },
            { n: "Lisa Hellman", r: "Behandlare · medication_custodian", leg: "Hudterapeut SHR", del: "—" },
            { n: "Stefan Norén", r: "Extern behandlare", leg: "Skönhetsterapeut", del: "Per kontrakt", external: true },
          ].map(p => (
            <div key={p.n} style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-divider)", display: "flex", gap: 12 }}>
              <Avatar initials={p.n.split(" ").map(s=>s[0]).join("").slice(0,2)} color={p.consultant ? "oklch(0.5 0.15 200)" : p.external ? "oklch(0.55 0.12 80)" : null} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{p.n}</span>
                  {p.warn && <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--ck-warning)" }} />}
                </div>
                <div style={{ fontSize: 12, color: "var(--ck-ink-3)" }}>{p.r}</div>
                <div className="ck-mono" style={{ fontSize: 10, color: p.warn ? "var(--ck-warning)" : "var(--ck-ink-3)", marginTop: 4, fontWeight: p.warn ? 600 : 400 }}>
                  {p.leg} {p.warn && "⚠"} · {p.del}
                </div>
              </div>
              <Icon name="chev-right" size={14} />
            </div>
          ))}
        </div>
      </MSection>
    </MScroll>
  </MobileShell>
);


/* ── AUDIT LOG ── */
const MAudit = () => (
  <MobileShell active="more" topbar={<MTopbar large back="Mer" title="Audit log" subtitle="1 482 händelser · 90d · append-only" action={<button style={{ background: "transparent", border: 0, padding: 8, color: "var(--ck-primary)" }}><Icon name="download" size={20} /></button>} />}>
    <div style={{ padding: "0 18px 12px", background: "var(--ck-surface)" }}>
      <input className="ck-input" placeholder="Sök actor, entity, request_id…" style={{ height: 40, borderRadius: 10 }} />
    </div>

    <MScroll>
      <div style={{ background: "var(--ck-surface)" }}>
        {[
          { ts: "09:18:42", actor: "Anna Lundqvist", role: "manager", action: "deviation.update", entity: "AVV-2026-0142", change: "open → investigating" },
          { ts: "09:14:08", actor: "Anna Lundqvist", role: "manager", action: "deviation.assign", entity: "AVV-2026-0142", change: "→ Anna L." },
          { ts: "09:12:22", actor: "Erik Berg", role: "staff", action: "deviation.create", entity: "AVV-2026-0142", change: "severity: critical" },
          { ts: "08:42:15", actor: "Maria Sjöberg", role: "staff", action: "hygiene.check.submit", entity: "HYG-2026-0521", change: "ok (7/10)" },
          { ts: "03:00:01", actor: "system", role: "system", action: "compliance.recalc", entity: "company:db-001", change: "84 → 87" },
          { ts: "22:14:18", actor: "system", role: "system", action: "medication.temperature_breach", entity: "Kyl-2", change: "8.0 → 9.4" },
          { ts: "19:42:08", actor: "Dr. Eva Hedman", role: "consulting", action: "order.approve", entity: "ORD-2026-0088", change: "pending → approved · BankID" },
          { ts: "14:08:22", actor: "Toni Kazarian", role: "owner", action: "document.publish", entity: "Lex Maria v2.1", change: "2.0 → 2.1" },
          { ts: "11:32:18", actor: "[imp:Sofia A.]", role: "imp_admin", action: "company.read", entity: "Derma Beauty AB", change: "—", imp: true },
        ].map((r, i) => (
          <div key={i} style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-divider)", background: r.imp ? "var(--ck-warning-soft)" : undefined }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-primary)", fontWeight: 600 }}>{r.action}</span>
              <span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{r.ts}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{r.entity}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: r.imp ? "var(--ck-warning)" : "var(--ck-ink-3)" }}>
                {r.actor} <span className="ck-mono" style={{ marginLeft: 4 }}>· {r.role}</span>
              </span>
              <span className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-2)" }}>{r.change}</span>
            </div>
          </div>
        ))}
      </div>
    </MScroll>
  </MobileShell>
);


/* ── CUSTOMERS ── */
const MCustomers = () => (
  <MobileShell active="more" topbar={<MTopbar large back="Mer" title="Patienter" subtitle="1 204 · 412 aktiva senaste 12 mån" action={<button style={{ background: "transparent", border: 0, padding: 8, color: "var(--ck-primary)" }}><Icon name="plus" size={22} /></button>} />}>
    {/* PDL banner — always visible */}
    <div style={{ margin: "12px 18px", padding: 12, borderRadius: 12, background: "var(--ck-warning-soft)", display: "flex", gap: 10, border: "1px solid oklch(0.85 0.08 80)" }}>
      <Icon name="alert" size={14} />
      <div style={{ fontSize: 11, color: "var(--ck-ink-2)", lineHeight: 1.5 }}>
        <strong style={{ color: "oklch(0.45 0.12 80)" }}>PDL-disclaimer:</strong> CareKompass är inte journalsystem. Strukturerad anteckning max 500 tecken.
      </div>
    </div>

    <div style={{ padding: "0 18px 12px", background: "var(--ck-surface)" }}>
      <input className="ck-input" placeholder="Sök patient…" style={{ height: 40, borderRadius: 10 }} />
    </div>

    <MScroll>
      <div style={{ background: "var(--ck-surface)" }}>
        {[
          { id: "P-44217", n: "K***** S*****", pn: "19850214-XXXX", last: "Idag 14:30", visits: 14, warn: ["Vaskulär ocklusion"] },
          { id: "P-91044", n: "M*** L***", pn: "19720801-XXXX", last: "22 maj", visits: 6 },
          { id: "P-12903", n: "E*** B*****", pn: "19901103-XXXX", last: "18 maj", visits: 4, warn: ["Hälsodek. > 6 mån"] },
          { id: "P-77441", n: "J**** N*****", pn: "19770421-XXXX", last: "12 apr", visits: 22 },
          { id: "P-08812", n: "S*** A*****", pn: "19661205-XXXX", last: "30 mar", visits: 9 },
          { id: "P-22019", n: "A*** K***", pn: "19920718-XXXX", last: "20 feb", visits: 2 },
        ].map(p => (
          <div key={p.id} style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-divider)", display: "flex", gap: 12 }}>
            <Avatar initials="••" color="oklch(0.85 0.02 60)" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{p.n}</span>
                <span className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)" }}>{p.id}</span>
              </div>
              <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 4 }}>{p.pn}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "var(--ck-ink-2)" }}>{p.last} · {p.visits} besök</span>
                {p.warn && <span className="ck-badge ck-badge--medium" style={{ fontSize: 9 }}>{p.warn[0]}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </MScroll>
  </MobileShell>
);


/* ── EXTERNALS / RENTAL ── */
const MExternals = () => (
  <MobileShell active="more" topbar={<MTopbar large back="Mer" title="Externa & uthyrning" subtitle="4 kontrakt · 2 rum uthyrda" />}>
    <MScroll>
      <MSection label="EXTERNA BEHANDLARE" mt={14}>
        <div style={{ background: "var(--ck-surface)" }}>
          {[
            { n: "Stefan Norén", role: "Skönhetsterapeut SHR", room: "Rum 3", status: "ok", contract: "→ 2026-08-31" },
            { n: "Cecilia Roos", role: "Massör", room: "Rum 4", status: "ok", contract: "→ 2026-11-14" },
            { n: "Daniel Lund", role: "Tatuerare", room: "Studio A", status: "warn", contract: "Försäkring saknas" },
            { n: "Petra Sand", role: "Permanent makeup", room: "Rum 3 (delad)", status: "ok", contract: "Förfallodatum 30 sep" },
          ].map(p => (
            <div key={p.n} style={{ padding: "14px 18px", borderBottom: "1px solid var(--ck-divider)", display: "flex", gap: 12 }}>
              <Avatar initials={p.n.split(" ").map(s=>s[0]).join("")} color="oklch(0.55 0.12 200)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{p.n}</span>
                  {p.status === "warn" ? <span className="ck-badge ck-badge--medium" style={{ fontSize: 9 }}>Försäk. saknas</span> : <span className="ck-badge ck-badge--ok" style={{ fontSize: 9 }}>OK</span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>{p.role} · {p.room}</div>
                <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", marginTop: 4 }}>{p.contract}</div>
              </div>
            </div>
          ))}
        </div>
      </MSection>

      <MSection label="RUM · ÖSTERMALM">
        <div style={{ padding: "0 18px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { id: "Rum 1", who: "Intern", t: "Botox / Filler", color: "var(--ck-primary-soft)", textC: "var(--ck-primary)" },
            { id: "Rum 2", who: "Intern", t: "Botox / Filler", color: "var(--ck-primary-soft)", textC: "var(--ck-primary)" },
            { id: "Rum 3", who: "Stefan · Petra", t: "Hudvård · PMU", color: "oklch(0.93 0.04 200)", textC: "oklch(0.45 0.12 200)" },
            { id: "Rum 4", who: "Cecilia", t: "Massage", color: "oklch(0.93 0.04 200)", textC: "oklch(0.45 0.12 200)" },
            { id: "Rum 5", who: "Intern", t: "PRP / Skinbooster", color: "var(--ck-primary-soft)", textC: "var(--ck-primary)" },
            { id: "Studio A", who: "Daniel", t: "Tatuering", color: "var(--ck-warning-soft)", textC: "oklch(0.45 0.12 80)" },
          ].map(r => (
            <div key={r.id} style={{ padding: 12, borderRadius: 10, background: r.color, minHeight: 76 }}>
              <div className="ck-mono" style={{ fontSize: 10, fontWeight: 600, color: r.textC }}>{r.id.toUpperCase()}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, color: r.textC }}>{r.who}</div>
              <div style={{ fontSize: 11, color: "var(--ck-ink-2)", marginTop: 2 }}>{r.t}</div>
            </div>
          ))}
        </div>
      </MSection>
    </MScroll>
  </MobileShell>
);


/* ── SETTINGS ── */
const MSettings = () => (
  <MobileShell active="more" topbar={<MTopbar large back="Mer" title="Inställningar" />}>
    <MScroll>
      <MSection label="DERMA BEAUTY AB" mt={14}>
        <div style={{ background: "var(--ck-surface)" }}>
          <MRow icon="shield" title="Bolagsuppgifter" sub="Org.nr · bransch · kvalitetsansvariga" />
          <MRow icon="home" title="Kliniker" sub="2 aktiva · Östermalm + Vasastan" />
          <MRow icon="users" title="Användare & roller" sub="14 medarbetare · 6 med delegering" />
        </div>
      </MSection>

      <MSection label="ABONNEMANG">
        <div style={{ background: "var(--ck-surface)" }}>
          <MRow icon="scale" iconColor="var(--ck-primary-soft)" title="Billing" sub="Pro · 9 d trial kvar" badge={<span className="ck-badge ck-badge--primary" style={{ fontSize: 9 }}>TRIAL</span>} chev />
          <MRow icon="external" title="Integrationer" sub="Stripe · BankID · BokaDirekt" />
        </div>
      </MSection>

      <MSection label="MIN PROFIL">
        <div style={{ background: "var(--ck-surface)" }}>
          <MRow icon="users" title="Min profil" sub="Toni Kazarian · owner + quality_manager" />
          <MRow icon="bell" title="Notifieringar" sub="In-app · e-post" />
          <MRow icon="lock" title="Säkerhet & inloggning" sub="2FA · sessioner · BankID-koppling" />
        </div>
      </MSection>

      <MSection label="JURIDIK">
        <div style={{ background: "var(--ck-surface)" }}>
          <MRow icon="doc" title="Användarvillkor" />
          <MRow icon="doc" title="Personuppgiftsbiträdesavtal (PuB)" sub="Signerat 2023-02-14" />
          <MRow icon="doc" title="Integritetspolicy" />
        </div>
      </MSection>

      <div style={{ padding: "16px 18px 24px" }}>
        <button style={{ width: "100%", height: 48, background: "transparent", border: "1px solid var(--ck-border-strong)", borderRadius: 12, color: "var(--ck-danger)", fontSize: 14, fontWeight: 500 }}>
          Logga ut
        </button>
        <div className="ck-mono" style={{ textAlign: "center", fontSize: 11, color: "var(--ck-ink-3)", marginTop: 16 }}>v6.0.142 · build 2026-05-26</div>
      </div>
    </MScroll>
  </MobileShell>
);


/* ── MORE MENU (entry point for non-primary modules) ── */
const MMore = () => (
  <MobileShell active="more" topbar={
    <div style={{ background: "var(--ck-surface)", padding: "10px 18px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <Avatar initials="TK" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Toni Kazarian</div>
          <div style={{ fontSize: 12, color: "var(--ck-ink-3)" }}>Verksamhetschef · Derma Beauty AB</div>
        </div>
      </div>
      <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.05, letterSpacing: "-0.025em" }}>Mer</h1>
    </div>
  }>
    <MScroll>
      <MSection label="MODULER" mt={14}>
        <div style={{ background: "var(--ck-surface)" }}>
          <MRow icon="stethoscope" title="Ordinationer" sub="Inbox · 7 väntar" badge={<span className="ck-badge ck-badge--medium" style={{ fontSize: 9 }}>7</span>} />
          <MRow icon="pill" title="Läkemedel" sub="42 batchar · 2 utgång < 30d" />
          <MRow icon="doc" title="Styrdokument" sub="47 dokument · 2 väntar signering" badge={<span className="ck-badge ck-badge--medium" style={{ fontSize: 9 }}>2</span>} />
          <MRow icon="scale" title="Riskanalys" sub="28 risker · 2 mycket höga" />
          <MRow icon="graduation" title="Personal & legitimation" sub="14 medarbetare" />
        </div>
      </MSection>

      <MSection label="ÖVERSYN">
        <div style={{ background: "var(--ck-surface)" }}>
          <MRow icon="shield" title="Compliance Center" sub="Score 87 · grönt" />
          <MRow icon="users" title="Patienter" sub="1 204 · PDL-disclaimer aktiv" />
          <MRow icon="clock" title="Audit log" sub="1 482 händelser senaste 90d" />
          <MRow icon="home" title="Externa & uthyrning" sub="4 kontrakt · 2 rum" />
        </div>
      </MSection>

      <MSection label="KONTO">
        <div style={{ background: "var(--ck-surface)" }}>
          <MRow icon="bell" title="Notifieringar" sub="5 olästa" badge={<span className="ck-badge ck-badge--primary" style={{ fontSize: 9 }}>5</span>} />
          <MRow icon="settings" title="Inställningar" />
          <MRow icon="circle-q" title="Hjälp & support" />
        </div>
      </MSection>

      <div style={{ padding: "16px 18px" }}>
        <div style={{ padding: 14, borderRadius: 12, background: "var(--ck-primary-soft)", display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="sparkle" size={16} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ck-primary)" }}>Trial slut om 9 dagar</div>
            <div style={{ fontSize: 11, color: "var(--ck-ink-2)" }}>Aktivera Pro nu</div>
          </div>
          <Icon name="chev-right" size={16} />
        </div>
      </div>
    </MScroll>
  </MobileShell>
);

Object.assign(window, { MRisk, MStaff, MAudit, MCustomers, MExternals, MSettings, MMore });
