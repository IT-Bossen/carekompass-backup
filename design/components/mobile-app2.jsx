/* MOBILE MODULES — Documents, Medications, Ordination (inbox + detail), Compliance, Hygiene-schedule */

/* ── DOCUMENTS LIST ── */
const MDocuments = () => (
  <MobileShell active="more" topbar={<MTopbar large back="Mer" title="Styrdokument" subtitle="47 · 2 väntar signering" action={<button style={{ background: "transparent", border: 0, padding: 8, color: "var(--ck-primary)" }}><Icon name="plus" size={22} /></button>} />}>
    <div style={{ padding: "0 18px 12px", background: "var(--ck-surface)" }}>
      <input className="ck-input" placeholder="Sök i titel, taggar…" style={{ height: 40, borderRadius: 10 }} />
    </div>
    <div style={{ padding: "10px 18px", display: "flex", gap: 6, overflow: "hidden", borderBottom: "1px solid var(--ck-border)", background: "var(--ck-bg)" }}>
      {["Alla · 47", "Policy · 8", "Rutin · 21", "Mall · 9", "Checklista · 6"].map((c, i) => (
        <button key={c} className={i === 0 ? "ck-btn" : "ck-btn ck-btn--secondary"} style={{ height: 30, flexShrink: 0, fontSize: 12 }}>{c}</button>
      ))}
    </div>

    <MScroll>
      <div style={{ background: "var(--ck-surface)" }}>
        {[
          { t: "Lex Maria — inrapportering", c: "Rutin", v: "v2.1", st: "Signering krävs (5/7)", color: "warn", new: true },
          { t: "Hygienrutin — bashygien & handhygien", c: "Rutin", v: "v3.0", st: "Publicerad", color: "ok" },
          { t: "Hygienrutin — behandlingsrum", c: "Rutin", v: "v2.4", st: "Publicerad", color: "ok" },
          { t: "Komplikationshantering — vaskulär ocklusion", c: "Rutin", v: "v1.8", st: "Publicerad", color: "ok" },
          { t: "Samtycke — botulinumtoxin", c: "Mall", v: "v1.2", st: "Publicerad", color: "ok" },
          { t: "Ledningssystem — SOSFS 2011:9", c: "Policy", v: "v1.0", st: "Publicerad", color: "ok" },
          { t: "GDPR / personuppgiftshantering", c: "Policy", v: "v1.1", st: "Publicerad", color: "ok" },
          { t: "Akutväska — innehållskontroll", c: "Checklista", v: "v1.0", st: "Utkast", color: null },
          { t: "Komplikation — allergisk reaktion", c: "Rutin", v: "v1.5", st: "Publicerad", color: "ok" },
        ].map(r => (
          <div key={r.t} style={{ padding: "14px 18px", borderBottom: "1px solid var(--ck-divider)", display: "flex", gap: 12 }}>
            <Icon name="doc" size={18} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{r.t}</span>
                {r.new && <span className="ck-badge ck-badge--primary" style={{ fontSize: 9 }}>NY</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <span className="ck-badge" style={{ fontSize: 10 }}>{r.c}</span>
                <span className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)" }}>{r.v}</span>
                <span className={r.color === "warn" ? "ck-badge ck-badge--medium" : r.color === "ok" ? "ck-badge ck-badge--ok" : "ck-badge"} style={{ fontSize: 9 }}>{r.st}</span>
              </div>
            </div>
            <Icon name="chev-right" size={14} />
          </div>
        ))}
      </div>
    </MScroll>
  </MobileShell>
);


