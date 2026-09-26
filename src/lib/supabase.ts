import { createClient } from "@supabase/supabase-js"
import { cookieStorage, clearAuthTokensFromLocalStorage } from "./cookie-storage"

export type Profile = {
  id: string
  /** Not readable through the API: the column is revoked for anon and authenticated. */
  email: string
  name: string
  university: string
  gender: string
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

/** Readable profile columns; see `PUBLIC_PROFILE_COLUMNS`. */
export type PublicProfile = Omit<Profile, "email">

export const PUBLIC_PROFILE_COLUMNS =
  "id, name, university, gender, bio, avatar_url, created_at, updated_at"

export type CompatibilityResponse = {
  id: string
  user_id: string
  /** Quiz answers keyed by habit, see `CompatibilityAnswers` in `@/lib/compatibility`. */
  answers: Record<string, string>
  sleep_schedule: string | null
  cleanliness_score: number | null
  social_habit: string | null
  study_preference: string | null
  updated_at: string
}

export type Message = {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}

export type RoomArrangement = "private" | "shared"

export type Room = {
  id: string
  owner_id: string
  name: string
  district: string
  street: string
  monthly_rent: number
  move_in_date: string
  lease_end_date: string
  arrangement: RoomArrangement
  member_count: number
  accepting_roommates: boolean
  /** Wizard extras (invitees, house rules, chores, utilities). */
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

/** A listing-safe view of a room, from the `list_open_rooms()` function. */
export type OpenRoom = {
  id: string
  owner_id: string
  owner_name: string | null
  name: string
  district: string
  monthly_rent: number
  move_in_date: string
  lease_end_date: string
  arrangement: RoomArrangement
  member_count: number
  open_spots: number
  guest_policy: string | null
  quiet_hours_start: string | null
  quiet_hours_end: string | null
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: {
          id: string
          email: string
          name: string
          university?: string
          gender?: string
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<{
          id: string
          email: string
          name: string
          university: string
          gender: string
          bio: string | null
          avatar_url: string | null
          updated_at: string
        }>
        Relationships: []
      }
      compatibility_responses: {
        Row: CompatibilityResponse
        Insert: {
          id?: string
          user_id: string
          answers: Record<string, string>
          sleep_schedule?: string | null
          cleanliness_score?: number | null
          social_habit?: string | null
          study_preference?: string | null
          updated_at?: string
        }
        Update: Partial<Omit<CompatibilityResponse, "id" | "user_id">>
        Relationships: []
      }
      messages: {
        Row: Message
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: Partial<{
          id: string
          sender_id: string
          receiver_id: string
          content: string
          read: boolean
          created_at: string
        }>
        Relationships: []
      }
      rooms: {
        Row: Room
        Insert: {
          id?: string
          /** Defaults to auth.uid() in the database. */
          owner_id?: string
          name: string
          district: string
          street?: string
          monthly_rent: number
          move_in_date: string
          lease_end_date: string
          arrangement?: RoomArrangement
          member_count: number
          accepting_roommates?: boolean
          settings?: Record<string, unknown>
        }
        Update: Partial<
          Omit<Room, "id" | "owner_id" | "created_at" | "updated_at">
        >
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      list_open_rooms: {
        Args: Record<string, never>
        Returns: OpenRoom[]
      }
    }
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || ""
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  ""

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("https://") &&
    !supabaseUrl.includes("your-project") &&
    !supabaseUrl.includes("placeholder") &&
    !supabaseAnonKey.includes("your-anon") &&
    !supabaseAnonKey.includes("placeholder")
)

// Fallback placeholder URL to prevent createClient throwing on instantiation during initial dev/preview
const validUrl = isSupabaseConfigured ? supabaseUrl : "https://placeholder.supabase.co"
const validKey = isSupabaseConfigured ? supabaseAnonKey : "placeholder-anon-key"

// Immediately purge any access tokens lingering in browser localStorage
clearAuthTokensFromLocalStorage()

export const supabase = createClient<Database>(validUrl, validKey, {
  auth: {
    persistSession: true,
    storage: cookieStorage,
    storageKey: "sb-auth-token",
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export function getSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and either VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY to .env.local."
    )
  }
  return supabase
}
