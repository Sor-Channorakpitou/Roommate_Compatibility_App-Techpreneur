import type { SupportedStorage } from "@supabase/supabase-js"

/**
 * Cookie storage adapter for Supabase Client.
 * Replaces localStorage with browser cookies, including chunking support
 * to prevent exceeding individual cookie size limits (4KB).
 */

const CHUNK_SIZE = 3180

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const nameEQ = encodeURIComponent(name) + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) {
      try {
        return decodeURIComponent(c.substring(nameEQ.length, c.length))
      } catch {
        return c.substring(nameEQ.length, c.length)
      }
    }
  }
  return null
}

function setCookie(name: string, value: string, maxAgeDays = 30): void {
  if (typeof document === "undefined") return
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:"
  const secureFlag = isSecure ? "; Secure" : ""
  const maxAge = maxAgeDays * 24 * 60 * 60
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`
}

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:"
  const secureFlag = isSecure ? "; Secure" : ""
  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secureFlag}`
}

/**
 * SupportedStorage implementation backed by document.cookie with chunking support.
 */
export const cookieStorage: SupportedStorage = {
  getItem: (key: string): string | null => {
    if (typeof document === "undefined") return null

    // 1. Check single un-chunked cookie
    const single = getCookie(key)
    if (single !== null) {
      return single
    }

    // 2. Check chunked cookies: key.0, key.1, etc.
    let index = 0
    let combined = ""
    while (true) {
      const chunk = getCookie(`${key}.${index}`)
      if (chunk === null) break
      combined += chunk
      index++
    }

    return combined.length > 0 ? combined : null
  },

  setItem: (key: string, value: string): void => {
    if (typeof document === "undefined") return

    // If small enough, store directly in a single cookie
    if (value.length <= CHUNK_SIZE) {
      setCookie(key, value)
      // Clean up any older chunks
      let i = 0
      while (getCookie(`${key}.${i}`) !== null) {
        deleteCookie(`${key}.${i}`)
        i++
      }
      return
    }

    // Otherwise split into multiple chunks
    deleteCookie(key)
    const chunks = Math.ceil(value.length / CHUNK_SIZE)
    for (let i = 0; i < chunks; i++) {
      const chunkVal = value.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
      setCookie(`${key}.${i}`, chunkVal)
    }

    // Clean up any extra leftover chunks from previous longer values
    let i = chunks
    while (getCookie(`${key}.${i}`) !== null) {
      deleteCookie(`${key}.${i}`)
      i++
    }
  },

  removeItem: (key: string): void => {
    if (typeof document === "undefined") return
    deleteCookie(key)
    let i = 0
    while (getCookie(`${key}.${i}`) !== null) {
      deleteCookie(`${key}.${i}`)
      i++
    }
  },
}

/**
 * Purge any auth tokens or session keys from browser localStorage
 * so that no tokens remain in client localStorage.
 */
export function clearAuthTokensFromLocalStorage(): void {
  if (typeof window === "undefined" || !window.localStorage) return
  try {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (
        k &&
        (k.startsWith("sb-") ||
          k.includes("auth-token") ||
          k.includes("supabase") ||
          k.includes("roomiematch"))
      ) {
        keysToRemove.push(k)
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k))
  } catch (err) {
    console.warn("[RoomieMatch] Could not clear auth tokens from localStorage:", err)
  }
}
