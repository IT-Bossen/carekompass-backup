import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/accept-invite/$token")({
  component: AcceptInvitePage,
});

function AcceptInvitePage() {
  const { token } = Route.useParams();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <main className="w-full max-w-md space-y-4 text-center">
        <h1 className="font-serif text-3xl text-foreground">Acceptera inbjudan</h1>
        <p className="text-sm text-muted-foreground">
          Inbjudan-flödet kommer i Fas 1.
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          <span className="sr-only">Inbjudningskod: </span>
          token: {token}
        </p>
      </main>
    </div>
  );
}
