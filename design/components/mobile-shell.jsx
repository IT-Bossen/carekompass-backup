/* MOBILE SHELL — phone wrapper + status bar + top bar + bottom tab bar + shared mobile primitives.
   Touch-first: 44px+ hit targets, bottom sheet pattern, FAB, swipeable lists. */

const MPhone = ({ children, width = 390, height = 844 }) => (
  <div style={{
    width: width + 16, height: height + 16,
    background: "oklch(0.22 0.015 60)",
    borderRadius: 44, padding: 8,
    boxShadow: "0 20px 50px oklch(0.22 0.015 60 / 0.18)",
    position: "relative",
  }}>
    <div style={{
      width, height, borderRadius: 36, background: "var(--ck-bg)", overflow: "hidden", position: "relative",
    }}>
      {children}
    </div>
  </div>
);

const MStatusBar = ({ light, time = "9:41" }) => (
  <div style={{
    height: 44, paddingTop: 14, paddingLeft: 28, paddingRight: 28,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    fontSize: 14, fontWeight: 600,
    color: light ? "#fff" : "var(--ck-ink)",
    position: "relative", zIndex: 2,
    flexShrink: 0,
  }}>
    <span className="ck-tnum">{time}</span>
    <div style={{ position: "absolute", left: "50%", top: 12, transform: "translateX(-50%)", width: 110, height: 32, borderRadius: 18, background: "oklch(0.22 0.015 60)" }} />
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      <svg width="16" height="11" viewBox="0 0 14 10"><path d="M0 8h2v2H0zm3-2h2v4H3zm3-2h2v6H6zm3-2h2v8H9zm3-3h2v11h-2z" fill="currentColor" /></svg>
      <svg width="16" height="11" viewBox="0 0 14 10"><path d="M7 1.3a8 8 0 0 1 5 1.7l1-1.3a10 10 0 0 0-12 0l1 1.3A8 8 0 0 1 7 1.3zm0 3a5 5 0 0 1 3 1l1-1.3a7 7 0 0 0-8 0l1 1.3a5 5 0 0 1 3-1zm0 2.7a2 2 0 0 0-1.8 1.2L7 10l1.8-1.8A2 2 0 0 0 7 7z" fill="currentColor"/></svg>
      <svg width="24" height="11" viewBox="0 0 22 10"><rect x="0.5" y="0.5" width="18" height="9" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.4" /><rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor" /><rect x="19" y="3" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.4" /></svg>
    </div>
  </div>
);

const MTopbar = ({ title, subtitle, back, action, large, dark }) => (
  <div style={{
    padding: large ? "12px 18px 20px" : "10px 12px",
    borderBottom: large ? 0 : "1px solid var(--ck-border)",
    background: dark ? "transparent" : "var(--ck-surface)",
    color: dark ? "#fff" : "var(--ck-ink)",
    flexShrink: 0,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 4, minHeight: 36 }}>
      {back && (
        <button style={{ background: "transparent", border: 0, padding: "8px 6px 8px 0", color: dark ? "#fff" : "var(--ck-primary)", display: "flex", alignItems: "center", gap: 2, fontSize: 15, marginLeft: -4 }}>
          <Icon name="chev-down" size={22} style={{ transform: "rotate(90deg)" }} />
          {typeof back === "string" && <span style={{ fontWeight: 500 }}>{back}</span>}
        </button>
      )}
      {!large && <div style={{ flex: 1, fontSize: 17, fontWeight: 600, textAlign: back ? "center" : "left", marginLeft: back ? -24 : 0 }}>{title}</div>}
      {action}
    </div>
    {large && (
      <div style={{ marginTop: back ? 8 : 0 }}>
        <h1 style={{ fontSize: 30, lineHeight: 1.1, letterSpacing: "-0.025em", fontWeight: 700, fontFamily: "var(--ck-font-serif)", color: "inherit" }}>{title}</h1>
        {subtitle && <div style={{ fontSize: 13, color: dark ? "oklch(1 0 0 / 0.7)" : "var(--ck-ink-2)", marginTop: 4 }}>{subtitle}</div>}
      </div>
    )}
  </div>
);

