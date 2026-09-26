import { isSupabaseConfigured, supabase } from "@/lib/supabase"

/** An error whose message is safe to show to the user as-is. */
export class ApiError extends Error {
  name = "ApiError"
  /** "unauthenticated" means the fix is to sign in again. */
  readonly reason: "unauthenticated" | "other"

  constructor(message: string, reason: "unauthenticated" | "other" = "other") {
    super(message)
    this.reason = reason
  }
}

export const NOT_CONFIGURED =
  "Supabase isn't connected. Add your keys to .env and restart the dev server."

/**
 * Fails fast when Supabase has no session. Without one, requests run as the
 * anonymous role and RLS rejects them, even if the app still shows a user.
 */
export async function ensureSignedIn(message = "You're not signed in.") {
  if (!isSupabaseConfigured) throw new ApiError(NOT_CONFIGURED)
  const { data } = await supabase.auth.getSession()
  if (!data.session) throw new ApiError(message, "unauthenticated")
  return data.session.user.id
}

export function isUnauthenticatedError(error: unknown) {
  return error instanceof ApiError && error.reason === "unauthenticated"
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message
  if (error instanceof TypeError) {
    return "Can't reach the server. Check your connection and try again."
  }
  return "Something went wrong. Please try again."
}
