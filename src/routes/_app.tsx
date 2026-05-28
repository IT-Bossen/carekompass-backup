import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Authed layout-route — skelett i Fas 0.
 *
 * Fas 1 ersätter dummy-context med getServerSession() från
 * src/lib/session.functions.ts och implementerar:
 *  - beforeLoad: getServerSession() + redirect till /login om ej inloggad
 *  - AppShell wrapper (Sidebar + Topbar + ClinicSwitcher)
 *  - context: { profileId, tenantId, activeCompanyId, activeClinicId }
 *
 * I Fas 0 returneras dummy-context så barn-routes kan börja byggas
 * och TypeScript-kontraktet i useActiveContext (Fas 1) är förberett.
 */
export const Route = createFileRoute("/_app")({
  // TODO(Fas 1): Ersätt dummy-context med getServerSession() från
  // src/lib/session.functions.ts. Lägg till redirect till /login om ej inloggad.
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
