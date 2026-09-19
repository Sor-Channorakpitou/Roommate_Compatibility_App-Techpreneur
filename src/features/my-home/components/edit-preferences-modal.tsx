import * as React from "react"
import { Sliders, X } from "lucide-react"
import { toast } from "sonner"

import type { LivingPreference } from "../types"

type EditPreferencesModalProps = {
  isOpen: boolean
  onClose: () => void
  currentPreferences: LivingPreference[]
  onSavePreferences: (prefs: LivingPreference[]) => void
}

const AVAILABLE_PREFERENCES: LivingPreference[] = [
  { id: "p1", label: "Early bird (10:30 PM)", iconName: "moon" },
  { id: "p1-night", label: "Night owl (1:00 AM)", iconName: "moon" },
  { id: "p2", label: "Clean daily", iconName: "sparkles" },
  { id: "p2-weekly", label: "Deep clean weekly", iconName: "sparkles" },
  { id: "p3", label: "24h heads-up", iconName: "users" },
  { id: "p3-spontaneous", label: "Casual guests welcome", iconName: "users" },
  { id: "p4", label: "Quiet after 10 PM", iconName: "volume-x" },
  { id: "p4-headphones", label: "Headphones in common areas", iconName: "volume-x" },
  { id: "p5", label: "26°C Eco", iconName: "snowflake" },
  { id: "p5-chilly", label: "23°C Cool climate", iconName: "snowflake" },
]

export function EditPreferencesModal({
  isOpen,
  onClose,
  currentPreferences,
  onSavePreferences,
}: EditPreferencesModalProps) {
  const [selected, setSelected] = React.useState<LivingPreference[]>(currentPreferences)

  React.useEffect(() => {
    setSelected(currentPreferences)
  }, [currentPreferences])

  if (!isOpen) return null

  function togglePreference(pref: LivingPreference) {
    if (selected.some((p) => p.id === pref.id)) {
      setSelected((prev) => prev.filter((p) => p.id !== pref.id))
    } else {
      setSelected((prev) => [...prev, pref])
    }
  }

  function handleSave() {
    onSavePreferences(selected)
    toast.success("Living preferences updated!")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#e8dfd8] bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#f0ebe5] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#faece6] text-[#7a3418]">
              <Sliders className="size-4" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Edit Living Preferences
              </h3>
              <p className="text-xs text-muted-foreground">
                Align habits with your roommate
              </p>
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

        <div className="mt-4 space-y-4">
          <p className="text-xs text-muted-foreground">
            Select the rhythm tags that match your current day-to-day lifestyle. These are visible to your roommates to ensure harmony.
          </p>

          <div className="flex flex-wrap gap-2.5">
            {AVAILABLE_PREFERENCES.map((pref) => {
              const isSelected = selected.some((p) => p.id === pref.id)
              return (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => togglePreference(pref)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#7a3418] text-white shadow-xs"
                      : "border border-[#ebe2d8] bg-[#f8f4ef] text-[#55433a] hover:bg-[#f1ebe3]"
                  }`}
                >
                  {isSelected ? "✓ " : "+ "}
                  {pref.label}
                </button>
              )
            })}
          </div>
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
            type="button"
            onClick={handleSave}
            className="rounded-full bg-[#7a3418] px-5 py-1.5 text-xs font-medium text-white hover:bg-[#682c14]"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}
