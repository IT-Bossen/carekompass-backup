/* MOBILE APP CORE — Dashboard, Deviations (list/detail/new), Notifications */

/* ── MOBILE DASHBOARD ── */
const MDashboard = () => (
  <MobileShell active="home" topbar={
    <div style={{ background: "var(--ck-surface)", padding: "10px 18px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 10px", borderRadius: 8,
          background: "var(--ck-surface-sunken)",
        }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: "linear-gradient(135deg, var(--ck-primary), oklch(0.55 0.10 200))", color: "#fff", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700 }}>DB</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.1 }}>Derma Beauty</div>
            <div style={{ fontSize: 10, color: "var(--ck-ink-3)", lineHeight: 1.1 }}>Östermalm</div>
          </div>
          <Icon name="chev-down" size={12} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={{ background: "transparent", border: 0, padding: 8, position: "relative", color: "var(--ck-ink-2)" }}>
            <Icon name="bell" size={22} />
            <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: 999, background: "var(--ck-danger)" }} />
          </button>
          <Avatar initials="TK" />
        </div>
      </div>

      <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.025em" }}>God morgon, Toni.</h1>
      <div style={{ fontSize: 12, color: "var(--ck-ink-2)", marginTop: 2 }}>Ons 27 maj · 2 saker väntar din uppmärksamhet</div>
    </div>
  }>
    <MScroll>
      {/* KPIs as horizontal scroll */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "14px 18px 4px" }}>
        {[
          { label: "Compliance", value: "87", sub: "Grönt · ↑3", color: "ok" },
          { label: "Öppna avvik.", value: "7", sub: "2 över SLA", color: "warn" },
          { label: "Delegeringar", value: "14", sub: "1 utgår om 4d", color: "warn" },
          { label: "Hygien v. 22", value: "18/21", sub: "3 missade", color: "danger" },
        ].map(k => (
          <div key={k.label} className="ck-card" style={{ padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className={`ck-dot ck-dot--${k.color === "danger" ? "danger" : k.color === "warn" ? "warn" : "ok"}`} />
              <span style={{ fontSize: 11, color: "var(--ck-ink-3)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{k.label}</span>
            </div>
            <div className="ck-tnum" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 4 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "var(--ck-ink-2)", marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Today's queue */}
      <MSection label="IDAG PÅ DIN LOTT" action={<span style={{ fontSize: 11, color: "var(--ck-primary)", fontWeight: 600 }}>Visa alla</span>}>
        <div style={{ background: "var(--ck-surface)", marginBottom: 4 }}>
          {[
            { icon: "alert", iconColor: "var(--ck-danger-soft)", danger: true, title: "Vaskulär ocklusion — filler nasolabialveck", sub: "AVV-2026-0142 · Anna L. · 12h kvar SLA", badge: <Severity level="critical" /> },
            { icon: "stethoscope", title: "Ordination väntar godkännande", sub: "ORD-2026-0089 · Botox 100E · 3d kvar", badge: <Severity level="medium" /> },
            { icon: "shield", title: "Delegering går ut", sub: "Maria S. · sjuksköterskedeleg. · 4d", badge: <Severity level="high" /> },
            { icon: "sparkle", iconColor: "var(--ck-warning-soft)", title: "Veckokontroll läkemedelskyl missad", sub: "Östermalm · förfallen 1d", badge: <Severity level="high" /> },
          ].map((r, i) => <MRow key={i} {...r} />)}
        </div>
      </MSection>

      {/* Trial banner */}
      <div style={{ padding: "12px 16px", margin: "10px 18px 4px", borderRadius: 12, background: "var(--ck-primary-soft)", border: "1px solid var(--ck-primary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="sparkle" size={16} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ck-primary)" }}>9 dagar kvar på Pro-trialen</div>
            <div style={{ fontSize: 11, color: "var(--ck-ink-2)", marginTop: 2 }}>Aktivera så appen inte faller tillbaka till read-only.</div>
          </div>
        </div>
        <button className="ck-btn" style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>Välj plan</button>
      </div>

      <MSection label="AKTIVITET — SENASTE 24H">
        <div style={{ background: "var(--ck-surface)", padding: "4px 18px 10px" }}>
          {[
            ["Anna L.", "stängde", "AVV-2026-0139", "12 min", "ok"],
            ["Dr. Hedman", "godkände ordination", "ORD-2026-0088", "32 min", "info"],
            ["Maria S.", "rapporterade hygienavvikelse", "HYG-2026-0520", "1h", "warn"],
            ["System", "noterade temperaturavvikelse", "Kyl-2 · 9.4°C", "5h", "danger"],
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < 3 ? "1px solid var(--ck-divider)" : "0" }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: `var(--ck-${a[4] === "danger" ? "danger" : a[4] === "warn" ? "warning" : a[4] === "ok" ? "success" : "info"})`, marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 12, color: "var(--ck-ink-2)" }}>
                <strong style={{ color: "var(--ck-ink)" }}>{a[0]}</strong> {a[1]} <span className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)" }}>{a[2]}</span>
              </div>
              <div style={{ fontSize: 10, color: "var(--ck-ink-3)" }}>{a[3]}</div>
            </div>
          ))}
        </div>
      </MSection>

      <MSection label="KOM IGÅNG (4/6 · 67%)">
        <MCard p={14}>
          <div style={{ height: 4, borderRadius: 999, background: "var(--ck-surface-sunken)", overflow: "hidden", marginBottom: 10 }}>
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
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", fontSize: 12 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: "1px solid var(--ck-border-strong)", background: done ? "var(--ck-primary)" : "transparent", display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}>
                {done && <Icon name="check" size={10} />}
              </div>
              <span style={{ textDecoration: done ? "line-through" : "none", color: done ? "var(--ck-ink-3)" : "var(--ck-ink)" }}>{label}</span>
            </div>
          ))}
        </MCard>
      </MSection>
    </MScroll>
  </MobileShell>
);

