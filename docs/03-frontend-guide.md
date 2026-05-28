# CareKompass v6.0 — Frontend Guide

> **Serie:** 01-system-spec · 02-database-api · **03-frontend-guide** · 04-implementation-plan
> **Stack:** React 19 + TanStack Start v1 + TanStack Router (filbaserad) + Vite 7 + Tailwind v4 + shadcn/ui + bun

---

## Innehåll

1. Filstruktur
2. Filbaserad routing & route-tree
3. SSR-strategi (loaders + Query hybrid)
4. Auth, guards & multi-tenant-kontext
5. Hooks (permissions, features, terminologi, subscription, klinik-switcher)
6. Tailwind v4 + design system
7. shadcn/ui-uppsättning
8. Komponenttaxonomi (per modul)
9. Form-mönster (zod + react-hook-form)
10. Realtime
11. Felgrafer (error/loading/empty)
12. Onboarding-flöde
13. Command palette
14. Inspector mode (revisor / IVO-läge)
15. Nyckelprinciper (sammanfattning)

---

## 1. Filstruktur

```
src/
├── routes/                           # TanStack Router file-based
│   ├── __root.tsx                    # Root layout (auth provider, theme, query client)
│   ├── index.tsx                     # /
│   ├── login.tsx                     # /login
│   ├── signup.tsx                    # /signup
│   ├── accept-invite.$token.tsx      # /accept-invite/<token>
│   ├── inspect.$token.tsx            # /inspect/<token> (read-only inspector mode)
│   ├── _app.tsx                      # Authed layout (sidebar + topbar + klinik-switcher)
│   ├── _app/
│   │   ├── index.tsx                 # /app  → redirect till /app/dashboard
│   │   ├── dashboard.tsx
│   │   ├── onboarding.tsx
│   │   ├── inbox.tsx                 # Consulting practitioner global inbox
│   │   ├── documents/
│   │   │   ├── index.tsx             # Lista
│   │   │   ├── $id.tsx               # Detalj
│   │   │   └── new.tsx               # Skapa
│   │   ├── deviations/
│   │   ├── medications/
│   │   ├── orders/                   # Ordination & delegering
│   │   ├── hygiene/
│   │   ├── risks/
│   │   ├── staff/                    # Personal & legitimation
│   │   ├── compliance/               # Compliance Center
│   │   ├── audit/                    # Audit logs (paginated)
│   │   ├── customers/                # Fas 8
│   │   ├── external-practitioners/   # Fas 9
│   │   └── settings/
│   │       ├── company.tsx
│   │       ├── clinics.tsx
│   │       ├── users.tsx
│   │       ├── billing.tsx
│   │       └── integrations.tsx
│   └── _admin/                       # CK-admin (intern), separat layout & guard
│       └── ...
│
├── integrations/
│   └── supabase/                     # Lovable-generated — ALDRIG redigera manuellt
│       ├── types.ts                  # genererad: bunx supabase gen types typescript
│       ├── client.ts                 # Browser-klient
│       ├── client.server.ts          # Server-klient factory (SSR)
│       ├── auth-middleware.ts        # requireSupabaseAuth middleware
│       └── auth-attacher.ts          # Bearer-token attacher (client-side)
│
├── lib/
│   ├── _helpers.ts                   # createApiHandler, requirePermission, auditLog (wrappar auth-middleware)
│   ├── deviations.functions.ts       # createServerFn per modul
│   ├── documents.functions.ts
│   ├── medications.functions.ts
│   ├── orders.functions.ts
│   ├── hygiene.functions.ts
│   ├── risks.functions.ts
│   ├── compliance.functions.ts
│   ├── audit.functions.ts
│   ├── billing.functions.ts
│   ├── customers.functions.ts
│   ├── staff.functions.ts
│   ├── terminology.ts                # useTerminology + helpers
│   └── permissions.ts                # client-side permission cache
│
├── components/
│   ├── ui/                           # shadcn primitives (button, input, dialog, ...)
│   ├── app/                          # App-specifika (Sidebar, Topbar, ClinicSwitcher, ...)
│   ├── modules/
│   │   ├── deviations/               # DeviationList, DeviationForm, DeviationCard
│   │   ├── documents/
│   │   ├── ...
│   └── forms/                        # FormField, FormError, generic wrappers
│
├── hooks/
│   ├── useAuth.ts
│   ├── useActiveContext.ts           # current company + clinic
│   ├── usePermissions.ts
│   ├── useFeatureFlags.ts
│   ├── useTerminology.ts
│   ├── useSubscriptionStatus.ts
│   └── useRealtimeChannel.ts
│
└── styles.css                        # Tailwind v4 entry + @theme inline (på rot-nivå i src/)
```

