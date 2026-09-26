/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import type { User as SupabaseAuthUser } from "@supabase/supabase-js"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"
import { clearAuthTokensFromLocalStorage } from "@/lib/cookie-storage"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type User = {
  id: string
  name: string
  email: string
  university: string
  gender: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  university: string
  gender: string
}

export type AuthResult = {
  ok: boolean
  user?: User
  error?: string
  requiresEmailVerification?: boolean
  message?: string
}

type AuthContextValue = {
  user: User | null
  /** True while initially verifying existing session with Supabase on app startup */
  isLoading: boolean
  /** True when a login or register request is currently in progress */
  isSubmitting: boolean
  isSupabaseConfigured: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  register: (payload: RegisterPayload) => Promise<AuthResult>
  logout: () => Promise<void>
}

// ---------------------------------------------------------------------------
// Error Formatting Helper
// ---------------------------------------------------------------------------

export function formatAuthError(error: unknown): string {
  if (!error) return "An unexpected error occurred. Please try again."

  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : (error as { message?: string }).message || String(error)

  const lower = message.toLowerCase()

  if (lower.includes("invalid login credentials")) {
    return "Invalid email or password. Please verify your credentials and try again."
  }
  if (lower.includes("email not confirmed")) {
    return "Your email address has not been confirmed. Please check your inbox for the verification link."
  }
  if (
    lower.includes("user already registered") ||
    lower.includes("already registered") ||
    lower.includes("user already exists")
  ) {
    return "An account with this email already exists. Please sign in instead."
  }
  if (lower.includes("password should be at least")) {
    return "Password must be at least 6 characters long."
  }
  if (lower.includes("signup requires a valid password")) {
    return "Please provide a valid password."
  }
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many attempts. Please wait a minute and try again."
  }
  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("fetch failed")
  ) {
    return "Unable to connect to Supabase. Please check your network connection or verify your Supabase project status."
  }

  return message
}

// ---------------------------------------------------------------------------
// Supabase User Mapping Helper
// ---------------------------------------------------------------------------

async function mapSupabaseUser(authUser: SupabaseAuthUser): Promise<User> {
  const metadata = authUser.user_metadata || {}

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, name, email, university, gender")
      .eq("id", authUser.id)
      .maybeSingle()

    if (!error && profile) {
      return {
        id: profile.id,
        email: profile.email || authUser.email || "",
        name: profile.name || metadata.name || "User",
        university: profile.university || metadata.university || "CADT",
        gender: profile.gender || metadata.gender || "Other",
      }
    }
  } catch (err) {
    console.warn("[RoomieMatch] Could not query profiles table, falling back to metadata:", err)
  }

  return {
    id: authUser.id,
    email: authUser.email || "",
    name: metadata.name || authUser.email?.split("@")[0] || "User",
    university: metadata.university || "CADT",
    gender: metadata.gender || "Other",
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Supabase is the single source of truth: no custom token / user storage in localStorage
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(isSupabaseConfigured)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  // Clean up any legacy manual session tokens left from older versions
  React.useEffect(() => {
    try {
      localStorage.removeItem("roomiematch_session")
      localStorage.removeItem("roomiematch_users")
      clearAuthTokensFromLocalStorage()
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [])

  // Initialize Supabase session & subscription
  React.useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn(
        "[RoomieMatch] Supabase credentials not found or invalid. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
      )
      return
    }

    let isMounted = true

    async function initSession() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("[RoomieMatch] Supabase getSession error:", error.message)
          if (isMounted) setUser(null)
          return
        }

        if (session?.user && isMounted) {
          const appUser = await mapSupabaseUser(session.user)
          if (isMounted) setUser(appUser)
        } else if (isMounted) {
          setUser(null)
        }
      } catch (err) {
        console.error("[RoomieMatch] Unexpected error retrieving Supabase session:", err)
        if (isMounted) setUser(null)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    initSession()

    // Listen to real-time auth state events directly from Supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const appUser = await mapSupabaseUser(session.user)
        if (isMounted) setUser(appUser)
      } else {
        if (isMounted) setUser(null)
      }

      if (event === "SIGNED_OUT") {
        if (isMounted) setUser(null)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Login handler using Supabase as source of truth
  const login = React.useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!isSupabaseConfigured) {
        return {
          ok: false,
          error:
            "Supabase is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.",
        }
      }

      setIsSubmitting(true)
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (error) {
          return { ok: false, error: formatAuthError(error) }
        }

        if (!data.user) {
          return {
            ok: false,
            error: "Authentication failed. No user was returned by Supabase.",
          }
        }

        const appUser = await mapSupabaseUser(data.user)
        setUser(appUser)
        return { ok: true, user: appUser }
      } catch (err) {
        return {
          ok: false,
          error: formatAuthError(err),
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    []
  )

  // Register handler using Supabase as source of truth
  const register = React.useCallback(
    async (payload: RegisterPayload): Promise<AuthResult> => {
      if (!isSupabaseConfigured) {
        return {
          ok: false,
          error:
            "Supabase is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.",
        }
      }

      setIsSubmitting(true)
      try {
        const cleanEmail = payload.email.trim()
        const cleanName = payload.name.trim()

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: payload.password,
          options: {
            data: {
              name: cleanName,
              university: payload.university,
              gender: payload.gender,
            },
          },
        })

        if (error) {
          return { ok: false, error: formatAuthError(error) }
        }

        if (!data.user) {
          return {
            ok: false,
            error: "Registration failed. No user created by Supabase.",
          }
        }

        // Supabase identity check: if identities is an empty array, email is already registered
        if (Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          return {
            ok: false,
            error: "An account with this email already exists. Please sign in instead.",
          }
        }

        const appUser: User = {
          id: data.user.id,
          email: cleanEmail,
          name: cleanName,
          university: payload.university,
          gender: payload.gender,
        }

        // Check if email confirmation is required (session is null)
        const requiresVerification = !data.session

        // If session exists right away, upsert profile
        if (data.session) {
          try {
            await supabase.from("profiles").upsert({
              id: data.user.id,
              email: appUser.email,
              name: appUser.name,
              university: appUser.university,
              gender: appUser.gender,
            })
          } catch (profileErr) {
            console.warn("[RoomieMatch] Note: Profile creation via client upsert skipped/handled by DB trigger:", profileErr)
          }

          setUser(appUser)
        }

        return {
          ok: true,
          user: appUser,
          requiresEmailVerification: requiresVerification,
          message: requiresVerification
            ? "Account created successfully! Please check your email inbox to verify your account before logging in."
            : undefined,
        }
      } catch (err) {
        return {
          ok: false,
          error: formatAuthError(err),
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    []
  )

  // Logout handler using Supabase
  const logout = React.useCallback(async () => {
    setIsSubmitting(true)
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error("[RoomieMatch] Error during Supabase signOut:", error.message)
        }
      }
    } catch (err) {
      console.error("[RoomieMatch] Unexpected error signing out:", err)
    } finally {
      setUser(null)
      setIsSubmitting(false)
    }
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isSubmitting,
      isSupabaseConfigured,
      login,
      register,
      logout,
    }),
    [user, isLoading, isSubmitting, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}

