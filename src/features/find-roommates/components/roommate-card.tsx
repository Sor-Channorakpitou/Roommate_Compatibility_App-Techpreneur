import React from "react"
import { Bookmark, MapPin, MoreHorizontal, Share2 } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import type { RoommateProfile } from "../data/roommates-data"

type RoommateCardProps = {
  profile: RoommateProfile
  onSeeBreakdown: (profile: RoommateProfile) => void
  onSendMatch: (profile: RoommateProfile) => void
}

export function RoommateCard({
  profile,
  onSeeBreakdown,
  onSendMatch,
}: RoommateCardProps) {
  const [isSaved, setIsSaved] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  // Determine match score badge style based on score value
  const getMatchBadgeStyle = (score: number) => {
    if (score >= 85) {
      return "bg-[#d4f2d2] dark:bg-emerald-950/60 text-[#1f561d] dark:text-emerald-300"
    }
    if (score >= 70) {
      return "bg-[#ffe0d3] dark:bg-amber-950/60 text-[#7a2e0e] dark:text-amber-300"
    }
    return "bg-[#eee6d9] dark:bg-stone-800 text-[#5f5140] dark:text-stone-300"
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      {/* Banner / Avatar Placeholder */}
      <div className="relative flex h-44 w-full items-center justify-center bg-[#eae0d2] dark:bg-stone-800">
        {/* Initials Placeholder */}
        <span className="font-roboto-slab text-5xl font-light tracking-widest text-[#9c856e] opacity-80 transition-transform duration-300 group-hover:scale-105 dark:text-stone-400">
          {profile.initials}
        </span>

        {/* Top-left "Has a room" Pill Badge */}
        {profile.hasRoom && (
          <span className="absolute top-3.5 left-3.5 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground shadow-xs backdrop-blur-xs">
            Has a room
          </span>
        )}

        {/* Top-right More Actions Button */}
        <div className="absolute top-3.5 right-3.5">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="More options"
            className="flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground shadow-xs transition-all hover:bg-background hover:scale-105"
          >
            <MoreHorizontal className="size-4" />
          </button>

          {/* Quick Menu Popover */}
          {isMenuOpen && (
            <div className="absolute top-10 right-0 z-20 w-44 rounded-xl border border-border bg-popover p-1.5 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setIsSaved(!isSaved)
                  setIsMenuOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                <Bookmark className="size-3.5" />
                {isSaved ? "Saved to favorites" : "Save roommate"}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  setIsMenuOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                <Share2 className="size-3.5" />
                Share profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="flex flex-col gap-3">
          {/* Header Row: Name & Age + Match Badge */}
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-roboto-slab text-xl font-medium tracking-tight text-foreground">
              {profile.name}, <span className="font-sans font-normal text-muted-foreground">{profile.age}</span>
            </h3>

            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-bold tracking-tight",
                getMatchBadgeStyle(profile.matchScore)
              )}
            >
              {profile.matchScore}% match
            </span>
          </div>

          {/* Meta Row: Location & Price */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-muted-foreground/80" />
            <span>
              {profile.area} • {profile.priceDisplay}
            </span>
          </div>

          {/* Availability Date */}
          <p className="text-xs text-muted-foreground/90">
            {profile.availableDate}
          </p>

          {/* Lifestyle Tags */}
          <div className="mt-1 flex flex-wrap gap-1.5">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#f3ede5] dark:bg-muted px-3 py-1 text-[0.75rem] font-medium text-foreground/90"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-4">
          <button
            type="button"
            onClick={() => onSeeBreakdown(profile)}
            className="text-xs font-semibold text-foreground transition-colors hover:text-primary hover:underline"
          >
            See breakdown
          </button>

          <Button
            size="pill-xs"
            onClick={() => onSendMatch(profile)}
            className="bg-[#6d2504] dark:bg-primary px-4 font-medium text-white shadow-xs transition-all hover:bg-[#581e03] hover:shadow"
          >
            Send match
          </Button>
        </div>
      </div>
    </div>
  )
}
