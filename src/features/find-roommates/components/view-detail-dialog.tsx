import React from "react"
import { ArrowRight, Check, CheckCircle2, X } from "lucide-react"

import type { RoommateListing } from "../data/roommates-data"

type ViewDetailDialogProps = {
  profile: RoommateListing | null
  onClose: () => void
  onSendMatch: (profile: RoommateListing) => void
}

export function ViewDetailDialog({
  profile,
  onClose,
  onSendMatch,
}: ViewDetailDialogProps) {
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
      }
    }
    if (profile) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [profile, onClose])

  if (!profile) return null

  const isRoommate = profile.type === "roommate" || profile.type === "has_room"
  const firstName = profile.name.split(" ")[0].toUpperCase()

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog container matching view_detail.png */}
      <div className="relative z-10 w-full max-w-[490px] overflow-hidden rounded-[28px] bg-white dark:bg-[#1a1714] p-6 sm:p-8 shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200">
        {/* Close "X" button on top right for accessibility */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full text-[#82776c] transition-colors hover:bg-[#f5f1eb] hover:text-[#211d18] dark:hover:bg-stone-800"
        >
          <X className="size-4" />
        </button>

        {/* Header Section */}
        <div className="flex items-center justify-between gap-4 pr-6">
          {/* Avatar & Name */}
          <div className="flex items-center gap-3.5">
            <div className="size-13 sm:size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-[#e4ddd4] dark:ring-stone-700 shadow-xs">
              <img
                src={profile.avatarImage || profile.image}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-[#7a7065] dark:text-stone-400">
                {isRoommate ? "Compatibility with" : "Space Details for"}
              </p>
              <h2
                id="dialog-title"
                className="font-roboto-slab text-2xl font-bold tracking-tight text-[#211d18] dark:text-stone-100"
              >
                {profile.name}
                {profile.age ? `, ${profile.age}` : ""}
              </h2>
            </div>
          </div>

          {/* Match Score & Rating Badge */}
          {profile.matchScore ? (
            <div className="text-right shrink-0">
              <div className="font-serif text-3xl sm:text-4xl font-normal leading-none text-[#205826] dark:text-emerald-400">
                {profile.matchScore}%
              </div>
              <p className="mt-1 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-[#205826] dark:text-emerald-400">
                {profile.matchRatingText || "EXCEPTIONAL MATCH"}
              </p>
            </div>
          ) : (
            <div className="text-right shrink-0">
              <div className="font-roboto-slab text-2xl font-bold text-[#682506] dark:text-amber-400">
                {profile.priceDisplay}
              </div>
              <p className="mt-0.5 text-[10px] font-bold tracking-widest uppercase text-[#205826] dark:text-emerald-400">
                VERIFIED SPACE
              </p>
            </div>
          )}
        </div>

        {/* Green Sync Bar */}
        <div className="mt-6 mb-7 h-1.5 w-full overflow-hidden rounded-full bg-[#ece7dd] dark:bg-stone-800">
          <div
            className="h-full rounded-full bg-[#24612b] transition-all duration-700 ease-out"
            style={{ width: `${profile.matchScore ?? 92}%` }}
          />
        </div>

        {/* Comparison Table matching view_detail.png */}
        <div className="overflow-hidden">
          {/* Table Headers */}
          <div className="grid grid-cols-12 pb-3 text-[11px] font-bold tracking-wider text-[#8b8075] uppercase dark:text-stone-400">
            <span className="col-span-4">HABIT</span>
            <span className="col-span-3">YOU</span>
            <span className="col-span-4">{isRoommate ? firstName : "SPACE"}</span>
            <span className="col-span-1 text-right"></span>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col divide-y divide-[#f2ece2] dark:divide-stone-800/70">
            {profile.habitComparisons.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 items-center py-3 text-xs"
              >
                {/* Habit Label */}
                <span className="col-span-4 font-roboto-slab text-[13px] font-semibold text-[#241f19] dark:text-stone-200">
                  {row.habit}
                </span>

                {/* You */}
                <span className="col-span-3 text-[12px] text-[#5c544a] dark:text-stone-400">
                  {row.you}
                </span>

                {/* Roommate / Space */}
                <span className="col-span-4 text-[12px] text-[#5c544a] dark:text-stone-400">
                  {row.them}
                </span>

                {/* Green Check Pill */}
                <div className="col-span-1 flex justify-end">
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#dcf2dc] text-[#225c27] dark:bg-emerald-950/80 dark:text-emerald-300 shadow-xs">
                    <Check className="size-3 stroke-[2.5]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed compatibility bullets */}
        {profile.breakdown && profile.breakdown.length > 0 && (
          <div className="mt-5 rounded-2xl bg-[#faf7f2] dark:bg-stone-900/60 p-3.5 border border-[#eee7dc] dark:border-stone-800">
            <div className="space-y-1.5">
              {profile.breakdown.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#524b42] dark:text-stone-300">
                  <CheckCircle2 className="size-3.5 text-[#24612b] shrink-0" />
                  <span>
                    <strong className="font-medium text-[#211d18] dark:text-stone-200">{item.category}:</strong>{" "}
                    {item.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 flex items-center justify-end gap-5">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-[#463f35] transition-colors hover:text-black hover:underline dark:text-stone-400 dark:hover:text-white"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onSendMatch(profile)
              onClose()
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#682506] hover:bg-[#541e05] active:scale-98 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#682506]"
          >
            <span>
              {isRoommate ? "Send Match Request" : "Inquire / Apply"}
            </span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
