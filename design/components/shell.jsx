/* CareKompass — shared primitives + AppShell + Logo + Topbar + Sidebar */

const Logo = ({ size = 22, label = "CareKompass" }) => (
  <span className="ck-logo" style={{ fontSize: size === 22 ? 15 : 18 }}>
    <span className="ck-logo-glyph" style={{ width: size, height: size }}>
      {/* Compass-rose glyph */}
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.8" />
        <path d="M6 1.5 L7 6 L6 10.5 L5 6 Z" fill="currentColor" />
        <circle cx="6" cy="6" r="0.7" fill="currentColor" />
      </svg>
    </span>
    {label}
  </span>
);

const Icon = ({ name, size = 16 }) => {
  const stroke = "currentColor";
  const sw = 1.5;
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "home":      return <svg {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>;
    case "alert":     return <svg {...p}><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>;
    case "doc":       return <svg {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /><path d="M8 14h8" /><path d="M8 18h6" /></svg>;
    case "pill":      return <svg {...p}><rect x="2" y="9" width="20" height="6" rx="3" /><path d="M12 9v6" /></svg>;
    case "stethoscope":return <svg {...p}><path d="M4 4h2v6a4 4 0 0 0 8 0V4h2" /><circle cx="18" cy="16" r="2" /><path d="M10 14v2a4 4 0 0 0 8 0" /></svg>;
    case "sparkle":   return <svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>;
    case "shield":    return <svg {...p}><path d="M12 2 4 5v7c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V5l-8-3z" /></svg>;
    case "users":     return <svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" /><circle cx="17" cy="8" r="2.5" /><path d="M22 21v-1a3 3 0 0 0-3-3" /></svg>;
    case "settings":  return <svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>;
    case "search":    return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
    case "bell":      return <svg {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" /></svg>;
    case "chev-down": return <svg {...p}><path d="m6 9 6 6 6-6" /></svg>;
    case "chev-right":return <svg {...p}><path d="m9 6 6 6-6 6" /></svg>;
    case "plus":      return <svg {...p}><path d="M12 5v14M5 12h14" /></svg>;
    case "check":     return <svg {...p}><path d="m5 12 5 5L20 7" /></svg>;
    case "x":         return <svg {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>;
    case "filter":    return <svg {...p}><path d="M3 6h18M6 12h12M10 18h4" /></svg>;
    case "download":  return <svg {...p}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>;
    case "upload":    return <svg {...p}><path d="M12 21V9" /><path d="m7 14 5-5 5 5" /><path d="M5 3h14" /></svg>;
    case "calendar":  return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg>;
    case "clock":     return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case "thermometer":return <svg {...p}><path d="M14 14V5a2 2 0 1 0-4 0v9a4 4 0 1 0 4 0z" /></svg>;
    case "lock":      return <svg {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;
    case "eye":       return <svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "menu":      return <svg {...p}><path d="M3 6h18M3 12h18M3 18h18" /></svg>;
    case "arrow-r":   return <svg {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
    case "external":  return <svg {...p}><path d="M14 3h7v7" /><path d="M10 14 21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></svg>;
    case "compass":   return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2z" /></svg>;
    case "flag":      return <svg {...p}><path d="M4 21V4M4 4h11l-2 4 2 4H4" /></svg>;
    case "more":      return <svg {...p}><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></svg>;
    case "leaf":      return <svg {...p}><path d="M11 20A7 7 0 0 1 4 13V8a6 6 0 0 1 6-6h7v6a7 7 0 0 1-6 7" /><path d="M4 21c0-4 3-9 11-12" /></svg>;
    case "scale":     return <svg {...p}><path d="M12 3v18M5 21h14M5 7h14M2 13l3-6 3 6M16 13l3-6 3 6M3 13a2 2 0 0 0 4 0M15 13a2 2 0 0 0 4 0" /></svg>;
    case "graduation":return <svg {...p}><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c2 1.5 4 2 6 2s4-.5 6-2v-5" /></svg>;
    case "trash":     return <svg {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" /></svg>;
    case "circle-q":  return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4" /><path d="M12 17h.01" /></svg>;
    default: return null;
  }
};

const Avatar = ({ initials, color }) => (
  <span className="ck-avatar" style={color ? { background: color, color: "#fff" } : null}>{initials}</span>
);

/* ── Sidebar nav ── */
const NavItem = ({ icon, label, active, badge, sub, count }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10,
    padding: sub ? "5px 12px 5px 38px" : "6px 12px",
    borderRadius: 6,
    background: active ? "var(--ck-primary-soft)" : "transparent",
    color: active ? "var(--ck-primary)" : "var(--ck-ink-2)",
    fontSize: 13, fontWeight: active ? 600 : 500,
    cursor: "default",
  }}>
    {icon && <Icon name={icon} size={16} />}
    <span style={{ flex: 1 }}>{label}</span>
    {badge && <span className="ck-badge ck-badge--primary" style={{ height: 18, fontSize: 10 }}>{badge}</span>}
    {count != null && <span style={{ fontSize: 11, color: "var(--ck-ink-3)", fontVariantNumeric: "tabular-nums" }}>{count}</span>}
  </div>
);

const NavSection = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    {label && (
      <div style={{
        fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
        color: "var(--ck-ink-4)", padding: "4px 12px 6px", fontWeight: 600,
      }}>{label}</div>
    )}
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>{children}</div>
  </div>
);

/* ── Sidebar ── */
const Sidebar = ({ active = "dashboard" }) => (
  <aside style={{
    width: 232, flexShrink: 0,
    borderRight: "1px solid var(--ck-border)",
    background: "var(--ck-surface)",
    display: "flex", flexDirection: "column",
  }}>
    {/* Brand */}
    <div style={{ padding: "14px 14px 12px", borderBottom: "1px solid var(--ck-border)" }}>
      <Logo />
    </div>

    {/* Clinic switcher */}
    <div style={{ padding: 10, borderBottom: "1px solid var(--ck-border)" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 10px",
        border: "1px solid var(--ck-border-strong)",
        borderRadius: 8, background: "var(--ck-surface)",
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6, flexShrink: 0,
          background: "linear-gradient(135deg, var(--ck-primary), oklch(0.55 0.10 200))",
          display: "grid", placeItems: "center", color: "#fff", fontSize: 11, fontWeight: 700,
        }}>DB</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>Derma Beauty AB</div>
          <div style={{ fontSize: 11, color: "var(--ck-ink-3)", lineHeight: 1.2 }}>Östermalm · 2 kliniker</div>
        </div>
        <Icon name="chev-down" size={14} />
      </div>
    </div>

    {/* Nav */}
    <div style={{ padding: "10px 8px", overflow: "hidden", flex: 1 }}>
      <NavSection>
        <NavItem icon="home" label="Översikt" active={active === "dashboard"} />
        <NavItem icon="alert" label="Avvikelser" active={active === "deviations"} badge="3" />
        <NavItem icon="stethoscope" label="Ordinationer" active={active === "orders"} badge="2" />
        <NavItem icon="pill" label="Läkemedel" active={active === "medications"} />
        <NavItem icon="sparkle" label="Hygien & egenkontroll" active={active === "hygiene"} />
        <NavItem icon="scale" label="Risk" active={active === "risk"} />
        <NavItem icon="doc" label="Styrdokument" active={active === "documents"} />
        <NavItem icon="graduation" label="Personal & legitimation" active={active === "staff"} />
      </NavSection>

      <NavSection label="Översyn">
        <NavItem icon="shield" label="Compliance Center" active={active === "compliance"} />
        <NavItem icon="clock" label="Audit log" active={active === "audit"} />
      </NavSection>

      <NavSection label="Konto">
        <NavItem icon="users" label="Användare & roller" active={active === "users"} />
        <NavItem icon="settings" label="Inställningar" active={active === "settings"} />
      </NavSection>
    </div>

    {/* Bottom: plan + user */}
    <div style={{ borderTop: "1px solid var(--ck-border)", padding: 10 }}>
      <div style={{ padding: "8px 10px", borderRadius: 8, background: "var(--ck-primary-soft)", marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: "var(--ck-primary)", fontWeight: 600, marginBottom: 2 }}>PRO · TRIAL</div>
        <div style={{ fontSize: 11, color: "var(--ck-ink-2)" }}>9 dagar kvar · <a style={{ textDecoration: "underline", color: "var(--ck-primary)" }}>Uppgradera</a></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar initials="TK" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Toni Kazarian</div>
          <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>Verksamhetschef</div>
        </div>
        <Icon name="chev-down" size={14} />
      </div>
    </div>
  </aside>
);

/* ── Topbar ── */
const Topbar = ({ title, breadcrumbs, actions }) => (
  <div style={{
    height: 56, borderBottom: "1px solid var(--ck-border)",
    background: "var(--ck-surface)",
    display: "flex", alignItems: "center", padding: "0 20px", gap: 16,
  }}>
    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
      {breadcrumbs && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ck-ink-3)", fontSize: 13 }}>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Icon name="chev-right" size={12} />}
              <span style={{ color: i === breadcrumbs.length - 1 ? "var(--ck-ink)" : "var(--ck-ink-3)", fontWeight: i === breadcrumbs.length - 1 ? 600 : 400 }}>{b}</span>
            </React.Fragment>
          ))}
        </div>
      )}
      {title && <h1 style={{ fontSize: 16, fontWeight: 600 }}>{title}</h1>}
    </div>

    {/* Cmd+K search */}
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      width: 300, height: 32, padding: "0 10px",
      border: "1px solid var(--ck-border-strong)",
      borderRadius: 6, background: "var(--ck-surface-sunken)",
      color: "var(--ck-ink-3)", fontSize: 12,
    }}>
      <Icon name="search" size={14} />
      <span style={{ flex: 1 }}>Sök avvikelser, dokument, patienter…</span>
      <span className="ck-kbd">⌘K</span>
    </div>

    <button className="ck-btn ck-btn--ghost" style={{ width: 32, padding: 0, position: "relative" }}>
      <Icon name="bell" size={16} />
      <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: 999, background: "var(--ck-danger)" }} />
    </button>

    {actions}
  </div>
);

