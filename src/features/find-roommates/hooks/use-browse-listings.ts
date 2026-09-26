import * as React from "react"

import { getErrorMessage } from "@/lib/api-error"
import { hasCompletedQuiz, type CompatibilityAnswers } from "@/lib/compatibility"
import { listOpenRooms, listStudents } from "@/lib/students-api"
import {
  roomListing,
  studentListing,
  type RoommateListing,
} from "../data/listings"

type BrowseState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ready"
      listings: RoommateListing[]
      /** The viewer's own answers; null when signed out. */
      myAnswers: CompatibilityAnswers | null
      /** False until the room listings migration is applied. */
      roomsAvailable: boolean
    }

/** Loads students and open rooms, scored against the viewer's quiz answers. */
export function useBrowseListings(
  viewerId: string | undefined,
  /** Wait for auth to settle, so scores load in one pass. */
  enabled = true
) {
  const [state, setState] = React.useState<BrowseState>({ status: "loading" })
  const [reloadKey, setReloadKey] = React.useState(0)

  React.useEffect(() => {
    if (!enabled) return
    let isCurrent = true
    Promise.all([listStudents(), listOpenRooms()])
      .then(([students, openRooms]) => {
        if (!isCurrent) return
        const me = students.find((s) => s.id === viewerId)
        const myAnswers = viewerId ? (me?.answers ?? {}) : null
        const listings = [
          ...students
            .filter((s) => s.id !== viewerId)
            .map((s) => studentListing(s, myAnswers)),
          ...openRooms.rooms
            .filter((room) => room.owner_id !== viewerId)
            .map(roomListing),
        ]
        setState({
          status: "ready",
          listings,
          myAnswers,
          roomsAvailable: openRooms.isAvailable,
        })
      })
      .catch(
        (error: unknown) =>
          isCurrent &&
          setState({ status: "error", message: getErrorMessage(error) })
      )
    return () => {
      isCurrent = false
    }
  }, [viewerId, enabled, reloadKey])

  const reload = React.useCallback(() => {
    setState({ status: "loading" })
    setReloadKey((key) => key + 1)
  }, [])

  const viewerTookQuiz =
    state.status === "ready" && hasCompletedQuiz(state.myAnswers)

  return { state, reload, viewerTookQuiz }
}
