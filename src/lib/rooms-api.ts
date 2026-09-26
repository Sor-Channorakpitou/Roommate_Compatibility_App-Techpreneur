import type { PostgrestError } from "@supabase/supabase-js"

import {
  isSupabaseConfigured,
  supabase,
  type Database,
  type Room,
} from "@/lib/supabase"

export type RoomInsert = Database["public"]["Tables"]["rooms"]["Insert"]

/** An error whose message is safe to show to the user as-is. */
class RoomsApiError extends Error {
  name = "RoomsApiError"
  /** "unauthenticated" means the fix is to sign in again. */
  readonly reason: "unauthenticated" | "other"

  constructor(message: string, reason: "unauthenticated" | "other" = "other") {
    super(message)
    this.reason = reason
  }
}

const NOT_SIGNED_IN = "You're not signed in. Sign in to save your room."

/**
 * Fails fast when Supabase has no session. Without one, requests run as the
 * anonymous role and RLS rejects them, even if the app still shows a user.
 */
async function ensureSignedIn() {
  if (!isSupabaseConfigured) {
    throw new RoomsApiError(
      "Supabase isn't connected. Add your keys to .env and restart the dev server."
    )
  }
  const { data } = await supabase.auth.getSession()
  if (!data.session) throw new RoomsApiError(NOT_SIGNED_IN, "unauthenticated")
}

export function isUnauthenticatedError(error: unknown) {
  return error instanceof RoomsApiError && error.reason === "unauthenticated"
}

function toRoomsApiError(error: PostgrestError): RoomsApiError {
  switch (error.code) {
    case "PGRST205": // table missing from the schema cache
      return new RoomsApiError(
        "The rooms table doesn't exist yet. Apply supabase/migrations/20260926000000_create_rooms.sql in Supabase."
      )
    case "PGRST116": // .single() matched no row: gone, or hidden by RLS
      return new RoomsApiError("That room no longer exists or isn't yours.")
    case "42501": // row level security rejected the request
      return new RoomsApiError(NOT_SIGNED_IN, "unauthenticated")
    case "23514": // CHECK constraint
      return new RoomsApiError(
        "Some room details are invalid. Check the rent, dates and member count."
      )
    default:
      return new RoomsApiError(error.message)
  }
}

export async function listMyRooms(ownerId: string): Promise<Room[]> {
  await ensureSignedIn()
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    // RLS already limits rows to the owner; the filter keeps the query explicit.
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
  if (error) throw toRoomsApiError(error)
  return data
}

export async function createRoom(room: RoomInsert): Promise<Room> {
  await ensureSignedIn()
  const { data, error } = await supabase
    .from("rooms")
    .insert(room)
    .select()
    .single()
  if (error) throw toRoomsApiError(error)
  return data
}

export async function setAcceptingRoommates(
  id: string,
  acceptingRoommates: boolean
): Promise<Room> {
  await ensureSignedIn()
  const { data, error } = await supabase
    .from("rooms")
    .update({ accepting_roommates: acceptingRoommates })
    .eq("id", id)
    .select()
    .single()
  if (error) throw toRoomsApiError(error)
  return data
}

export async function deleteRoom(id: string): Promise<void> {
  await ensureSignedIn()
  const { data, error } = await supabase
    .from("rooms")
    .delete()
    // Always scope deletes to a single row.
    .eq("id", id)
    .select("id")
  if (error) throw toRoomsApiError(error)
  // RLS turns a forbidden delete into a silent no-op, so confirm a row went.
  if (data.length === 0) {
    throw new RoomsApiError("That room no longer exists or isn't yours.")
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof RoomsApiError) return error.message
  if (error instanceof TypeError) {
    return "Can't reach the server. Check your connection and try again."
  }
  return "Something went wrong. Please try again."
}