---

## 2. Filbaserad routing & route-tree

TanStack Router genererar `routeTree.gen.ts` från filstrukturen. **Det finns inget `src/App.tsx`. Det finns ingen `src/pages/`.** Det finns ingen central route-konfig — varje fil deklarerar sin route.

### 2.1 Route-fil-exempel

```tsx
// src/routes/_app/deviations/index.tsx
import { createFileRoute } from "@tanstack/react-router"
import { listDeviations } from "~/lib/deviations.functions"
import { DeviationList } from "~/components/modules/deviations/DeviationList"

export const Route = createFileRoute("/_app/deviations/")({
  loader: async ({ context }) => {
    const result = await listDeviations({
      data: { company_id: context.activeCompanyId, clinic_id: context.activeClinicId },
    })
    return result
  },
  component: DeviationsPage,
  pendingComponent: () => <LoadingState />,
  errorComponent: ({ error }) => <ErrorState error={error} />,
})

function DeviationsPage() {
  const initial = Route.useLoaderData()
  // SSR-renderat med initial. TanStack Query tar över vid mutation/refetch.
  return <DeviationList initialData={initial.ok ? initial.data : []} />
}
```

### 2.2 Authed layout-route

```tsx
// src/routes/_app.tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { AppShell } from "~/components/app/AppShell"
import { getServerSession } from "~/lib/session.functions"

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location }) => {
    const session = await getServerSession()
    if (!session.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } })
    }
    return {
      profileId: session.profileId,
      tenantId: session.tenantId,
      activeCompanyId: session.activeCompanyId,
      activeClinicId: session.activeClinicId,
    }
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
})
```

`beforeLoad` returnerar context som ärvs av barn-routes (`context.activeCompanyId` etc.).

### 2.3 Root-layout

```tsx
// src/routes/__root.tsx
import { createRootRoute, Outlet, ScrollRestoration } from "@tanstack/react-router"
import { Meta, Scripts } from "@tanstack/start"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "~/components/ui/sonner"
import { ThemeProvider } from "~/components/app/ThemeProvider"
import appCss from "~/styles.css?url"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false },
  },
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CareKompass" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: () => (
    <html lang="sv">
      <head><Meta /></head>
      <body>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Outlet />
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  ),
})
```

---

## 3. SSR-strategi (loaders + Query hybrid)

Detta är centralt och måste etableras i Fas 0 så alla moduler följer samma mönster.

### 3.1 Mönstret

```
Route loader     →   anropar createServerFn   →   data fetchas på server (SSR)
                                                      │
                                                      ▼
Komponent får data via Route.useLoaderData()   →   skickar som initialData till useQuery
                                                      │
                                                      ▼
useQuery hanterar:  - refetch efter mutation
                    - optimistic updates
                    - realtime-uppdateringar
                    - cache-invalidering
```

### 3.2 Konkret exempel

```tsx
// src/components/modules/deviations/DeviationList.tsx
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { listDeviations } from "~/lib/deviations.functions"
import { useActiveContext } from "~/hooks/useActiveContext"

export function DeviationList({ initialData }: { initialData: Deviation[] }) {
  const ctx = useActiveContext()
  const { data, refetch } = useQuery({
    queryKey: ["deviations", ctx.activeCompanyId, ctx.activeClinicId],
    queryFn: async () => {
      const r = await listDeviations({
        data: { company_id: ctx.activeCompanyId, clinic_id: ctx.activeClinicId },
      })
      if (!r.ok) throw new Error(r.error_code ?? r.error)
      return r.data
    },
    initialData,
  })

  return (
    <div>
      {data.map((d) => <DeviationRow key={d.id} deviation={d} />)}
    </div>
  )
}
```

### 3.3 Realtime via Query

```tsx
// Realtime-prenumeration kopplas till samma queryKey
useRealtimeChannel({
  channel: `deviations:${ctx.activeCompanyId}`,
  table: "deviations",
  filter: `company_id=eq.${ctx.activeCompanyId}`,
  onChange: () => qc.invalidateQueries({ queryKey: ["deviations", ctx.activeCompanyId] }),
})
```

