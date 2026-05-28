import { createFileRoute } from "@tanstack/react-router";

/**
 * Authed dashboard — Fas 0 placeholder.
 *
 * Anchorar `_app.tsx`-layouten så TanStack router-generator
 * inte träffar en empty-pathless-layout-konflikt mot index.tsx.
 * Fas 1 ersätter denna med riktig dashboard (compliance-score,
 * notifikationer, recent activity per docs/03 §12).
 *
 * Alla strängar här ska gå genom t() i Fas 1 (docs/06 §9).
 */
export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-2xl text-foreground">Översikt</h1>
      <p className="text-sm text-muted-foreground">
        Dashboard kommer i Fas 1 (compliance-score, notifikationer, senaste aktivitet).
      </p>
    </div>
  );
}
