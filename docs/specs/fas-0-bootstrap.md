# Fas 0 — Bootstrap & arkitektur-fundament — Spec

> **Story-källa:** `docs/04 §2` (Fas 0 acceptance + verbatim prompt).
> **Mål:** Etablera alla arkitektoniska mönster (SSR-loader + createServerFn + `ApiResult`, design-tokens forest-teal, CI, ADRs) så att Fas 1+ blir repetition.
> **Längd (per `04 §2`):** 1–2 veckor.
> **Greenfield-status:** Scaffolding-grunden finns (TanStack Start v1, React 19, Vite 7, Tailwind v4, 44 shadcn-primitiver, Supabase-clients, bun, Cloudflare). ~60–65 % av acceptance redan på plats — tre kritiska blockerare (`attachSupabaseAuth` ej registrerad, ingen `createServerFn`-bevisroute, fem package.json-scripts saknas) hanteras här.

---

## 1. Overview

### 1.1 Linkade acceptance-items (`docs/04 §2.2`)

- **AC1** — `bun dev` startar utan fel.
- **AC2** — `/health` SSR:as och visar server-renderad data.
- **AC3** — `bunx supabase gen types typescript` ger fil utan diff.
- **AC4** — `bun typecheck` är grön (strict mode).
- **AC5** — En `createServerFn` kan anropas från en route-loader och från en komponent via TanStack Query med samma queryKey.
- **AC6** — shadcn `<Button>` renderar med rätt design-tokens.

### 1.2 Resolverade beslut (re-litigera inte)

1. **Forest-teal i `src/styles.css` nu** (beslut 09 §6b). Behåll shadcn-token-namnen (`--primary`, `--background`, …) men byt **värdena** till forest-teal + warm off-whites från `design/styles.css`. Lägg dessutom till healthcare-tokens (`--color-success`, `--color-warning`, `--color-info`) i `@theme inline` + `:root` + `.dark`. Font-stack: Inter (sans), Newsreader (serif), JetBrains Mono (mono).
2. **Observability defer:as till Fas 1.** Ingen Sentry-SDK, ingen BetterStack i Fas 0. Ren scaffolding.
3. **Doc-drift accepteras pragmatiskt.** Behåll `src/integrations/supabase/*` som faktiska klient-platser, `src/styles.css` som token-källa, `src/integrations/supabase/types.ts` som typ-fil. `doc-writer` uppdaterar `docs/03 §1`, `docs/04 §2.1`, `docs/07 §1` i sin pass efter validator.
4. **Helpers wrappar befintligt.** `src/lib/_helpers.ts` re-exporterar `requireSupabaseAuth` från `src/integrations/supabase/auth-middleware.ts` och tillägger `createApiHandler`, `requirePermission`, `requireWritableSubscription`, `auditLog` + typade error-klasser. Skäl: överlever Lovable-regeneration av auth-middleware.
5. **Helpers-context i Fas 0 = `{ supabase, userId, claims, requestId }`.** `tenantId`/`profileId` läggs till i Fas 1 när `profiles`-tabellen och `current_profile_id()`-helper:n finns. Server-fn som behöver tenant/profile får antingen vänta till Fas 1 eller resolva manuellt mot `profiles`. Markera tydligt i `requireSupabaseAuth`-wrapper-doc-komment.
6. **`__root.tsx` rebrand:** `lang="sv"`, title `CareKompass`, ta bort Lovable OG/Twitter-meta, lägg till `<Toaster />` från `src/components/ui/sonner.tsx`. **Ingen ThemeProvider i Fas 0** (Tailwind v4 dark-mode via `.dark`-klass + tokens räcker; `next-themes` introduceras vid behov i Fas 1).
7. **Critical path = Task 1 först.** `attachSupabaseAuth` måste registreras som global `functionMiddleware` i `src/start.ts` **innan** något annat. Utan den är `createServerFn`-bevisroute meningslös eftersom klient-anrop saknar Bearer-token (även om `/health` i sig är ovaktad).

### 1.3 ADRs i scope

Fas 0 etablerar `docs/decisions/` + de sex ADR:erna `0001`–`0006` (per `docs/06 §14.3`) som skelett (Status: Proposed). Innehållet i Context/Decision/Consequences fylls av Toni manuellt — agenten skriver bara metadata-skelett och en första-stab på problembeskrivning.

---

## 2. Task breakdown — ordnad lista

> Tagg-konventioner: `[setup]`, `[backend]`, `[frontend]`, `[ci]`, `[docs]`.
> "Acceptance-item" = `AC1`–`AC6` per `docs/04 §2.2`.
> "Dep" = task-ID som måste landa först.

---

### Task 1 — [setup] Registrera `attachSupabaseAuth` som global `functionMiddleware`

**CRITICAL — blockerar Task 9, Task 10.**

**Vad.** Klient-middleware:n som bifogar Bearer-token till alla `createServerFn`-anrop är skapad men aldrig registrerad. Konsekvens: varje `createServerFn` som använder `requireSupabaseAuth` får `Unauthorized: No authorization header provided`. Registrera middleware:n globalt så hela appen får token-passthrough.

**File path.** `src/start.ts`

**Shape (exakt diff).**

```ts
// src/start.ts
import { createStart, createMiddleware } from "@tanstack/react-start";

import { attachSupabaseAuth } from "./integrations/supabase/auth-attacher";
import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
  functionMiddleware: [attachSupabaseAuth],
}));
```

**Dep.** Ingen.

**Acceptance-item.** AC1 (rena starts), AC5 (createServerFn-mönstret slutar fungera korrekt utan denna).

**Verifiering.**

1. `bun run lint` + `bunx tsc --noEmit` grön.
2. `bun run dev` startar utan fel.
3. När Task 10 levererat kan `/health` anropas i webbläsare och ge SSR-renderad data.

---

### Task 2 — [setup] Lägg till `typecheck` + `gen-types` i `package.json`

**Vad.** Fyra av sex acceptance-kriterier kräver scripts som inte finns. Lägg till `typecheck` (alias för `tsc --noEmit` per `CLAUDE.md` "Stack & commands") och `gen-types`. `test` defer:as till när vitest installeras (Fas 0/1 övergångs-task; ny dep, kräver 24h supply-chain-guard).

**File path.** `package.json`

**Shape (exakt edit av `scripts`-blocket).**

```json
"scripts": {
  "dev": "vite dev",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "preview": "vite preview",
  "lint": "eslint .",
  "format": "prettier --write .",
  "typecheck": "tsc --noEmit",
  "gen-types": "bunx supabase gen types typescript > src/integrations/supabase/types.ts"
}
```

**Notera.**

- `gen-types`-pathen är `src/integrations/supabase/types.ts` (faktisk plats — `CLAUDE.md` "Data model" säger detta). Avviker från `docs/04 §2.3 step 11` som pekar på `src/types/supabase.ts` — doc-writer rättar.
- `gen-types` förutsätter att man är inloggad mot rätt Supabase-projekt via `bunx supabase login`. När schemat är tomt (Fas 0) ska re-running ge en diff-fri `types.ts`.

**Dep.** Ingen.

**Acceptance-item.** AC3 (`gen-types`), AC4 (`typecheck`).

**Verifiering.**

1. `bun run typecheck` exit 0.
2. `bun run gen-types` körs utan fel (kan kräva manuell Supabase-login först); diff mot befintlig `types.ts` ska vara tom så länge inget schema finns.

