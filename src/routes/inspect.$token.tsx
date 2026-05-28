import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/inspect/$token")({
  component: InspectPage,
});

function InspectPage() {
  const { token } = Route.useParams();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Warm amber banner — inspector mode marker (docs/10 §4) */}
      <div
        role="status"
        aria-live="polite"
        className="border-b border-warning/40 bg-warning/15 px-4 py-3 text-center text-sm font-medium text-foreground"
      >
        Inspektörsläge — endast läsbehörighet
      </div>
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="font-serif text-3xl text-foreground">Inspektörsläge</h1>
          <p className="text-sm text-muted-foreground">
            Inspector mode kommer i Fas 5.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            <span className="sr-only">Inspektionskod: </span>
            token: {token}
          </p>
        </div>
      </main>
    </div>
  );
}
