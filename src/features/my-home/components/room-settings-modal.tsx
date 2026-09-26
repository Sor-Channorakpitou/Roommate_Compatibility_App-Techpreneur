import * as React from "react"
import { Settings, X } from "lucide-react"
import { toast } from "sonner"

import { PHNOM_PENH_DISTRICTS } from "@/config/districts"
import { ROOM_NAME_MAX_LENGTH } from "@/features/create-room/lib/room-calculations"
import type { Room } from "@/lib/supabase"

export type RoomSettingsValues = Pick<
  Room,
  "name" | "district" | "street" | "lease_end_date"
>

type RoomSettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  room: Room
  /** Resolves true once saved. */
  onSave: (values: RoomSettingsValues) => Promise<boolean>
}

const inputClass =
  "w-full rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3.5 py-2 text-xs text-foreground focus:border-[#7a3418] focus:outline-none"

export function RoomSettingsModal({
  isOpen,
  onClose,
  room,
  onSave,
}: RoomSettingsModalProps) {
  const [values, setValues] = React.useState<RoomSettingsValues>(room)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Start from the saved room each time the dialog opens.
  const [wasOpen, setWasOpen] = React.useState(isOpen)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    if (isOpen) setValues(room)
  }

  if (!isOpen) return null

  const update = (patch: Partial<RoomSettingsValues>) =>
    setValues((prev) => ({ ...prev, ...patch }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = values.name.trim()
    if (!name) {
      toast.error("Give your home a name.")
      return
    }
    if (!values.lease_end_date || values.lease_end_date <= room.move_in_date) {
      toast.error("Lease must end after the move-in date.")
      return
    }
    setIsSubmitting(true)
    const saved = await onSave({ ...values, name, street: values.street.trim() })
    setIsSubmitting(false)
    if (saved) onClose()
  }

  // Keep a district that predates the current list selectable.
  const districts: readonly string[] = PHNOM_PENH_DISTRICTS.includes(
    room.district as (typeof PHNOM_PENH_DISTRICTS)[number]
  )
    ? PHNOM_PENH_DISTRICTS
    : [room.district, ...PHNOM_PENH_DISTRICTS]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-settings-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-[#e8dfd8] bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between border-b border-[#f0ebe5] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#faece6] text-[#7a3418]">
              <Settings className="size-4" />
            </div>
            <div>
              <h3
                id="room-settings-title"
                className="font-heading text-lg font-semibold text-foreground"
              >
                Room Settings
              </h3>
              <p className="text-xs text-muted-foreground">Update your room's details</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="settings-name" className="text-xs font-semibold text-foreground">
              Room name
            </label>
            <input
              id="settings-name"
              type="text"
              maxLength={ROOM_NAME_MAX_LENGTH}
              value={values.name}
              onChange={(e) => update({ name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-district" className="text-xs font-semibold text-foreground">
              District
            </label>
            <select
              id="settings-district"
              value={values.district}
              onChange={(e) => update({ district: e.target.value })}
              className={inputClass}
            >
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-street" className="text-xs font-semibold text-foreground">
              Street / landmark
            </label>
            <input
              id="settings-street"
              type="text"
              value={values.street}
              onChange={(e) => update({ street: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-lease" className="text-xs font-semibold text-foreground">
              Lease end date
            </label>
            <input
              id="settings-lease"
              type="date"
              min={room.move_in_date}
              value={values.lease_end_date}
              onChange={(e) => update({ lease_end_date: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#f0ebe5] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#d6cbbe] px-4 py-1.5 text-xs font-medium text-[#4a3b34] hover:bg-[#f6efe8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#7a3418] px-5 py-1.5 text-xs font-medium text-white hover:bg-[#682c14] disabled:opacity-50"
            >
              {isSubmitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
