import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/inspect/$token")({
  component: InspectPage,
});

function InspectPage() {
  const { token } = Route.useParams();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Warm amber banner — inspector mode marker (docs/10 §4) */}
      {/* id+aria-describedby säkerställer att AT exponerar bannern i läsordningen (a11y-reviewer Item 1) */}
      <div
        id="inspector-mode-banner"
        role="status"
        aria-live="polite"
        className="border-b border-warning/40 bg-warning/15 px-4 py-3 text-center text-sm font-medium text-foreground"
      >
        Inspektörsläge — endast läsbehörighet
      </div>
      <main
        aria-describedby="inspector-mode-banner"
        className="flex flex-1 items-center justify-center px-4"
      >
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="font-serif text-3xl text-foreground">Inspektörsläge</h1>
          <p className="text-sm text-muted-foreground">Inspector mode kommer i Fas 5.</p>
          <p className="font-mono text-xs text-muted-foreground">
            <span className="sr-only">Inspektionskod: </span>
            token: {token}
          </p>
        </div>
      </main>
    </div>
  );
}
