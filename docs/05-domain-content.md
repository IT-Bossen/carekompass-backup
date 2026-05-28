# CareKompass v6.0 — Domain Content

> **Serie:** 01-system-spec · 02-database-api · 03-frontend-guide · 04-implementation-plan · **05-domain-content** · 06-conventions
> **Syfte:** Konkret branschspecifikt innehåll som måste finnas innan kod kan skrivas mot relevanta moduler. Inkluderar roll × permission-matris (Fas 1), industry templates (Fas 1), default-dokumentmallar (Fas 2), hygienchecklistor (Fas 4), notifieringskatalog (genomgående) och kategoriseringslistor.

> **OBS:** Innehållet i denna fil är **förslag baserade på branschpraxis och svenska regelverk (lag 2021:363, SOSFS 2011:9, IVO:s tillsynspraxis)**. Toni måste granska, godkänna och ev. anpassa innan seed-migrationer körs. Vissa avsnitt är medvetet placeholders där sakkunnig granskning krävs.

---

## Innehåll

1. Roll × permission-matris
2. Permission-katalog (alla `<module>.<action>`-koder)
3. Industry templates — terminologi-nycklar
4. Industry templates — fyllda exempel (3 branscher)
5. Default-dokumentmallar per bransch
6. Hygienchecklist-mallar per bransch
7. Avvikelsekategorier per bransch
8. Riskkategorier per bransch
9. Behandlingstyper per bransch
10. Notifieringskatalog
11. Compliance-score-vikter (konfig)
12. Validering & sakkunnig granskning krävs

---

## 1. Roll × permission-matris

> **⚠ ÖVERSTYRD AV 07 §2.** Rollmodellen nedan (13 separata roller) ersattes av den hierarkiska modellen i **07-v4-mapping-and-overrides.md §2**: hierarkiska roller (`owner`/`manager`/`quality_manager`/`member` på bolagsnivå + `clinic_manager`/`staff`/`auditor` på kliniknivå) + **kapabilitetsflaggor** (`is_licensed_practitioner`, `is_medication_custodian`, `is_hygiene_lead`, `is_consulting_practitioner`) + **utbyggbara staff-subroller** per bransch. Använd 07 §2 som sanning för roller. **Permission-katalogen (§2 nedan), industry templates (§3-4), dokumentmallar (§5), hygienchecklistor (§6), kategorier (§7-9), notifieringskatalog (§10) och compliance-vikter (§11) i denna fil gäller oförändrat** — det är endast roll→permission-*mappningen* i §1 som 07 förfinar. Permissionerna i sig (§2) mappas mot de hierarkiska rollerna + kapabiliteter istället för de 13 koderna nedan.

Matrisen nedan behålls som referens för *vilka permissions som finns per ansvarsområde* — översätt rollkolumnerna till 07:s modell (t.ex. `tenant_owner`+`company_owner` → `owner`; `verksamhetschef` → `quality_manager` eller `manager`; `legitimerad_*` → `staff` + `is_licensed_practitioner`).

Matrisen seedas via migration `0012_seed_roles_permissions.sql`. Förkortningar: C=create, R=read, U=update, D=soft delete, A=approve, S=sign, X=export, M=manage.

### 1.1 Bolagsövergripande roller

| Permission | tenant_owner | company_owner | verksamhetschef | clinic_manager | administrator | auditor |
|---|---|---|---|---|---|---|
| **company.*** | CRUD | CRUD | RU | R | R | R |
| **clinic.*** | CRUD | CRUD | CRUD | RU (egen) | R | R |
| **user.invite** | ✓ | ✓ | ✓ | ✓ (egen klinik) | ✓ (egen klinik) | – |
| **user.revoke** | ✓ | ✓ | ✓ | ✓ (egen klinik) | – | – |
| **billing.view** | ✓ | ✓ | ✓ | – | – | ✓ |
| **billing.manage** | ✓ | ✓ | – | – | – | – |
| **settings.update_company** | ✓ | ✓ | ✓ | – | – | – |
| **integrations.manage** | ✓ | ✓ | ✓ | – | – | – |
| **audit_log.view** | ✓ | ✓ | ✓ | ✓ (egen klinik) | – | ✓ |
| **audit_log.export** | ✓ | ✓ | ✓ | – | – | ✓ |
| **inspector_token.create** | ✓ | ✓ | ✓ | – | – | – |

### 1.2 Kliniska roller