---

### Task 3 — [backend] Skapa `src/lib/_helpers.ts`

**Vad.** Etablera `ApiResult<T>`-shape, `createApiHandler`-wrapper, error-klasser och de tre standard-guards (`requirePermission`, `requireWritableSubscription`, `auditLog`) som hela kodbasen kommer importera. Wrappar (re-exporterar) `requireSupabaseAuth` från `src/integrations/supabase/auth-middleware.ts` så vi kan utöka context utan att röra Lovable-generated file.

**File path.** `src/lib/_helpers.ts`

**Shape.**

```ts
// src/lib/_helpers.ts
// Hjälpare som används av alla createServerFn. Wrappar Lovable-generated
// auth-middleware för att överleva regenerering.
//
// Fas 0: ctx = { supabase, userId, claims, requestId }.
// Fas 1 utvidgar till { ..., tenantId, profileId } när profiles-tabell + helpers finns.

import { requireSupabaseAuth as baseRequireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ----- ApiResult -----

export type ApiResult<T> =
  | {
      ok: true;
      data: T;
      request_id: string;
      meta?: Record<string, unknown>;
    }
  | {
      ok: false;
      error: string;
      error_code?: ApiErrorCode;
      request_id: string;
      field_errors?: Record<string, string>;
    };

export type ApiErrorCode =
  | "version_conflict"
  | "forbidden"
  | "feature_disabled"
  | "subscription_read_only"
  | "validation_failed"
  | "internal";

// ----- Error-klasser -----

export class ForbiddenError extends Error {
  readonly code = "forbidden" as const;
  constructor(message = "forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends Error {
  readonly code = "validation_failed" as const;
  readonly fieldErrors: Record<string, string>;
  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }
}

export class VersionConflictError extends Error {
  readonly code = "version_conflict" as const;
  constructor(message = "version_conflict") {
    super(message);
    this.name = "VersionConflictError";
  }
}

export class FeatureDisabledError extends Error {
  readonly code = "feature_disabled" as const;
  constructor(message: string) {
    super(message);
    this.name = "FeatureDisabledError";
  }
}

export class SubscriptionReadOnlyError extends Error {
  readonly code = "subscription_read_only" as const;
  constructor(message = "subscription_read_only") {
    super(message);
    this.name = "SubscriptionReadOnlyError";
  }
}

// ----- Auth middleware re-export -----
// Konsumenter importerar från _helpers istället för auth-middleware direkt.
// Tillägg av tenantId / profileId sker i Fas 1.
export const requireSupabaseAuth = baseRequireSupabaseAuth;

// ----- createApiHandler -----
// Wrappar handler-logiken så att alla createServerFn returnerar ApiResult och
// aldrig kastar till klienten. Kastade ForbiddenError/ValidationError/etc.
// mappas till maskinläsbar error_code som translateError() (Fas 1) använder.

export function createApiHandler<T>(
  fn: () => Promise<T>,
): () => Promise<ApiResult<T>> {
  return async () => {
    const request_id = crypto.randomUUID();
    try {
      const data = await fn();
      return { ok: true, data, request_id };
    } catch (err) {
      if (err instanceof ForbiddenError) {
        return { ok: false, error: err.message, error_code: "forbidden", request_id };
      }
      if (err instanceof ValidationError) {
        return {
          ok: false,
          error: err.message,
          error_code: "validation_failed",
          field_errors: err.fieldErrors,
          request_id,
        };
      }
      if (err instanceof VersionConflictError) {
        return { ok: false, error: err.message, error_code: "version_conflict", request_id };
      }
      if (err instanceof FeatureDisabledError) {
        return { ok: false, error: err.message, error_code: "feature_disabled", request_id };
      }
      if (err instanceof SubscriptionReadOnlyError) {
        return { ok: false, error: err.message, error_code: "subscription_read_only", request_id };
      }
      // Okänt fel — strukturerad loggning (Sentry kommer i Fas 1)
      console.error(
        JSON.stringify({
          level: "error",
          message: "Unhandled server error",
          request_id,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
      return { ok: false, error: "Internal server error", error_code: "internal", request_id };
    }
  };
}

// ----- requirePermission (skelett, full impl. i Fas 1) -----
// I Fas 0 finns ingen profiles/permissions-tabell. Behåll signatur så server-fn
// kan kalla den; kasta TODO-fel om någon faktiskt försöker köra den nu.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export interface AuthedCtx {
  supabase: SupabaseClient<Database>;
  userId: string;
  claims: Record<string, unknown>;
  requestId: string;
}

export async function requirePermission(
  _ctx: AuthedCtx,
  permission: string,
  _companyId: string,
): Promise<void> {
  throw new ForbiddenError(
    `requirePermission(${permission}) called in Fas 0 — no permissions schema yet (lands in Fas 1).`,
  );
}

export async function requireWritableSubscription(
  _ctx: AuthedCtx,
  _companyId: string,
): Promise<void> {
  throw new SubscriptionReadOnlyError(
    "requireWritableSubscription called in Fas 0 — no subscriptions schema yet (lands in Fas 1).",
  );
}

// ----- auditLog (skelett, full impl. i Fas 1) -----
export async function auditLog(
  _ctx: { supabase: unknown; userId: string; requestId: string },
  _entry: {
    action: string; // "<module>.<action>" (docs/07 §4.2)
    entityType: string;
    entityId?: string;
    before?: unknown;
    after?: unknown;
  },
): Promise<void> {
  // No-op i Fas 0. När audit_logs + module_audit_logs landat (Fas 1) insertas raden.
  return;
}
```

**Notera.**

- `AuthedCtx`-typen är illustrativ i Fas 0; den faktiska context-formen kommer från middleware:n. När Fas 1 utökar context med `tenantId`/`profileId` flyttas typen hit och ersätter middleware-derived shape.
- `requirePermission` / `requireWritableSubscription` / `auditLog` är **skelett**. Försöker man köra dem i Fas 0 får man en tydlig error med Fas-info — det är önskat (ingen ska tro att de fungerar).
- `createApiHandler` är direkt baserad på `docs/06 §12.1`.

> **Konsumtionsmönstret för `requireSupabaseAuth` är `.middleware([requireSupabaseAuth])` på `createServerFn`, inte `await requireSupabaseAuth()`.** Context (`supabase`, `userId`, `claims`) injiceras till handler via `context`-parametern. `docs/02 §8.3` visar en alternativ implementering — använd Lovable-mönstret som demonstreras i Task 9.

**Dep.** Ingen (kan parallelliseras med Tasks 4–8, 11–13).

**Acceptance-item.** AC5 (helpers nödvändiga för createServerFn-mönstret).

**Verifiering.**

1. `bunx tsc --noEmit` grön (filen importeras inte ännu men ska kompilera).
2. Import-test från Task 9: `import { createApiHandler } from "@/lib/_helpers"` löser sig.

---

### Task 4 — [frontend] Konvertera `src/styles.css` till forest-teal + healthcare-tokens

**Vad.** Byt slate-värdena i `:root` och `.dark` till forest-teal + warm off-whites från `design/styles.css`. Lägg till `--success`, `--warning`, `--info` i båda blocken + registrera dem i `@theme inline`. Lägg till `--font-sans`, `--font-serif`, `--font-mono`-tokens. Behåll alla shadcn-token-namnen (`--primary`, `--background`, `--card`, …) intakta så att alla 44 shadcn-primitiver fortsätter att fungera utan modifikation.

