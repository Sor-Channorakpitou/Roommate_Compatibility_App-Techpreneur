/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

type Theme = "light"

type ThemeProviderProps = {
  children: React.ReactNode
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

export function ThemeProvider({
  children,
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme] = React.useState<Theme>("light")

  const setTheme = React.useCallback(
    (_nextTheme: Theme) => {
      localStorage.setItem(storageKey, "light")
    },
    [storageKey]
  )

  React.useEffect(() => {
    const root = document.documentElement
    root.classList.remove("dark")
    root.classList.add("light")
  }, [])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}