| Permission | legitimerad_lakare | legitimerad_tandlakare | legitimerad_sjukskoterska | behandlare | extern_behandlare | consulting_practitioner |
|---|---|---|---|---|---|---|
| **order.create** | ✓ | ✓ | – | – | – | ✓ (cross-tenant) |
| **order.approve** | ✓ | ✓ | – | – | – | ✓ |
| **order.execute** | ✓ | ✓ | ✓ (m. delegation) | ✓ (m. delegation) | ✓ (per kontrakt) | – |
| **order.read** | ✓ | ✓ | ✓ | ✓ | ✓ (egen) | ✓ (egen scope) |
| **delegation.create** | ✓ | ✓ | – | – | – | ✓ |
| **delegation.sign** | ✓ | ✓ | – | – | – | ✓ |
| **delegation.read** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **medication.log_usage** | ✓ | ✓ | ✓ (m. delegation) | ✓ (m. delegation) | ✓ (per kontrakt) | – |
| **medication.log_temperature** | ✓ | ✓ | ✓ | ✓ | – | – |
| **medication.read** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (egen scope) |
| **medication.create** | ✓ | ✓ | – | – | – | – |
| **medication.discard** | ✓ | ✓ | ✓ | – | – | – |
| **customer.create** | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| **customer.read** | ✓ | ✓ | ✓ | ✓ | ✓ (egen) | ✓ (egen scope) |
| **customer_record.create** | ✓ | ✓ | ✓ (m. delegation) | ✓ (m. delegation) | ✓ (per kontrakt) | – |
| **customer_record.read** | ✓ | ✓ | ✓ | ✓ | ✓ (egen) | ✓ (egen scope) |

### 1.3 Tvärsmodul-roller (alla operativa roller)

| Permission | Alla operativa | Endast manager+ | Endast owner+ |
|---|---|---|---|
| **deviation.create** | ✓ | | |
| **deviation.read** | ✓ | | |
| **deviation.update** | ✓ (egen) | ✓ (alla) | |
| **deviation.assign** | | ✓ | |
| **deviation.close** | | ✓ | |
| **deviation.export** | | ✓ | |
| **document.read** | ✓ | | |
| **document.create** | | ✓ | |
| **document.update** | | ✓ | |
| **document.approve** | | | ✓ |
| **document.archive** | | | ✓ |
| **document.sign** | ✓ (krav) | | |
| **document.export** | ✓ | | |
| **hygiene.perform_check** | ✓ | | |
| **hygiene.create_schedule** | | ✓ | |
| **hygiene.configure_templates** | | | ✓ |
| **risk.read** | ✓ | | |
| **risk.create** | | ✓ | |
| **risk.update** | | ✓ | |
| **risk.close** | | | ✓ |
| **compliance.view** | ✓ | | |
| **compliance.export_audit_package** | | ✓ | |
| **staff_credential.read** | ✓ (egen) | ✓ (alla) | |
| **staff_credential.create** | ✓ (egen) | ✓ (alla) | |
| **staff_credential.verify** | | | ✓ |
| **rental.read** | | ✓ | |
| **rental.create** | | | ✓ |
| **rental.sign** | | | ✓ |

### 1.4 Specialroller

**`auditor`** (revisor / intern compliance): read-only på allt utom egen profil. Kan exportera audit-paket. Kan **inte** skapa, ändra, godkänna eller signera något.

**`inspector_token`** (extern myndighet via token): tidsbegränsad sessions; read-only på allt inom scope (bolag eller klinik). Egen RLS-path via `inspector_tokens`-tabell. Ingen inloggning, token i URL. Alla SELECT loggas i `inspection_views`.

---

## 2. Permission-katalog

Komplett lista över alla `code`-värden som seedas i `permissions`-tabellen (modul-prefixerade).

```
# Company / clinic / users
company.read, company.update
clinic.create, clinic.read, clinic.update, clinic.delete
user.invite, user.revoke, user.update_role

# Billing & subscription
billing.view, billing.manage

# Settings & integrations
settings.update_company, integrations.manage

# Audit
audit_log.view, audit_log.export
inspector_token.create, inspector_token.revoke

# Documents
document.create, document.read, document.update, document.approve, document.archive, document.sign, document.export

# Deviations
deviation.create, deviation.read, deviation.update, deviation.assign, deviation.close, deviation.export

# Medications
medication.create, medication.read, medication.update, medication.log_usage, medication.log_temperature, medication.discard

# Orders & delegations
order.create, order.read, order.approve, order.reject, order.execute
delegation.create, delegation.read, delegation.sign, delegation.revoke

# Hygiene
hygiene.perform_check, hygiene.create_schedule, hygiene.configure_templates, hygiene.read

# Risks
risk.create, risk.read, risk.update, risk.close, risk.review

# Compliance
compliance.view, compliance.recalculate, compliance.export_audit_package

# Staff credentials
staff_credential.create, staff_credential.read, staff_credential.update, staff_credential.verify

# Customers (Fas 8)
customer.create, customer.read, customer.update, customer.export_gdpr, customer.delete_gdpr
customer_record.create, customer_record.read, customer_record.update, customer_record.accept_pdl_disclaimer

# Rentals / external practitioners (Fas 9)
rental.create, rental.read, rental.update, rental.sign, rental.revoke
```