**File path.** `src/styles.css`

**Shape (komplett ersättning).**

```css
@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/*
 * CareKompass v6 design tokens — forest-teal primary, warm off-whites.
 *
 * Token-strategi:
 * - Behåll shadcn-token-namnen (--primary, --background, ...) intakta
 *   så alla shadcn-primitiver mappar 1:1.
 * - Värdena byts från slate till forest-teal-paletten enligt
 *   design/styles.css (docs/10 §4 + §6 + §14 — tentativt default
 *   pending Fas 5-konfirmering, docs/09 §6b).
 * - Healthcare-tokens (--success, --warning, --info) läggs till
 *   utöver shadcn-standard.
 * - Tre fonter med tydliga roller (docs/10 §3).
 */

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-ring-offset-background: var(--background);

  /* Healthcare status-tokens (utöver shadcn-standard) */
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);

  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Typography (docs/10 §3) */
  --font-sans: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-serif: "Newsreader", "Source Serif 4", Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
}

:root {
  --radius: 0.625rem;

  /* Surfaces — warm off-whites (design/styles.css :root) */
  --background: oklch(0.985 0.005 80);
  --foreground: oklch(0.22 0.015 60);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.22 0.015 60);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.22 0.015 60);

  /* Brand — forest-teal (docs/10 §4) */
  --primary: oklch(0.42 0.06 175);
  --primary-foreground: oklch(0.985 0.005 175);

  /* Secondary / muted / accent — warm-tinted surfaces */
  --secondary: oklch(0.975 0.007 80);
  --secondary-foreground: oklch(0.22 0.015 60);
  --muted: oklch(0.965 0.008 80);
  --muted-foreground: oklch(0.55 0.012 60);
  --accent: oklch(0.95 0.025 175);
  --accent-foreground: oklch(0.22 0.015 60);

  /* Status — forest-teal-paletten harmoniserade lightness/chroma */
  --destructive: oklch(0.55 0.17 25);
  --destructive-foreground: oklch(0.985 0.005 175);
  --success: oklch(0.55 0.13 152);
  --success-foreground: oklch(0.985 0.005 175);
  --warning: oklch(0.72 0.14 75);
  --warning-foreground: oklch(0.22 0.015 60);
  --info: oklch(0.55 0.13 235);
  --info-foreground: oklch(0.985 0.005 175);

  /* Lines */
  --border: oklch(0.925 0.008 70);
  --input: oklch(0.925 0.008 70);
  --ring: oklch(0.42 0.06 175);

  /* Charts — behåll shadcn defaults så recharts mappar */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);

  /* Sidebar — separat skala (CK-admin har egen, docs/10 §4 “scope-färger”) */
  --sidebar: oklch(0.975 0.007 80);
  --sidebar-foreground: oklch(0.22 0.015 60);
  --sidebar-primary: oklch(0.42 0.06 175);
  --sidebar-primary-foreground: oklch(0.985 0.005 175);
  --sidebar-accent: oklch(0.95 0.025 175);
  --sidebar-accent-foreground: oklch(0.22 0.015 60);
  --sidebar-border: oklch(0.925 0.008 70);
  --sidebar-ring: oklch(0.42 0.06 175);
}

.dark {
  /* Surfaces — deep cool (design/styles.css .ck-dark) */
  --background: oklch(0.18 0.012 240);
  --foreground: oklch(0.96 0.005 200);
  --card: oklch(0.22 0.013 240);
  --card-foreground: oklch(0.96 0.005 200);
  --popover: oklch(0.22 0.013 240);
  --popover-foreground: oklch(0.96 0.005 200);

  /* Brand lighter på mörk */
  --primary: oklch(0.72 0.10 175);
  --primary-foreground: oklch(0.18 0.015 175);

  --secondary: oklch(0.26 0.013 240);
  --secondary-foreground: oklch(0.96 0.005 200);
  --muted: oklch(0.26 0.013 240);
  --muted-foreground: oklch(0.62 0.010 200);
  --accent: oklch(0.30 0.05 175);
  --accent-foreground: oklch(0.96 0.005 200);

  --destructive: oklch(0.65 0.17 25);
  --destructive-foreground: oklch(0.96 0.005 200);
  --success: oklch(0.65 0.13 152);
  --success-foreground: oklch(0.18 0.012 240);
  --warning: oklch(0.78 0.14 75);
  --warning-foreground: oklch(0.18 0.012 240);
  --info: oklch(0.65 0.13 235);
  --info-foreground: oklch(0.18 0.012 240);

  --border: oklch(0.30 0.012 240);
  --input: oklch(0.30 0.012 240);
  --ring: oklch(0.72 0.10 175);

  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);

  --sidebar: oklch(0.16 0.012 240);
  --sidebar-foreground: oklch(0.96 0.005 200);
  --sidebar-primary: oklch(0.72 0.10 175);
  --sidebar-primary-foreground: oklch(0.18 0.015 175);
  --sidebar-accent: oklch(0.30 0.05 175);
  --sidebar-accent-foreground: oklch(0.96 0.005 200);
  --sidebar-border: oklch(0.30 0.012 240);
  --sidebar-ring: oklch(0.72 0.10 175);
}

@layer base {
  * {
    border-color: var(--color-border);
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
    font-feature-settings: "cv11", "ss01", "ss03";
    -webkit-font-smoothing: antialiased;
    font-size: 14px;
    line-height: 1.45;
    letter-spacing: -0.005em;
  }
}
```

**Notera.**

- Värdena är hämtade ur `design/styles.css` (`:root` + `.ck-dark`) per beslut 1 i `1.2` ovan.
- `--success`/`--warning`/`--info` registreras i `@theme inline` så att klasser som `bg-success` / `text-warning` automatiskt fungerar i Tailwind v4. **Risk:** om shadcn-komponenter någonstans hårdkodar `bg-success`-klass utan token får de inte värdet — verifiera med `bun run build` att inga oklch-värden behöver fallback.
  - **Verifikation:** kör `git grep -E 'bg-(success|warning|info)' src/components/ui/` — ska returnera 0 matches. Om matches finns, antingen byt komponenten till opt-in (lägg klassen i custom wrapper) eller flagga separat i validator-pass.
- `--ring` sätts till brand-färgen så fokus-ring följer forest-teal istället för slate.

**Dep.** Ingen.

**Acceptance-item.** AC6.

**Verifiering.**

1. `bun run dev` startar, `/` (placeholder-routen) ändrar bakgrundsfärg från `#fcfbf8` inline till `var(--color-background)` automatiskt via `@layer base` body-regeln.
2. Inspektera `<Button>` (när Task 10 kommit) — `--primary` ska vara forest-teal `oklch(0.42 0.06 175)` (verifiera i DevTools Computed Styles).
3. `bun run build` grön — inga ovuda CSS-fel.

---

### Task 5 — [frontend] Google Fonts-injection (Inter + Newsreader + JetBrains Mono)

**Vad.** `src/styles.css` deklarerar font-stackarna men fonten måste laddas. Injicera Google Fonts-preconnect + stylesheet i `__root.tsx` `head`-meta så att SSR-renderad HTML inkluderar dem.

**File path.** `src/routes/__root.tsx` (kompletteras i Task 6).

