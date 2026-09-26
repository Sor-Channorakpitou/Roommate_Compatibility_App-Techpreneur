import * as React from "react"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/api-error"
import type { CompatibilityAnswers } from "@/lib/compatibility"
import { parseRoomSettings, type RoomSettings } from "@/lib/room-settings"
import { listMyRooms, updateRoom, type RoomUpdate } from "@/lib/rooms-api"
import { getStudent } from "@/lib/students-api"
import type { Room } from "@/lib/supabase"

type HomeState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; rooms: Room[]; myAnswers: CompatibilityAnswers }

/**
 * The host's rooms plus their quiz answers. Edits are applied optimistically
 * and rolled back if the database rejects them.
 */
export function useMyHome(userId: string) {
  const [state, setState] = React.useState<HomeState>({ status: "loading" })
  const [reloadKey, setReloadKey] = React.useState(0)
  const [isSaving, setIsSaving] = React.useState(false)

  React.useEffect(() => {
    let isCurrent = true
    Promise.all([listMyRooms(userId), getStudent(userId)])
      .then(
        ([rooms, me]) =>
          isCurrent &&
          setState({ status: "ready", rooms, myAnswers: me?.answers ?? {} })
      )
      .catch(
        (error: unknown) =>
          isCurrent &&
          setState({ status: "error", message: getErrorMessage(error) })
      )
    return () => {
      isCurrent = false
    }
  }, [userId, reloadKey])

  const reload = React.useCallback(() => {
    setState({ status: "loading" })
    setReloadKey((key) => key + 1)
  }, [])

  const replaceRoom = React.useCallback((room: Room) => {
    setState((current) =>
      current.status === "ready"
        ? {
            ...current,
            rooms: current.rooms.map((r) => (r.id === room.id ? room : r)),
          }
        : current
    )
  }, [])

  /** Saves column changes and/or a settings patch; resolves true on success. */
  const saveRoom = React.useCallback(
    async (
      room: Room,
      changes: { columns?: RoomUpdate; settings?: Partial<RoomSettings> },
      successMessage?: string
    ) => {
      const patch: RoomUpdate = { ...changes.columns }
      if (changes.settings) {
        patch.settings = {
          ...room.settings,
          ...parseRoomSettings(room),
          ...changes.settings,
        }
      }
      replaceRoom({ ...room, ...patch } as Room)
      setIsSaving(true)
      try {
        replaceRoom(await updateRoom(room.id, patch))
        if (successMessage) toast.success(successMessage)
        return true
      } catch (error) {
        replaceRoom(room)
        toast.error("Couldn't save your changes", {
          description: getErrorMessage(error),
        })
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [replaceRoom]
  )

  return { state, reload, saveRoom, isSaving }
}