Total: **62 permissions** i v6.0 MVP.

---

## 3. Industry templates — terminologi-nycklar

Standardiserade nycklar som `useTerminology()`-hooken konsumerar. Alla värden anges på svenska.

```
# Ordination / behandlingsbeslut
ordination.title              # "Ordination" / "Behandlingsprotokoll" / "Behandlingsplan"
ordination.title_plural
ordination.create_action
ordination.approver_label     # "Ordinatör" / "Ansvarig" / "Beslutande"

# Delegation
delegation.title              # "Delegering" / "Behandlingsbehörighet"
delegation.title_plural
delegation.delegator_label    # "Delegerande läkare" / "Ansvarig"

# Kund / patient
customer.label                # "Patient" / "Kund" / "Klient"
customer.label_plural
customer.create_action

# Behandlingslogg
treatment_log.label           # "Behandlingsanteckning" / "Behandlingsjournal" / "Behandlingsprotokoll"
treatment_log.label_plural

# Läkemedel / produkt
medication.label              # "Läkemedel" / "Produkt" / "Material"
medication.label_plural
medication.batch_label        # "Batch" / "Lot" / "Sats"

# Avvikelse
deviation.label               # "Avvikelse" / "Incident" / "Händelse"
deviation.label_plural
deviation.severity_critical_label

# Hygien
hygiene.label                 # "Hygien & miljö" / "Egenkontroll"
hygiene.check_label           # "Hygienkontroll" / "Inspektion"

# Risk
risk.label
risk.matrix_title             # "Riskmatris (SOSFS 2011:9)" / "Riskbedömning"

# Myndighet
regulatory_body.label         # "IVO" / "Miljöförvaltningen" / "Socialstyrelsen"
regulatory_body.report_action # "Anmäl till IVO" / "Inrapportera till Miljöförvaltningen"

# Personal
staff.label                   # "Personal" / "Behandlare" / "Medarbetare"
staff.credential_label        # "Legitimation" / "Certifikat" / "Utbildningsbevis"

# Compliance
compliance.title              # "Compliance Center" / "Egenkontrollöversikt"
compliance.score_label        # "Compliance-score" / "Kvalitetspoäng"

# Dokument
document.label                # "Styrdokument" / "Rutin" / "Dokument"
document.label_plural

# Onboarding-fraser (anpassas per bransch)
onboarding.welcome_headline   # "Välkommen — kom igång med din klinik" / "Välkommen — kom igång med din studio"
```

Total: ~30 nycklar i v6.0 MVP. Fler kan läggas till löpande utan migration (`terminology` är `jsonb`).

---

## 4. Industry templates — fyllda exempel

Seedas via migration `0013_seed_industry_templates.sql`. Här tre fullt utfyllda exempel; övriga branscher i §4.4 är skissade.

### 4.1 `estetisk_injektion`

```json
{
  "code": "estetisk_injektion",
  "display_name": "Estetisk injektionsklinik",
  "regulatory_body": "IVO",
  "terminology": {
    "ordination.title": "Ordination",
    "ordination.title_plural": "Ordinationer",
    "ordination.create_action": "Skapa ordination",
    "ordination.approver_label": "Ordinatör",
    "delegation.title": "Delegering",
    "delegation.title_plural": "Delegeringar",
    "delegation.delegator_label": "Delegerande läkare",
    "customer.label": "Patient",
    "customer.label_plural": "Patienter",
    "customer.create_action": "Lägg till patient",
    "treatment_log.label": "Behandlingsanteckning",
    "treatment_log.label_plural": "Behandlingsanteckningar",
    "medication.label": "Läkemedel",
    "medication.label_plural": "Läkemedel",
    "medication.batch_label": "Batch",
    "deviation.label": "Avvikelse",
    "deviation.label_plural": "Avvikelser",
    "hygiene.label": "Hygien & miljö",
    "hygiene.check_label": "Hygienkontroll",
    "risk.label": "Risk",
    "risk.matrix_title": "Riskmatris (SOSFS 2011:9)",
    "regulatory_body.label": "IVO",
    "regulatory_body.report_action": "Inrapportera till IVO",
    "staff.label": "Personal",
    "staff.credential_label": "Legitimation",
    "compliance.title": "Compliance Center",
    "compliance.score_label": "Compliance-score",
    "document.label": "Styrdokument",
    "onboarding.welcome_headline": "Välkommen — kom igång med din klinik"
  },
  "default_treatment_types": [
    "Botulinumtoxin – panna",
    "Botulinumtoxin – ögonbrynsrynka",
    "Botulinumtoxin – kråksparkar",
    "Botulinumtoxin – övrigt",
    "Filler – läppar",
    "Filler – nasolabialveck",
    "Filler – kindben",
    "Filler – haka/käke",
    "Filler – övrigt",
    "Skinbooster",
    "PRP – ansikte",
    "PRP – hårbotten",
    "Hyalase (upplösning)",
    "Konsultation",
    "Uppföljning"
  ],
  "default_risk_categories": [
    "Infektion",
    "Vaskulär ocklusion",
    "Allergisk reaktion",
    "Felaktig dosering",
    "Produktförväxling",
    "Bristande delegering",
    "Bristande dokumentation",
    "Hygienbrist",
    "Bristfälligt samtycke",
    "Komplikation – patient"
  ]
}
```

