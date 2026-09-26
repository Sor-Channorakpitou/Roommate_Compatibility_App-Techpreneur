import { CalendarDays, GraduationCap, Heart, Home, MapPin } from "lucide-react"
import { cn } from "cn"

import { formatUsd, getInitials } from "@/lib/format"
import { formatShortDate, type RoommateListing } from "../data/listings"

type RoommateCardProps = {
  profile: RoommateListing
  onSeeBreakdown: (profile: RoommateListing) => void
  onSendMatch: (profile: RoommateListing) => void
}

export function RoommateCard({
  profile,
  onSeeBreakdown,
  onSendMatch,
}: RoommateCardProps) {
  const isPlace = profile.type === "place"

  const renderTypeBadge = () => {
    if (isPlace) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#27532a]/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs">
          <Home className="size-3" />
          PLACE AVAILABLE
        </span>
      )
    }
    return (
      <span className="inline-flex items-center rounded-full bg-[#faf7f0]/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#632408] shadow-xs backdrop-blur-xs border border-[#eee4d5]">
        STUDENT
      </span>
    )
  }

  const renderRightBadge = () => {
    if (!profile.match) return null
    const isHigh = profile.match.score >= 85
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-xs backdrop-blur-xs",
          isHigh
            ? "bg-[#e5f4e4]/95 text-[#1e5828] dark:bg-emerald-950/80 dark:text-emerald-300"
            : "bg-[#f5e3bc]/95 text-[#5e4414] dark:bg-amber-950/80 dark:text-amber-300"
        )}
      >
        {isHigh && <Heart className="size-3 fill-[#1e5828] text-[#1e5828]" />}
        {profile.match.score}% Match
      </span>
    )
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-[22px] border border-[#e8dfd2] dark:border-stone-800 bg-white dark:bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Top visual: the student's photo or initials, or the room's district */}
      <div
        className={cn(
          "relative flex h-40 w-full items-center justify-center overflow-hidden",
          isPlace
            ? "bg-[#e3ecdf] dark:bg-emerald-950/40"
            : "bg-[#f1e6d8] dark:bg-stone-800"
        )}
      >
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : isPlace ? (
          <div className="flex flex-col items-center gap-1.5 text-[#27532a] dark:text-emerald-300">
            <Home className="size-9" aria-hidden />
            <span className="text-xs font-semibold">{profile.room?.district}</span>
          </div>
        ) : (
          <span
            aria-hidden
            className="flex size-20 items-center justify-center rounded-full bg-white/80 font-heading text-2xl font-semibold text-[#682506] shadow-xs dark:bg-stone-900 dark:text-amber-300"
          >
            {getInitials(profile.name)}
          </span>
        )}

        <div className="absolute top-3.5 left-3.5 z-10">{renderTypeBadge()}</div>
        <div className="absolute top-3.5 right-3.5 z-10">{renderRightBadge()}</div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-roboto-slab text-[19px] font-semibold tracking-tight text-[#211d18] dark:text-stone-100 leading-snug">
              {profile.name}
            </h3>

            {profile.rentShare !== undefined && (
              <span className="shrink-0 rounded-md bg-[#faeedd] dark:bg-amber-950/60 px-2 py-0.5 text-xs font-bold text-[#6d2504] dark:text-amber-300">
                {formatUsd(profile.rentShare)}/mo each
              </span>
            )}
          </div>

          {profile.subtitle && (
            <p className="text-xs text-muted-foreground font-sans">
              {profile.subtitle}
            </p>
          )}

          {profile.room ? (
            <div className="flex items-center gap-1.5 text-xs text-[#6e6357] dark:text-stone-400">
              <MapPin className="size-3.5 shrink-0 text-[#682506] dark:text-amber-500" />
              <span>{profile.room.district}</span>
              <span aria-hidden>•</span>
              <CalendarDays className="size-3.5 shrink-0 text-[#682506] dark:text-amber-500" />
              <span>Move in {formatShortDate(profile.room.move_in_date)}</span>
            </div>
          ) : (
            profile.student?.university && (
              <div className="flex items-center gap-1.5 text-xs text-[#6e6357] dark:text-stone-400">
                <GraduationCap className="size-3.5 shrink-0 text-[#682506] dark:text-amber-500" />
                <span>{profile.student.university}</span>
              </div>
            )
          )}

          <p className="text-[12.5px] text-[#544d44] dark:text-stone-300 line-clamp-2 leading-relaxed">
            {profile.description}
          </p>

          {profile.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#f3ede3] dark:bg-stone-800 px-2.5 py-0.5 text-[11px] font-medium text-[#483f34] dark:text-stone-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#f0e8dc] dark:border-stone-800 pt-4">
          <button
            type="button"
            onClick={() => onSeeBreakdown(profile)}
            className="rounded-full border border-[#d6cbbe] dark:border-stone-700 bg-white dark:bg-stone-800/80 px-4 py-1.5 text-xs font-semibold text-[#3b342c] dark:text-stone-200 transition-all hover:bg-[#f6f2ec] dark:hover:bg-stone-700 active:scale-98"
          >
            {isPlace ? "View Place" : "View Detail"}
          </button>

          <button
            type="button"
            onClick={() => onSendMatch(profile)}
            className="rounded-full bg-[#5c2005] hover:bg-[#481903] active:scale-98 px-5 py-1.5 text-xs font-semibold text-white shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5c2005]"
          >
            {isPlace ? "Message Host" : "Message"}
          </button>
        </div>
      </div>
    </div>
  )
}
