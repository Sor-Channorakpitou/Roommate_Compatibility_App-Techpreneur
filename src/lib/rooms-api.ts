import type { PostgrestError } from "@supabase/supabase-js"

import {
  ApiError,
  ensureSignedIn as ensureSession,
  getErrorMessage,
  isUnauthenticatedError,
} from "@/lib/api-error"
import { supabase, type Database, type Room } from "@/lib/supabase"

export { getErrorMessage, isUnauthenticatedError }

export type RoomInsert = Database["public"]["Tables"]["rooms"]["Insert"]
export type RoomUpdate = Database["public"]["Tables"]["rooms"]["Update"]

const NOT_SIGNED_IN = "You're not signed in. Sign in to save your room."

const ensureSignedIn = () => ensureSession(NOT_SIGNED_IN)

function toApiError(error: PostgrestError): ApiError {
  switch (error.code) {
    case "PGRST205": // table missing from the schema cache
      return new ApiError(
        "The rooms table doesn't exist yet. Apply supabase/migrations/20260926000000_create_rooms.sql in Supabase."
      )
    case "PGRST116": // .single() matched no row: gone, or hidden by RLS
      return new ApiError("That room no longer exists or isn't yours.")
    case "42501": // row level security rejected the request
      return new ApiError(NOT_SIGNED_IN, "unauthenticated")
    case "23514": // CHECK constraint
      return new ApiError(
        "Some room details are invalid. Check the rent, dates and member count."
      )
    default:
      return new ApiError(error.message)
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
  if (error) throw toApiError(error)
  return data
}

export async function createRoom(room: RoomInsert): Promise<Room> {
  await ensureSignedIn()
  const { data, error } = await supabase
    .from("rooms")
    .insert(room)
    .select()
    .single()
  if (error) throw toApiError(error)
  return data
}

export async function setAcceptingRoommates(
  id: string,
  acceptingRoommates: boolean
): Promise<Room> {
  return updateRoom(id, { accepting_roommates: acceptingRoommates })
}

export async function updateRoom(id: string, patch: RoomUpdate): Promise<Room> {
  await ensureSignedIn()
  const { data, error } = await supabase
    .from("rooms")
    .update(patch)
    .eq("id", id)
    .select()
    .single()
  if (error) throw toApiError(error)
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
  if (error) throw toApiError(error)
  // RLS turns a forbidden delete into a silent no-op, so confirm a row went.
  if (data.length === 0) {
    throw new ApiError("That room no longer exists or isn't yours.")
  }
}