**Shape (länkar att lägga i `head().links`).**

```ts
links: [
  { rel: "stylesheet", href: appCss },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css2?" +
      "family=Inter:wght@400;500;600;700&" +
      "family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&" +
      "family=JetBrains+Mono:wght@400;500&display=swap",
  },
],
```

**Notera.**

- CSP i `docs/06 §5.2` inkluderar `font-src 'self' data:` men inte Google Fonts ännu. **Designed risk**: i Fas 0 sätts inte CSP-headers från Workers (det är ett Fas 5-task per `docs/06 §5.2`), så Google Fonts laddar fritt. När CSP slås på (Fas 5) måste `style-src` och `font-src` utvidgas med `https://fonts.googleapis.com` och `https://fonts.gstatic.com` — eller (bättre) fonten self-hostas. Flagga i Risks §4.
- `display=swap` undviker FOIT.

**Dep.** Task 4 (font-stackarna deklareras där), Task 6 (filen som läggs till).

**Acceptance-item.** AC6.

**Verifiering.**

1. DevTools → Network → laddar fonts.gstatic.com woff2-filer.
2. `font-family: Inter` syns i Computed Styles på `<body>`.

---

### Task 6 — [frontend] Rebrand `src/routes/__root.tsx`

**Vad.** Ta bort Lovable-branding (title, OG/Twitter-bilder, author). Sätt `lang="sv"`. Lägg till `<Toaster />` från `src/components/ui/sonner.tsx` så att toast-meddelanden från `translateError()` (kommer i Fas 1) funkar direkt vid första modul-task. Behåll `createRootRouteWithContext<{ queryClient }>` + `RootShell`/`RootComponent`-uppdelningen — det är korrekt TanStack Start v1-mönster (bättre än `docs/03 §2.3`-mallen).

**File path.** `src/routes/__root.tsx`

**Shape (komplett ersättning).**

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Sidan hittades inte
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sidan du söker finns inte eller har flyttats.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Till start
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Sidan kunde inte laddas
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Något gick fel. Försök ladda om eller gå tillbaka till start.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Försök igen
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Till start
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CareKompass" },
      {
        name: "description",
        content:
          "CareKompass — kvalitetsledning och patientsäkerhet för svenska kliniker.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?" +
          "family=Inter:wght@400;500;600;700&" +
          "family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&" +
          "family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
```

**Notera.**

- `<Toaster />` placeras i `RootComponent` (efter `<Outlet />`) så att alla routes — inklusive `/_app/*` och `/inspect/$token` — kan trigga toasts.
- All synlig copy är översatt till svenska (`Sidan hittades inte`, `Försök igen`, `Till start`). Hårdkodade strängar är OK i Fas 0 eftersom `t("key")`-funktionen från `docs/06 §9.2` ännu inte finns; alla strängar **flaggas i implementations-PR** som "ska genom `t()` när i18n-helpern landar i Fas 1".
- `createRootRouteWithContext` är behållen från befintlig kod — den fungerar med `getRouter()` i `src/router.tsx` som passar in `queryClient`.
- `queryClient` skapas i `src/router.tsx`'s `getRouter()` och passas via `createRootRouteWithContext<{ queryClient }>`. **Skapa inte** en fil-lokal `new QueryClient()` i `__root.tsx` — det skulle bryta SSR (en client per request på server). `docs/03 §2.3`-mallen visar fil-lokal QueryClient men supersederas av befintlig `getRouter()`-mönster; doc-writer rättar `docs/03 §2.3` i sin pass (Task 14).

**Dep.** Task 4 (styles.css), Task 5 (font-länkar konceptuellt — implementeras i samma fil).

**Acceptance-item.** AC1 (rena starts), AC6 (button/typo via tokens).

**Verifiering.**

1. `bun run dev` startar, `<html lang="sv">` syns i view-source.
2. `<title>CareKompass</title>` i HTML-headern (inte "Lovable App").
3. Toast (test): från devtools `import { toast } from "sonner"; toast.success("test")` ger visuell toast med forest-teal-accent.

---

### Task 7 — [frontend] Skapa `src/routes/_app.tsx` (authed layout-skelett)

**Vad.** Layout-route som matchar `docs/03 §2.2`-mönstret men med Fas 0-dummy-context (riktig session-resolving via `getServerSession` görs i Fas 1). Den här filen etablerar route-grupperingen `/_app/*` så Fas 1 kan dropp in `_app/dashboard.tsx` osv. utan att rita om grunden.

**File path.** `src/routes/_app.tsx`

**Shape.**

```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Authed layout-route — skelett i Fas 0.
 *
 * Fas 1 implementerar:
 *  - beforeLoad: getServerSession() + redirect till /login om ej inloggad
 *  - AppShell wrapper (Sidebar + Topbar + ClinicSwitcher)
 *  - context: { profileId, tenantId, activeCompanyId, activeClinicId }
 *
 * I Fas 0 returneras dummy-context så barn-routes kan börja byggas
 * och TypeScript-kontraktet i useActiveContext (Fas 1) är förberett.
 */
export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    return {
      // Dummy i Fas 0 — ersätts av session.functions.ts i Fas 1.
      profileId: "00000000-0000-0000-0000-000000000000",
      tenantId: "00000000-0000-0000-0000-000000000000",
      activeCompanyId: "00000000-0000-0000-0000-000000000000",
      activeClinicId: null as string | null,
    };
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">
        <p className="font-serif text-lg text-foreground">CareKompass</p>
        <p className="text-xs text-muted-foreground">
          Fas 0 layout-skelett — AppShell levereras i Fas 1.
        </p>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
```

**Notera.**

- `bg-background` + `text-foreground` använder forest-teal-tokens (verifierar Task 4 från frontend-håll).
- `font-serif` använder Newsreader (verifierar Task 5).
- Ingen rendering av `<AppShell>` ännu — den komponenten finns inte, och Fas 0 ska inte uppfinna `Sidebar`/`Topbar`/`ClinicSwitcher`. Bara strukturen som Fas 1 kan utöka.
- Dummy-context typas explicit som `activeClinicId: string | null` så `useActiveContext`-konsumenten i Fas 1 inte behöver typeswitcha.

**Dep.** Task 4 (tokens), Task 6 (root layout — fungerar parallellt; route registreras via `routeTree.gen.ts` automatiskt vid `bun run dev`).

**Acceptance-item.** AC1.

**Verifiering.**

1. `bun run dev` — `routeTree.gen.ts` regenereras automatiskt och innehåller `/_app`.
2. `bunx tsc --noEmit` grön.

---

### Task 8 — [frontend] Skeleton-routes: `login.tsx`, `signup.tsx`, `accept-invite.$token.tsx`, `inspect.$token.tsx`

**Vad.** Skapa minimala placeholders med rätt route-deklaration och svensk copy. Inga formulär, ingen auth-logik — bara så att TanStack Router har dem registrerade och Fas 1 kan utöka dem utan att skapa nya filer.

**File paths.**

- `src/routes/login.tsx`
- `src/routes/signup.tsx`
- `src/routes/accept-invite.$token.tsx`
- `src/routes/inspect.$token.tsx`

**Shape (`login.tsx` som mönster — övriga analogt).**

```tsx
// src/routes/login.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="font-serif text-3xl text-foreground">Logga in</h1>
        <p className="text-sm text-muted-foreground">
          Inloggning kommer i Fas 1 (multi-tenant + RBAC + onboarding).
        </p>
      </div>
    </div>
  );
}
```

**`signup.tsx`** — analogt, copy `"Skapa konto"`, `"Registrering kommer i Fas 1."`.

**`accept-invite.$token.tsx`** — använd `Route.useParams()` för att läsa `token` (visa det som mono-text):

```tsx
// src/routes/accept-invite.$token.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/accept-invite/$token")({
  component: AcceptInvitePage,
});

