import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <main className="w-full max-w-md space-y-4 text-center">
        <h1 className="font-serif text-3xl text-foreground">Skapa konto</h1>
        <p className="text-sm text-muted-foreground">
          Registrering kommer i Fas 1 (multi-tenant + RBAC + onboarding).
        </p>
      </main>
    </div>
  );
}
