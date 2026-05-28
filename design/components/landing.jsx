/* CareKompass — public Landing page */

const PublicHeader = () => (
  <header style={{
    height: 64, borderBottom: "1px solid var(--ck-border)",
    background: "var(--ck-surface)",
    display: "flex", alignItems: "center", padding: "0 36px", gap: 32,
  }}>
    <Logo />
    <nav style={{ display: "flex", gap: 22, fontSize: 13, color: "var(--ck-ink-2)", marginLeft: 16 }}>
      <span>Funktioner</span>
      <span>Branscher</span>
      <span>Priser</span>
      <span>Säkerhet</span>
      <span>Nyheter</span>
      <span>Support</span>
    </nav>
    <div style={{ flex: 1 }} />
    <span style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>Logga in</span>
    <button className="ck-btn">Starta gratis trial</button>
  </header>
);

const PublicFooter = () => (
  <footer style={{ borderTop: "1px solid var(--ck-border)", padding: "36px 36px 28px", background: "var(--ck-surface)" }}>
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", gap: 32 }}>
      <div>
        <Logo />
        <p style={{ fontSize: 12, color: "var(--ck-ink-3)", marginTop: 12, maxWidth: 220, lineHeight: 1.5 }}>
          Ledningssystem för svenska kliniker enligt SOSFS 2011:9. Bygger på Lovable Cloud i EU.
        </p>
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          <span className="ck-badge ck-badge--ok"><Icon name="shield" size={10} />GDPR-anpassad</span>
          <span className="ck-badge">EU-hostad</span>
        </div>
      </div>
      {[
        ["Produkt", ["Avvikelser", "Styrdokument", "Läkemedel", "Ordination", "Hygien", "Compliance Center"]],
        ["Företag", ["Om oss", "Nyheter", "Kontakt", "Bli partner"]],
        ["Resurser", ["GDPR-guide", "IVO-anpassning", "Säkerhet", "Webinars"]],
        ["Juridik", ["Användarvillkor", "Integritet", "Cookies", "DPA / PuB-avtal", "Lagar vi följer"]],
      ].map(([title, items]) => (
        <div key={title}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ck-ink-3)", marginBottom: 10 }}>{title}</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {items.map(i => <li key={i} style={{ fontSize: 12, color: "var(--ck-ink-2)" }}>{i}</li>)}
          </ul>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 32, paddingTop: 18, borderTop: "1px solid var(--ck-border)", display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ck-ink-3)" }}>
      <span>© 2026 CareKompass AB · Org.nr 559123-4567</span>
      <span className="ck-mono">v6.0 · v6.carekompass.se</span>
    </div>
  </footer>
);

const Landing = () => (
  <div className="ck" style={{ background: "var(--ck-bg)" }}>
    <PublicHeader />

    {/* HERO */}
    <section style={{ padding: "84px 36px 72px", position: "relative", overflow: "hidden" }}>
      {/* Subtle decorative compass-rose */}
      <svg style={{ position: "absolute", right: -80, top: 40, opacity: 0.06 }} width="520" height="520" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="24" fill="none" stroke="currentColor" strokeWidth="0.3" />
        <path d="M50 4 L54 50 L50 96 L46 50 Z" fill="currentColor" />
        <path d="M4 50 L50 46 L96 50 L50 54 Z" fill="currentColor" opacity="0.6" />
      </svg>

      <div style={{ maxWidth: 1100, position: "relative" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          <span className="ck-badge ck-badge--primary"><Icon name="compass" size={10} />v6.0 — nu i öppen pilot</span>
          <span className="ck-badge">För estetik, fotvård, piercing & tatuering</span>
        </div>

        <h1 className="ck-serif" style={{ fontSize: 80, lineHeight: 0.98, letterSpacing: "-0.035em", marginBottom: 28, maxWidth: 980 }}>
          Compliance som inte<br />stjäl din tid.
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.5, color: "var(--ck-ink-2)", maxWidth: 640, marginBottom: 36 }}>
          CareKompass är ledningssystemet som låter dig <em>äga</em> ditt kvalitetsarbete
          — avvikelser, läkemedel, hygien, dokument och delegeringar på en plats,
          spårbart för IVO och Miljöförvaltningen från första dagen.
        </p>

        <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
          <button className="ck-btn ck-btn--lg" style={{ height: 48, padding: "0 22px", fontSize: 15 }}>
            Starta 14-dagars trial<Icon name="arrow-r" size={16} />
          </button>
          <button className="ck-btn ck-btn--secondary ck-btn--lg" style={{ height: 48, padding: "0 22px", fontSize: 15 }}>
            Boka 20-min demo
          </button>
        </div>

        <div style={{ display: "flex", gap: 28, fontSize: 12, color: "var(--ck-ink-3)", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="check" size={14} />Inget kort krävs</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="check" size={14} />Datan stannar i EU</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="check" size={14} />Audit-export på 30s</span>
        </div>
      </div>
    </section>

    {/* App-screen preview */}
    <section style={{ padding: "0 36px 72px" }}>
      <div style={{
        border: "1px solid var(--ck-border)", borderRadius: 16,
        background: "var(--ck-surface)", overflow: "hidden",
        boxShadow: "0 24px 60px oklch(0.22 0.015 60 / 0.08), 0 6px 18px oklch(0.22 0.015 60 / 0.06)",
      }}>
        {/* fake browser chrome */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: "1px solid var(--ck-border)", background: "var(--ck-surface-sunken)" }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.85 0.06 25)" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.85 0.06 80)" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.85 0.06 150)" }} />
          <div style={{ flex: 1, maxWidth: 380, height: 24, margin: "0 auto", borderRadius: 4, background: "var(--ck-surface)", border: "1px solid var(--ck-border)", display: "grid", placeItems: "center", fontSize: 11, color: "var(--ck-ink-3)" }} className="ck-mono">
            v6.carekompass.se/app/compliance
          </div>
        </div>
        {/* dashboard glimpse */}
        <div style={{ display: "grid", gridTemplateColumns: "232px 1fr", height: 480 }}>
          <div style={{ borderRight: "1px solid var(--ck-border)", padding: 16, background: "var(--ck-surface)" }}>
            <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 8 }} className="ck-mono">DERMA BEAUTY AB</div>
            {["Översikt", "Avvikelser", "Ordinationer", "Läkemedel", "Hygien", "Risk", "Compliance Center", "Audit log"].map((it, i) => (
              <div key={it} style={{ padding: "6px 8px", fontSize: 13, color: i === 6 ? "var(--ck-primary)" : "var(--ck-ink-2)", background: i === 6 ? "var(--ck-primary-soft)" : "transparent", borderRadius: 6, marginBottom: 2, fontWeight: i === 6 ? 600 : 500 }}>{it}</div>
            ))}
          </div>
          <div style={{ padding: 28, background: "var(--ck-bg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
              <div>
                <div className="ck-mono" style={{ fontSize: 10, color: "var(--ck-ink-3)", letterSpacing: "0.06em" }}>COMPLIANCE CENTER · MAJ 2026</div>
                <h2 style={{ fontSize: 22, marginTop: 4 }}>Din egen översikt</h2>
              </div>
              <button className="ck-btn ck-btn--secondary"><Icon name="download" size={14} />Audit-paket</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20 }}>
              <div className="ck-card" style={{ padding: 20 }}>
                <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>Compliance-score</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 6 }}>
                  <span className="ck-tnum" style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-0.03em" }}>87</span>
                  <span style={{ fontSize: 14, color: "var(--ck-ink-3)" }}>/ 100</span>
                </div>
                <div className="ck-badge ck-badge--ok" style={{ marginTop: 6 }}>GRÖNT · stabilt</div>
                <div style={{ marginTop: 16, height: 6, borderRadius: 999, background: "var(--ck-surface-sunken)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "87%", background: "var(--ck-primary)" }} />
                </div>
                <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginTop: 14, lineHeight: 1.5 }}>
                  Hjälpmedel för din kvalitetsansvariga — inte ett myndighetsutlåtande.
                </div>
              </div>

              <div className="ck-card" style={{ padding: 20 }}>
                <div style={{ fontSize: 11, color: "var(--ck-ink-3)", marginBottom: 12 }}>Vad behöver uppmärksamhet</div>
                {[
                  ["Avvikelser", "2 öppna ≥ 7d", "warning"],
                  ["Delegeringar", "1 går ut om 4d", "warning"],
                  ["Hygienkontroller", "3 missade denna vecka", "danger"],
                  ["Läkemedel", "Allt OK", "ok"],
                ].map(([k, v, lvl]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--ck-divider)", fontSize: 13 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className={`ck-dot ck-dot--${lvl === "danger" ? "danger" : lvl === "warning" ? "warn" : "ok"}`} />
                      {k}
                    </span>
                    <span style={{ color: "var(--ck-ink-2)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Problem / lösning */}
    <section style={{ padding: "80px 36px", background: "var(--ck-surface)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
        <div>
          <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 12 }}>PROBLEMET</div>
          <h2 className="ck-serif" style={{ fontSize: 38, lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: 18 }}>
            Pärmar, Excel-filer, lösa rutiner — och tillsyn nästa vecka.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ck-ink-2)" }}>
            De flesta kliniker bygger sitt ledningssystem av Word-dokument i Dropbox,
            handskrivna avvikelseblock och delegeringar som signeras på papper.
            När IVO eller Miljöförvaltningen knackar på dörren tar det dagar att
            sätta ihop en spårbar bild av vad ni faktiskt har gjort.
          </p>
        </div>
        <div>
          <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 12 }}>LÖSNINGEN</div>
          <h2 className="ck-serif" style={{ fontSize: 38, lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: 18 }}>
            Ett ledningssystem som följer ditt arbetssätt — inte tvärtom.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ck-ink-2)" }}>
            CareKompass strukturerar bara det som behöver vara strukturerat:
            avvikelser, ordinationer, läkemedel, hygien och dokument. Allt sker
            i flöden er personal redan känner igen — men spåras automatiskt med
            tidsstämpel, signering och full audit-historik.
          </p>
        </div>
      </div>
    </section>

    {/* Modules */}
    <section style={{ padding: "80px 36px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 8 }}>MODULER</div>
          <h2 className="ck-serif" style={{ fontSize: 38, lineHeight: 1.05, letterSpacing: "-0.025em" }}>Allt på ett ställe, ingenting i vägen.</h2>
        </div>
        <span style={{ fontSize: 13, color: "var(--ck-ink-2)" }}>Aktivera per plan — ingår alla i Pro & Enterprise</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { icon: "alert", title: "Avvikelsehantering", body: "Rapportera → klassificera → tilldela → åtgärda → stäng. SLA per severity, Lex Maria-tröskel inbyggd." },
          { icon: "doc", title: "Styrdokument", body: "Versionerade rutiner och policys. Signera digitalt, exportera vid tillsyn, automatiska påminnelser." },
          { icon: "pill", title: "Läkemedel & produkt", body: "Batch, utgångsdatum, temperaturlogg per kyl, lager per klinik, kassationer spårade." },
          { icon: "stethoscope", title: "Ordination & delegering", body: "Vem får ordinera, vem får utföra, giltighetstid. Cross-tenant inbox för konsulterande läkare." },
          { icon: "sparkle", title: "Hygien & egenkontroll", body: "Schemalagda checklistor med fotobevis. Avvikelse skapas automatiskt vid \"ej OK\"." },
          { icon: "scale", title: "Risk", body: "5×5-riskmatris enligt SOSFS 2011:9. Branschspecifika kategorier, åtgärdsplaner, översyn." },
          { icon: "shield", title: "Compliance Center", body: "En score, en lista över vad som saknas, ett exportpaket. För din kvalitetsansvariga — inte för oss." },
          { icon: "graduation", title: "Personal & legitimation", body: "Legitimation, certifikat och utbildning per behandlare. Varningar 30/7 dagar innan utgång." },
          { icon: "users", title: "Roller & behörigheter", body: "13 roller, 62 permissions, RLS-säkrat på databasnivå. Inspector-token för IVO med tidsgräns." },
        ].map(m => (
          <div key={m.title} className="ck-card" style={{ padding: 22 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--ck-primary-soft)", color: "var(--ck-primary)", display: "grid", placeItems: "center", marginBottom: 14 }}>
              <Icon name={m.icon} size={18} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{m.title}</div>
            <div style={{ fontSize: 13, color: "var(--ck-ink-2)", lineHeight: 1.5 }}>{m.body}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Branscher */}
    <section style={{ padding: "72px 36px", background: "var(--ck-surface)" }}>
      <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 12, textAlign: "center" }}>BRANSCHER SOM CAREKOMPASS STÖTTAR</div>
      <h2 className="ck-serif" style={{ fontSize: 30, lineHeight: 1.05, letterSpacing: "-0.025em", textAlign: "center", marginBottom: 36 }}>Terminologi och regelverk som matchar din verksamhet.</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, maxWidth: 1000, margin: "0 auto" }}>
        {[
          ["Estetisk injektion", "IVO · \"Patient\" · \"Ordination\""],
          ["Estetisk kirurgi", "IVO · lag 2021:363"],
          ["Tandvård estetik", "IVO + Socialstyrelsen"],
          ["Klinikkedja", "Multi-bransch per klinik"],
          ["Piercing & tatuering", "Miljöförvaltningen"],
          ["Fotvård", "\"Klient\" · \"Behandlingsplan\""],
          ["Laser & IPL", "Strålsäkerhetsmynd. + IVO"],
          ["Microneedling & PRP", "IVO (blodhantering)"],
        ].map(([name, sub]) => (
          <div key={name} style={{ padding: 16, border: "1px solid var(--ck-border)", borderRadius: 10, background: "var(--ck-surface)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{name}</div>
            <div style={{ fontSize: 11, color: "var(--ck-ink-3)" }}>{sub}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Positionering / ansvarsgräns */}
    <section style={{ padding: "80px 36px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
        <div className="ck-mono" style={{ fontSize: 11, color: "var(--ck-ink-3)", letterSpacing: "0.06em", marginBottom: 14 }}>VAR VI DRAR LINJEN</div>
        <h2 className="ck-serif" style={{ fontSize: 44, lineHeight: 1.04, letterSpacing: "-0.03em", marginBottom: 20 }}>
          Du äger ditt kvalitetsarbete.<br />Vi är verktyget.
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--ck-ink-2)" }}>
          CareKompass tar aldrig över vårdgivarens lagstadgade ansvar.
          Vi granskar inte er vård, vi godkänner inte er compliance och vi gör inga
          myndighetsutlåtanden. Vi ger er strukturen, spårbarheten och
          tidsstämplarna — så att er kvalitetsansvariga kan göra sitt jobb i fred.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
          <span className="ck-badge"><Icon name="check" size={10} />SOSFS 2011:9</span>
          <span className="ck-badge"><Icon name="check" size={10} />Patientsäkerhetslagen</span>
          <span className="ck-badge"><Icon name="check" size={10} />GDPR · EU-data</span>
          <span className="ck-badge"><Icon name="check" size={10} />Audit-trail 7 år</span>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: "80px 36px 100px" }}>
      <div className="ck-card" style={{
        padding: 56, textAlign: "center",
        background: "linear-gradient(180deg, var(--ck-primary) 0%, oklch(0.32 0.06 175) 100%)",
        color: "var(--ck-primary-foreground)",
        border: 0,
      }}>
        <h2 className="ck-serif" style={{ fontSize: 44, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 14 }}>
          Sov bättre inför nästa tillsyn.
        </h2>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 28, maxWidth: 540, margin: "0 auto 28px" }}>
          14 dagar gratis. Allt i Pro öppet. Du behöver bara org.nr och en kvalitetsansvarig.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="ck-btn ck-btn--lg" style={{ background: "var(--ck-surface)", color: "var(--ck-ink)", height: 48, padding: "0 24px" }}>Starta trial<Icon name="arrow-r" size={16} /></button>
          <button className="ck-btn ck-btn--lg" style={{ background: "transparent", color: "var(--ck-primary-foreground)", border: "1px solid oklch(1 0 0 / 0.3)", height: 48, padding: "0 24px" }}>Boka demo</button>
        </div>
      </div>
    </section>

    <PublicFooter />
  </div>
);

Object.assign(window, { Landing });