### 4.2 `piercing_tatuering`

```json
{
  "code": "piercing_tatuering",
  "display_name": "Piercing- och tatueringsstudio",
  "regulatory_body": "Miljöförvaltningen",
  "terminology": {
    "ordination.title": "Behandlingsprotokoll",
    "ordination.title_plural": "Behandlingsprotokoll",
    "ordination.create_action": "Skapa protokoll",
    "ordination.approver_label": "Ansvarig",
    "delegation.title": "Behandlingsbehörighet",
    "delegation.title_plural": "Behandlingsbehörigheter",
    "delegation.delegator_label": "Studioansvarig",
    "customer.label": "Kund",
    "customer.label_plural": "Kunder",
    "customer.create_action": "Lägg till kund",
    "treatment_log.label": "Behandlingsprotokoll",
    "treatment_log.label_plural": "Behandlingsprotokoll",
    "medication.label": "Material",
    "medication.label_plural": "Material",
    "medication.batch_label": "Lot",
    "deviation.label": "Avvikelse",
    "deviation.label_plural": "Avvikelser",
    "hygiene.label": "Hygien & egenkontroll",
    "hygiene.check_label": "Hygienkontroll",
    "risk.label": "Risk",
    "risk.matrix_title": "Riskbedömning",
    "regulatory_body.label": "Miljöförvaltningen",
    "regulatory_body.report_action": "Inrapportera till Miljöförvaltningen",
    "staff.label": "Personal",
    "staff.credential_label": "Utbildningsbevis",
    "compliance.title": "Egenkontrollöversikt",
    "compliance.score_label": "Kvalitetspoäng",
    "document.label": "Rutin",
    "onboarding.welcome_headline": "Välkommen — kom igång med din studio"
  },
  "default_treatment_types": [
    "Tatuering – liten",
    "Tatuering – medel",
    "Tatuering – stor",
    "Cover-up",
    "Piercing – öra",
    "Piercing – ansikte",
    "Piercing – kropp",
    "Smycksbyte",
    "Konsultation"
  ],
  "default_risk_categories": [
    "Infektion",
    "Allergisk reaktion (bläck/metall)",
    "Bristande sterilitet",
    "Avfallshantering – stickande/skärande",
    "Felaktig kundbedömning (ålder, blodsmitta)",
    "Hudreaktion",
    "Material-/färgförväxling",
    "Bristfälligt samtycke",
    "Brandsäkerhet"
  ]
}
```

### 4.3 `fotvard`

```json
{
  "code": "fotvard",
  "display_name": "Medicinsk fotvård",
  "regulatory_body": "Miljöförvaltningen + IVO (om medicinsk)",
  "terminology": {
    "ordination.title": "Behandlingsplan",
    "ordination.create_action": "Skapa behandlingsplan",
    "customer.label": "Klient",
    "customer.label_plural": "Klienter",
    "treatment_log.label": "Behandlingsanteckning",
    "medication.label": "Material",
    "deviation.label": "Avvikelse",
    "hygiene.label": "Hygien & egenkontroll",
    "regulatory_body.label": "Miljöförvaltningen",
    "compliance.title": "Egenkontrollöversikt",
    "document.label": "Rutin",
    "onboarding.welcome_headline": "Välkommen — kom igång med din fotvård"
  },
  "default_treatment_types": [
    "Medicinsk fotvård – standard",
    "Nagelvård",
    "Nageltrång – konservativ",
    "Nageltrång – ortonyxi",
    "Förhårdnader / liktornar",
    "Diabetesfot",
    "Reumatikerfot",
    "Vårtbehandling",
    "Konsultation"
  ],
  "default_risk_categories": [
    "Infektion",
    "Bristande sterilitet",
    "Felaktig hantering vid diabetes / vasokonstriktion",
    "Allergisk reaktion",
    "Bristfälligt samtycke",
    "Komplikation – sårläkning"
  ]
}
```

