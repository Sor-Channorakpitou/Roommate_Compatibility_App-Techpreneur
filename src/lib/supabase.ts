import { createClient } from "@supabase/supabase-js"
import { cookieStorage, clearAuthTokensFromLocalStorage } from "./cookie-storage"

export type Profile = {
  id: string
  email: string
  name: string
  university: string
  gender: string
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type CompatibilityResponse = {
  id: string
  user_id: string
  answers: Record<string, unknown>
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
          answers?: Record<string, unknown>
          sleep_schedule?: string | null
          cleanliness_score?: number | null
          social_habit?: string | null
          study_preference?: string | null
          updated_at?: string
        }
        Update: Partial<{
          id: string
          user_id: string
          answers: Record<string, unknown>
          sleep_schedule: string | null
          cleanliness_score: number | null
          social_habit: string | null
          study_preference: string | null
          updated_at: string
        }>
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
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ""

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