function AcceptInvitePage() {
  const { token } = Route.useParams();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="font-serif text-3xl text-foreground">Acceptera inbjudan</h1>
        <p className="text-sm text-muted-foreground">
          Inbjudan-flödet kommer i Fas 1.
        </p>
        <p className="font-mono text-xs text-muted-foreground">token: {token}</p>
      </div>
    </div>
  );
}
```

**`inspect.$token.tsx`** — analogt, copy `"Inspektörsläge"`, `"Inspector mode kommer i Fas 5."`. Använd `bg-[--info-soft]` om relevant senare — i Fas 0 räcker standard bakgrund.

**Notera.** Alla fyra routes ligger **utanför** `_app/`-gruppen (ingen auth-guard) — `login`/`signup`/`accept-invite` ska vara publika, `inspect/$token` har egen separat layout (`docs/03 §14`).

**Dep.** Task 4 (tokens — `font-serif`, `font-mono` används).

**Acceptance-item.** AC1.

**Verifiering.**

1. `bun run dev` — `routeTree.gen.ts` innehåller alla fyra paths.
2. Navigera till `/login`, `/signup`, `/accept-invite/foo123`, `/inspect/bar456` — alla renderar utan fel.

---

### Task 9 — [backend] Skapa `src/lib/health.functions.ts`

**Vad.** Etablera `createServerFn`-mönstret från `docs/02 §8.2` med en publik `getHealth`-funktion. Returnerar en server-timestamp + env-status i `ApiResult<T>`-format via `createApiHandler`. **Ingen `requireSupabaseAuth`-middleware på `/health`** — ologiskt att tvinga inloggning för en SSR-bevis-route, och Task 1:s middleware-registrering räcker för att bevisa hela kedjan i Fas 1-modules. Men `getHealth` använder `createApiHandler` så `ApiResult`-mönstret bevisas redan här.

**File path.** `src/lib/health.functions.ts`

**Shape.**

```ts
// src/lib/health.functions.ts
// Public health-check server function. Bevisar createServerFn + ApiResult-mönstret.
// Ingen requireSupabaseAuth — endpoint är publik (SSR-bevis, inte affärs-data).
//
// Mönstret som demonstreras:
// 1. createServerFn skapas i .functions.ts
// 2. Logiken wrappas i createApiHandler -> returnerar ApiResult<T>
// 3. Route-loader anropar den, komponent får data via Route.useLoaderData()
// 4. TanStack Query tar över med samma queryKey + initialData

import { createServerFn } from "@tanstack/react-start";
import { createApiHandler, type ApiResult } from "./_helpers";

export interface HealthPayload {
  timestamp: string;
  env: "ok";
  uptime_seconds: number;
}

const startedAt = Date.now();

export const getHealth = createServerFn({ method: "GET" }).handler(
  async (): Promise<ApiResult<HealthPayload>> => {
    return createApiHandler<HealthPayload>(async () => ({
      timestamp: new Date().toISOString(),
      env: "ok",
      uptime_seconds: Math.floor((Date.now() - startedAt) / 1000),
    }))();
  },
);
```

**Notera.**

- `createApiHandler` kallas inom handler:n (returnerar en funktion → invokeras direkt med `()`). Detta är det dokumenterade mönstret i `docs/06 §12.1`.
- Server-importen `@tanstack/react-start` verifierat mot `package.json` (`"@tanstack/react-start": "^1.167.50"`).
- `startedAt` capturas vid modul-load — visar uptime per Worker-instans (vilket är userful diagnostiskt).
- Eventuella Fas 1-modules som använder middleware kan kopiera detta mönster men byter `(): Promise<ApiResult<T>> => createApiHandler(...)` mot `.middleware([requireSupabaseAuth]).validator(...).handler(async ({ data, context }) => createApiHandler(async () => { ... })())`.

> **Undantaget:** `getHealth` är publikt — ingen `requireSupabaseAuth`-middleware. Detta är den enda `createServerFn` i Fas 0 utan auth (SSR-bevis, inte affärs-data). Alla framtida `createServerFn` i Fas 1+ är middleware-guarded by default; det här mönstret kopieras endast för analoga publika endpoints (jfr `bankid-callback`/`send-contact-email` i `docs/07 §5`). Ingen separat ADR behövs — täcks av ADR 0002.

**Dep.** Task 3 (`_helpers.ts` levererar `createApiHandler` + `ApiResult`). Task 1 är **inte** strikt blockerande (denna fn är ovaktad) men bör landa först så middleware-kedjan inte är trasig när hela mönstret demonstreras.

**Acceptance-item.** AC2, AC5.

**Verifiering.**

1. `bun run dev` — anropa `getHealth({})` från devtools console (eller via Task 10:s route) → response `{ ok: true, data: { timestamp, env, uptime_seconds }, request_id }`.
2. `bunx tsc --noEmit` grön.

---

### Task 10 — [frontend] Skapa `src/routes/health.tsx`

**Vad.** Etablera SSR-mönstret end-to-end: route `loader` anropar `getHealth`, komponent läser `Route.useLoaderData()` och skickar till `useQuery({ initialData })` med samma `queryKey`. Detta är **mönstret som hela appen kommer kopiera** (per `docs/03 §3`).

**File path.** `src/routes/health.tsx`

**Shape.**

```tsx
// src/routes/health.tsx
// SSR-bevis-route. Demonstrerar det kanoniska Fas-0-mönstret:
//   1. Loader anropar createServerFn → data fetchas server-side
//   2. Komponent får data via Route.useLoaderData()
//   3. useQuery tar över med samma queryKey + initialData
//
// Detta är mönstret alla moduler ska följa (docs/03 §3).

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { getHealth, type HealthPayload } from "@/lib/health.functions";

export const Route = createFileRoute("/health")({
  loader: async () => {
    const result = await getHealth();
    return result;
  },
  component: HealthPage,
});

