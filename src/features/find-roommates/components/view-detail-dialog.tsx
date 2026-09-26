import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Check, Home, Minus, X } from "lucide-react"

import {
  answerLabel,
  HABITS,
  type HabitComparison,
} from "@/lib/compatibility"
import { formatMonthYear, formatTime, formatUsd, getInitials } from "@/lib/format"
import { formatShortDate, type RoommateListing } from "../data/listings"

type ViewDetailDialogProps = {
  profile: RoommateListing | null
  /** Whether the viewer has answers to compare against. */
  viewerTookQuiz: boolean
  onClose: () => void
  onSendMatch: (profile: RoommateListing) => void
}

function ScoreIcon({ comparison }: { comparison: HabitComparison }) {
  if (comparison.score === 100) {
    return (
      <span
        title="Same answer"
        className="flex size-5 items-center justify-center rounded-full bg-[#dcf2dc] text-[#225c27] dark:bg-emerald-950/80 dark:text-emerald-300 shadow-xs"
      >
        <Check className="size-3 stroke-[2.5]" />
      </span>
    )
  }
  if (comparison.score >= 60) {
    return (
      <span
        title="Close"
        className="flex size-5 items-center justify-center rounded-full bg-[#f5e3bc] text-[#5e4414] shadow-xs"
      >
        <Minus className="size-3 stroke-[2.5]" />
      </span>
    )
  }
  return (
    <span
      title="Different"
      className="flex size-5 items-center justify-center rounded-full bg-[#f8dcd4] text-[#8c2f14] shadow-xs"
    >
      <X className="size-3 stroke-[2.5]" />
    </span>
  )
}

const GUEST_POLICY_LABELS: Record<string, string> = {
  never: "No overnight guests",
  "with-notice": "Guests with 24h notice",
  anytime: "Guests welcome anytime",
}

