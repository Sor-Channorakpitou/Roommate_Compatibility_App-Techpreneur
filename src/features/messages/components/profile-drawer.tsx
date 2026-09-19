import { Check, MapPin, ShieldCheck, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Conversation } from "@/features/messages/types"



type ProfileDrawerProps = {
  conversation: Conversation
  onClose: () => void
  onSendInvite: (name: string) => void
  onViewFullProfile: (name: string) => void
}

export function ProfileDrawer({
  conversation,
  onClose,
  onSendInvite,
  onViewFullProfile,
}: ProfileDrawerProps) {
  return (
    <div className="w-full flex-col border-l border-border/40 bg-[#faf8f5]/80 dark:bg-card/90 sm:w-[320px] lg:w-[340px] shrink-0 overflow-y-auto p-6 transition-all duration-200 animate-in fade-in-0 slide-in-from-right-5">
      {/* Header close button */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Roommate Profile
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          title="Close profile panel"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Main Avatar & Name */}
      <div className="mt-6 flex flex-col items-center text-center">
        <div className="relative">
          <Avatar className="size-20 border-2 border-primary/20 shadow-xs">
            <AvatarFallback className={`text-xl font-bold ${conversation.avatarBg}`}>
              {conversation.initials}
            </AvatarFallback>
          </Avatar>
          {conversation.verified && (
            <span
              className="absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white ring-2 ring-card"
              title="Verified Student"
            >
              <Check className="size-3.5" />
            </span>
          )}
        </div>

        <h3 className="mt-3 font-heading text-lg font-bold text-foreground">
          {conversation.name}, {conversation.age}
        </h3>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" />
          {conversation.fullLocation}
        </p>
      </div>

      {/* Compatibility Box */}
      <div className="mt-6 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">Compatibility</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
            {conversation.matchScore}% match
          </span>
        </div>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-emerald-200/60 dark:bg-emerald-900/40">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-500"
            style={{ width: `${conversation.matchScore}%` }}
          />
        </div>
        <p className="mt-2 text-[0.75rem] leading-snug text-muted-foreground">
          Strong alignment on noise tolerance, schedule, and guest policies.
        </p>
      </div>

      {/* Key Habits */}
      <div className="mt-6">
        <h4 className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
          Key Habits
        </h4>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {conversation.keyHabits.map((habit) => (
            <span
              key={habit}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-2xs"
            >
              {habit}
            </span>
          ))}
        </div>
      </div>

      {/* Details Grid */}
      <div className="mt-6 space-y-2.5 border-t border-border/40 pt-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Monthly Budget:</span>
          <span className="font-bold text-foreground">{conversation.budget}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Move-in date:</span>
          <span className="font-bold text-foreground">Available {conversation.moveInDate}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Occupation:</span>
          <span className="font-bold text-foreground">{conversation.occupation}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewFullProfile(conversation.name)}
          className="w-full rounded-xl bg-card border-border/80 text-xs font-semibold text-foreground hover:bg-muted"
        >
          View full profile
        </Button>
        <Button
          variant="brand-outline"
          size="sm"
          onClick={() => onSendInvite(conversation.name)}
          className="w-full rounded-xl text-xs font-semibold"
        >
          Send room invite
        </Button>
      </div>

      {/* Safety Note */}
      <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 text-[0.75rem] leading-relaxed text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
        <ShieldCheck className="size-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong className="font-bold">Safety Note:</strong> Meet in public places and verify before signing agreements or sending deposits.
        </p>
      </div>
    </div>
  )
}