### 4.4 Övriga branscher (skiss — fyll i före seed)

- `estetisk_kirurgi` — terminologi som `estetisk_injektion`, men `treatment_types` är operationer; reglering = IVO med striktare krav
- `tandvard_estetik` — terminologi blandning; reglering = IVO + Socialstyrelsen
- `klinikkedja` — multi-bransch (anges per klinik istället för per bolag); terminologi standard estetisk
- `hudvard` — terminologi som fotvård; reglering = Miljöförvaltningen
- `laser_ipl` — terminologi liknar estetisk; reglering = Strålsäkerhetsmyndigheten + IVO (om medicinskt syfte)
- `microneedling_prp` — reglering = IVO (om PRP, då blod hanteras)
- `frisor_skonhet` — terminologi enkel; reglering = Miljöförvaltningen
- `uthyrningsklinik` — sammansatt; externa behandlare central, Fas 9 mycket relevant

---

## 5. Default-dokumentmallar per bransch

`industry_templates.default_document_template_ids` pekar mot `document_templates` (skapas som egen tabell i Fas 2). Auto-seedas i nytt bolag.

> **⚠ Sakkunnig granskning krävs.** Listan nedan är **vilka mallar som bör finnas** — inte mallarnas innehåll. Mallarnas faktiska text måste skrivas/granskas av kvalitetskonsult eller verksamhetschef innan produktionsanvändning. CareKompass tillhandahåller skelett, inte färdiga juridiskt korrekta dokument.

### 5.1 Gemensamma mallar (alla branscher)

| Kategori | Dokument |
|---|---|
| policy | Kvalitetspolicy |
| policy | Patient-/kundsäkerhetspolicy |
| policy | GDPR / personuppgiftshantering |
| procedure | Avvikelsehantering — rutin |
| procedure | Riskbedömning — rutin |
| procedure | Egenkontrollprogram |
| procedure | Brand & utrymning |
| form | Samtycke (allmän) |
| form | Hälsodeklaration (allmän) |
| checklist | Daglig öppning av lokal |
| checklist | Daglig stängning av lokal |

### 5.2 Estetisk injektion (utöver gemensamma)

| Kategori | Dokument | Krav-koppling |
|---|---|---|
| policy | Ledningssystem för systematiskt kvalitetsarbete | SOSFS 2011:9 |
| procedure | Hygienrutin — bashygien & handhygien | Vårdhandboken, SOSFS 2011:9 |
| procedure | Hygienrutin — behandlingsrum & instrument | Vårdhandboken |
| procedure | Läkemedelshantering | HSLF-FS 2017:37 |
| procedure | Ordination & delegering | Patientsäkerhetslag |
| procedure | Avfallshantering — stickande/skärande | Avfallsförordningen |
| procedure | Kemikaliehantering | Arbetsmiljölag |
| procedure | Komplikationshantering — vaskulär ocklusion | IVO-praxis |
| procedure | Komplikationshantering — allergisk reaktion (anafylaxi) | |
| procedure | Lex Maria — inrapportering | Patientsäkerhetslag |
| form | Samtycke — botulinumtoxin |
| form | Samtycke — filler |
| form | Samtycke — hyalase / upplösning |
| form | Samtycke — PRP |
| form | Hälsodeklaration — estetisk injektion |
| form | Före/efter-information — botulinumtoxin |
| form | Före/efter-information — filler |
| checklist | Behandlingsrum före patient |
| checklist | Behandlingsrum efter patient |
| checklist | Veckokontroll — läkemedelskyl (temperatur) |
| checklist | Månadskontroll — utgångsdatum produkter |
| guideline | Patientinformation — efter behandling |

### 5.3 Piercing/tatuering (utöver gemensamma)

| Kategori | Dokument |
|---|---|
| procedure | Hygienrutin — sterilisering av instrument |
| procedure | Hygienrutin — engångsmaterial |
| procedure | Avfallshantering — stickande/skärande |
| procedure | Materialhantering — bläck, smycken |
| procedure | Bedömning vid minderårig kund |
| form | Samtycke — tatuering |
| form | Samtycke — piercing |
| form | Hälsodeklaration — tatuering/piercing |
| form | Samtycke vid minderårig (vårdnadshavare) |
| checklist | Autoklav — daglig kontroll |
| checklist | Behandlingsstation före kund |
| guideline | Eftervårdsråd — tatuering |
| guideline | Eftervårdsråd — piercing |

### 5.4 Fotvård (utöver gemensamma)

| Kategori | Dokument |
|---|---|
| procedure | Hygienrutin — instrument & sterilisering |
| procedure | Bedömning vid diabetes / vasokonstriktion |
| procedure | Sårhantering |
| form | Samtycke — fotvård |
| form | Hälsodeklaration — fotvård |
| checklist | Behandlingsrum före klient |
| checklist | Autoklav / ultraljudstvätt — kontroll |

