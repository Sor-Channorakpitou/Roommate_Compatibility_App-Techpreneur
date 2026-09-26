import { createClient } from "@supabase/supabase-js"
import { cookieStorage, clearAuthTokensFromLocalStorage } from "./cookie-storage"

export type Profile = {
  id: string
  email: string
  name: string
  university: string
  gender: string
  created_at: string
  housing_preferences: Record<string, unknown> | null
}

export type CompatibilityResponse = {
  id: number
  user_id: string
  responses: Array<Record<string, unknown>>
  completed_at: string
}

export type Message = {
  id: string | number
  interest_id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}

export type ListingRow = {
  id: string
  type: "roommate" | "place" | "has_room"
  badge_label: string
  name: string
  age: number | null
  match_score: number | null
  price_min: number
  price_max: number
  subtitle: string
  location: string
  available_date: string
  quote: string
  tags: string[]
  housing_type: string
  area_category: string
  lifestyle_rhythms: string[]
  move_in_horizon: string
  bio: string | null
  habit_comparisons: Array<Record<string, unknown>>
  breakdown: Array<Record<string, unknown>>
  owner_id: string | null
  owner_name: string | null
  is_published: boolean
  created_at: string
}

export type ListingInterest = {
  id: string
  listing_id: string
  interested_user_id: string
  owner_id: string
  interested_name: string
  owner_name: string
  listing_name: string
  listing_location: string
  price_min: number
  price_max: number
  available_date: string
  status: "pending" | "accepted" | "declined"
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
          created_at?: string
          housing_preferences?: Record<string, unknown> | null
        }
        Update: Partial<{
          id: string
          email: string
          name: string
          university: string
          gender: string
          housing_preferences: Record<string, unknown> | null
        }>
        Relationships: []
      }
      compatibility_responses: {
        Row: CompatibilityResponse
        Insert: {
          id?: number
          user_id: string
          responses: Array<Record<string, unknown>>
          completed_at?: string
        }
        Update: Partial<{
          id: number
          user_id: string
          responses: Array<Record<string, unknown>>
          completed_at: string
        }>
        Relationships: []
      }
      roommate_listings: {
        Row: ListingRow
        Insert: {
          id: string
          type: ListingRow["type"]
          badge_label: string
          name: string
          age?: number | null
          match_score?: number | null
          price_min: number
          price_max: number
          subtitle: string
          location: string
          available_date: string
          quote: string
          tags?: string[]
          housing_type: string
          area_category: string
          lifestyle_rhythms?: string[]
          move_in_horizon: string
          bio?: string | null
          habit_comparisons?: Array<Record<string, unknown>>
          breakdown?: Array<Record<string, unknown>>
          owner_id: string
          owner_name?: string | null
          is_published?: boolean
          created_at?: string
        }
        Update: Partial<Omit<ListingRow, "id" | "created_at">>
        Relationships: []
      }
      messages: {
        Row: Message
        Insert: {
          id?: string | number
          interest_id: string
          sender_id: string
          receiver_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: Partial<{
          id: string | number
          interest_id: string
          sender_id: string
          receiver_id: string
          content: string
          read: boolean
          created_at: string
        }>
        Relationships: []
      }
      listing_interests: {
        Row: ListingInterest
        Insert: Omit<ListingInterest, "id" | "created_at" | "status"> & { id?: string; created_at?: string; status?: ListingInterest["status"] }
        Update: Partial<ListingInterest>
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
      get_listing_compatibility_scores: {
        Args: Record<PropertyKey, never>
        Returns: Array<{ listing_id: string; match_score: number }>
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
