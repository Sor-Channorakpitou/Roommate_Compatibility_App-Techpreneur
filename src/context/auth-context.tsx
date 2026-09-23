/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import type { User as SupabaseAuthUser } from "@supabase/supabase-js"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"

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

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isSupabaseConfigured: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; user?: User; error?: string }>
  register: (payload: RegisterPayload) => Promise<{ ok: boolean; user?: User; error?: string }>
  logout: () => Promise<void> | void
}

// ---------------------------------------------------------------------------
// LocalStorage Fallback Helpers (used when Supabase is not configured)
// ---------------------------------------------------------------------------

const USERS_KEY = "roomiematch_users"
const SESSION_KEY = "roomiematch_session"

type StoredUser = User & { password: string }

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  } catch {
    return []
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getStoredSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveStoredSession(user: User | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

function fakeDelay(ms = 600) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function generateLocalId() {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// ---------------------------------------------------------------------------
// Supabase User Mapping Helper
// ---------------------------------------------------------------------------

async function mapSupabaseUser(authUser: SupabaseAuthUser): Promise<User> {
  const metadata = authUser.user_metadata || {}

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle()

    if (profile) {
      return {
        id: profile.id,
        email: profile.email || authUser.email || "",
        name: profile.name || metadata.name || "User",
        university: profile.university || metadata.university || "CADT",
        gender: profile.gender || metadata.gender || "Other",
      }
    }
  } catch {
    // If profiles table is still provisioning or RLS is configuring, fallback to user_metadata
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
  const [user, setUser] = React.useState<User | null>(() => {
    return !isSupabaseConfigured ? getStoredSession() : null
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(isSupabaseConfigured)

  // Initialize Supabase session & listener if configured
  React.useEffect(() => {
    if (!isSupabaseConfigured) {
      console.info(
        "[RoomieMatch] Running in local demo mode. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to activate Supabase."
      )
      return
    }

    let isMounted = true

    async function initSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user && isMounted) {
          const appUser = await mapSupabaseUser(session.user)
          if (isMounted) setUser(appUser)
        }
      } catch (err) {
        console.error("[RoomieMatch] Error retrieving Supabase session:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    initSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const appUser = await mapSupabaseUser(session.user)
        if (isMounted) setUser(appUser)
      } else {
        if (isMounted) setUser(null)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Sync session to localStorage in mock mode
  React.useEffect(() => {
    if (!isSupabaseConfigured) {
      saveStoredSession(user)
    }
  }, [user])

  // Login handler
  const login = React.useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ ok: boolean; user?: User; error?: string }> => {
      setIsLoading(true)

      // 1. Supabase Mode
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          })

          if (error) {
            setIsLoading(false)
            return { ok: false, error: error.message }
          }

          if (!data.user) {
            setIsLoading(false)
            return { ok: false, error: "Authentication failed. No user returned." }
          }

          const appUser = await mapSupabaseUser(data.user)
          setUser(appUser)
          setIsLoading(false)
          return { ok: true, user: appUser }
        } catch (err) {
          setIsLoading(false)
          return {
            ok: false,
            error: err instanceof Error ? err.message : "Unexpected error during sign in.",
          }
        }
      }

      // 2. Local Fallback Mode
      await fakeDelay()
      const users = getStoredUsers()
      const match = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      )
      setIsLoading(false)
      if (!match) return { ok: false, error: "Invalid email or password." }
      const { password: _, ...safeUser } = match
      setUser(safeUser)
      return { ok: true, user: safeUser }
    },
    []
  )

  // Register handler
  const register = React.useCallback(
    async (
      payload: RegisterPayload
    ): Promise<{ ok: boolean; user?: User; error?: string }> => {
      setIsLoading(true)

      // 1. Supabase Mode
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: payload.email.trim(),
            password: payload.password,
            options: {
              data: {
                name: payload.name.trim(),
                university: payload.university,
                gender: payload.gender,
              },
            },
          })

          if (error) {
            setIsLoading(false)
            return { ok: false, error: error.message }
          }

          if (!data.user) {
            setIsLoading(false)
            return { ok: false, error: "Registration failed. No user created." }
          }

          const appUser: User = {
            id: data.user.id,
            email: payload.email.trim(),
            name: payload.name.trim(),
            university: payload.university,
            gender: payload.gender,
          }

          // Ensure profile entry exists
          try {
            await supabase.from("profiles").upsert({
              id: data.user.id,
              email: appUser.email,
              name: appUser.name,
              university: appUser.university,
              gender: appUser.gender,
            })
          } catch {
            // Profile may be handled by PostgreSQL database trigger
          }

          setUser(appUser)
          setIsLoading(false)
          return { ok: true, user: appUser }
        } catch (err) {
          setIsLoading(false)
          return {
            ok: false,
            error: err instanceof Error ? err.message : "Unexpected registration error.",
          }
        }
      }

      // 2. Local Fallback Mode
      await fakeDelay(800)
      const users = getStoredUsers()
      if (
        users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())
      ) {
        setIsLoading(false)
        return {
          ok: false,
          error: "An account with this email already exists.",
        }
      }
      const newUser: StoredUser = {
        id: generateLocalId(),
        name: payload.name,
        email: payload.email,
        password: payload.password,
        university: payload.university,
        gender: payload.gender,
      }
      saveStoredUsers([...users, newUser])
      const { password: _, ...safeUser } = newUser
      setUser(safeUser)
      setIsLoading(false)
      return { ok: true, user: safeUser }
    },
    []
  )

  // Logout handler
  const logout = React.useCallback(async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut()
      } catch (err) {
        console.error("[RoomieMatch] Error signing out:", err)
      }
    }
    setUser(null)
  }, [])

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      isSupabaseConfigured,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