---

## 6. Hygienchecklist-mallar per bransch

`hygiene_checklist_templates`-tabell (skapas i Fas 4). En mall = en lista av items med svar-typ (`pass_fail`, `pass_fail_partial`, `numeric`, `text`).

### 6.1 Estetisk injektion — daglig öppning

```yaml
template_code: aesthetic_injection_daily_open
display_name: "Daglig öppning – behandlingsklinik"
industry: estetisk_injektion
frequency_default: daily
items:
  - id: 1
    label: "Behandlingsrum dammtorkat och tomt på personliga föremål"
    type: pass_fail
  - id: 2
    label: "Ytdesinfektion utförd (alla horisontella ytor i behandlingsrum)"
    type: pass_fail
  - id: 3
    label: "Handdesinfektion påfylld i alla rum"
    type: pass_fail
  - id: 4
    label: "Engångshandskar finns i alla storlekar (S/M/L)"
    type: pass_fail
  - id: 5
    label: "Akutväska – kontrollerad och förseglad"
    type: pass_fail
  - id: 6
    label: "Adrenalin – utgångsdatum kontrollerat (>30 dagar kvar)"
    type: pass_fail
  - id: 7
    label: "Sopkärl för stickande/skärande – tömt och rent"
    type: pass_fail
  - id: 8
    label: "Läkemedelskyl – temperatur (°C)"
    type: numeric
    expected_range: { min: 2, max: 8 }
  - id: 9
    label: "Tvättställ – funktion + tvål + papper"
    type: pass_fail
  - id: 10
    label: "Övriga anmärkningar"
    type: text
    required: false
```

### 6.2 Estetisk injektion — efter patient

```yaml
template_code: aesthetic_injection_post_patient
display_name: "Behandlingsrum efter patient"
industry: estetisk_injektion
frequency_default: per_event
items:
  - id: 1
    label: "Använda nålar/kanyler kasserade i godkänd behållare"
    type: pass_fail
  - id: 2
    label: "Använda förband/material kasserade i smittförande avfall"
    type: pass_fail
  - id: 3
    label: "Behandlingsbrits – ytdesinfektion"
    type: pass_fail
  - id: 4
    label: "Bordsyta – ytdesinfektion"
    type: pass_fail
  - id: 5
    label: "Restprodukt — användning loggad i läkemedelslogg?"
    type: pass_fail
  - id: 6
    label: "Foto före/efter — sparat med samtycke"
    type: pass_fail_partial
```

### 6.3 Piercing/tatuering — daglig kontroll

```yaml
template_code: tattoo_piercing_daily
display_name: "Daglig kontroll – studio"
industry: piercing_tatuering
frequency_default: daily
items:
  - id: 1
    label: "Autoklav – funktionstest (sporprov senaste veckan dokumenterat)"
    type: pass_fail
  - id: 2
    label: "Arbetsstation – ytdesinfekterad"
    type: pass_fail
  - id: 3
    label: "Engångsmaterial – stickkanyler, handskar, plast-täcken finns"
    type: pass_fail
  - id: 4
    label: "Bläck – batchnummer & utgångsdatum kontrollerat"
    type: pass_fail
  - id: 5
    label: "Sopkärl för stickande/skärande – tömt"
    type: pass_fail
  - id: 6
    label: "Skyddsglas/duk på arbetsstation"
    type: pass_fail
  - id: 7
    label: "Övriga anmärkningar"
    type: text
    required: false
```

### 6.4 Fotvård — behandlingsrum

```yaml
template_code: foot_care_room
display_name: "Behandlingsrum före klient"
industry: fotvard
frequency_default: per_event
items:
  - id: 1
    label: "Instrument från autoklav – sigillerade + datummärkta"
    type: pass_fail
  - id: 2
    label: "Behandlingsstol – ytdesinfekterad"
    type: pass_fail
  - id: 3
    label: "Fotbad – rengjort och desinfekterat (om används)"
    type: pass_fail
  - id: 4
    label: "Engångshandskar finns"
    type: pass_fail
  - id: 5
    label: "Sopkärl – tömt"
    type: pass_fail
```

---

## 7. Avvikelsekategorier per bransch

`deviations.category` är en text-kolumn, värdena valideras mot industry_template. Förslag på enum-värden:

### 7.1 Gemensamma kategorier (alla branscher)

```
hygiene             — Hygienavvikelse
treatment           — Behandlingsrelaterad
equipment           — Utrustning / teknisk
documentation       — Dokumentationsbrist
environment         — Miljö / lokal
staff               — Personal / kompetens / delegering
customer_complaint  — Patient-/kundklagomål
data_breach         — GDPR / personuppgiftsincident
other               — Övrigt
```