function HealthPage() {
  const initial = Route.useLoaderData();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const r = await getHealth();
      if (!r.ok) throw new Error(r.error_code ?? r.error);
      return r.data;
    },
    initialData: initial.ok ? initial.data : undefined,
    staleTime: 5_000,
  });

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Laddar…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg space-y-6 rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm">
        <header className="space-y-1">
          <h1 className="font-serif text-2xl text-foreground">Hälsokontroll</h1>
          <p className="text-sm text-muted-foreground">
            SSR + createServerFn + TanStack Query — fungerar.
          </p>
        </header>
        <dl className="space-y-3 text-sm">
          <Row label="Server-timestamp" value={data.timestamp} mono />
          <Row label="Miljö" value={data.env} />
          <Row label="Uptime" value={`${data.uptime_seconds} s`} mono />
        </dl>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isFetching ? "Hämtar…" : "Uppdatera"}
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono text-xs text-foreground" : "text-foreground"}>
        {value}
      </dd>
    </div>
  );
}
```

**Notera.**

- `queryKey: ["health"]` — samma som det loader-anropet returnerar (loader använder ingen explicit queryKey, men `initialData` matchar formen). Hela poängen med "samma queryKey" (`docs/04 §2.2` AC5) är att `useQuery` på klienten kan invalidera samma data utan dubbel-fetch.
- `bg-card`, `text-card-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`, `text-muted-foreground`, `font-serif`, `font-mono` — alla kommer från Task 4:s tokens. Bevisar AC6.
- "Uppdatera"-knappen är en `<button>` med shadcn-button-stilade klasser. Vi använder inte `<Button>`-komponenten från `src/components/ui/button.tsx` här för att hålla beroende-grafen minimal — men en validation-task kan byta till `<Button>` om man vill ha en mer explicit AC6-verifiering.
- Om man vill explicit demonstrera AC6 med shadcn `<Button>`: byt knappen mot `import { Button } from "@/components/ui/button"` + `<Button onClick={...} disabled={isFetching}>{...}</Button>`. Lämnas som builder-val.

**Dep.** Task 1 (middleware), Task 3 (helpers), Task 4 (tokens), Task 6 (root layout), Task 9 (health.functions.ts).

**Acceptance-item.** AC2, AC5, AC6.

**Verifiering.**

1. `bun run dev`. Öppna `/health` i webbläsare — sidan SSR:as (visa via `view-source` att timestamp finns i HTML innan JS körts).
2. Klicka "Uppdatera" → timestamp uppdateras utan full sid-reload.
3. Inspektera knappens computed `background-color` → forest-teal `oklch(0.42 0.06 175)`.
4. Inspektera `<h1>` → `font-family: "Newsreader"`.

---

### Task 11 — [ci] Skapa `.github/workflows/ci.yml`

**Vad.** Pre-merge-check: lint + typecheck + build. Använder `oven-sh/setup-bun@v2`. Triggas på `pull_request` mot alla branches + `push` till `main`/`develop`. **Inget `bun test` ännu** — vitest är inte installerat (separat Fas 0/1-task med supply-chain-cooldown).

**File path.** `.github/workflows/ci.yml`

**Shape.**

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main, develop]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  ci:
    name: Lint + Typecheck + Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Lint
        run: bun run lint

      - name: Typecheck
        run: bun run typecheck

      - name: Build
        run: bun run build
```

**Notera.**

- `--frozen-lockfile` säkerställer att supply-chain-guarden (`bunfig.toml minimumReleaseAge`) inte påverkar CI — låsta versioner används som de är.
- `bun run build` på Cloudflare-mode kräver vissa env-variabler. Om bygget kraschar i CI utan `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` — lägg dummy-värden som GitHub Action env (`VITE_SUPABASE_URL: https://dummy.supabase.co` etc.) eller verifiera att Vite tolererar undefined. **Flagga i Risks §4.**
- `e2e.yml`, `deploy-staging.yml`, `deploy-prod.yml` (per `docs/06 §3.3`) levereras inte i Fas 0 — de hör hemma i Fas 1+ när det finns en staging-env.

**Dep.** Task 2 (`typecheck`-scriptet måste finnas).

**Acceptance-item.** AC4 (CI verifierar `typecheck` löpande).

**Verifiering.**

1. Skapa testbranch, push → workflow startar och kör tre steg.
2. Alla tre steg grön.

---

### Task 12 — [setup] Skapa `.github/pull_request_template.md`

**Vad.** Per `docs/06 §11.4`. Säkerställer att varje PR har konsekvent struktur (Vad / Varför / Hur / Tester / Påverkan / Skärmdumpar).

**File path.** `.github/pull_request_template.md`

**Shape (verbatim ur `docs/06 §11.4`).**

```markdown
## Vad
<kort beskrivning>

## Varför
<motivering>

## Hur
<implementationsöversikt, eventuella avvägningar>

## Tester
- [ ] Unit
- [ ] Integration
- [ ] RLS (om policy-ändringar)
- [ ] E2E (om user flow-ändringar)
- [ ] Manuellt testat i staging

## Påverkan
- [ ] Migrationer ingår
- [ ] Breaking changes (beskriv)
- [ ] Påverkar feature flags
- [ ] Påverkar permissions

## Skärmdumpar / GIF
<om UI-ändringar>
```

**Notera.** Test-checkboxarna är "olästa" i Fas 0 (vitest finns inte) — bocka ändå om det är relevant, eller stryk i implementations-PR med kommentar.

**Dep.** Ingen.

**Acceptance-item.** Stödjer alla AC via process.

**Verifiering.** Filen finns på rätt path; nästa PR auto-injicerar mallen.

---

### Task 13 — [docs] Skapa `docs/decisions/` + ADR-skelett 0001–0006

**Vad.** Per `docs/06 §14.3`. Sex filer med metadata + första-stab på Context. Status = `Proposed`. Toni fyller Decision/Consequences manuellt vid faktiska beslutspunkter (vissa, t.ex. 0005 Tailwind v4 + shadcn, är de facto redan tagna — kan markeras `Accepted` direkt).

**File paths.**

- `docs/decisions/0001-tanstack-start-vs-nextjs.md`
- `docs/decisions/0002-hybrid-server-fn-edge-functions.md`
- `docs/decisions/0003-jwt-passthrough-rls.md`
- `docs/decisions/0004-loaders-plus-tanstack-query.md`
- `docs/decisions/0005-tailwind-v4-shadcn.md`
- `docs/decisions/0006-i18n-strategy.md`

**Shape (`0001` som mall — övriga analogt).**

```markdown
# ADR 0001 — TanStack Start vs Next.js

## Status
Proposed

## Context
CareKompass v6 är en greenfield omskrivning av v4 (React 18 + Vite 5 + React
Router + Express). v6:s krav: SSR av authed views med Supabase RLS, edge-deploy
(Cloudflare Workers), file-baserad routing, integration med TanStack Query för
realtime + optimistic updates. Tre alternativ utvärderades: Next.js (App Router),
TanStack Start v1 (beta), Remix.

## Decision
<Toni fyller — vald: TanStack Start v1.>

## Consequences
<Toni fyller.>

## Date
2026-05-28

## Author
Toni Kazarian
```

**Övriga rubriker / Context-stab:**

- **0002 — Hybrid server-fn + Edge Functions.** Context: `createServerFn` täcker 80 % av server-logik men kan inte köra Deno-bibliotek (`pdf-lib` för audit-export) eller offentliga endpoints utan JWT (BankID-callback). Decision: `docs/02 §8.1`-tabell + `docs/07 §5`-mappning.
- **0003 — JWT-passthrough → RLS som single source of truth.** Context: alternativ var service_role-overrider med manuell auth-check. Decision: JWT vidarebefordras via `attachSupabaseAuth` → `requireSupabaseAuth` skapar RLS-respekterande klient. Endast `supabaseAdmin` för cross-tenant maintenance (server-only modules).
- **0004 — Loader + TanStack Query hybrid SSR.** Context: alternativ var (a) loaders-only, (b) Query-only client-side, (c) RSC (ej stöd i TanStack Start). Decision: loader fetchar initial → Query tar över. Bevis-route levereras i Fas 0 (denna spec, Task 10).
- **0005 — Tailwind v4 + shadcn slate base, forest-teal override.** Context: shadcn-mallar förutsätter `tailwind.config.ts` (v3). v4 är CSS-first. Decision: `@theme inline` i `src/styles.css`. shadcn slate som base, forest-teal override per `docs/10 §4`. **Status:** `Accepted (Tailwind v4 + shadcn-arkitektur). Brand-färg forest-teal är Proposed pending Fas 5 (docs/09 §6b).`
- **0006 — i18n: sv-default, en-future via `t()`.** Context: alternativ var (a) hårdkoda svenska, (b) react-i18next nu, (c) lazy. Decision: per `docs/06 §9` — `t()`-funktion etableras Fas 1 (när första modul har dynamisk copy), alla strängar går genom den från dag 1.

