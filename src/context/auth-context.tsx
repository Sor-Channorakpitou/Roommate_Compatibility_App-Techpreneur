/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"

export type User = { id: string; name: string; email: string; university: string; gender: string }
type RegisterPayload = Omit<User, "id">
type AuthResult = { ok: boolean; user?: User; error?: string; needsEmailConfirmation?: boolean }
type AuthContextValue = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  register: (payload: RegisterPayload & { password: string }) => Promise<AuthResult>
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

function profileFromAuthUser(authUser: { id: string; email?: string; user_metadata: Record<string, unknown> }): User {
  return {
    id: authUser.id,
    name: String(authUser.user_metadata.name ?? "RoomieMatch member"),
    email: authUser.email ?? "",
    university: String(authUser.user_metadata.university ?? ""),
    gender: String(authUser.user_metadata.gender ?? "Other"),
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again."
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(isSupabaseConfigured)

  React.useEffect(() => {
    if (!isSupabaseConfigured) return
    const client = getSupabase()
    async function loadUser() {
      const { data } = await client.auth.getUser()
      setUser(data.user ? profileFromAuthUser(data.user) : null)
      setIsLoading(false)
    }
    void loadUser()
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? profileFromAuthUser(session.user) : null)
      setIsLoading(false)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const login = React.useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured) return { ok: false, error: "Supabase is not configured. Copy .env.example to .env.local first." }
    setIsLoading(true)
    try {
      const { data, error } = await getSupabase().auth.signInWithPassword({ email, password })
      if (error) return { ok: false, error: error.message }
      return data.user ? { ok: true, user: profileFromAuthUser(data.user) } : { ok: false, error: "No user was returned by Supabase." }
    } catch (error) { return { ok: false, error: errorMessage(error) } } finally { setIsLoading(false) }
  }, [])

  const register = React.useCallback(async ({ password, ...profile }: RegisterPayload & { password: string }): Promise<AuthResult> => {
    if (!isSupabaseConfigured) return { ok: false, error: "Supabase is not configured. Copy .env.example to .env.local first." }
    setIsLoading(true)
    try {
      const { data, error } = await getSupabase().auth.signUp({
        email: profile.email,
        password,
        options: { data: { name: profile.name, university: profile.university, gender: profile.gender } },
      })
      if (error) return { ok: false, error: error.message }
      if (!data.user) return { ok: false, error: "No user was returned by Supabase." }
      return { ok: true, user: profileFromAuthUser(data.user), needsEmailConfirmation: !data.session }
    } catch (error) {
      return { ok: false, error: errorMessage(error) }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = React.useCallback(async () => {
    if (isSupabaseConfigured) await getSupabase().auth.signOut()
  }, [])
  const value = React.useMemo(() => ({ user, isLoading, login, register, logout }), [user, isLoading, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (ctx === undefined) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