### 7.2 Branschspecifika tillägg

| Bransch | Tillägg |
|---|---|
| `estetisk_injektion`, `estetisk_kirurgi`, `tandvard_estetik` | `medication`, `vascular_event`, `allergic_reaction`, `delegation_breach` |
| `piercing_tatuering` | `sterilization_failure`, `material`, `minor_client` |
| `fotvard` | `wound_complication`, `material` |
| `laser_ipl` | `burn`, `pigmentation`, `equipment_calibration` |

### 7.3 Severity-mappning

| Severity | Beskrivning | SLA stängning |
|---|---|---|
| `critical` | Akut patientskada, lex Maria-tröskel, allvarlig dataintrång | 24 timmar utredning |
| `high` | Allvarlig komplikation utan bestående skada, hygienavvikelse i pågående drift | 7 dagar |
| `medium` | Dokumentationsbrist, sen åtgärd, mindre hygienbrist | 30 dagar |
| `low` | Mindre rutinavvikelse, informationsfel | 90 dagar |

---

## 8. Riskkategorier per bransch

Listas i `industry_templates.default_risk_categories` (exempel i §4). Visas som dropdown i risk-formulär.

Risk-matrisen (5×5) klassificerar **probability** och **consequence** (1–5), `risk_score = probability * consequence`:

| Score | Klass | Färg | Krav |
|---|---|---|---|
| 1–4 | Låg | Grön | Bevaka, ingen åtgärdsplan krävs |
| 5–9 | Medel | Gul | Åtgärdsplan rekommenderad |
| 10–15 | Hög | Orange | Åtgärdsplan obligatorisk, översyn ≤ 6 mån |
| 16–25 | Mycket hög | Röd | Omedelbar åtgärd, översyn ≤ 1 mån |

---

## 9. Behandlingstyper per bransch

Se §4 — `default_treatment_types` per industry_template. Konsumeras i:
- Ordination-formulär (dropdown)
- Customer_record-formulär (dropdown)
- Hygiene-mallar (per-event-kontroller)

Lista är **utgångspunkt** — varje bolag kan utöka via `companies.custom_treatment_types` (jsonb, läggs till om behov uppstår i Fas 3).

---

## 10. Notifieringskatalog

`notifications`-tabell (Fas 2). En notifiering = en rad. Realtime-prenumeration i topbar visar badge.

```sql
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  company_id uuid not null,
  recipient_profile_id uuid not null references public.profiles(id),
  type text not null,
  priority text not null,              -- 'info' | 'warning' | 'urgent'
  title text not null,
  body text,
  entity_type text,                    -- 'deviation' | 'order' | 'document' | ...
  entity_id uuid,
  link_path text,                      -- '/app/deviations/<id>'
  read_at timestamptz,
  created_at timestamptz not null default now()
);
```

### 10.1 Notifieringstyper (komplett katalog)