export function ViewDetailDialog({
  profile,
  viewerTookQuiz,
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

  const room = profile.room
  const student = profile.student
  const match = profile.match
  const firstName = (profile.name.split(" ")[0] ?? profile.name).toUpperCase()

  const roomDetails = room
    ? [
        ["Total rent", `${formatUsd(room.monthly_rent)}/mo`],
        ["Your share", `${formatUsd(profile.rentShare ?? 0)}/mo`],
        ["Move-in", formatShortDate(room.move_in_date)],
        ["Lease until", formatMonthYear(room.lease_end_date)],
        ["Household", `${room.member_count} people`],
        ["Open spots", String(room.open_spots)],
        room.quiet_hours_start && room.quiet_hours_end
          ? [
              "Quiet hours",
              `${formatTime(room.quiet_hours_start)} – ${formatTime(room.quiet_hours_end)}`,
            ]
          : null,
        room.guest_policy
          ? ["Guests", GUEST_POLICY_LABELS[room.guest_policy] ?? room.guest_policy]
          : null,
      ].filter((row): row is [string, string] => Boolean(row))
    : []

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-[490px] overflow-y-auto rounded-[28px] bg-white dark:bg-[#1a1714] p-6 sm:p-8 shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full text-[#82776c] transition-colors hover:bg-[#f5f1eb] hover:text-[#211d18] dark:hover:bg-stone-800"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 pr-6">
          <div className="flex items-center gap-3.5">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f1e6d8] font-heading text-lg font-semibold text-[#682506] ring-2 ring-[#e4ddd4] dark:ring-stone-700 shadow-xs">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : room ? (
                <Home className="size-6" aria-hidden />
              ) : (
                getInitials(profile.name)
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-[#7a7065] dark:text-stone-400">
                {room ? `Hosted by ${profile.contactName}` : "Compatibility with"}
              </p>
              <h2
                id="dialog-title"
                className="font-roboto-slab text-2xl font-bold tracking-tight text-[#211d18] dark:text-stone-100"
              >
                {profile.name}
              </h2>
            </div>
          </div>

          {match ? (
            <div className="text-right shrink-0">
              <div className="font-serif text-3xl sm:text-4xl font-normal leading-none text-[#205826] dark:text-emerald-400">
                {match.score}%
              </div>
              <p className="mt-1 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-[#205826] dark:text-emerald-400">
                {match.rating}
              </p>
            </div>
          ) : room ? (
            <div className="text-right shrink-0">
              <div className="font-roboto-slab text-2xl font-bold text-[#682506] dark:text-amber-400">
                {formatUsd(profile.rentShare ?? 0)}
              </div>
              <p className="mt-0.5 text-[10px] font-bold tracking-widest uppercase text-[#7a7065]">
                per person / mo
              </p>
            </div>
          ) : null}
        </div>

        {match && (
          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-[#ece7dd] dark:bg-stone-800">
            <div
              className="h-full rounded-full bg-[#24612b] transition-all duration-700 ease-out"
              style={{ width: `${match.score}%` }}
            />
          </div>
        )}

        {student?.bio?.trim() && (
          <p className="mt-6 rounded-2xl bg-[#faf7f2] p-3.5 text-sm leading-relaxed text-[#3b342c] dark:bg-stone-900/60 dark:text-stone-300">
            {student.bio}
          </p>
        )}

        {/* Student: side-by-side habits */}
        {student && match && (
          <div className="mt-6">
            <div className="grid grid-cols-12 pb-3 text-[11px] font-bold tracking-wider text-[#8b8075] uppercase dark:text-stone-400">
              <span className="col-span-4">HABIT</span>
              <span className="col-span-3">YOU</span>
              <span className="col-span-4">{firstName}</span>
              <span className="col-span-1" />
            </div>
            <div className="flex flex-col divide-y divide-[#f2ece2] dark:divide-stone-800/70">
              {match.comparisons.map((row) => (
                <div key={row.key} className="grid grid-cols-12 items-center py-3 text-xs">
                  <span className="col-span-4 font-roboto-slab text-[13px] font-semibold text-[#241f19] dark:text-stone-200">
                    {row.label}
                  </span>
                  <span className="col-span-3 text-[12px] text-[#5c544a] dark:text-stone-400">
                    {row.you}
                  </span>
                  <span className="col-span-4 text-[12px] text-[#5c544a] dark:text-stone-400">
                    {row.them}
                  </span>
                  <div className="col-span-1 flex justify-end">
                    <ScoreIcon comparison={row} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student without a score: explain why */}
        {student && !match && (
          <div className="mt-6 space-y-3">
            {HABITS.some(({ key }) => student.answers[key]) && (
              <ul className="flex flex-col divide-y divide-[#f2ece2] text-xs dark:divide-stone-800/70">
                {HABITS.filter(({ key }) => student.answers[key]).map((habit) => (
                  <li key={habit.key} className="flex justify-between py-2.5">
                    <span className="font-semibold text-[#241f19] dark:text-stone-200">
                      {habit.label}
                    </span>
                    <span className="text-[#5c544a] dark:text-stone-400">
                      {answerLabel(habit.key, student.answers[habit.key])}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="rounded-2xl border border-[#eee7dc] bg-[#faf7f2] p-3.5 text-xs text-[#524b42] dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-300">
              {!viewerTookQuiz ? (
                <>
                  <Link to="/compatibility-test" className="font-semibold text-[#682506] underline">
                    Take the compatibility quiz
                  </Link>{" "}
                  to see how your habits compare.
                </>
              ) : (
                `${profile.name.split(" ")[0]} hasn't finished the compatibility quiz yet, so there's no score to show.`
              )}
            </p>
          </div>
        )}

        {/* Place: real room details */}
        {room && (
          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            {roomDetails.map(([label, value]) => (
              <div key={label} className="border-b border-[#f2ece2] pb-2 dark:border-stone-800">
                <dt className="text-[10px] font-bold tracking-wider text-[#8b8075] uppercase">
                  {label}
                </dt>
                <dd className="mt-0.5 font-semibold text-[#241f19] dark:text-stone-200">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}

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
            <span>{room ? "Message Host" : `Message ${profile.name.split(" ")[0]}`}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
