import * as React from "react"
import {
  AtSign,
  CircleCheck,
  Clock,
  Copy,
  Info,
  Link2,
  Send,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GUEST_HOST_NAME } from "../../data/create-room-defaults"
import type { RoomDraftActions } from "../../hooks/use-room-draft"
import {
  formatUsd,
  isValidInviteContact,
  joinLink,
  rentPerPerson,
} from "../../lib/room-calculations"
import type { RoomDraft } from "../../types"
import { fieldControlClass } from "../../lib/form-field-helpers"
import { FieldAdornment } from "../form-field"
import { MemberAvatar } from "../member-avatar"
import { StepCard, type WizardStepProps } from "../step-card"

type RoommatesStepProps = Pick<
  RoomDraftActions,
  "addInvitee" | "removeInvitee"
> & {
  draft: RoomDraft
  hostName: string
} & WizardStepProps

export function RoommatesStep({
  draft,
  hostName,
  addInvitee,
  removeInvitee,
  footer,
}: RoommatesStepProps) {
  const [contact, setContact] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  const allocatedSlots = draft.invitees.length + 1
  const link = joinLink(draft)
  const share = formatUsd(rentPerPerson(draft))

  function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = contact.trim()

    if (!isValidInviteContact(value)) {
      setError("Enter a Telegram @handle or a valid email address.")
      return
    }
    if (allocatedSlots >= draft.memberCount) {
      setError(
        `All ${draft.memberCount} slots are allocated. Add a member in Step 1 first.`
      )
      return
    }
    if (
      draft.invitees.some(
        (i) => i.contact.toLowerCase() === value.toLowerCase()
      )
    ) {
      setError(`${value} has already been invited.`)
      return
    }

    addInvitee({ id: crypto.randomUUID(), name: value, contact: value })
    setContact("")
    setError(null)
    toast.success(`${value} added to your roster`)
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(`https://${link}`)
      toast.success("Invite link copied")
    } catch {
      toast.error("Couldn't copy the link. Select and copy it manually.")
    }
  }

  return (
    <StepCard
      id="roommates"
      number={2}
      title="Roommates"
      description="Send invites via email, Telegram, or generate an instant join link."
      footer={footer}
    >
      <div className="flex flex-col gap-6">
        <form
          noValidate
          onSubmit={handleInvite}
          className="flex flex-col gap-2"
        >
          <label
            htmlFor="invite-contact"
            className="text-sm font-semibold tracking-[0.01em] text-foreground"
          >
            Invite by username or email
          </label>
          <div className="flex flex-col gap-3 @md:flex-row">
            <div className="relative flex-1">
              <FieldAdornment side="start">
                <AtSign />
              </FieldAdornment>
              <Input
                id="invite-contact"
                value={contact}
                onChange={(e) => {
                  setContact(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="Telegram @handle or email address"
                autoComplete="off"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "invite-contact-error" : undefined}
                className={cn(fieldControlClass, "py-3.5 pl-10")}
              />
            </div>
            <Button
              type="submit"
              className="h-auto rounded-xl px-6 py-3 text-sm font-semibold shadow-card"
            >
              <Send className="size-3.5" />
              Send invite
            </Button>
          </div>
          {error && (
            <p id="invite-contact-error" className="text-xs text-destructive">
              {error}
            </p>
          )}
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/40 bg-surface p-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link2 aria-hidden className="size-5 shrink-0 text-brand" />
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.02em] text-foreground">
                Instant Join Link
              </p>
              <p className="truncate text-[0.8125rem] text-subtle-foreground">
                {link}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="pill-xs"
            onClick={handleCopyLink}
            className="border-border/80 bg-transparent px-4 font-semibold"
          >
            <Copy />
            Copy invite link
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold tracking-[0.01em] text-foreground">
            Household Roster ({allocatedSlots} of {draft.memberCount} slots
            allocated)
          </h3>

          <ul className="flex flex-col gap-3">
            <li className="flex items-center justify-between gap-3 rounded-xl bg-muted p-4">
              <div className="flex min-w-0 items-center gap-4">
                <MemberAvatar name={hostName} isHost size="lg" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {hostName === GUEST_HOST_NAME
                      ? hostName
                      : `${hostName} (You)`}
                  </p>
                  <p className="truncate text-[0.8125rem] text-muted-foreground">
                    Primary Leaseholder · Master Bedroom
                  </p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sage px-3 py-1 text-xs font-bold text-sage-foreground">
                <CircleCheck aria-hidden className="size-2.5" />
                Host
              </span>
            </li>

            {draft.invitees.map((invitee, index) => (
              <li
                key={invitee.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/30 bg-surface p-4"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <MemberAvatar name={invitee.name} size="lg" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {invitee.name}
                    </p>
                    <p className="truncate text-[0.8125rem] text-muted-foreground">
                      {invitee.contact} · Bedroom {index + 2} ({share}/mo)
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-peach px-3 py-1 text-xs font-bold text-peach-foreground">
                    <Clock aria-hidden className="size-2.5" />
                    Pending
                  </span>
                  <button
                    type="button"
                    onClick={() => removeInvitee(invitee.id)}
                    aria-label={`Cancel invite for ${invitee.name}`}
                    className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p className="flex items-center gap-1.5 text-[0.8125rem] text-subtle-foreground italic">
            <Info aria-hidden className="size-3 shrink-0" />
            Invited roommates are saved with your room when you publish.
          </p>
        </div>
      </div>
    </StepCard>
  )
}