/* ── DEVIATIONS LIST ── */
const MDeviationsList = () => (
  <MobileShell active="deviations" topbar={
    <MTopbar large back title="Avvikelser" subtitle="54 totalt · 7 öppna · 2 över SLA"
      action={<button style={{ background: "transparent", border: 0, padding: 8, color: "var(--ck-primary)" }}><Icon name="filter" size={20} /></button>} />
  }>
    {/* Sticky tab/filter bar */}
    <div style={{ padding: "0 18px 12px", background: "var(--ck-bg)", borderBottom: "1px solid var(--ck-border)", display: "flex", gap: 6, overflow: "hidden" }}>
      {["Öppna · 7", "Alla", "Mitt", "Kritiska · 1", "Över SLA · 2"].map((t, i) => (
        <button key={t} className={i === 0 ? "ck-btn" : "ck-btn ck-btn--secondary"} style={{ height: 32, flexShrink: 0, fontSize: 12 }}>{t}</button>
      ))}
    </div>

    <MScroll>
      <div style={{ background: "var(--ck-surface)" }}>
        {[
          { sev: "critical", title: "Vaskulär ocklusion — filler nasolabialveck", id: "AVV-2026-0142", who: "Anna L.", sla: "12h kvar", slaColor: "warn", st: "investigating", time: "23 maj 14:08" },
          { sev: "high", title: "Hyalase-administration — patient stabil 30 min", id: "AVV-2026-0141", who: "Toni K.", st: "closed", time: "23 maj 14:55" },
          { sev: "high", title: "Temperaturavvikelse läkemedelskyl — 9.4°C", id: "AVV-2026-0140", who: "System", st: "action", sla: "2d", time: "22 maj 22:14" },
          { sev: "medium", title: "Felaktigt utfyllt samtycke — botox", id: "AVV-2026-0139", who: "Erik B.", st: "closed", time: "22 maj 11:32" },
          { sev: "high", title: "Brist i delegering — sjuksköterska", id: "AVV-2026-0138", who: "Toni K.", st: "investigating", sla: "Förfallen 9h", slaColor: "danger", time: "21 maj 16:45" },
          { sev: "medium", title: "Stickskada — använt instrument", id: "AVV-2026-0137", who: "Maria S.", st: "action", sla: "8d", time: "20 maj 09:18" },
          { sev: "low", title: "Patientklagomål — ojämnt resultat botox", id: "AVV-2026-0136", who: "—", st: "open", time: "18 maj 13:01" },
          { sev: "critical", title: "Lex Maria — anmälan utförd", id: "AVV-2026-0135", who: "Toni K.", st: "closed", time: "15 maj" },
        ].map(d => (
          <div key={d.id} style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-divider)", display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                <Severity level={d.sev} />
                <Status level={d.st} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3, marginBottom: 4 }}>{d.title}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)" }}>{d.id} · {d.who}</span>
                {d.sla && <span style={{ fontSize: 11, color: d.slaColor === "danger" ? "var(--ck-danger)" : d.slaColor === "warn" ? "var(--ck-warning)" : "var(--ck-ink-3)", fontWeight: d.slaColor ? 600 : 400 }}>{d.sla}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </MScroll>
  </MobileShell>
);