**Notera.**

- Skapa även en kort `docs/decisions/README.md` som indexar ADR:erna (titel + status + datum) — det blir lättare att se status i översikt.
- Status `Proposed` kommunicerar att Toni måste fylla Decision/Consequences innan ADR betraktas som färdig.

**Dep.** Ingen.

**Acceptance-item.** Stödjer `docs/04 §2.3 step 13` + `docs/06 §14.3`.

**Verifiering.** Sex filer + README finns; filnamnen följer `NNNN-titel.md`.

---

### Task 14 — [docs] Doc-drift task-lista till doc-writer (post-validator)

**Vad.** Detta är inte en agent-task i Fas 0 — det är en task-lista som `doc-writer` får i sin pass efter att validator har godkänt builders. Listas här för spårbarhet.

**Doc-drift att rätta:**

| Doc | Sektion | Drift | Rättning |
|---|---|---|---|
| `docs/03-frontend-guide.md` | §1 filstruktur | `src/lib/supabase.client.ts/server.ts` | Ändra till `src/integrations/supabase/client.ts/client.server.ts` (Lovable-managed) |
| `docs/03-frontend-guide.md` | §1 filstruktur, §6.1 setup | `src/styles/app.css` | Ändra till `src/styles.css` |
| `docs/03-frontend-guide.md` | §6.1 setup | `--primary: oklch(0.208 0.042 265.755)` slate-värde | Ändra till forest-teal `oklch(0.42 0.06 175)` med ref till `docs/10 §4` + `09 §6b` |
| `docs/03-frontend-guide.md` | §15 nyckelprinciper | `> src/types/supabase.ts` | Ändra till `> src/integrations/supabase/types.ts` |
| `docs/04-implementation-plan.md` | §2.1 innehåll | `src/styles/app.css`, `src/types/supabase.ts`, `src/lib/supabase.client.ts`/`supabase.server.ts` | Ändra alla tre till faktisk plats; lägg till parentes "(Lovable Cloud genererar `src/integrations/supabase/*` — vi wrappar dem i `src/lib/_helpers.ts`)" |
| `docs/04-implementation-plan.md` | §2.3 step 11 | `src/types/supabase.ts` | Ändra till `src/integrations/supabase/types.ts` |
| `docs/04-implementation-plan.md` | §2.3 step 10 | Sentry/BetterStack i Fas 0 | Markera flyttat till Fas 1 (per beslut 09 §17-19 redan, men step 10 säger fortfarande "initiera nu") |
| `docs/07-v4-mapping-and-overrides.md` | §1 tabell rad 1 | `src/lib/supabase.client.ts + .server.ts` | Ändra till `src/integrations/supabase/client.ts + client.server.ts` |

**Dep.** Alla builder-tasks (1–13).

**Acceptance-item.** Stödjer hela DoD-spårbarhet.

**Verifiering.** `doc-writer` levererar PR-edits.

---

## 3. Sequencing

### 3.1 Critical path

```
Task 1 (start.ts middleware)
   ↓ blockerar
Task 9 (health.functions.ts)
   ↓ blockerar
Task 10 (health.tsx route)
```

**Task 3 (`_helpers.ts`)** blockerar också **Task 9** (för `createApiHandler` + `ApiResult`).

### 3.2 Parallelliserbara grupper

**Parallell-grupp A — tokens & root layout:**
- Task 4 (`styles.css` forest-teal)
- Task 5 (Google Fonts)
- Task 6 (`__root.tsx` rebrand)

Tasks 5+6 är logiskt sammanslagna i samma fil-edit (`__root.tsx`) men ordnas så Task 4:s tokens finns innan Task 6 ändrar `lang`/title.

**Parallell-grupp B — skelett-routes & layout:**
- Task 7 (`_app.tsx`)
- Task 8 (login/signup/accept-invite/inspect)

Båda beroende på Task 4 (tokens).

**Parallell-grupp C — process & docs:**
- Task 2 (package.json scripts)
- Task 11 (CI workflow) — beroende på Task 2
- Task 12 (PR template)
- Task 13 (ADRs)

Alla i C kan börjas direkt — Task 11 väntar bara på Task 2:s scripts existerar i `package.json`.

### 3.3 Föreslagen exekveringsordning för en builder-batch

1. **Steg 1 (sequential):** Task 1 → Task 2 → Task 3 (sätter critical-path-grunden).
2. **Steg 2 (parallel):** {Task 4, Task 5 inom Task 6, Task 7, Task 8, Task 11, Task 12, Task 13}.
3. **Steg 3 (sequential, kräver Steg 1+2):** Task 6 (utöver Task 5:s länkar — inkludera dem i samma edit) → Task 9 → Task 10.
4. **Steg 4 (post-validator):** Task 14 till doc-writer.

---

## 4. Risks / decisions

### 4.1 Tailwind v4 `@theme inline` med custom status-tokens

Vi lägger till `--color-success`, `--color-warning`, `--color-info` i `@theme inline` (Task 4). shadcn-primitiver (i `src/components/ui/`) använder inte dessa idag — de har `--destructive` inbyggt men ingen `--success`. **Risk:** om någon framtida shadcn-update introducerar default `bg-success`-användning utan token-fallback kan stilning saknas. **Mitigation:** verifiera med `bun run build` i CI att inga `bg-success`/`bg-warning`-klasser används av shadcn-default-komponenter; ta in dem aktivt i custom-Badge/Status-komponenter (Fas 1).

### 4.2 ThemeProvider skippas i Fas 0

`docs/03 §2.3`-mallen inkluderar `<ThemeProvider>` (next-themes-baserad). Vi skippar — Tailwind v4 + tokens räcker för dark mode (toggling sker via `.dark`-klass på `<html>`, kan settas manuellt eller via en framtida hook). **Risk:** vid Fas 1 om en explicit theme-toggle krävs (i topbar) behöver `next-themes` läggas till — ny dep, 24h supply-chain-cooldown. **Mitigation:** Toni godkänner i Fas 1 om/när behov uppstår; alternativ är en egen lättviktig hook i `useTheme.ts` som skriver `.dark` direkt på `document.documentElement`.

### 4.3 `requireSupabaseAuth` Fas 0-shape vs Fas 1-shape

Lovable-generated middleware returnerar `{ supabase, userId, claims }`. Helpers-doc-strings tydliggör att `tenantId`/`profileId` saknas tills Fas 1. **Risk:** om någon builder skriver server-fn i Fas 0 som behöver `tenantId` kraschar typsystemet. **Mitigation:**

