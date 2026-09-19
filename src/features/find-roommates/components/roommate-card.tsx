import React from "react"
import { Check, Heart, Home, MapPin, Users } from "lucide-react"
import { cn } from "cn"

import type { RoommateListing } from "../data/roommates-data"

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
  const [isConnected, setIsConnected] = React.useState(Boolean(profile.connected))

  const handleConnectClick = () => {
    if (!isConnected) {
      setIsConnected(true)
      onSendMatch(profile)
    }
  }

  const isPlace = profile.type === "place"

  // Top-left badge styling matching Browse.png
  const renderTypeBadge = () => {
    if (profile.type === "place") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#27532a]/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs">
          <Home className="size-3" />
          PLACE AVAILABLE
        </span>
      )
    }
    if (profile.type === "has_room") {
      return (
        <span className="inline-flex items-center rounded-full bg-[#7a6442]/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs">
          HAS EXTRA ROOM
        </span>
      )
    }
    return (
      <span className="inline-flex items-center rounded-full bg-[#faf7f0]/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#632408] shadow-xs backdrop-blur-xs border border-[#eee4d5]">
        ROOM SEEKER
      </span>
    )
  }

  // Top-right badge styling matching Browse.png
  const renderRightBadge = () => {
    if (profile.matchScore) {
      const isHigh = profile.matchScore >= 85
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
          {profile.matchScore}% Match
        </span>
      )
    }
    if (profile.id === "riverside-colonial-flat") {
      return (
        <span className="inline-flex items-center rounded-full bg-[#faf7f0]/95 px-3 py-1 text-xs font-bold text-[#682506] shadow-xs backdrop-blur-xs">
          {profile.priceDisplay}
        </span>
      )
    }
    return null
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-[22px] border border-[#e8dfd2] dark:border-stone-800 bg-white dark:bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Top Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#e8dfd2] dark:bg-stone-800">
        <img
          src={profile.image}
          alt={profile.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 z-10">{renderTypeBadge()}</div>
        <div className="absolute top-3.5 right-3.5 z-10">{renderRightBadge()}</div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-2.5">
          {/* Title & Price Row */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-roboto-slab text-[19px] font-semibold tracking-tight text-[#211d18] dark:text-stone-100 leading-snug">
              {profile.name}
              {profile.age ? `, ${profile.age}` : ""}
            </h3>

            <span className="shrink-0 rounded-md bg-[#faeedd] dark:bg-amber-950/60 px-2 py-0.5 text-xs font-bold text-[#6d2504] dark:text-amber-300">
              {profile.priceDisplay}
            </span>
          </div>

          {/* Subtitle / Role */}
          <p className="text-xs text-muted-foreground font-sans">
            {profile.subtitle}
          </p>

          {/* Location & Availability */}
          <div className="flex items-center gap-1.5 text-xs text-[#6e6357] dark:text-stone-400">
            <MapPin className="size-3.5 shrink-0 text-[#682506] dark:text-amber-500" />
            <span>
              {profile.location} • {profile.availableDate}
            </span>
          </div>

          {/* Additional info for places with roommates */}
          {profile.roommatesCountText && (
            <div className="flex items-center gap-1.5 text-xs text-[#205826] dark:text-emerald-400 font-medium">
              <Users className="size-3.5 shrink-0" />
              <span>{profile.roommatesCountText}</span>
            </div>
          )}

          {/* Quote Description */}
          <p className="text-[12.5px] italic text-[#544d44] dark:text-stone-300 line-clamp-2 leading-relaxed">
            {profile.quote}
          </p>

          {/* Rhythm Tags */}
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
        </div>

        {/* Card Footer Actions matching Browse.png */}
        <div className="mt-5 flex items-center justify-between border-t border-[#f0e8dc] dark:border-stone-800 pt-4">
          {/* View Detail / View Place Button */}
          <button
            type="button"
            onClick={() => onSeeBreakdown(profile)}
            className="rounded-full border border-[#d6cbbe] dark:border-stone-700 bg-white dark:bg-stone-800/80 px-4 py-1.5 text-xs font-semibold text-[#3b342c] dark:text-stone-200 transition-all hover:bg-[#f6f2ec] dark:hover:bg-stone-700 active:scale-98"
          >
            {isPlace ? "View Place" : "View Detail"}
          </button>

          {/* Primary Action Button (Connect / Connected / Inquire) */}
          {isConnected ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#5c2005] px-4 py-1.5 text-xs font-semibold text-white shadow-xs"
            >
              <span>Connected</span>
              <Check className="size-3 stroke-[2.5]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConnectClick}
              className="rounded-full bg-[#5c2005] hover:bg-[#481903] active:scale-98 px-5 py-1.5 text-xs font-semibold text-white shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5c2005]"
            >
              {isPlace ? "Inquire / Apply" : "Connect"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
