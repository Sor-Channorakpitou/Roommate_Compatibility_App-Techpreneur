import type { PostgrestError } from "@supabase/supabase-js"

import { ApiError, ensureSignedIn, NOT_CONFIGURED } from "@/lib/api-error"
import {
  parseAnswers,
  toResponseColumns,
  type CompatibilityAnswers,
} from "@/lib/compatibility"
import {
  isSupabaseConfigured,
  PUBLIC_PROFILE_COLUMNS,
  supabase,
  type OpenRoom,
  type PublicProfile,
} from "@/lib/supabase"

/** A student's public profile plus their quiz answers (empty if not taken). */
export type Student = PublicProfile & { answers: CompatibilityAnswers }

function toApiError(error: PostgrestError) {
  return new ApiError(error.message)
}

function assertConfigured() {
  if (!isSupabaseConfigured) throw new ApiError(NOT_CONFIGURED)
}

/**
 * Answers are only readable when signed in, so signed-out visitors get an
 * empty map rather than an error.
 */
async function answersByUser(userIds?: string[]) {
  let query = supabase.from("compatibility_responses").select("user_id, answers")
  if (userIds) query = query.in("user_id", userIds)
  const { data, error } = await query
  if (error) throw toApiError(error)
  return new Map(data.map((row) => [row.user_id, parseAnswers(row.answers)]))
}

export async function listStudents(): Promise<Student[]> {
  assertConfigured()
  const [profiles, answers] = await Promise.all([
    supabase
      .from("profiles")
      .select(PUBLIC_PROFILE_COLUMNS)
      .order("created_at", { ascending: false }),
    answersByUser(),
  ])
  if (profiles.error) throw toApiError(profiles.error)
  return profiles.data.map((profile) => ({
    ...profile,
    answers: answers.get(profile.id) ?? {},
  }))
}

export async function getStudents(ids: string[]): Promise<Student[]> {
  assertConfigured()
  if (ids.length === 0) return []
  const [profiles, answers] = await Promise.all([
    supabase.from("profiles").select(PUBLIC_PROFILE_COLUMNS).in("id", ids),
    answersByUser(ids),
  ])
  if (profiles.error) throw toApiError(profiles.error)
  return profiles.data.map((profile) => ({
    ...profile,
    answers: answers.get(profile.id) ?? {},
  }))
}

export async function getStudent(id: string): Promise<Student | null> {
  const [student] = await getStudents([id])
  return student ?? null
}

export async function getMyAnswers(): Promise<CompatibilityAnswers> {
  const userId = await ensureSignedIn()
  const { data, error } = await supabase
    .from("compatibility_responses")
    .select("answers")
    .eq("user_id", userId)
    .maybeSingle()
  if (error) throw toApiError(error)
  return parseAnswers(data?.answers)
}

/** One row per student: retaking the quiz replaces the previous answers. */
export async function saveMyAnswers(answers: Required<CompatibilityAnswers>) {
  const userId = await ensureSignedIn("Sign in to save your answers.")
  const { error } = await supabase
    .from("compatibility_responses")
    .upsert(
      {
        user_id: userId,
        ...toResponseColumns(answers),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
  if (error) throw toApiError(error)
}

export type ProfileUpdate = Pick<
  PublicProfile,
  "name" | "university" | "gender" | "bio"
>

export async function updateMyProfile(patch: ProfileUpdate) {
  const userId = await ensureSignedIn()
  const { error } = await supabase
    .from("profiles")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", userId)
  if (error) throw toApiError(error)
}

export type OpenRoomsResult = {
  rooms: OpenRoom[]
  /** False until supabase/migrations/20260927000000_public_room_listings.sql is applied. */
  isAvailable: boolean
}

export async function listOpenRooms(): Promise<OpenRoomsResult> {
  assertConfigured()
  const { data, error } = await supabase.rpc("list_open_rooms")
  if (error) {
    // PGRST202: the function isn't in the schema cache yet.
    if (error.code === "PGRST202") return { rooms: [], isAvailable: false }
    throw toApiError(error)
  }
  return { rooms: data, isAvailable: true }
}
