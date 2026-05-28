// SSR-bevis-route. Demonstrerar det kanoniska Fas-0-mönstret:
//   1. Loader anropar createServerFn → data fetchas server-side
//   2. Komponent får data via Route.useLoaderData()
//   3. useQuery tar över med samma queryKey + initialData
//
// Detta är mönstret alla moduler ska följa (docs/03 §3).
// Alla strängar här ska gå genom t() i Fas 1 (docs/06 §9).

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { getHealth, type HealthPayload } from "@/lib/health.functions";

export const Route = createFileRoute("/health")({
  loader: async () => {
    return await getHealth();
  },
  component: HealthPage,
});

function HealthPage() {
  const initial = Route.useLoaderData();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const r = await getHealth();
      if (!r.ok) {
        throw new Error(r.error_code ?? r.error);
      }
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
      <main className="w-full max-w-lg space-y-6 rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm">
        <header className="space-y-1">
          <h1 className="font-serif text-2xl text-foreground">Hälsokontroll</h1>
          <p className="text-sm text-muted-foreground">
            SSR + createServerFn + TanStack Query — fungerar.
          </p>
        </header>
        <HealthDetails data={data} />
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          aria-label={isFetching ? "Hämtar hälsodata" : "Uppdatera hälsodata"}
        >
          {isFetching ? "Hämtar…" : "Uppdatera"}
        </Button>
      </main>
    </div>
  );
}

function HealthDetails({ data }: { data: HealthPayload }) {
  return (
    <dl className="space-y-3 text-sm">
      <Row label="Server-timestamp" value={data.timestamp} mono />
      <Row label="Miljö" value={data.env} />
      <Row label="Uptime" value={`${data.uptime_seconds} s`} mono />
    </dl>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono text-xs text-foreground" : "text-foreground"}>{value}</dd>
    </div>
  );
}
