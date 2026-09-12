// Phase 8 §6 — typed result wrapper for every server action / mutation API
// route. Never throw raw Prisma/DB errors to the client; log server-side,
// return a generic safe message client-side.

export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function fail(error: string): ActionResult<never> {
  return { success: false, error };
}

export async function runAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return ok(data);
  } catch (err) {
    console.error("[action error]", err);
    const message = err instanceof Error && err.message.startsWith("Forbidden")
      ? err.message
      : "Something went wrong. Please try again.";
    return fail(message);
  }
}