| Typ | Trigger | Mottagare | Prioritet | Kanal |
|---|---|---|---|---|
| `invite.received` | Användare bjuds in | inbjuden profil (via mail-länk) | info | mail |
| `invite.accepted` | Inbjudan accepterad | inbjudare | info | in-app |
| `deviation.assigned` | Avvikelse tilldelad | assignee | warning | in-app + mail |
| `deviation.escalated` | Severity ändrad uppåt | clinic_manager+ | urgent | in-app + mail |
| `deviation.unresolved_sla` | Öppen över SLA | clinic_manager + assignee | urgent | in-app + mail |
| `document.signature_required` | Signering krävs | berörda profiler | info | in-app + mail |
| `document.version_updated` | Ny version godkänd | alla i bolaget med roll | info | in-app |
| `order.pending` | Ny ordination väntar godkännande | ordinatör (eller consulting) | warning | in-app + mail |
| `order.approved` | Ordination godkänd | utförare | info | in-app |
| `order.rejected` | Ordination avslagen | skapare | warning | in-app + mail |
| `delegation.expiring_30d` | Delegering går ut inom 30d | delegerande + delegerad | warning | in-app + mail |
| `delegation.expiring_7d` | Delegering går ut inom 7d | delegerande + delegerad + clinic_manager | urgent | in-app + mail |
| `delegation.expired` | Delegering har gått ut | delegerande + delegerad + clinic_manager | urgent | in-app + mail |
| `medication.batch_expiring_30d` | Batch utgång inom 30d | clinic_manager | warning | in-app |
| `medication.batch_expiring_7d` | Batch utgång inom 7d | clinic_manager | urgent | in-app + mail |
| `medication.batch_expired` | Batch utgången | clinic_manager | urgent | in-app + mail |
| `medication.temperature_breach` | Temperaturlogg utanför range | clinic_manager | urgent | in-app + mail |
| `medication.low_stock` | Lager < threshold | clinic_manager | warning | in-app |
| `hygiene.check_due` | Schemalagd kontroll inom 24h | ansvarig profil | info | in-app |
| `hygiene.check_overdue` | Kontroll missad | ansvarig + clinic_manager | warning | in-app + mail |
| `hygiene.check_failed` | Kontroll resultat fail | clinic_manager | warning | in-app + mail |
| `risk.review_due` | Risk review_due_at passerar | risk_owner + clinic_manager | warning | in-app |
| `risk.high_score_new` | Ny risk med score ≥ 16 | clinic_manager + company_owner | urgent | in-app + mail |
| `staff_credential.expiring_30d` | Legitimation/certifikat 30d | staff + clinic_manager | warning | in-app + mail |
| `staff_credential.expired` | Utgånget | staff + clinic_manager | urgent | in-app + mail |
| `subscription.trial_ending_7d` | Trial slut inom 7d | company_owner | warning | in-app + mail |
| `subscription.trial_ended` | Trial slut, ej uppgraderat | company_owner | urgent | in-app + mail |
| `subscription.payment_failed` | Stripe `invoice.payment_failed` | company_owner | urgent | in-app + mail |
| `subscription.canceled` | Prenumeration avslutad | company_owner | warning | in-app + mail |
| `compliance.score_drop` | Score sjönk > 10 punkter senaste 7d | company_owner + verksamhetschef | warning | in-app + mail |
| `audit_export.ready` | Audit-paket genererat | begärare | info | in-app + mail |
| `inspector.token_used` | Inspektörstoken aktiverad första gången | company_owner | info | in-app + mail |
| `inspector.token_expiring` | Token går ut inom 3d | company_owner | info | in-app |
| `customer.gdpr_request` | GDPR-begäran inkommen (Fas 8) | company_owner | warning | in-app + mail |

Total: **34 notifieringstyper** i v6.0 MVP.

### 10.2 Notifierings-leverans

- **In-app:** rad i `notifications` → realtime-prenumeration uppdaterar topbar-badge
- **Mail:** Edge Function `send-notification-email` skickar via Lovable Cloud Email (eller Resend om Lovable inte räcker)
- **SMS:** ej i v6.0 MVP — flagga som FUTURE

### 10.3 Användarinställningar (Fas 1, utbygges löpande)

`profile_notification_preferences`-tabell — användaren kan stänga av mail per typ (alltid behåller in-app):

```sql
create table public.profile_notification_preferences (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  notification_type text not null,
  email_enabled boolean not null default true,
  primary key (profile_id, notification_type)
);
```

`urgent`-notifieringar kan **inte** stängas av (säkerhet).

---

## 11. Compliance-score-vikter (konfig)

Värdena seedas och kan justeras via CK-admin. Default-vikter:

```yaml
weights:
  documents: 0.15
  deviations: 0.20
  hygiene: 0.20
  medication: 0.10
  orders_delegations: 0.15
  risk: 0.10
  staff_credentials: 0.10

thresholds:
  red: 50      # < 50 = röd
  yellow: 80   # 50-79 = gul, >=80 = grön

sla_hours:
  deviation:
    critical: 24
    high: 168    # 7d
    medium: 720  # 30d
    low: 2160    # 90d
  order_pending_warning_hours: 168  # 7d
  hygiene_check_overdue_hours: 24
```

Komplett algoritm: 04-implementation-plan §13.

---

## 12. Validering & sakkunnig granskning krävs

Innan dessa går i produktion:

| Område | Granskning krävs av |
|---|---|
| Roll × permission-matris (§1) | Toni + verksamhetschef Derma Beauty |
| Industry templates fyllning (§4) | Toni + ev. branschexpert per ny bransch |
| Default-dokumentmallarnas **innehåll** (§5) | Kvalitetskonsult / verksamhetschef per bransch |
| Hygienchecklistor (§6) | Sakkunnig vårdhygien / hygiensjuksköterska |
| Avvikelsekategorier (§7) | Patientsäkerhetsansvarig |
| Notifieringskatalog (§10) | Toni — för rätt mottagare-mappning vid edge-cases |
| Compliance-score-vikter (§11) | Toni — kalibrera mot riktig data efter Fas 5 |

**Process:** seed-migrationerna innehåller defaults enligt detta dokument. Vid pilot-användning (Derma Beauty) körs en review-runda och alla ändringar tas in via ny migration `0014_seed_industry_templates_v2.sql` etc. Aldrig redigera deployad migration.

---

*Slut på 05-domain-content. Vidare till 06-conventions.md för teknik-konventioner och operativa standarder.*