const MTabBar = ({ active = "home", showFab = true }) => {
  const tabs = [
    { key: "home", label: "Hem", icon: "home" },
    { key: "deviations", label: "Avvikelser", icon: "alert", badge: 3 },
    null,
    { key: "hygiene", label: "Hygien", icon: "sparkle" },
    { key: "more", label: "Mer", icon: "menu" },
  ];

  return (
    <div style={{
      height: 92, paddingBottom: 26,
      borderTop: "1px solid var(--ck-border)",
      background: "var(--ck-surface)",
      display: "grid", gridTemplateColumns: "1fr 1fr 80px 1fr 1fr",
      alignItems: "center",
      position: "relative",
      flexShrink: 0,
    }}>
      {tabs.map((tab, i) => {
        if (!tab) {
          return (
            <div key="fab-slot" style={{ display: "grid", placeItems: "center" }}>
              {showFab && (
                <button style={{
                  width: 56, height: 56, borderRadius: 999,
                  background: "var(--ck-primary)", color: "var(--ck-primary-foreground)",
                  border: "4px solid var(--ck-surface)", marginTop: -28,
                  display: "grid", placeItems: "center",
                  boxShadow: "0 8px 18px oklch(0.42 0.06 175 / 0.4)",
                }}>
                  <Icon name="plus" size={24} />
                </button>
              )}
            </div>
          );
        }
        const isActive = tab.key === active;
        return (
          <div key={tab.key} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: isActive ? "var(--ck-primary)" : "var(--ck-ink-3)",
            padding: "6px 0", position: "relative", cursor: "pointer",
          }}>
            <Icon name={tab.icon} size={22} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.02 }}>{tab.label}</span>
            {tab.badge && <span style={{
              position: "absolute", top: 2, right: "calc(50% - 18px)",
              background: "var(--ck-danger)", color: "#fff",
              minWidth: 16, height: 16, borderRadius: 999, padding: "0 4px",
              display: "grid", placeItems: "center",
              fontSize: 9, fontWeight: 700,
            }} className="ck-tnum">{tab.badge}</span>}
          </div>
        );
      })}
      <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, borderRadius: 999, background: "var(--ck-ink)" }} />
    </div>
  );
};

const MobileShell = ({ active, children, topbar, lightStatus, noTabs, noBar }) => (
  <div className="ck" style={{ width: "100%", height: "100%", background: "var(--ck-bg)", display: "flex", flexDirection: "column" }}>
    {!noBar && <MStatusBar light={lightStatus} />}
    {topbar}
    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>{children}</div>
    {!noTabs && <MTabBar active={active} />}
  </div>
);

/* Mobile list row — touch target */
const MRow = ({ icon, iconColor, title, sub, meta, badge, chev = true, danger }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 18px", borderBottom: "1px solid var(--ck-divider)",
    background: "var(--ck-surface)", minHeight: 64,
  }}>
    {icon && (
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: iconColor || "var(--ck-surface-sunken)",
        color: danger ? "var(--ck-danger)" : "var(--ck-ink-2)",
        display: "grid", placeItems: "center", flexShrink: 0,
      }}>
        <Icon name={icon} size={18} />
      </div>
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ck-ink)", marginBottom: sub ? 2 : 0 }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--ck-ink-3)" }}>{sub}</div>}
    </div>
    {badge}
    {meta && <div style={{ fontSize: 11, color: "var(--ck-ink-3)", flexShrink: 0 }} className="ck-mono">{meta}</div>}
    {chev && <Icon name="chev-right" size={14} />}
  </div>
);

/* Section header within scrollable content */
const MSection = ({ label, action, children, mt = 16 }) => (
  <>
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      padding: "10px 18px 6px", marginTop: mt,
    }}>
      <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.08em", fontWeight: 600 }}>{label}</div>
      {action}
    </div>
    {children}
  </>
);

const MCard = ({ children, p = 16, style }) => (
  <div className="ck-card" style={{ padding: p, margin: "0 18px 12px", ...style }}>{children}</div>
);

/* Scrollable content area */
const MScroll = ({ children, style }) => (
  <div style={{ flex: 1, overflow: "hidden", background: "var(--ck-bg)", ...style }}>
    <div style={{ paddingBottom: 12 }}>{children}</div>
  </div>
);

/* Bottom-sheet primary action button */
const MPrimaryAction = ({ label, icon, large }) => (
  <button style={{
    width: "100%", height: large ? 52 : 48,
    background: "var(--ck-primary)", color: "var(--ck-primary-foreground)",
    border: 0, borderRadius: 14,
    fontSize: 15, fontWeight: 600,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  }}>
    {icon && <Icon name={icon} size={18} />}
    {label}
  </button>
);

const MSecondaryAction = ({ label, icon }) => (
  <button style={{
    width: "100%", height: 48,
    background: "var(--ck-surface)", color: "var(--ck-ink)",
    border: "1px solid var(--ck-border-strong)", borderRadius: 14,
    fontSize: 15, fontWeight: 500,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  }}>
    {icon && <Icon name={icon} size={18} />}
    {label}
  </button>
);

Object.assign(window, { MPhone, MStatusBar, MTopbar, MTabBar, MobileShell, MRow, MSection, MCard, MScroll, MPrimaryAction, MSecondaryAction });
