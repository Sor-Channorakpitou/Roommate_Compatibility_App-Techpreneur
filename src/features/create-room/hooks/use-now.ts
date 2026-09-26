import * as React from "react"

/** Current timestamp, refreshed on an interval so relative labels stay fresh. */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = React.useState(Date.now)

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])

  return now
}
