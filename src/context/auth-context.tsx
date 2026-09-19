/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

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

type RegisterPayload = {
  name: string
  email: string
  password: string
  university: string
  gender: string
}

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; user?: User; error?: string }>
  register: (payload: RegisterPayload) => Promise<{ ok: boolean; user?: User; error?: string }>
  logout: () => void
}

// ---------------------------------------------------------------------------
// Storage helpers
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

function getSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(user: User | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

/** Simulate a backend round-trip */
function fakeDelay(ms = 800) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function generateId() {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(getSession)
  const [isLoading, setIsLoading] = React.useState(false)

  // Keep localStorage in sync
  React.useEffect(() => {
    saveSession(user)
  }, [user])

  const login = React.useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; user?: User; error?: string }> => {
      setIsLoading(true)
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

  const register = React.useCallback(
    async (payload: RegisterPayload): Promise<{ ok: boolean; user?: User; error?: string }> => {
      setIsLoading(true)
      await fakeDelay(1000)
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
        id: generateId(),
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

  const logout = React.useCallback(() => {
    setUser(null)
  }, [])

  const value = React.useMemo(
    () => ({ user, isLoading, login, register, logout }),
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