Hooken `useRealtimeChannel` finns i `src/hooks/useRealtimeChannel.ts` och pratar med `supabase.channel()` direkt från klienten (RLS gäller).

### 3.4 Mutations + optimistic update

```tsx
const mutate = useMutation({
  mutationFn: (input: CreateDeviationInput) => createDeviation({ data: input }),
  onMutate: async (input) => {
    await qc.cancelQueries({ queryKey: ["deviations", ctx.activeCompanyId] })
    const prev = qc.getQueryData(["deviations", ctx.activeCompanyId])
    qc.setQueryData(["deviations", ctx.activeCompanyId], (old) => [optimistic(input), ...(old ?? [])])
    return { prev }
  },
  onError: (err, _, context) => {
    qc.setQueryData(["deviations", ctx.activeCompanyId], context?.prev)
    toast.error(translateError(err))
  },
  onSettled: () => qc.invalidateQueries({ queryKey: ["deviations", ctx.activeCompanyId] }),
})
```

---

## 4. Auth, guards & multi-tenant-kontext

### 4.1 Session på servern

`requireSupabaseAuth` (02-database-api §8.3) körs i varje `createServerFn`. För route-beforeLoad används en separat helper:

```ts
// src/lib/session.functions.ts
import { createServerFn } from "@tanstack/start"

export const getServerSession = createServerFn({ method: "GET" }).handler(async () => {
  const ctx = await tryGetAuth()  // tillåts null
  if (!ctx) return { user: null }

  // Hämta active company/clinic från cookie eller default
  const activeCompanyId = await resolveActiveCompany(ctx)
  const activeClinicId = await resolveActiveClinic(ctx, activeCompanyId)

  return {
    user: ctx.user,
    profileId: ctx.profileId,
    tenantId: ctx.tenantId,
    activeCompanyId,
    activeClinicId,
  }
})
```

### 4.2 Klinik-switcher

Användaren tillhör ett bolag, ofta flera kliniker. Active-state lagras i cookie `ck_active_clinic`. Switcher i topbar (`<ClinicSwitcher />`) skriver cookien via `createServerFn` och triggar router-invalidate så loaders körs om.

### 4.3 Tre lager av access control i frontend

1. **Subscription**: `useSubscriptionStatus()` → `trialing` | `active` ⇒ writable. `past_due` | `canceled` ⇒ read-only.
2. **Feature flag**: `useFeatureFlags()` → `isModuleEnabled("module.deviations_enabled")`.
3. **Permission (roll)**: `usePermissions("deviation")` → `{ canCreate, canApprove, canDelete }`.

Alla tre kontrolleras: sidebar-rendering, route-guard, knapprendering, mutation-disabled-state.

```tsx
function NewDeviationButton() {
  const { writable } = useSubscriptionStatus()
  const { isEnabled } = useFeatureFlags()
  const { canCreate } = usePermissions("deviation")

  if (!isEnabled("module.deviations_enabled")) return null
  if (!canCreate) return null
  return <Button disabled={!writable}>Ny avvikelse</Button>
}
```

**Backend speglar samma kontroller** via `requirePermission` + RLS-policies + `requireWritableSubscription`. Frontend-gates är UX, RLS är säkerhet.

### 4.4 Route guard för feature flag

```tsx
// src/routes/_app/deviations/route.tsx  (route-grupp-config)
export const Route = createFileRoute("/_app/deviations")({
  beforeLoad: async ({ context }) => {
    const features = await getCompanyFeatures({ data: { company_id: context.activeCompanyId } })
    if (!features.data?.["module.deviations_enabled"]) {
      throw redirect({ to: "/app/settings/billing", search: { upgrade: "deviations" } })
    }
  },
})
```

### 4.5 Feature flag race-fix

Efter en mutation som potentiellt ändrat feature-status (ex. Stripe trial-end):

```ts
// I stripe-relaterade mutations + var 60s i layout
useEffect(() => {
  const i = setInterval(() => qc.invalidateQueries({ queryKey: ["company-features"] }), 60_000)
  return () => clearInterval(i)
}, [])
```

---

## 5. Hooks

### 5.1 `useActiveContext`

```ts
export function useActiveContext() {
  const router = useRouter()
  const matches = router.state.matches
  const appMatch = matches.find((m) => m.routeId === "/_app")
  return appMatch?.context as {
    profileId: string
    tenantId: string
    activeCompanyId: string
    activeClinicId: string | null
  }
}
```

