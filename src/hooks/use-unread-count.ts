import * as React from "react"

import { countUnread, subscribeToMessages } from "@/lib/messages-api"

/** Live count of unread messages for the header badge. */
export function useUnreadCount(userId: string | undefined) {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!userId) return
    let isCurrent = true
    const refresh = () =>
      countUnread(userId)
        .then((n) => isCurrent && setCount(n))
        .catch(() => {
          // Keep the last known count; the badge is only a hint.
        })
    void refresh()
    const unsubscribe = subscribeToMessages(userId, refresh)
    return () => {
      isCurrent = false
      unsubscribe()
    }
  }, [userId])

  return userId ? count : 0
}
