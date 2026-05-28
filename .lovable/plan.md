## Mål

När Claude (eller någon annan) pushar nya migreringar till GitHub ska vi få (B) en automatisk varning i GitHub om något är oapplicerat, och (C) jag ska själv flagga oapplicerade migreringar i början av varje ny chattsession.

---

## Del B — GitHub Action: migration-drift-check

**Fil:** `.github/workflows/migration-drift-check.yml`

**Trigger:**
- `push` till `main` när filer under `supabase/migrations/**` ändras
- `pull_request` mot `main` med samma path-filter
- `workflow_dispatch` (manuell körning)

**Vad den gör:**
1. Checkar ut repot
2. Installerar Supabase CLI
3. Loggar in med `SUPABASE_ACCESS_TOKEN` + linkar mot project ref `gwmkcckkztlicbnqqklp`
4. Kör `supabase migration list --linked` och parsar utfallet
5. Jämför `supabase/migrations/*.sql` (Local) mot Remote-kolumnen
6. Om diff finns:
   - På PR → failar checken med en kommentar som listar oapplicerade filer
   - På push till main → skapar en GitHub Issue märkt `migrations`, `automated` med listan + instruktion "öppna Lovable och be agenten köra dem"
7. Om ingen diff → ✅ grön check, ingen issue

**Inget appliceras automatiskt** — workflowen är read-only mot databasen. Behåller `docs/06 §4` migration-disciplinen (ADR + 24h cooling för destruktiva ändringar).

**Secrets som behövs (du lägger dem i GitHub Settings → Secrets and variables → Actions):**
- `SUPABASE_ACCESS_TOKEN` — personal access token från supabase.com/dashboard/account/tokens
- `SUPABASE_DB_PASSWORD` — DB-lösenordet för projektet (för `--linked`)

Project ref hårdkodas i workflowen eftersom den redan är publik i `.env`.

---

## Del C — Memory-regel åt mig

**Fil:** `mem://index.md` (skapas — finns inte än)

Lägger till en Core-regel:

> **Migration-drift check:** Vid första user-message i en ny session, lista filer i `supabase/migrations/` och jämför mot senast applicerade (via `supabase--read_query` mot `supabase_migrations.schema_migrations`). Om något lokalt saknas remote — flagga det direkt i svaret innan annat arbete påbörjas, och fråga om jag ska köra dem via migration-toolet.

Regeln laddas automatiskt i varje ny session så fort `mem://index.md` finns.

---

## Tekniska detaljer

**Migration list-parsning:** `supabase migration list --linked` returnerar en tabell med `Local | Remote | Time`. Workflowen plockar rader där `Remote` är tom = oapplicerad.

**Issue-deduplicering:** Innan en ny issue skapas, sök efter öppna issues med label `migrations` + samma titelprefix. Uppdatera befintlig istället för att spamma.

**Failure-läge:** Om Supabase CLI inte kan ansluta (fel token/lösen) → workflowen failar med tydligt meddelande, ingen falsk grön check.

---

## Filer som skapas/ändras

| Fil | Åtgärd |
|---|---|
| `.github/workflows/migration-drift-check.yml` | Skapas |
| `mem://index.md` | Skapas |

Inga ändringar i applikationskoden, inga nya npm-paket, inga DB-migreringar.

---

## Vad du gör efter att jag implementerat

1. Generera `SUPABASE_ACCESS_TOKEN` på supabase.com/dashboard/account/tokens
2. Hämta DB-lösenord från Supabase-projektets Database settings
3. Lägg båda som GitHub Actions secrets i repots Settings
4. Trigga workflowen manuellt en gång (`workflow_dispatch`) för att verifiera att inloggningen funkar
5. Klart — nästa Claude-push triggar checken automatiskt

---

## Verifiering

Efter implementation:
- Visa workflow-filen
- Visa memory-regeln
- Lista de manuella stegen ovan med klickbara länkar till rätt Supabase-sidor