### 5.2 `useFeatureFlags`

```ts
export function useFeatureFlags() {
  const { activeCompanyId } = useActiveContext()
  const { data } = useQuery({
    queryKey: ["company-features", activeCompanyId],
    queryFn: () => getCompanyFeatures({ data: { company_id: activeCompanyId } }).then((r) => r.data),
    staleTime: 60_000,
  })
  return {
    isEnabled: (key: string) => Boolean(data?.[key]),
    flags: data ?? {},
  }
}
```

### 5.3 `usePermissions`

```ts
export function usePermissions(module: string) {
  const { activeCompanyId } = useActiveContext()
  const { data } = useQuery({
    queryKey: ["permissions", activeCompanyId, module],
    queryFn: () => getMyPermissions({ data: { company_id: activeCompanyId, module } }).then((r) => r.data),
    staleTime: 5 * 60_000,
  })
  return {
    canCreate: data?.includes(`${module}.create`) ?? false,
    canUpdate: data?.includes(`${module}.update`) ?? false,
    canApprove: data?.includes(`${module}.approve`) ?? false,
    canDelete: data?.includes(`${module}.delete`) ?? false,
  }
}
```

### 5.4 `useTerminology`

```ts
export function useTerminology() {
  const { activeCompanyId } = useActiveContext()
  const { data } = useQuery({
    queryKey: ["terminology", activeCompanyId],
    queryFn: () => getTerminology({ data: { company_id: activeCompanyId } }).then((r) => r.data),
    staleTime: Infinity,    // ändras inte under sessionen
  })
  return (key: string, fallback?: string) => data?.[key] ?? fallback ?? key
}

// Användning:
const t = useTerminology()
return <h1>{t("ordination.title", "Ordination")}</h1>
// estetisk_injektion → "Ordination"
// tatuering → "Behandlingsprotokoll"
```

### 5.5 `useSubscriptionStatus`

```ts
export function useSubscriptionStatus() {
  const { activeCompanyId } = useActiveContext()
  const { data } = useQuery({
    queryKey: ["subscription", activeCompanyId],
    queryFn: () => getSubscriptionStatus({ data: { company_id: activeCompanyId } }).then((r) => r.data),
    staleTime: 30_000,
  })
  return {
    status: data?.status,
    writable: ["trialing", "active"].includes(data?.status ?? ""),
    trialEndsAt: data?.trial_ends_at,
  }
}
```

### 5.6 `useRealtimeChannel`

```ts
export function useRealtimeChannel(opts: {
  channel: string
  table: string
  filter?: string
  onChange: (payload: RealtimePostgresChangesPayload) => void
}) {
  useEffect(() => {
    const c = supabase
      .channel(opts.channel)
      .on("postgres_changes",
          { event: "*", schema: "public", table: opts.table, filter: opts.filter },
          opts.onChange)
      .subscribe()
    return () => { supabase.removeChannel(c) }
  }, [opts.channel, opts.table, opts.filter])
}
```

---

## 6. Tailwind v4 + design system

> **Branding (09 §6b, levererat i Fas 0):** v6.0 använder **forest-teal `oklch(0.42 0.06 175)`** som primärt brand-token, tentativt bekräftat av designer och accepterat som default pending Fas 5-konfirmering. Shadcn-token-**namnen** (`--primary`, `--background`, …) är oförändrade — bara **värdena** är bytta från slate till forest-teal-paletten. Se `docs/10 §4 + §14` och `docs/09 §6b`. Logo är fortfarande placeholder.

### 6.1 Setup

Tailwind v4 har **inte** `tailwind.config.js`. Token-konfiguration sker i `src/styles.css` via `@theme inline` + `:root`/`.dark`. **Filen heter `src/styles.css`** (direkt under `src/`) — inte `src/styles/app.css`.

```css
/* src/styles.css — forest-teal primär (tentativ), shadcn-token-namn intakta */
@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";

@theme inline {
  /* Shadcn-standard token-namn — alla shadcn-primitiver mappar automatiskt */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);

  /* CK healthcare-tokens (utöver shadcn-standard) */
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);

  /* Typografi (docs/10 §3) */
  --font-sans: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-serif: "Newsreader", "Source Serif 4", Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
}

:root {
  --radius: 0.625rem;
  /* Surfaces — warm off-whites */
  --background: oklch(0.985 0.005 80);
  --foreground: oklch(0.22 0.015 60);
  /* Brand — forest-teal */
  --primary: oklch(0.42 0.06 175);
  --primary-foreground: oklch(0.985 0.005 175);
  /* … fulla värden i src/styles.css … */
}
```

