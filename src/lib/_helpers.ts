// Hjälpare som används av alla createServerFn. Wrappar Lovable-generated
// auth-middleware för att överleva regenerering.
//
// Fas 0: ctx = { supabase, userId, claims, requestId }.
// Fas 1 utvidgar till { ..., tenantId, profileId } när profiles-tabell + helpers finns.

import type { SupabaseClient } from "@supabase/supabase-js";

import { requireSupabaseAuth as baseRequireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

// ----- ApiResult -----
// JsonValue används istället för `unknown` i meta-fältet eftersom TanStack Start
// validerar att server-fn returvärden är JSON-serializable vid compile-time —
// `unknown` accepteras inte. JsonValue är ekvivalent uttrycks-mässigt men typsäker.

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type ApiResult<T> =
  | {
      ok: true;
      data: T;
      request_id: string;
      meta?: Record<string, JsonValue>;
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
//
// Konsumtionsmönster:
//   .middleware([requireSupabaseAuth])
// Context (supabase, userId, claims) injiceras till handler via `context`-param.
export const requireSupabaseAuth = baseRequireSupabaseAuth;

// ----- AuthedCtx -----
// Illustrativ Fas 0-shape. Faktisk context-form härleds från middleware:n vid
// .handler-anrop; denna typ används primärt av Fas 1-helpers (requirePermission,
// requireWritableSubscription, auditLog) som tar emot ctx som första-argument.
export interface AuthedCtx {
  supabase: SupabaseClient<Database>;
  userId: string;
  claims: Record<string, unknown>;
  requestId: string;
}

// ----- createApiHandler -----
// Wrappar handler-logiken så att alla createServerFn returnerar ApiResult och
// aldrig kastar till klienten. Kastade ForbiddenError/ValidationError/etc.
// mappas till maskinläsbar error_code som translateError() (Fas 1) använder.

export function createApiHandler<T>(fn: () => Promise<T>): () => Promise<ApiResult<T>> {
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
        return {
          ok: false,
          error: err.message,
          error_code: "subscription_read_only",
          request_id,
        };
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

export async function requirePermission(
  _ctx: AuthedCtx,
  permission: string,
  _companyId: string,
): Promise<void> {
  throw new ForbiddenError(
    `requirePermission(${permission}) called in Fas 0 — no permissions schema yet (lands in Fas 1).`,
  );
}

// ----- requireWritableSubscription (skelett, full impl. i Fas 1) -----
// VARNING: Stub kastar SubscriptionReadOnlyError i Fas 0. Ersätt med riktig
// company_modules + subscription_status-kontroll innan Fas 1-write-paths går live,
// annars failar samtliga writes.
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
