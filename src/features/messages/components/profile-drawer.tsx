import { Link } from "react-router-dom"
import { GraduationCap, ShieldCheck, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { comparisonDetail, habitTags } from "@/lib/compatibility"
import { getInitials } from "@/lib/format"
import type { Room } from "@/lib/supabase"
import type { Conversation } from "@/features/messages/types"

type ProfileDrawerProps = {
  conversation: Conversation
  /** The viewer's room to invite them to; the button hides without one. */
  inviteRoom: Room | null
  onClose: () => void
  onSendInvite: (room: Room) => void
}

export function ProfileDrawer({
  conversation,
  inviteRoom,
  onClose,
  onSendInvite,
}: ProfileDrawerProps) {
  const { partner, match } = conversation
  const name = partner?.name ?? "RoomieMatch member"
  const habits = partner ? habitTags(partner.answers) : []

  return (
    <div className="w-full flex-col border-l border-border/40 bg-[#faf8f5]/80 dark:bg-card/90 sm:w-[320px] lg:w-[340px] shrink-0 overflow-y-auto p-6 transition-all duration-200 animate-in fade-in-0 slide-in-from-right-5">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Roommate Profile
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Close profile panel"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <Avatar className="size-20 border-2 border-primary/20 shadow-xs">
          {partner?.avatar_url && <AvatarImage src={partner.avatar_url} alt="" />}
          <AvatarFallback className="bg-[#e8d8c8] text-xl font-bold text-[#522b12]">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <h3 className="mt-3 font-heading text-lg font-bold text-foreground">{name}</h3>
        {partner?.university && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <GraduationCap className="size-3" />
            {partner.university}
          </p>
        )}
      </div>

      {partner?.bio?.trim() && (
        <p className="mt-5 rounded-xl border border-border/60 bg-card p-3 text-xs leading-relaxed text-foreground">
          {partner.bio}
        </p>
      )}

      {/* Compatibility Box */}
      <div className="mt-6 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        {match ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Compatibility</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                {match.score}% match
              </span>
            </div>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-emerald-200/60 dark:bg-emerald-900/40">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${match.score}%` }}
              />
            </div>
            <ul className="mt-3 space-y-1.5">
              {match.comparisons.map((comparison) => (
                <li
                  key={comparison.key}
                  className="text-[0.75rem] leading-snug text-muted-foreground"
                >
                  <span className="font-semibold text-foreground">
                    {comparison.category}:
                  </span>{" "}
                  {comparisonDetail(comparison)}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-[0.75rem] leading-snug text-muted-foreground">
            No compatibility score yet: you both need to finish the{" "}
            <Link to="/compatibility-test" className="font-semibold text-primary underline">
              compatibility quiz
            </Link>
            .
          </p>
        )}
      </div>

      {habits.length > 0 && (
        <div className="mt-6">
          <h4 className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
            Key Habits
          </h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {habits.map((habit) => (
              <span
                key={habit}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-2xs"
              >
                {habit}
              </span>
            ))}
          </div>
        </div>
      )}

      {inviteRoom && (
        <div className="mt-6">
          <Button
            variant="brand-outline"
            size="sm"
            onClick={() => onSendInvite(inviteRoom)}
            className="w-full rounded-xl text-xs font-semibold"
          >
            Invite to {inviteRoom.name}
          </Button>
        </div>
      )}

      <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 text-[0.75rem] leading-relaxed text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
        <ShieldCheck className="size-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong className="font-bold">Safety Note:</strong> Meet in public places and verify before signing agreements or sending deposits.
        </p>
      </div>
    </div>
  )
}