**Princip:** Shadcn-token-namnen (`--primary`, `--background`, ...) är oförändrade — alla 44 shadcn-primitiver fungerar utan modifikation. Värdena är forest-teal-palettens oklch-värden. För att byta brand-färg i framtiden räcker det att ändra `--primary` + `--primary-foreground` (och `--ring`). Litterala `#hex`/`rgb`/`oklch` i komponentfiler är **förbjudet** — använd alltid tokens.

### 6.2 Designprinciper

- **Lugn, klinisk, professionell** — inte färgglad SaaS-bling
- **Hög densitet** — kliniker hanterar mycket info, tabeller och listor måste bjuda upp till skanning
- **Status-färger konsistenta**: `success` (grön), `warning` (gul), `destructive` (röd), `info` (blå)
- **Genväg-tangenter** överallt där det går (Cmd+K, J/K för rad-navigering, R för rapportera avvikelse)
- **Inte tjocka skuggor** — diskreta borders + bg-shifts

---

## 7. shadcn/ui-uppsättning

Installeras via `bunx shadcn@latest add <component>`. **Komponenter ligger i `src/components/ui/`.**

Initialt set:
- `button`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`
- `dialog`, `sheet`, `popover`, `tooltip`, `dropdown-menu`, `command`
- `table`, `tabs`, `accordion`, `alert`, `badge`, `avatar`
- `form` (react-hook-form-integration)
- `toast` (sonner)
- `calendar`, `date-picker`
- `data-table` (TanStack Table-wrapper)

**Anpassningar:**
- Alla shadcn-komponenter granskas och anpassas till CK:s densitet (mindre padding, kompakt typografi)
- `data-table` får inbyggt stöd för selektion, sortering, paginering och CSV-export

---

## 8. Komponenttaxonomi (per modul)

Varje modul har samma struktur i `src/components/modules/<module>/`:

```
deviations/
├── DeviationList.tsx         # Tabellvy med filter
├── DeviationCard.tsx         # En rad / kort
├── DeviationDetail.tsx       # Detaljsida
├── DeviationForm.tsx         # Skapa/redigera (zod + react-hook-form)
├── DeviationStatusChip.tsx
├── DeviationTimeline.tsx     # Status-historik
├── DeviationFilters.tsx
└── _api.ts                   # Tunna wrappers för createServerFn-anrop
```

### 8.1 Routes mappar mot komponenter

```
src/routes/_app/deviations/index.tsx     →  <DeviationList />
src/routes/_app/deviations/$id.tsx       →  <DeviationDetail />
src/routes/_app/deviations/new.tsx       →  <DeviationForm mode="create" />
```

Routes innehåller **inga** affärslogik — bara loader + komponentmount.

---

## 9. Form-mönster (zod + react-hook-form)

**Samma zod-schema används både i `createServerFn` och i formuläret.** Schema bor i `src/lib/<module>.schemas.ts`:

```ts
// src/lib/deviations.schemas.ts
import { z } from "zod"

