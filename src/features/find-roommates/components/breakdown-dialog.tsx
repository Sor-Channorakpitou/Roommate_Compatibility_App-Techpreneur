import { CheckCircle2, MapPin, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { RoommateProfile } from "../data/roommates-data"

type BreakdownDialogProps = {
  profile: RoommateProfile | null
  onClose: () => void
  onSendMatch: (profile: RoommateProfile) => void
}

export function BreakdownDialog({
  profile,
  onClose,
  onSendMatch,
}: BreakdownDialogProps) {
  if (!profile) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Window */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Top Banner Header */}
        <div className="relative flex items-center justify-between bg-[#efe6d8] dark:bg-stone-800 p-6 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#dccdb9] dark:bg-stone-700 font-roboto-slab text-2xl font-light text-[#7a644d] dark:text-stone-300 shadow-xs">
              {profile.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-roboto-slab text-2xl font-medium tracking-tight text-foreground">
                  {profile.name}, {profile.age}
                </h3>
                <span className="rounded-full bg-[#d4f2d2] dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-[#1f561d] dark:text-emerald-300">
                  {profile.matchScore}% match
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-0.5">
                <MapPin className="size-3.5 text-primary" />
                {profile.area} • {profile.priceDisplay}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 flex flex-col gap-6">
          {/* Bio */}
          {profile.bio && (
            <div className="rounded-2xl bg-surface/60 p-4 border border-border/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                About {profile.name.split(" ")[0]}
              </h4>
              <p className="text-sm leading-relaxed text-foreground">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Lifestyle Breakdown Header */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="size-4 text-primary" />
              <h4 className="font-roboto-slab text-lg font-semibold tracking-tight text-foreground">
                Lifestyle Compatibility Breakdown
              </h4>
            </div>

            <div className="flex flex-col gap-4">
              {profile.breakdown.map((item) => (
                <div
                  key={item.category}
                  className="flex flex-col gap-1.5 rounded-xl bg-background p-3.5 border border-border/40"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {item.category}
                    </span>
                    <span className="font-bold text-primary text-xs">
                      {item.score}% sync
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="size-3 text-sage-foreground shrink-0" />
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between border-t border-border/40 bg-surface/40 p-4 px-6">
          <Button variant="ghost" size="pill" onClick={onClose}>
            Close
          </Button>

          <Button
            size="pill"
            onClick={() => {
              onSendMatch(profile)
              onClose()
            }}
            className="bg-[#6d2504] dark:bg-primary font-medium text-white hover:bg-[#581e03]"
          >
            Send Match Request
          </Button>
        </div>
      </div>
    </div>
  )
}
