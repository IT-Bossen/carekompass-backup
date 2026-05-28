// Public health-check server function. Bevisar createServerFn + ApiResult-mönstret.
// Ingen requireSupabaseAuth — endpoint är publik (SSR-bevis, inte affärs-data).
//
// Mönstret som demonstreras:
// 1. createServerFn skapas i .functions.ts
// 2. Logiken wrappas i createApiHandler -> returnerar ApiResult<T>
// 3. Route-loader anropar den, komponent får data via Route.useLoaderData()
// 4. TanStack Query tar över med samma queryKey + initialData
//
// Undantaget: getHealth är publikt — ingen requireSupabaseAuth-middleware. Detta är
// den enda createServerFn i Fas 0 utan auth (SSR-bevis, inte affärs-data). Alla
// framtida createServerFn i Fas 1+ är middleware-guarded by default; det här mönstret
// kopieras endast för analoga publika endpoints (jfr bankid-callback / send-contact-email
// i docs/07 §5).

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