export const CreateDeviationSchema = z.object({
  company_id: z.string().uuid(),
  clinic_id: z.string().uuid(),
  category: z.enum(["hygiene", "medication", "treatment", "equipment", "other"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  title: z.string().min(3, "Minst 3 tecken").max(200),
  description: z.string().max(5000).optional(),
})

export type CreateDeviationInput = z.infer<typeof CreateDeviationSchema>
```

Importeras av både `deviations.functions.ts` (server) och `DeviationForm.tsx` (klient).

```tsx
const form = useForm<CreateDeviationInput>({
  resolver: zodResolver(CreateDeviationSchema),
  defaultValues: { ... },
})
```

### 9.1 `field_errors` från server

Om `createServerFn` returnerar `{ ok: false, error_code: "validation_failed", field_errors: { title: "Minst 3 tecken" } }` → frontend mappar via `form.setError(field, ...)`.

---

## 10. Realtime

Användsfall:
- Avvikelser — när en kollega rapporterar, dyker den upp i listan
- Ordinations — när consulting practitioner godkänner, syns det
- Notifieringar — central notification-tabell prenumereras på i topbar

**Inte** användas för:
- Audit logs — tunga, dedikerad sida
- Compliance score — uppdateras endast nightly
- Hela bolagets data — för stort scope

---

## 11. Felgrafer (error/loading/empty)

Varje listvy hanterar fyra tillstånd:

```tsx
function DeviationList({ initialData }) {
  const { data, isLoading, isError, error } = useQuery({ ..., initialData })

  if (isLoading) return <SkeletonTable rows={5} />
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />
  if (!data || data.length === 0) return <EmptyState
    icon={<AlertCircleIcon />}
    title="Inga avvikelser ännu"
    description="Rapportera den första för att börja bygga er avvikelsehistorik."
    action={<Button>Ny avvikelse</Button>}
  />
  return <DataTable data={data} columns={columns} />
}
```

`SkeletonTable`, `ErrorState`, `EmptyState` är delade komponenter i `src/components/app/states/`.

---

## 12. Onboarding-flöde

```
1. Skapa konto  →  2. Verifiera mail  →  3. Skapa bolag (org.nr, namn)  →
4. Välj bransch (industry_template)  →  5. Välj plan (trial default)  →
6. Signera PuB-avtal (click v6.0, BankID Fas 10)  →
7. Skapa första klinik  →  8. Bjud in medarbetare  →  9. Dashboard
```

Dashboard har gamifierad checklista:
- [ ] Skapa din första klinik
- [ ] Bjud in en medarbetare
- [ ] Ladda upp ett styrdokument (eller använd auto-seedade mallar)
- [ ] Rapportera en testavvikelse
- [ ] Konfigurera hygienschema

Progressbar visas tills 100%.

---

## 13. Command palette

Cmd+K / Ctrl+K öppnar global sökning (shadcn `command`):

- Senaste avvikelser, dokument, kunder
- Snabb-navigation till moduler
- Snabbåtgärder ("Rapportera avvikelse", "Skapa ordination")
- Filtrerat på behörigheter och feature flags
- Fuzzy matching

Sökindex byggs server-side via `createServerFn` `searchEverything({ query })` som UNIONar resultat från flera tabeller via RLS-filtrerad query.

---

## 14. Inspector mode

`v6.carekompass.se/inspect/<token>` är en **separat layout** utan sidebar/topbar — inspektörsläge.

- Token slås upp i `inspector_tokens` → giltig + scope (bolag/klinik) + giltighetstid
- Skapar en read-only session som inte kräver fullt konto
- UI:t är märkt med banner "Inspektörsläge — read-only — token utfärdad av <bolag> till <inspektör>"
- Alla SELECT-operationer loggas i `inspection_views`
- Inga mutations möjliga (RLS-policy + UI hide)
- Inspektören kan ladda ner audit-paket-PDF (kräver att bolaget har förgenererat ett, eller initierar generering på begäran)

Route: `src/routes/inspect.$token.tsx` — egen layout, ingen `_app`-wrapping.

---

## 15. Nyckelprinciper (sammanfattning)

- **Genererade typer**: `bunx supabase gen types typescript > src/integrations/supabase/types.ts` — aldrig manuella `as any`; filen är Lovable-generated och ska **inte** redigeras manuellt
- **Loaders för initial-load (SSR), Query för interaktivitet** — standardmönster, etableras Fas 0
- **Feature flag + permission + subscription** — tre lager av frontend-gate som speglas backend
- **Zod-schema delas mellan klient och server** — ett schema, en sanning
- **Realtime via TanStack Query invalidation** — inte direkt state-mutering
- **Ingen affärslogik i komponenter** — validering i zod, beslut i `createServerFn`, säkerhet i RLS
- **Defensiv rendering** — varje vy hanterar loading/error/empty/data
- **Konsistenta patterns** — varje modul följer samma CRUD-struktur (lista → detalj → formulär)
- **Filbaserad routing är sanning** — inga manuella route-trees, inga manuella App.tsx
- **`createServerFn` för CRUD, Edge Function för specialfall** — gränsen är dokumenterad (02 §8.1)
- **shadcn-komponenter granskas och anpassas** — inte rå default-styling
- **Tailwind v4 via `@theme inline` i CSS** — inte `tailwind.config.js`

---

*Slut på 03-frontend-guide. Vidare till 04-implementation-plan.md för faser, prompts och acceptanskriterier.*