/* ── AppShell ── */
const AppShell = ({ active, children, topbarProps }) => (
  <div className="ck" style={{ display: "flex", height: "100%", background: "var(--ck-bg)" }}>
    <Sidebar active={active} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <Topbar {...topbarProps} />
      <div style={{ flex: 1, overflow: "hidden", background: "var(--ck-bg)" }}>{children}</div>
    </div>
  </div>
);

/* ── Severity chip helper ── */
const Severity = ({ level }) => {
  const map = {
    critical: { label: "Kritisk", cls: "ck-badge--critical" },
    high:     { label: "Hög",     cls: "ck-badge--high" },
    medium:   { label: "Medel",   cls: "ck-badge--medium" },
    low:      { label: "Låg",     cls: "ck-badge--low" },
  };
  const m = map[level];
  return <span className={`ck-badge ck-badge--dot ${m.cls}`}>{m.label}</span>;
};

const Status = ({ level, label }) => {
  const map = {
    open:        { dot: "warn",   label: label || "Öppen" },
    investigating:{ dot: "info",  label: label || "Utreds" },
    action:      { dot: "info",   label: label || "Åtgärd pågår" },
    closed:      { dot: "ok",     label: label || "Stängd" },
    overdue:     { dot: "danger", label: label || "Försenad" },
    pending:     { dot: "warn",   label: label || "Väntar" },
  };
  const m = map[level] || { dot: "info", label };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ck-ink-2)" }}>
      <span className={`ck-dot ck-dot--${m.dot}`} />
      {m.label}
    </span>
  );
};

Object.assign(window, { Logo, Icon, Avatar, NavItem, NavSection, Sidebar, Topbar, AppShell, Severity, Status });