/* ── DEVIATION DETAIL ── */
const MDeviationDetail = () => (
  <MobileShell active="deviations" topbar={
    <MTopbar back title="AVV-2026-0142" action={<button style={{ background: "transparent", border: 0, padding: 8, color: "var(--ck-ink-2)" }}><Icon name="more" size={20} /></button>} />
  }>
    <MScroll>
      {/* Header card */}
      <div style={{ padding: "16px 18px", background: "var(--ck-surface)" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          <Severity level="critical" />
          <Status level="investigating" />
          <span className="ck-badge"><Icon name="flag" size={10} />Lex Maria-tröskel</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.015em", marginBottom: 6 }}>
          Vaskulär ocklusion vid filler-injektion i nasolabialveck
        </h1>
        <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>
          Rapporterad av Erik B. · 23 maj 14:08 · Östermalm rum 2
        </div>

        {/* SLA banner */}
        <div style={{ marginTop: 14, padding: 12, background: "var(--ck-warning-soft)", borderRadius: 10, display: "flex", gap: 10, alignItems: "center" }}>
          <Icon name="clock" size={16} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "oklch(0.45 0.12 80)" }}>12 timmar kvar till SLA</div>
            <div style={{ fontSize: 11, color: "var(--ck-ink-2)" }}>Kritisk · 24h · IVO-rapportering påbörjad</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "var(--ck-surface)", borderTop: "1px solid var(--ck-border)" }}>
        <div className="ck-tabs" style={{ padding: "0 18px" }}>
          <div className="ck-tab is-active">Översikt</div>
          <div className="ck-tab">Tidslinje</div>
          <div className="ck-tab">Audit</div>
        </div>
      </div>

      {/* Beskrivning */}
      <div style={{ padding: "16px 18px", background: "var(--ck-surface)" }}>
        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 8 }}>BESKRIVNING</div>
        <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ck-ink)", marginBottom: 16 }}>
          Patient (kvinna, 41) fick filler-injektion (Restylane Lyft) i höger nasolabialveck. Inom 30 sek noterades blanching och kraftig smärta. Misstänkt vaskulär ocklusion. Akut hyalase-protokoll initierades omedelbart. Patient stabiliserad efter 18 minuter.
        </p>

        <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 8 }}>OMEDELBAR ÅTGÄRD</div>
        <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ck-ink)" }}>
          Hyalase 1500 IE administrerat. Värme + massage. Aspirin 325 mg. Patient stannade 90 min för observation. Uppföljning 24h + 7d.
        </p>
      </div>

      <MSection label="METADATA" mt={4}>
        <MCard p={14}>
          {[
            ["Patient", "P-44217 (PII maskerad)", "mono"],
            ["Produkt", "Restylane Lyft 1ml"],
            ["Batch", "L23F0214", "mono"],
            ["Utförare", "Anna Lundqvist (ssk)"],
            ["Delegering", "DEL-0042 ✓ giltig", "mono"],
            ["Ordinatör", "Dr. Hedman (konsult)"],
            ["IVO-anmälan", <span className="ck-badge ck-badge--info" style={{ fontSize: 10 }}>Pågår</span>],
          ].map(([k, v, m], i, arr) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--ck-divider)" : 0, fontSize: 12 }}>
              <span style={{ color: "var(--ck-ink-3)" }}>{k}</span>
              <span className={m === "mono" ? "ck-mono" : ""} style={{ color: "var(--ck-ink)" }}>{v}</span>
            </div>
          ))}
        </MCard>
      </MSection>

      <MSection label="BIFOGAT (2 foton · 1 dokument)">
        <div style={{ padding: "0 18px 12px", display: "flex", gap: 8, overflow: "hidden" }}>
          <div className="ck-img-ph" style={{ width: 110, height: 90, flexShrink: 0 }}>foto · t+0</div>
          <div className="ck-img-ph" style={{ width: 110, height: 90, flexShrink: 0 }}>foto · t+18</div>
          <div style={{ width: 110, height: 90, flexShrink: 0, border: "1px solid var(--ck-border)", borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Icon name="doc" size={16} />
            <div style={{ fontSize: 10 }}>SÖS-rapport.pdf</div>
          </div>
        </div>
      </MSection>
    </MScroll>

    {/* Bottom action bar */}
    <div style={{ padding: "12px 18px 18px", borderTop: "1px solid var(--ck-border)", background: "var(--ck-surface)", display: "flex", gap: 8 }}>
      <button className="ck-btn ck-btn--secondary" style={{ flex: 1, height: 44, justifyContent: "center", borderRadius: 12 }}>
        <Icon name="users" size={16} />Tilldela
      </button>
      <button className="ck-btn" style={{ flex: 1.4, height: 44, justifyContent: "center", borderRadius: 12 }}>
        <Icon name="check" size={16} />Markera som åtgärdad
      </button>
    </div>
  </MobileShell>
);

/* ── NEW DEVIATION (mobile) ── */
const MDeviationNew = () => (
  <MobileShell active="deviations" noTabs topbar={
    <MTopbar back="Avbryt" title="Rapportera avvikelse"
      action={<button style={{ background: "transparent", border: 0, padding: 8, color: "var(--ck-primary)", fontSize: 14, fontWeight: 600 }}>Spara</button>} />
  }>
    <MScroll>
      <div style={{ background: "var(--ck-surface)", padding: 18, borderBottom: "1px solid var(--ck-border)" }}>
        <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>Ta det viktiga först — komplettera senare.</div>
      </div>

      {/* Severity — touch-first big buttons */}
      <div style={{ padding: 18, background: "var(--ck-surface)" }}>
        <label className="ck-label">SEVERITY *</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            ["Låg", "low", false],
            ["Medel", "medium", false],
            ["Hög", "high", false],
            ["Kritisk", "critical", true],
          ].map(([n, lvl, on]) => (
            <button key={n} style={{
              height: 56, borderRadius: 12, fontSize: 14, fontWeight: 600,
              border: on ? "2px solid var(--ck-danger)" : "1px solid var(--ck-border-strong)",
              background: on ? "var(--ck-danger-soft)" : "var(--ck-surface)",
              color: on ? "var(--ck-danger)" : "var(--ck-ink-2)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <Severity level={lvl} />
              {n}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--ck-surface)", borderTop: "1px solid var(--ck-divider)", padding: 18 }}>
        <label className="ck-label">RUBRIK *</label>
        <input className="ck-input" defaultValue="Vaskulär ocklusion vid filler-injektion" style={{ height: 48, fontSize: 15, borderRadius: 10 }} />
      </div>

      <div style={{ background: "var(--ck-surface)", borderTop: "1px solid var(--ck-divider)", padding: 18 }}>
        <label className="ck-label">BESKRIVNING</label>
        <textarea className="ck-input" defaultValue="Patient fick filler-injektion (Restylane Lyft) i höger nasolabialveck. Inom 30 sek noterades blanching och kraftig smärta..." style={{ minHeight: 110, padding: 12, fontSize: 14, borderRadius: 10, lineHeight: 1.5 }}></textarea>
      </div>

      {/* Quick selects */}
      <div style={{ background: "var(--ck-surface)", borderTop: "1px solid var(--ck-divider)" }}>
        {[
          ["KATEGORI", "Komplikation"],
          ["KLINIK", "Östermalm"],
          ["PATIENT (valfritt)", "P-44217"],
          ["PRODUKT-BATCH", "L23F0214"],
        ].map(([l, v]) => (
          <div key={l} style={{ padding: "14px 18px", borderBottom: "1px solid var(--ck-divider)", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{v}</div>
            </div>
            <Icon name="chev-right" size={16} />
          </div>
        ))}
      </div>

      {/* Foto */}
      <div style={{ background: "var(--ck-surface)", borderTop: "1px solid var(--ck-divider)", padding: 18 }}>
        <label className="ck-label">FOTO / BILAGOR</label>
        <button style={{
          width: "100%", height: 80, borderRadius: 12, border: "1.5px dashed var(--ck-border-strong)",
          background: "var(--ck-surface-sunken)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          color: "var(--ck-ink-2)", fontSize: 13,
        }}>
          <Icon name="upload" size={18} /> Ta foto eller välj från galleri
        </button>
      </div>

      {/* Critical warning */}
      <div style={{ margin: "16px 18px", padding: 14, background: "var(--ck-danger-soft)", borderRadius: 12, display: "flex", gap: 10 }}>
        <Icon name="alert" size={16} />
        <div style={{ fontSize: 12, color: "var(--ck-danger)" }}>
          <strong>Kritisk severity</strong> — Lex Maria-bedömning krävs inom 24h. SLA-klocka startar vid spara.
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, color: "var(--ck-ink-2)" }}>
            <input type="checkbox" defaultChecked style={{ width: 18, height: 18 }} /> Koppla IVO-anmälan-checklista
          </label>
        </div>
      </div>
    </MScroll>

    <div style={{ padding: "12px 18px 18px", borderTop: "1px solid var(--ck-border)", background: "var(--ck-surface)" }}>
      <MPrimaryAction label="Rapportera & tilldela" icon="arrow-r" large />
    </div>
  </MobileShell>
);

/* ── NOTIFICATIONS ── */
const MNotifications = () => (
  <MobileShell active="more" topbar={
    <MTopbar back title="Notifieringar" action={<button style={{ background: "transparent", border: 0, padding: 8, color: "var(--ck-primary)", fontSize: 13, fontWeight: 600 }}>Markera lästa</button>} />
  }>
    <div style={{ padding: "10px 18px", background: "var(--ck-bg)", borderBottom: "1px solid var(--ck-border)", display: "flex", gap: 6, overflow: "hidden" }}>
      {["Alla · 5", "Brådskande · 2", "Mina"].map((t, i) => (
        <button key={t} className={i === 0 ? "ck-btn" : "ck-btn ck-btn--secondary"} style={{ height: 30, flexShrink: 0 }}>{t}</button>
      ))}
    </div>

    <MScroll>
      <div style={{ background: "var(--ck-surface)" }}>
        {[
          { type: "deviation.escalated", prio: "urgent", title: "Avvikelse eskalerad till kritisk", body: "AVV-2026-0142 · 12h kvar SLA", time: "12 min", unread: true },
          { type: "delegation.expiring_7d", prio: "urgent", title: "Delegering går ut om 4 dagar", body: "Maria S. · sjuksköterskedelegering", time: "1h", unread: true },
          { type: "medication.temperature_breach", prio: "urgent", title: "Temperaturavvikelse läkemedelskyl", body: "Kyl-2 · 9.4°C (max 8°C)", time: "10h", unread: true },
          { type: "order.pending", prio: "warning", title: "Ordination väntar din signatur", body: "Botulinumtoxin 100E", time: "1d", unread: true },
          { type: "subscription.trial_ending_7d", prio: "warning", title: "Trial slut om 9 dagar", body: "Aktivera Pro så slipper read-only", time: "1d", unread: true },
          { type: "document.signature_required", prio: "info", title: "Signering krävs", body: "Lex Maria-rutin v2.1 (5/7)", time: "2d" },
          { type: "hygiene.check_failed", prio: "warning", title: "Hygienkontroll ej OK", body: "Auto-skapad avvikelse", time: "5d" },
        ].map((n, i) => (
          <div key={i} style={{
            padding: "14px 18px", borderBottom: "1px solid var(--ck-divider)",
            display: "flex", gap: 12,
            background: n.unread ? "var(--ck-primary-soft)" : "transparent",
            opacity: n.unread ? 1 : 0.85,
          }}>
            <span className={`ck-dot ck-dot--${n.prio === "urgent" ? "danger" : n.prio === "warning" ? "warn" : "info"}`} style={{ marginTop: 6, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{n.title}</div>
              <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>{n.body}</div>
              <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", marginTop: 4 }}>{n.type} · {n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </MScroll>
  </MobileShell>
);

Object.assign(window, { MDashboard, MDeviationsList, MDeviationDetail, MDeviationNew, MNotifications });