- `requirePermission`, `requireWritableSubscription`, `auditLog` är **skelett som kastar** med tydlig Fas-info — ingen ska tro de funkar nu.
- `getHealth` i Task 9 använder ingen middleware — bara `createApiHandler` — så Fas 0:s enda createServerFn behöver inte den utökade kontexten.
- Fas 1-spec ska ange exakt SQL-migration som lägger till `profiles` + ny middleware-wrapper som resolvar `profileId`/`tenantId` (via en `current_profile_id()` helper-RPC eller manuell SELECT).

### 4.4 Google Fonts vs CSP

Task 5 laddar Inter/Newsreader/JetBrains Mono från Google CDN. **Risk:** när CSP slås på (Fas 5 per `docs/06 §5.2`) måste `style-src` + `font-src` utvidgas — eller fonten self-hostas. **Mitigation:** Fas 5-spec inkluderar antingen `https://fonts.googleapis.com`/`https://fonts.gstatic.com` i CSP, eller migration till self-hostade `.woff2` i `public/fonts/`. Inget action nu.

### 4.5 `bun run build` i CI utan VITE-env

Task 11 kör `bun run build`. Vite ersätter `import.meta.env.VITE_SUPABASE_URL` vid build-tid. Om dessa saknas i CI fail:ar bygget eller producerar trasig output. **Mitigation:** lägg dummies som GitHub Action env i `ci.yml`:

```yaml
env:
  VITE_SUPABASE_URL: https://dummy.supabase.co
  VITE_SUPABASE_PUBLISHABLE_KEY: dummy_key
```

Detta är OK eftersom `bun run build` inte gör några faktiska Supabase-anrop — det compilerar bara. **Verifiera** detta beteende mot `src/integrations/supabase/client.ts:11-20` (kastar om saknade); det är runtime-kastat (Proxy-pattern) så build går igenom. Inkludera env-pairs i `ci.yml` ändå för säkerhets skull.

### 4.6 Vitest defer:as — påverkar test-verifier

Test-runner saknas — Fas 0 lägger inte till det (per beslut). `test-verifier` har bara `lint + typecheck + build` att gå på. **Risk:** ingen test säkerställer att `createApiHandler` faktiskt returnerar rätt `ApiResult`-shape vid `ForbiddenError` etc. **Mitigation:** Fas 0/1-övergångs-task: installera `vitest` + `@vitest/coverage-v8` (nya deps, 24h cooldown), skriv unit-test mot `_helpers.ts`. Listas i Fas 1-spec.

### 4.7 ADR-innehåll skrivs av Toni, inte agent

Task 13 levererar skeleton + första-stab på Context. Decision + Consequences är Toni:s domän — agenten ska inte ta beslut åt honom där (`docs/06 §14`-intent). **Risk:** ADR:erna förblir `Proposed` länge. **Mitigation:** flagga i validator att Fas 0 godkänns med `Proposed`-ADR:er, men `Decision`-fält ska fyllas innan Fas 5 cutover.

### 4.8 `/health` är publik (ingen middleware)

Per beslut: `/health` har ingen `requireSupabaseAuth`-middleware. Det är inte ett affärs-data-endpoint — det är SSR-bevis. **Risk:** en bot kan polla `/health` och konsumera Worker-kapacitet. **Mitigation:** Fas 1 inkluderar Cloudflare Workers rate-limit (`docs/06 §6`); `/health` täcks då av en standard-policy. Ingen action i Fas 0.

### 4.9 Open `docs/09`-questions touched

Inga av de 6 öppna frågorna i `docs/09` blockerar Fas 0. Forest-teal-valet (beslut 09 §6b) är "tentativt default pending Fas 5-konfirmering" — Fas 0 implementerar det som default, Fas 5 kan byta till en annan brand-färg utan kod-arbete (bara `--primary` + `--ring`-värdesändring i `src/styles.css`).

### 4.10 Nya dependencies?

Fas 0 lägger **inga** nya runtime-deps. Allt görs med existing packages från `package.json`:

- TanStack Start v1, React 19, Vite 7, Tailwind v4 — finns
- shadcn-primitiver (alla 44 + `sonner`) — finns
- `@supabase/supabase-js`, `zod`, `@tanstack/react-query`, `@tanstack/react-router` — finns
- `clsx` + `tailwind-merge` (för `cn()`) — finns

Inga 24h supply-chain-cooldowns triggas.

---

## 5. Acceptance check

Checklist mappad till `docs/04 §2.2`:

- [ ] **AC1** — `bun dev` startar utan fel.
  - Tasks: 1 (middleware), 6 (rebrand), 7 (`_app.tsx` skelett), 8 (skeleton routes).
  - Bevis: `bun run dev` ger `Local: http://localhost:5173` utan errors.

- [ ] **AC2** — `/health` SSR:as och visar server-renderad data.
  - Tasks: 9 (health.functions.ts), 10 (health.tsx).
  - Bevis: `view-source:/health` visar timestamp i HTML innan JS körs.

- [ ] **AC3** — `bunx supabase gen types typescript` ger fil utan diff.
  - Tasks: 2 (`gen-types` script).
  - Bevis: `bun run gen-types` → `git diff src/integrations/supabase/types.ts` är tom (schema är tomt i Fas 0).

- [ ] **AC4** — `bun typecheck` är grön (strict mode).
  - Tasks: 2 (`typecheck` script), 11 (CI kör det).
  - Bevis: `bun run typecheck` exit 0 + CI-job grön.

- [ ] **AC5** — En `createServerFn` kan anropas från en route-loader och från en komponent via TanStack Query med samma queryKey.
  - Tasks: 1 (middleware), 3 (helpers), 9 (health.functions), 10 (health.tsx).
  - Bevis: `/health` route — loader anropar `getHealth`, komponent har `useQuery({ queryKey: ["health"], initialData, queryFn: getHealth })`.

- [ ] **AC6** — shadcn `<Button>` renderar med rätt design-tokens.
  - Tasks: 4 (forest-teal tokens), 5 (Inter font), 10 (health.tsx — knappen verifierar tokens även utan att importera `<Button>`; alternativt byt knappen till `<Button>`).
  - Bevis: knapp på `/health` har computed `background-color: oklch(0.42 0.06 175)` (forest-teal) och `font-family: Inter`.

---

## 6. Pekare för builders

- **`createServerFn`-import:** `@tanstack/react-start` (verifierat i `package.json`). Inte `@tanstack/start` (som `docs/02 §8.2` skriver — den exporten finns inte i v1.167.x).
- **Path-alias:** `@/` → `src/` (per `CLAUDE.md` + `vite.config.ts` via `vite-tsconfig-paths`).
- **Lovable-generated filer som INTE får hand-editas:** `src/integrations/supabase/types.ts`, `client.ts`, `client.server.ts`, `auth-middleware.ts`, `auth-attacher.ts`, `src/routeTree.gen.ts`.
- **`design/`** är referensmaterial — kopiera tokens-värden, kopiera inte komponentkod.
- **Component-storlek ≤ ~150 rader** (per `docs/06 §10`). Splittra `health.tsx` om Row-helper växer; idag är den nästan-noll-overhead.
- **All UI-copy är svenska**; `t("key")` kommer i Fas 1 — flagga hårdkodade strängar med inline-kommentar `// TODO i18n` om det är många. I Fas 0 räcker `// All strings här ska gå genom t() i Fas 1` som en gemensam not på toppen av varje route-fil.

---

*Slut på Fas 0-spec.*
