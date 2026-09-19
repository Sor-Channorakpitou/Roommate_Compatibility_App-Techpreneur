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
        className="fixed inset-0 animate-in bg-black/40 backdrop-blur-xs transition-opacity fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Window */}
      <div className="relative z-10 w-full max-w-lg animate-in overflow-hidden rounded-3xl border border-border bg-card shadow-2xl duration-200 zoom-in-95">
        {/* Top Banner Header */}
        <div className="relative flex items-center justify-between bg-secondary p-6 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-border font-heading text-2xl font-light text-muted-foreground shadow-xs">
              {profile.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-2xl font-medium tracking-tight text-foreground">
                  {profile.name}, {profile.age}
                </h3>
                <span className="rounded-full bg-sage px-2.5 py-0.5 text-xs font-bold text-sage-foreground">
                  {profile.matchScore}% match
                </span>
              </div>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <MapPin className="size-3.5 text-primary" />
                {profile.area} • {profile.priceDisplay}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex max-h-[70vh] flex-col gap-6 overflow-y-auto p-6">
          {/* Bio */}
          {profile.bio && (
            <div className="rounded-2xl border border-border/40 bg-surface/60 p-4">
              <h4 className="mb-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                About {profile.name.split(" ")[0]}
              </h4>
              <p className="text-sm leading-relaxed text-foreground">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Lifestyle Breakdown Header */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h4 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                Lifestyle Compatibility Breakdown
              </h4>
            </div>

            <div className="flex flex-col gap-4">
              {profile.breakdown.map((item) => (
                <div
                  key={item.category}
                  className="flex flex-col gap-1.5 rounded-xl border border-border/40 bg-background p-3.5"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-primary">
                      {item.score}% sync
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>

                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <CheckCircle2 className="size-3 shrink-0 text-sage-foreground" />
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
            className="font-medium hover:bg-primary/90"
          >
            Send Match Request
          </Button>
        </div>
      </div>
    </div>
  )
}
