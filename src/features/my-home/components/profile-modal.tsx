import {
  GraduationCap,
  Heart,
  MapPin,
  ShieldCheck,
  X,
} from "lucide-react"

import type { HouseholdResident } from "../types"

type ProfileModalProps = {
  isOpen: boolean
  onClose: () => void
  resident: HouseholdResident | null
}

export function ProfileModal({ isOpen, onClose, resident }: ProfileModalProps) {
  if (!isOpen || !resident) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#e8dfd8] bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#f0ebe5] pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-12 items-center justify-center rounded-full text-base font-bold ${resident.avatarBg} ${resident.avatarTextColor}`}
            >
              {resident.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {resident.name}, {resident.age}
                </h3>
                {resident.matchScore && (
                  <span className="rounded-full bg-[#e2f3e4] px-2 py-0.5 text-[11px] font-bold text-[#276e33]">
                    {resident.matchScore}% Match
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{resident.occupation}</p>
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

        <div className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#f9f5f0] p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="size-3.5 text-[#7a3418]" />
              <span>Royal University of Phnom Penh</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-3.5 text-[#7a3418]" />
              <span>Phnom Penh, Cambodia</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-3.5 text-[#276e33]" />
              <span className="font-medium text-[#276e33]">Verified Student ID</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="size-3.5 text-[#e15b5b]" />
              <span>Cleanliness index: High</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">
              Lifestyle Habits & Mutual Cadence
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {resident.preferences.map((p) => (
                <span
                  key={p.id}
                  className="rounded-full border border-[#ebe2d8] bg-[#f8f4ef] px-3 py-1.5 text-xs text-[#55433a]"
                >
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#eee6dc] p-3 text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground">Co-living Philosophy:</p>
            <p className="mt-1">
              "Believes in quiet restful nights, prompt dishwashing, and respecting private time while enjoying pleasant shared weekend meals."
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#f0ebe5] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#d6cbbe] px-4 py-1.5 text-xs font-medium text-[#4a3b34] hover:bg-[#f6efe8]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
