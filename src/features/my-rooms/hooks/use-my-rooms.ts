import * as React from "react"
import { toast } from "sonner"

import {
  deleteRoom,
  getErrorMessage,
  listMyRooms,
  setAcceptingRoommates,
} from "@/lib/rooms-api"
import type { Room } from "@/lib/supabase"

type RoomsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; rooms: Room[] }

/** Loads the owner's rooms and exposes the toggle and delete mutations. */
export function useMyRooms(ownerId: string | undefined) {
  const [state, setState] = React.useState<RoomsState>({ status: "loading" })
  const [reloadKey, setReloadKey] = React.useState(0)
  // Rooms with a request in flight, so their controls can be disabled.
  const [pendingIds, setPendingIds] = React.useState<ReadonlySet<string>>(
    () => new Set()
  )

  React.useEffect(() => {
    if (!ownerId) return
    let isCurrent = true
    listMyRooms(ownerId)
      .then((rooms) => isCurrent && setState({ status: "ready", rooms }))
      .catch(
        (error: unknown) =>
          isCurrent &&
          setState({ status: "error", message: getErrorMessage(error) })
      )
    // Ignore responses from a superseded request (e.g. after a quick reload).
    return () => {
      isCurrent = false
    }
  }, [ownerId, reloadKey])

  const reload = React.useCallback(() => {
    setState({ status: "loading" })
    setReloadKey((key) => key + 1)
  }, [])

  function setPending(id: string, isPending: boolean) {
    setPendingIds((ids) => {
      const next = new Set(ids)
      if (isPending) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function patchRooms(update: (rooms: Room[]) => Room[]) {
    setState((current) =>
      current.status === "ready"
        ? { status: "ready", rooms: update(current.rooms) }
        : current
    )
  }

  async function toggleAcceptingRoommates(room: Room) {
    const accepting = !room.accepting_roommates
    // Optimistic: flip now, roll back if the database refuses.
    patchRooms((rooms) =>
      rooms.map((r) =>
        r.id === room.id ? { ...r, accepting_roommates: accepting } : r
      )
    )
    setPending(room.id, true)
    try {
      const saved = await setAcceptingRoommates(room.id, accepting)
      patchRooms((rooms) => rooms.map((r) => (r.id === saved.id ? saved : r)))
      toast.success(
        accepting
          ? `${room.name} is accepting roommates`
          : `${room.name} is no longer accepting roommates`
      )
    } catch (error) {
      patchRooms((rooms) => rooms.map((r) => (r.id === room.id ? room : r)))
      toast.error("Couldn't update the room", {
        description: getErrorMessage(error),
      })
    } finally {
      setPending(room.id, false)
    }
  }

  async function removeRoom(room: Room) {
    setPending(room.id, true)
    try {
      await deleteRoom(room.id)
      patchRooms((rooms) => rooms.filter((r) => r.id !== room.id))
      toast.success(`${room.name} was deleted`)
    } catch (error) {
      toast.error("Couldn't delete the room", {
        description: getErrorMessage(error),
      })
    } finally {
      setPending(room.id, false)
    }
  }

  return {
    state,
    pendingIds,
    reload,
    toggleAcceptingRoommates,
    removeRoom,
  }
}
