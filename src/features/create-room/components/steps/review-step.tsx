import type * as React from "react"
import { BadgeCheck, ThumbsUp } from "lucide-react"

import { GUEST_POLICY_OPTIONS } from "../../data/create-room-defaults"
import {
  acModeLabel,
  formatTime,
  formatUsd,
  rentPerPerson,
  utilitiesPerPerson,
} from "../../lib/room-calculations"
import type { RoomDraft, StepId } from "../../types"
import { StepCard, type WizardStepProps } from "../step-card"

type ReviewStepProps = {
  draft: RoomDraft
  hostName: string
  onEditStep: (step: StepId) => void
} & WizardStepProps

export function ReviewStep({
  draft,
  hostName,
  footer,
  onEditStep,
}: ReviewStepProps) {
  const { rules } = draft
  const guestSummary = GUEST_POLICY_OPTIONS.find(
    (option) => option.value === rules.guestPolicy
  )?.summary
  const streetShort = draft.street.split(",")[0]?.trim()
  const quietHours = `${formatTime(rules.quietHours.start, { compact: true })} - ${formatTime(rules.quietHours.end, { compact: true })}`

  return (
    <StepCard
      id="review"
      number={5}
      title="Review & Publish Room"
      description="Check everything over before you publish."
      footer={footer}
      aside={
        <BadgeCheck
          aria-label="Ready to publish"
          className="size-5 text-sage-foreground"
        />
      }
    >
      <div className="grid gap-4 pb-2 @xl:grid-cols-2">
        <SummaryTile
          title="Room details"
          onEdit={() => onEditStep("room-details")}
        >
          <p className="pt-0.5 font-heading text-xl text-foreground">
            {draft.name || "Untitled room"}
          </p>
          <p className="pt-0.5">
            {[draft.district, streetShort].filter(Boolean).join(" · ")}
          </p>
          <p>
            {draft.arrangement === "private" ? "Private" : "Shared"} room
            arrangement · {draft.memberCount} slots
          </p>
        </SummaryTile>

        <SummaryTile
          title="Financial structure"
          onEdit={() => onEditStep("room-details")}
        >
          <p className="pt-0.5 font-heading text-xl text-primary">
            {formatUsd(rentPerPerson(draft))} / person
          </p>
          <p className="pt-0.5">
            Total Rent: {formatUsd(draft.monthlyRent ?? 0)} / month
          </p>
          <p>
            Utilities average: ~{formatUsd(utilitiesPerPerson(draft))} / person
          </p>
        </SummaryTile>

        <SummaryTile
          title="Roommates roster"
          onEdit={() => onEditStep("roommates")}
        >
          <p className="pt-1 text-[0.9375rem] font-semibold text-foreground">
            {hostName} (Host)
          </p>
          {draft.invitees.length > 0 ? (
            draft.invitees.map((invitee) => (
              <p key={invitee.id}>{invitee.name} (Pending invite acceptance)</p>
            ))
          ) : (
            <p>No roommates invited yet</p>
          )}
        </SummaryTile>

        <SummaryTile
          title="Rules & living pace"
          onEdit={() => onEditStep("house-rules")}
        >
          <p className="pt-1">Quiet hours: {quietHours}</p>
          <p>{guestSummary}</p>
          <p>
            No indoor smoking · {acModeLabel(rules.acTemperature)} AC{" "}
            {rules.acTemperature}°C
          </p>
          {rules.customGuidelines.length > 0 && (
            <p>+ {rules.customGuidelines.length} custom guideline(s)</p>
          )}
        </SummaryTile>
      </div>

      <div className="flex items-start gap-4 rounded-xl border border-sage bg-sage/40 p-4">
        <ThumbsUp
          aria-hidden
          className="mt-0.5 size-5 shrink-0 text-sage-foreground"
        />
        <div>
          <p className="text-sm font-bold text-foreground">
            Your shared sanctuary is ready to launch
          </p>
          <p className="text-[0.8125rem] text-muted-foreground">
            Publishing saves your room. You can open or close it to new
            roommates, or delete it, from My Rooms.
          </p>
        </div>
      </div>
    </StepCard>
  )
}

function SummaryTile({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <div className="relative flex flex-col gap-0.5 self-start rounded-xl border border-border/30 bg-surface p-4 text-xs text-muted-foreground">
      <h3 className="pr-10 text-xs font-bold tracking-[0.05em] text-subtle-foreground uppercase">
        {title}
      </h3>
      {children}
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${title.toLowerCase()}`}
        className="absolute top-3 right-3 text-xs font-bold text-primary underline underline-offset-2 hover:text-brand"
      >
        Edit
      </button>
    </div>
  )
}
