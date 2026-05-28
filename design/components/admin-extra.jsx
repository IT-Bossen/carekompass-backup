/* CK-admin extra tabs: Users (+impersonation), Billing, Templates, System health, Support */

const AdminShell = ({ active, children }) => (
  <div className="ck" style={{ height: "100%", background: "var(--ck-bg)", display: "flex" }}>
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
        ["companies", "Företag", "shield", "3"],
        ["users", "Användare", "users"],
        ["billing", "Billing", "scale"],
        ["compliance", "Compliance", "shield"],
        ["modules", "Moduler", "settings"],
        ["plans", "Planer", "doc"],
        ["templates", "Mallar", "doc"],
        ["news", "Nyheter", "leaf"],
        ["support", "Support", "circle-q", "12"],
        ["system", "System", "settings"],
      ].map(([key, label, icon, badge]) => (
        <div key={key} style={{
          padding: "7px 10px", borderRadius: 6, fontSize: 13,
          display: "flex", alignItems: "center", gap: 10, marginBottom: 1,
          background: active === key ? "oklch(0.30 0.020 240)" : "transparent",
          color: active === key ? "oklch(0.98 0.005 200)" : "oklch(0.75 0.008 200)",
          fontWeight: active === key ? 600 : 500,
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
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{ height: 56, borderBottom: "1px solid var(--ck-border)", background: "var(--ck-surface)", display: "flex", alignItems: "center", padding: "0 24px", gap: 12 }}>
        <div style={{ color: "var(--ck-ink-3)", fontSize: 13 }}>System Admin / <span style={{ color: "var(--ck-ink)", fontWeight: 600 }}>{({companies:"Företag",users:"Användare",billing:"Billing",templates:"Mallar",system:"System",support:"Support"})[active]}</span></div>
        <div style={{ flex: 1 }} />
        <span className="ck-badge ck-badge--medium"><span className="ck-dot ck-dot--warn" />Du tittar cross-tenant</span>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
    </div>
  </div>
);

/* ── Admin · Users (with impersonation modal) ── */
const AdminUsers = () => (
  <AdminShell active="users">
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
      <div>
        <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Användare</h1>
        <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>1 842 profiler · 5 super_admins · senaste inloggning loggas i sessions</div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input className="ck-input" placeholder="Sök e-post, namn, profile_id…" style={{ flex: 1 }} />
        <button className="ck-btn ck-btn--secondary">Företag: alla</button>
        <button className="ck-btn ck-btn--secondary">Roll: alla</button>
        <button className="ck-btn ck-btn--secondary">Aktivt: senaste 30d</button>
      </div>

      <div className="ck-card" style={{ flex: 1, overflow: "hidden" }}>
        <table className="ck-table">
          <thead><tr><th>NAMN</th><th>E-POST</th><th>FÖRETAG</th><th>HÖGSTA ROLL</th><th>SENAST</th><th>SESSIONS</th><th>SUPER_ADMIN</th><th></th></tr></thead>
          <tbody>
            {[
              { n: "Toni Kazarian", e: "t***@d***.se", co: "Derma Beauty AB", r: "owner", l: "12 min", s: 1, su: false, sel: true },
              { n: "Anna Lundqvist", e: "a***@d***.se", co: "Derma Beauty AB", r: "quality_manager", l: "1h", s: 2, su: false },
              { n: "Linda Holm", e: "l***@s***.se", co: "Stockholm Estetik AB", r: "owner", l: "26 maj", s: 1, su: false },
              { n: "Petter Vik", e: "p***@t***.se", co: "Tattoo Studio Söder", r: "owner", l: "25 maj", s: 1, su: false },
              { n: "Sofia Andersson", e: "sofia@carekompass.se", co: "—", r: "super_admin", l: "nyss", s: 1, su: true },
              { n: "Karl Engström", e: "karl@carekompass.se", co: "—", r: "super_admin", l: "2d", s: 0, su: true },
            ].map(u => (
              <tr key={u.e} style={{ background: u.sel ? "var(--ck-primary-soft)" : undefined }}>
                <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar initials={u.n.split(" ").map(s=>s[0]).join("")} color={u.su ? "oklch(0.5 0.15 30)" : undefined} /><span style={{ fontWeight: 500 }}>{u.n}</span></div></td>
                <td className="ck-mono" style={{ fontSize: 11 }}>{u.e}</td>
                <td>{u.co}</td>
                <td><span className="ck-mono" style={{ fontSize: 11 }}>{u.r}</span></td>
                <td className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{u.l}</td>
                <td className="ck-tnum">{u.s}</td>
                <td>{u.su ? <span className="ck-badge ck-badge--critical" style={{ fontSize: 10 }}>YES</span> : <span style={{ color: "var(--ck-ink-3)" }}>—</span>}</td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="ck-btn ck-btn--ghost" style={{ height: 26, fontSize: 11 }}>Återst. lösen</button>
                    {!u.su && <button className="ck-btn ck-btn--secondary" style={{ height: 26, fontSize: 11 }}><Icon name="eye" size={11} />Impersonera</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Impersonation modal */}
      <div style={{ position: "absolute", inset: 0, background: "oklch(0.22 0.015 60 / 0.55)", display: "grid", placeItems: "center", padding: 24 }}>
        <div className="ck-card" style={{ width: 440, padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--ck-warning-soft)", color: "var(--ck-warning)", display: "grid", placeItems: "center" }}>
              <Icon name="eye" size={18} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Starta impersonation</div>
              <div style={{ fontSize: 12, color: "var(--ck-ink-3)" }}>Som <strong>Toni Kazarian</strong> · Derma Beauty AB</div>
            </div>
          </div>

          <div style={{ padding: 12, background: "var(--ck-warning-soft)", borderRadius: 8, fontSize: 12, color: "var(--ck-ink-2)", marginBottom: 16 }}>
            Alla åtgärder loggas <em>dubbelt</em>: under Toni:s ID och under ditt admin-ID med <span className="ck-mono">case_reference</span>.
            Kunden får mail-notis. Destruktiva åtgärder blockeras.
          </div>

          <label className="ck-label">Ärende-ID (obligatoriskt)</label>
          <input className="ck-input" defaultValue="SUP-2026-0048" style={{ marginBottom: 12 }} />

          <label className="ck-label">Anledning</label>
          <textarea className="ck-input ck-textarea" defaultValue="Kund rapporterade att hygien-schema inte triggar notis. Felsökning på begäran." style={{ marginBottom: 12, minHeight: 60 }}></textarea>

          <label className="ck-label">Maxlängd</label>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {["15 min", "30 min", "60 min"].map((d, i) => (
              <button key={d} style={{
                flex: 1, height: 32, borderRadius: 6, fontSize: 12, fontWeight: 500,
                border: i === 0 ? "1.5px solid var(--ck-primary)" : "1px solid var(--ck-border-strong)",
                background: i === 0 ? "var(--ck-primary-soft)" : "var(--ck-surface)",
                color: i === 0 ? "var(--ck-primary)" : "var(--ck-ink-2)",
              }}>{d}</button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="ck-btn ck-btn--ghost">Avbryt</button>
            <button className="ck-btn"><Icon name="eye" size={14} />Starta impersonation</button>
          </div>
        </div>
      </div>
    </div>
  </AdminShell>
);


/* ── Admin · Billing ── */
const AdminBilling = () => (
  <AdminShell active="billing">
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Billing</h1>
        <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>Stripe data, MRR/ARR, fakturor, refunds — cross-tenant</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <KpiCard label="MRR" value="284 412 kr" delta="↑ 8.2%" dot="ok" sub="312 aktiva bolag" />
        <KpiCard label="ARR" value="3.41M kr" delta="↑ 12%" dot="ok" sub="rullande 12 mån" />
        <KpiCard label="Trial → betald" value="62%" delta="över branschsnitt" dot="ok" sub="senaste 90d" />
        <KpiCard label="Förfallna fakturor" value="4" delta="14 218 kr" dot="warn" sub="kräver retry" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, flex: 1, overflow: "hidden" }}>
        <div className="ck-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--ck-border)", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Senaste fakturor</div>
            <button className="ck-btn ck-btn--ghost" style={{ height: 26 }}><Icon name="download" size={12} />Export</button>
          </div>
          <table className="ck-table">
            <thead><tr><th>FAKTURA</th><th>FÖRETAG</th><th>BELOPP</th><th>STATUS</th><th>DATUM</th></tr></thead>
            <tbody>
              {[
                ["INV-2026-1442", "Aesthetic Lab", "1 295 kr", "Betald", "ok", "27 maj"],
                ["INV-2026-1441", "Stockholm Estetik AB", "3 990 kr", "Betald", "ok", "27 maj"],
                ["INV-2026-1440", "Footcare Norrtull", "1 295 kr", "Förfallen", "danger", "26 maj"],
                ["INV-2026-1439", "Klinik Holm", "990 kr", "Refund pending", "warn", "26 maj"],
                ["INV-2026-1438", "Skin & Co", "3 990 kr", "Betald", "ok", "25 maj"],
                ["INV-2026-1437", "Derma Beauty AB", "3 781 kr", "Betald", "ok", "25 maj"],
                ["INV-2026-1436", "Tattoo Studio Söder", "495 kr", "Trial — ej fakturerad", null, "24 maj"],
              ].map(([id, co, amt, st, color, d]) => (
                <tr key={id}>
                  <td><span className="ck-mono" style={{ fontSize: 11 }}>{id}</span></td>
                  <td>{co}</td>
                  <td className="ck-tnum">{amt}</td>
                  <td>{color === "ok" ? <span className="ck-badge ck-badge--ok">{st}</span> : color === "danger" ? <span className="ck-badge ck-badge--critical">{st}</span> : color === "warn" ? <span className="ck-badge ck-badge--medium">{st}</span> : <span className="ck-badge">{st}</span>}</td>
                  <td className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ck-card" style={{ padding: 18, overflow: "hidden" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Top kunder · MRR</div>
          <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 14 }}>Maj 2026</div>
          {[
            { n: "Stockholm Estetik AB", mrr: 7980, plan: "Pro × 6" },
            { n: "Klinikkedjan Nord", mrr: 6450, plan: "Enterprise" },
            { n: "Skin & Co", mrr: 3990, plan: "Pro × 3" },
            { n: "Derma Beauty AB", mrr: 3781, plan: "Pro × 2" },
            { n: "Aesthetic Lab", mrr: 1295, plan: "Pro × 1" },
          ].map(c => (
            <div key={c.n} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--ck-divider)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{c.n}</div>
                <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{c.plan}</div>
              </div>
              <div className="ck-tnum" style={{ fontSize: 13, fontWeight: 600 }}>{c.mrr.toLocaleString("sv")} kr</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </AdminShell>
);


/* ── Admin · Templates ── */
const AdminTemplates = () => (
  <AdminShell active="templates">
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>Systemmallar</h1>
        <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>Industry templates · dokumentmallar · hygienchecklistor · sprids till nya bolag</div>
      </div>

      <div className="ck-tabs">
        <div className="ck-tab is-active">Industry templates <span className="ck-badge" style={{ fontSize: 10, height: 16 }}>9</span></div>
        <div className="ck-tab">Dokumentmallar <span className="ck-badge" style={{ fontSize: 10, height: 16 }}>47</span></div>
        <div className="ck-tab">Hygienchecklistor <span className="ck-badge" style={{ fontSize: 10, height: 16 }}>12</span></div>
        <div className="ck-tab">Avtalsmallar</div>
      </div>

      <div className="ck-card" style={{ flex: 1, overflow: "hidden" }}>
        <table className="ck-table">
          <thead><tr><th>CODE</th><th>VISNINGSNAMN</th><th>MYNDIGHET</th><th>BEHANDLINGSTYPER</th><th>RISKKATEGORIER</th><th>ANVÄNDS AV</th><th>UPPDATERAD</th><th></th></tr></thead>
          <tbody>
            {[
              { c: "estetisk_injektion", n: "Estetisk injektionsklinik", reg: "IVO", t: 15, r: 10, used: 142 },
              { c: "estetisk_kirurgi", n: "Estetisk kirurgi", reg: "IVO", t: 8, r: 8, used: 12 },
              { c: "tandvard_estetik", n: "Tandvård · estetik", reg: "IVO + Socialst.", t: 6, r: 6, used: 23 },
              { c: "fotvard", n: "Medicinsk fotvård", reg: "Miljöförv. + IVO", t: 9, r: 6, used: 67 },
              { c: "piercing_tatuering", n: "Piercing & tatuering", reg: "Miljöförvaltningen", t: 9, r: 9, used: 41 },
              { c: "klinikkedja", n: "Klinikkedja (multi-bransch)", reg: "per klinik", t: "—", r: "—", used: 8 },
              { c: "hudvard", n: "Hudvård", reg: "Miljöförvaltningen", t: 12, r: 5, used: 14, draft: true },
              { c: "laser_ipl", n: "Laser & IPL", reg: "SSM + IVO", t: 6, r: 7, used: 3, draft: true },
              { c: "frisor_skonhet", n: "Frisör & skönhet", reg: "Miljöförvaltningen", t: 4, r: 3, used: 2, draft: true },
            ].map(t => (
              <tr key={t.c}>
                <td><span className="ck-mono" style={{ fontSize: 11 }}>{t.c}</span></td>
                <td><span style={{ fontWeight: 500 }}>{t.n}{t.draft && <span className="ck-badge ck-badge--medium" style={{ marginLeft: 6, fontSize: 10 }}>Skiss</span>}</span></td>
                <td><span style={{ fontSize: 12 }}>{t.reg}</span></td>
                <td className="ck-tnum">{t.t}</td>
                <td className="ck-tnum">{t.r}</td>
                <td className="ck-tnum">{t.used} bolag</td>
                <td className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>2026-05-12</td>
                <td><button className="ck-btn ck-btn--ghost" style={{ height: 26 }}>Editera</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AdminShell>
);


/* ── Admin · System health ── */
const AdminSystem = () => (
  <AdminShell active="system">
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <h1 className="ck-serif" style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 4 }}>System health</h1>
        <div style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>Worker-status, secrets, cron jobs, DB-tillväxt, ship-flags</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="ck-card" style={{ padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Komponentstatus (via BetterStack)</div>
          {[
            ["TanStack Start Worker", "ok", "99.98% / 30d"],
            ["Supabase Postgres", "ok", "99.99% / 30d"],
            ["Supabase Storage", "ok", "99.97% / 30d"],
            ["Edge: stripe-webhook", "ok", "99.99%"],
            ["Edge: audit-export (pdf-lib)", "ok", "99.95%"],
            ["Edge: bankid-callback", "ok", "100% (få anrop)"],
            ["Realtime", "warn", "99.82% — försämring 03:00–04:12 idag"],
            ["Lovable Email", "ok", "99.96%"],
          ].map(([name, st, uptime]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--ck-divider)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                <span className={`ck-dot ck-dot--${st === "ok" ? "ok" : "warn"}`} />{name}
              </span>
              <span className="ck-mono" style={{ fontSize: 11, color: st === "warn" ? "var(--ck-warning)" : "var(--ck-ink-3)" }}>{uptime}</span>
            </div>
          ))}
        </div>

        <div className="ck-card" style={{ padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Cron jobs (pg_cron)</div>
          {[
            ["compliance-recalc", "dygnsvis 03:00", "✓", "327 ms", "ok"],
            ["delegation-expiry-check", "dygnsvis 06:00", "✓", "118 ms", "ok"],
            ["secret-expiry-check", "vecka mån 09:00", "✓", "44 ms", "ok"],
            ["audit-export-cleanup", "vecka sön 02:00", "✓", "12 ms", "ok"],
            ["medication-batch-expiry", "dygnsvis 07:00", "✓", "208 ms", "ok"],
          ].map(([j, s, ok, t, c]) => (
            <div key={j} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--ck-divider)", fontSize: 12 }}>
              <span className="ck-mono">{j}</span>
              <span style={{ color: "var(--ck-ink-3)" }}>{s}</span>
              <span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-success)" }}>{ok}</span>
              <span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, flex: 1, overflow: "hidden" }}>
        <div className="ck-card" style={{ padding: 18, overflow: "hidden" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Databastillväxt (rader)</div>
          <table className="ck-table">
            <thead><tr><th>TABELL</th><th>RADER</th><th>30D Δ</th><th>STORLEK</th></tr></thead>
            <tbody>
              {[
                ["audit_logs", "4 281 433", "+184 222", "612 MB"],
                ["deviations", "8 122", "+412", "12 MB"],
                ["hygiene_checks", "24 411", "+2 188", "44 MB"],
                ["medication_uses", "32 199", "+3 011", "22 MB"],
                ["orders", "1 822", "+89", "3 MB"],
                ["documents", "1 412", "+22", "6 MB"],
                ["customers", "84 219", "+1 222", "188 MB"],
              ].map(([t, r, d, s]) => (
                <tr key={t}>
                  <td><span className="ck-mono">{t}</span></td>
                  <td className="ck-tnum">{r}</td>
                  <td className="ck-mono" style={{ color: "var(--ck-success)", fontSize: 11 }}>{d}</td>
                  <td className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ck-card" style={{ padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Ship-flags</div>
          <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 14 }}>06 §15.4 · global on/off</div>
          {[
            ["feature.manual_onboarding_approval", false],
            ["feature.auto_trial_enabled", true],
            ["feature.bankid_enabled", false],
            ["feature.bokadirekt_enabled", false],
            ["feature.consulting_inbox_enabled", true],
            ["feature.inspector_mode_enabled", true],
            ["feature.pdl_module_enabled", true],
          ].map(([k, on]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12 }}>
              <span className="ck-mono" style={{ color: "var(--ck-ink-2)", fontSize: 11 }}>{k}</span>
              <span style={{ width: 26, height: 14, borderRadius: 999, background: on ? "var(--ck-primary)" : "var(--ck-border-strong)", position: "relative" }}>
                <span style={{ position: "absolute", width: 10, height: 10, borderRadius: 999, background: "#fff", top: 2, left: on ? 14 : 2 }} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </AdminShell>
);


/* ── Admin · Support ── */
const AdminSupport = () => (
  <AdminShell active="support">
    <div style={{ padding: 24, height: "100%", overflow: "hidden", display: "grid", gridTemplateColumns: "360px 1fr", gap: 16 }}>
      <div className="ck-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--ck-border)" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Inkommande ärenden</div>
          <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>12 öppna · 4 brådskande · 8 väntar svar</div>
        </div>
        <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--ck-border)" }}>
          <input className="ck-input" placeholder="Sök ärenden…" />
        </div>
        {[
          { sel: true, n: "SUP-2026-0048", co: "Derma Beauty AB", subj: "Hygien-schema triggar ingen notis", prio: "high", t: "12 min", new: true },
          { n: "SUP-2026-0047", co: "Stockholm Estetik AB", subj: "Stripe webhook ej levererad efter trial-slut", prio: "urgent", t: "42 min", new: true },
          { n: "SUP-2026-0046", co: "Aesthetic Lab", subj: "Kan inte ladda upp foto i avvikelse", prio: "medium", t: "2h" },
          { n: "SUP-2026-0045", co: "Skin & Co", subj: "Önskar custom industry_template", prio: "low", t: "1d" },
          { n: "SUP-2026-0044", co: "Footcare Norrtull", subj: "BankID-signering fastnar i loop", prio: "high", t: "1d" },
        ].map(t => (
          <div key={t.n} style={{
            padding: "12px 16px",
            background: t.sel ? "var(--ck-primary-soft)" : "transparent",
            borderLeft: t.sel ? "3px solid var(--ck-primary)" : "3px solid transparent",
            borderBottom: "1px solid var(--ck-divider)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{t.n}</span>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 999,
                background: t.prio === "urgent" ? "var(--ck-danger-soft)" : t.prio === "high" ? "var(--ck-warning-soft)" : "var(--ck-surface-sunken)",
                color: t.prio === "urgent" ? "var(--ck-danger)" : t.prio === "high" ? "oklch(0.50 0.14 80)" : "var(--ck-ink-3)",
              }}>{t.prio.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{t.subj}</div>
            <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{t.co} · {t.t}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <span className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>SUP-2026-0048</span>
            <span className="ck-badge ck-badge--medium">Hög</span>
            <span className="ck-badge">Tilldelad Sofia A.</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em" }}>Hygien-schema triggar ingen notis</h2>
          <div style={{ fontSize: 13, color: "var(--ck-ink-2)", marginTop: 4 }}>Från Toni Kazarian · Derma Beauty AB · 12 min sedan</div>
        </div>

        <div className="ck-card" style={{ flex: 1, overflow: "hidden", padding: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 24, height: "100%" }}>
            <div style={{ overflow: "hidden" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <Avatar initials="TK" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Toni Kazarian <span style={{ fontSize: 11, color: "var(--ck-ink-3)", fontWeight: 400 }}>· 12 min</span></div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ck-ink-2)" }}>
                    Vi har en daglig öppning-kontroll schemalagd kl 08:00, men ingen notifiering går ut till morgon-teamet om den inte är gjord innan kl 09. Förväntad beteende vs. faktiskt?
                  </div>
                </div>
              </div>

              <div style={{ padding: 12, background: "var(--ck-surface-sunken)", borderRadius: 8, fontSize: 12, color: "var(--ck-ink-2)", marginBottom: 14 }}>
                <strong>Intern note (CK-admin):</strong> Användaren har <span className="ck-mono">hygiene.check_overdue</span>-notisen avstängd i sina preferenser. Bekräfta innan vi felsöker djupare.
              </div>

              <textarea className="ck-input ck-textarea" placeholder="Skriv svar… ⌘+↵ skickar" defaultValue="Hej Toni — jag ser i din profil att notistypen `hygiene.check_overdue` är avstängd för in-app men på för e-post. Får du e-post men ingen in-app-notis?"></textarea>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <button className="ck-btn ck-btn--ghost"><Icon name="eye" size={14} />Impersonera Toni för felsökning</button>
                <button className="ck-btn">Svara & sätt status: Väntar svar</button>
              </div>
            </div>

            <div>
              <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 10 }}>METADATA</div>
              <div style={{ fontSize: 12, lineHeight: 1.8 }}>
                <div style={{ color: "var(--ck-ink-3)" }}>Bolag</div><div>Derma Beauty AB</div>
                <div style={{ color: "var(--ck-ink-3)", marginTop: 6 }}>Plan</div><div>Pro · trial</div>
                <div style={{ color: "var(--ck-ink-3)", marginTop: 6 }}>Roll</div><div>owner + quality_manager</div>
                <div style={{ color: "var(--ck-ink-3)", marginTop: 6 }}>Senaste deploy</div><div className="ck-mono" style={{ fontSize: 11 }}>v6.0.142</div>
                <div style={{ color: "var(--ck-ink-3)", marginTop: 6 }}>Browser</div><div>Chrome 124 / macOS</div>
              </div>
              <button className="ck-btn ck-btn--secondary" style={{ marginTop: 14, width: "100%", justifyContent: "center", height: 28 }}>Öppna bolagsdetaljer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminShell>
);

Object.assign(window, { AdminUsers, AdminBilling, AdminTemplates, AdminSystem, AdminSupport });