/* ── MEDICATIONS ── */
const MMedications = () => (
  <MobileShell active="more" topbar={<MTopbar large back="Mer" title="Läkemedel" subtitle="42 batchar · 2 utgång < 30d" action={<button style={{ background: "transparent", border: 0, padding: 8, color: "var(--ck-primary)" }}><Icon name="plus" size={22} /></button>} />}>
    <MScroll>
      {/* Temperature card */}
      <MCard p={16} style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Läkemedelskyl 1</div>
            <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>2.0 – 8.0 °C · senaste 24h</div>
          </div>
          <span className="ck-badge ck-badge--ok"><span className="ck-dot ck-dot--ok" />OK</span>
        </div>
        <svg viewBox="0 0 320 80" style={{ width: "100%", height: 80 }}>
          <rect x="0" y="24" width="320" height="32" fill="var(--ck-success-soft)" opacity="0.5" />
          <path d="M0 40 L40 38 L80 42 L120 36 L160 40 L200 44 L240 38 L280 40 L320 40" fill="none" stroke="var(--ck-primary)" strokeWidth="2" />
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--ck-ink-3)" }} className="ck-mono">
          <span>00:00</span><span>06</span><span>12</span><span>18</span><span>23:59</span>
        </div>
      </MCard>

      <MCard p={16}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Läkemedelskyl 2</div>
            <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>Avvikelse · spike 22:14</div>
          </div>
          <span className="ck-badge ck-badge--medium"><span className="ck-dot ck-dot--warn" />9.4°C</span>
        </div>
        <svg viewBox="0 0 320 80" style={{ width: "100%", height: 80 }}>
          <rect x="0" y="24" width="320" height="32" fill="var(--ck-success-soft)" opacity="0.5" />
          <path d="M0 42 L40 40 L80 38 L120 32 L160 24 L200 18 L210 14 L240 26 L280 36 L320 38" fill="none" stroke="var(--ck-warning)" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="210" cy="14" r="3" fill="var(--ck-warning)" />
        </svg>
      </MCard>

      <MSection label="LAGER · ÖSTERMALM">
        <div style={{ background: "var(--ck-surface)" }}>
          {[
            { p: "Botulinumtoxin 100E", b: "B45L2025", qty: "8 / 12", exp: "2027-03-15", warn: false, kyl: true },
            { p: "Restylane Lyft 1ml", b: "L23F0214", qty: "11 / 20", exp: "2026-06-08", warn: true },
            { p: "Profhilo 2ml", b: "PR-2025-A14", qty: "3 / 10", exp: "2026-06-22", warn: true },
            { p: "Skinbooster Vital", b: "SV-04-26", qty: "6 / 8", exp: "2027-01-30" },
            { p: "Hyalase 1500 IE", b: "HY-2025-091", qty: "5 / 5", exp: "2026-12-30", kyl: true },
            { p: "Adrenalin 1mg/ml", b: "AD-25-441", qty: "4 / 4", exp: "2026-08-12", akut: true },
          ].map(r => (
            <div key={r.b} style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-divider)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{r.p}</span>
                <span className="ck-tnum" style={{ fontSize: 13, fontWeight: 600 }}>{r.qty}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)" }}>{r.b}</span>
                  {r.kyl && <span className="ck-badge" style={{ fontSize: 9 }}>Kyl</span>}
                  {r.akut && <span className="ck-badge ck-badge--critical" style={{ fontSize: 9 }}>Akut</span>}
                </div>
                <span className="ck-mono" style={{ fontSize: 11, color: r.warn ? "var(--ck-warning)" : "var(--ck-ink-3)", fontWeight: r.warn ? 600 : 400 }}>
                  {r.exp}{r.warn && " · <30d"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </MSection>
    </MScroll>
  </MobileShell>
);


/* ── ORDINATION INBOX (consulting practitioner) ── */
const MOrdinationInbox = () => (
  <MobileShell active="more" topbar={<MTopbar large back="Mer" title="Inbox" subtitle="Konsulterande över 4 bolag · 7 väntar" />}>
    <div style={{ padding: "10px 18px", background: "var(--ck-bg)", borderBottom: "1px solid var(--ck-border)", display: "flex", gap: 6, overflow: "hidden" }}>
      {["Idag · 3", "Imorgon · 3", "Senare", "Avslagna"].map((c, i) => (
        <button key={c} className={i === 0 ? "ck-btn" : "ck-btn ck-btn--secondary"} style={{ height: 30, flexShrink: 0, fontSize: 12 }}>{c}</button>
      ))}
    </div>

    <MScroll>
      <div style={{ background: "var(--ck-surface)" }}>
        {[
          { who: "Derma Beauty AB", clinic: "Östermalm", patient: "P-44217", med: "Botulinumtoxin 100E", dose: "panna + glabella · 11 punkter", urgent: true, n: 3 },
          { who: "Stockholm Estetik", clinic: "Vasastan", patient: "P-91044", med: "Restylane Lyft 1ml", dose: "nasolabial", urgent: false, n: 2 },
          { who: "Aesthetic Lab", clinic: "Östermalm", patient: "P-12903", med: "Profhilo 2ml", dose: "ansikte fullt", urgent: false, n: 1 },
          { who: "Skin & Co", clinic: "Kungsholmen", patient: "P-77441", med: "Botulinumtoxin 50E", dose: "kråksparkar", urgent: false, n: 1 },
        ].map((t, i) => (
          <div key={i} style={{ padding: "14px 18px", borderBottom: "1px solid var(--ck-divider)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{t.who}</span>
              {t.urgent && <span style={{ fontSize: 11, color: "var(--ck-warning)", fontWeight: 600 }}>Idag</span>}
            </div>
            <div style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>
              {t.clinic} · <span className="ck-mono" style={{ fontSize: 11 }}>{t.patient}</span>
            </div>
            <div style={{ marginTop: 8, padding: "10px 12px", background: "var(--ck-surface-sunken)", borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{t.med}</div>
              <div style={{ fontSize: 12, color: "var(--ck-ink-3)" }}>{t.dose}</div>
            </div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="ck-badge" style={{ fontSize: 10 }}>{t.n} ordination{t.n > 1 ? "er" : ""}</span>
              <span style={{ fontSize: 12, color: "var(--ck-primary)", fontWeight: 600 }}>Granska →</span>
            </div>
          </div>
        ))}
      </div>
    </MScroll>
  </MobileShell>
);


/* ── ORDINATION DETAIL · BANKID APPROVAL ── */
const MOrdinationDetail = () => (
  <MobileShell active="more" noTabs topbar={<MTopbar back title="Ordination" action={<button style={{ background: "transparent", border: 0, padding: 8, color: "var(--ck-ink-2)" }}><Icon name="more" size={20} /></button>} />}>
    <MScroll>
      <div style={{ padding: 18, background: "var(--ck-surface)" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          <span className="ck-badge ck-badge--primary"><Icon name="external" size={10} />Cross-tenant</span>
          <span className="ck-badge ck-badge--medium">Väntar din signatur</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.015em", marginBottom: 6 }}>
          Botulinumtoxin 100E — panna + glabella
        </h1>
        <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>
          Derma Beauty AB · patient <span className="ck-mono">P-44217</span> (kvinna, 41)
        </div>
        <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", marginTop: 6 }}>ORD-DB-2026-0089</div>
      </div>

      <MSection label="BEHANDLINGSPLAN">
        <MCard p={14}>
          {[
            ["Dos", "20E panna · 24E glabella"],
            ["Område", "Frontalis + corrugator + procerus"],
            ["Punkter", "11", "mono"],
            ["Utförare", "Anna Lundqvist (ssk)"],
            ["Delegering", "DEL-0042 ✓ giltig till 2026-09-30", "mono"],
            ["Behandling", "27 maj 14:30"],
            ["Förra", "17 mar 2026 (samma område)"],
          ].map(([k, v, m], i, arr) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--ck-divider)" : 0, fontSize: 12 }}>
              <span style={{ color: "var(--ck-ink-3)" }}>{k}</span>
              <span className={m === "mono" ? "ck-mono" : ""} style={{ color: "var(--ck-ink)", textAlign: "right", maxWidth: "60%" }}>{v}</span>
            </div>
          ))}
        </MCard>
      </MSection>

      <MSection label="SÄKERHETSKOLL · AUTOMATISK">
        <div style={{ padding: "0 18px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            "Patient över 18 år",
            "Delegering giltig för utförare",
            "Hälsodeklaration uppdaterad (< 6 mån)",
            "Samtycke signerat",
            "Inga aktiva varningar i historik",
            "Tillräcklig batch på lager",
          ].map(c => (
            <div key={c} style={{ display: "flex", gap: 10, alignItems: "center", padding: 12, background: "var(--ck-success-soft)", borderRadius: 10 }}>
              <Icon name="check" size={16} />
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ck-ink)" }}>{c}</span>
            </div>
          ))}
        </div>
      </MSection>

      <div style={{ padding: 18 }}>
        <div style={{ padding: 14, background: "var(--ck-info-soft)", borderRadius: 12, fontSize: 12, color: "var(--ck-ink-2)" }}>
          <strong style={{ color: "var(--ck-info)" }}>Stark autentisering:</strong> Godkännande kräver BankID-signering. SLA per ordination = 7d.
        </div>
      </div>
    </MScroll>

    {/* Bottom actions */}
    <div style={{ padding: "12px 18px 18px", borderTop: "1px solid var(--ck-border)", background: "var(--ck-surface)", display: "flex", flexDirection: "column", gap: 8 }}>
      <MPrimaryAction label="Godkänn med BankID" icon="shield" large />
      <div style={{ display: "flex", gap: 8 }}>
        <button className="ck-btn ck-btn--secondary" style={{ flex: 1, height: 44, justifyContent: "center", borderRadius: 12 }}>Begär komplettering</button>
        <button className="ck-btn ck-btn--secondary" style={{ flex: 1, height: 44, justifyContent: "center", borderRadius: 12, color: "var(--ck-danger)" }}>Avslå</button>
      </div>
    </div>
  </MobileShell>
);


/* ── COMPLIANCE CENTER ── */
const MCompliance = () => (
  <MobileShell active="more" topbar={<MTopbar large back="Mer" title="Compliance Center" subtitle="För din kvalitetsansvariga — inte en CK-stämpel" />}>
    <MScroll>
      {/* Score circle */}
      <div style={{ padding: "16px 18px 6px", textAlign: "center", background: "var(--ck-surface)" }}>
        <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto" }}>
          <svg viewBox="0 0 100 100" width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--ck-surface-sunken)" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--ck-primary)" strokeWidth="8" strokeDasharray={`${87 * 2.64} 1000`} strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div>
              <div className="ck-tnum" style={{ fontSize: 56, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>87</div>
              <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>av 100</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 6 }}>
          <span className="ck-badge ck-badge--ok">GRÖNT</span>
          <span className="ck-badge">↑ 3 vs förra mån</span>
        </div>
        <button className="ck-btn" style={{ marginTop: 16, height: 44, padding: "0 18px", borderRadius: 12 }}><Icon name="download" size={14} />Generera audit-paket</button>
      </div>

      {/* Sub-scores grid */}
      <MSection label="OMRÅDEN" mt={20}>
        <div style={{ padding: "0 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            ["Dokument", 92, 0.15, "ok"],
            ["Avvikelser", 88, 0.20, "ok"],
            ["Hygien", 71, 0.20, "warn"],
            ["Läkemedel", 95, 0.10, "ok"],
            ["Ord./Deleg.", 89, 0.15, "ok"],
            ["Risk", 84, 0.10, "ok"],
            ["Personal", 90, 0.10, "ok"],
          ].map(([n, s, w, c]) => (
            <div key={n} className="ck-card" style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{n}</span>
                <span className="ck-mono" style={{ fontSize: 9, color: "var(--ck-ink-3)" }}>×{w}</span>
              </div>
              <div className="ck-tnum" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{s}</div>
              <div style={{ marginTop: 6, height: 3, borderRadius: 999, background: "var(--ck-surface-sunken)", overflow: "hidden" }}>
                <div style={{ width: `${s}%`, height: "100%", background: c === "ok" ? "var(--ck-success)" : "var(--ck-warning)" }} />
              </div>
            </div>
          ))}
        </div>
      </MSection>

      <MSection label="VAD BEHÖVER ÅTGÄRDAS · 6">
        <div style={{ background: "var(--ck-surface)" }}>
          {[
            { icon: "sparkle", title: "3 missade hygienkontroller", note: "Östermalm · −4.2 score", color: "danger" },
            { icon: "shield", title: "Delegering går ut om 4d", note: "Maria S. · −1.8 om utgången", color: "warn" },
            { icon: "alert", title: "AVV-2026-0138 över SLA", note: "Förfallen 9h · −2.4 score", color: "danger" },
            { icon: "scale", title: "Risk-översyn förfallen", note: "Vaskulär ocklusion (score 16)", color: "warn" },
          ].map(it => <MRow key={it.title} icon={it.icon} iconColor={`var(--ck-${it.color === "danger" ? "danger" : "warning"}-soft)`} danger={it.color === "danger"} title={it.title} sub={it.note} />)}
        </div>
      </MSection>

      <div style={{ margin: "12px 18px 24px", padding: 14, background: "var(--ck-warning-soft)", borderRadius: 12, fontSize: 12, color: "var(--ck-ink-2)" }}>
        <strong style={{ color: "oklch(0.45 0.12 80)" }}>Påminnelse:</strong> Score är ett verktyg för er kvalitetsansvariga — inte ett godkännande från CK eller en myndighet.
      </div>
    </MScroll>
  </MobileShell>
);


/* ── HYGIENE SCHEDULE (mobile overview, complement to existing HygieneMobile checklist) ── */
const MHygieneSchedule = () => (
  <MobileShell active="hygiene" topbar={<MTopbar large title="Hygien & egenkontroll" subtitle="Vecka 22 · 18/21 utförda" />}>
    <MScroll>
      {/* KPI strip */}
      <div style={{ padding: "12px 18px 4px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          ["Denna vecka", "18 / 21", "85.7%", "warn"],
          ["Ej OK · mån.", "4", "auto-avvikelser", "info"],
          ["Aktiva scheman", "9", "2D · 4V · 3M", "ok"],
          ["Foto-evidens", "124", "senaste 30d", "ok"],
        ].map(([l, v, sub, c]) => (
          <div key={l} className="ck-card" style={{ padding: 12 }}>
            <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{l}</div>
            <div className="ck-tnum" style={{ fontSize: 22, fontWeight: 600, marginTop: 2 }}>{v}</div>
            <div style={{ fontSize: 11, color: "var(--ck-ink-2)" }}>{sub}</div>
          </div>
        ))}
      </div>

      <MSection label="IDAG · ONSDAG 27 MAJ">
        <div style={{ background: "var(--ck-surface)" }}>
          {[
            { name: "Daglig öppning — behandlingsklinik", freq: "8 av 10 klara", state: "active", who: "Du · pågår" },
            { name: "Behandlingsrum efter patient", freq: "4 utförda hittills", state: "ok", who: "Behandlare" },
            { name: "Veckokontroll läkemedelskyl", freq: "Försenad sedan måndag", state: "miss", who: "Maria S." },
            { name: "Avfall stick/skär — tömning", freq: "Schemalagd 16:00", state: "todo", who: "Maria S." },
          ].map(it => (
            <div key={it.name} style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-divider)", display: "flex", gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: it.state === "ok" ? "var(--ck-success-soft)"
                          : it.state === "miss" ? "var(--ck-danger-soft)"
                          : it.state === "active" ? "var(--ck-primary-soft)"
                          : "var(--ck-surface-sunken)",
                color: it.state === "ok" ? "var(--ck-success)"
                     : it.state === "miss" ? "var(--ck-danger)"
                     : it.state === "active" ? "var(--ck-primary)"
                     : "var(--ck-ink-3)",
                display: "grid", placeItems: "center",
                fontSize: 14, fontWeight: 600,
              }}>
                {it.state === "ok" && <Icon name="check" size={18} />}
                {it.state === "miss" && <Icon name="x" size={18} />}
                {it.state === "active" && <Icon name="sparkle" size={16} />}
                {it.state === "todo" && <Icon name="clock" size={16} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{it.name}</div>
                <div style={{ fontSize: 12, color: "var(--ck-ink-3)" }}>{it.freq} · {it.who}</div>
              </div>
              <Icon name="chev-right" size={14} />
            </div>
          ))}
        </div>
      </MSection>

      <MSection label="VECKOÖVERSIKT">
        <div style={{ padding: "0 18px 14px", display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {[
            { day: "Mån", n: 3, total: 3, c: "ok" },
            { day: "Tis", n: 3, total: 3, c: "ok" },
            { day: "Ons", n: 2, total: 4, c: "active" },
            { day: "Tor", n: 0, total: 3, c: "todo" },
            { day: "Fre", n: 0, total: 4, c: "todo" },
            { day: "Lör", n: 0, total: 2, c: "todo" },
            { day: "Sön", n: 0, total: 2, c: "todo" },
          ].map(d => (
            <div key={d.day} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "var(--ck-ink-3)", marginBottom: 4 }}>{d.day}</div>
              <div style={{
                height: 56, borderRadius: 8,
                background: d.c === "ok" ? "var(--ck-success-soft)"
                          : d.c === "active" ? "var(--ck-primary-soft)"
                          : "var(--ck-surface-sunken)",
                color: d.c === "ok" ? "var(--ck-success)"
                     : d.c === "active" ? "var(--ck-primary)"
                     : "var(--ck-ink-3)",
                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                fontSize: 14, fontWeight: 600,
              }} className="ck-tnum">
                {d.n}/{d.total}
              </div>
            </div>
          ))}
        </div>
      </MSection>
    </MScroll>
  </MobileShell>
);

Object.assign(window, { MDocuments, MMedications, MOrdinationInbox, MOrdinationDetail, MCompliance, MHygieneSchedule });
