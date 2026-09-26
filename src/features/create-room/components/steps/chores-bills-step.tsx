import {
  Droplet,
  ListChecks,
  ReceiptText,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { Switch } from "@/components/ui/switch"
import type { RoomDraftActions } from "../../hooks/use-room-draft"
import {
  firstName,
  formatUsd,
  splitRatioLabel,
  utilityShare,
} from "../../lib/room-calculations"
import type { Chore, RoomDraft, UtilityKind } from "../../types"
import { StepCard, type WizardStepProps } from "../step-card"

type ChoresBillsStepProps = Pick<RoomDraftActions, "update"> & {
  draft: RoomDraft
  hostName: string
} & WizardStepProps

const UTILITY_ICONS: Record<UtilityKind, LucideIcon> = {
  electricity: Zap,
  water: Droplet,
  internet: Wifi,
}

export function ChoresBillsStep({
  draft,
  hostName,
  update,
  footer,
}: ChoresBillsStepProps) {
  function assigneeLabel(chore: Chore) {
    if (chore.assignee === "host") return `Assigned: ${firstName(hostName)}`
    const invitee = draft.invitees.find((i) => i.id === chore.assignee)
    return invitee
      ? `Assigned: ${firstName(invitee.name.replace(/^@/, ""))}`
      : "Shared task"
  }

  return (
    <StepCard
      id="chores-bills"
      number={4}
      title="Chores and bill splitting"
      description="Fair rotational tasks and automated monthly bill breakdowns."
      footer={footer}
      aside={
        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          Automatic Split
        </span>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-[0.01em] text-foreground">
              <ListChecks aria-hidden className="size-5 text-brand" />
              Default Household Chores
            </h3>
            <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
              Rotate weekly:
              <Switch
                checked={draft.rotateChoresWeekly}
                onCheckedChange={(rotateChoresWeekly) =>
                  update({ rotateChoresWeekly })
                }
              />
            </label>
          </div>

          <ul className="grid gap-3 @xl:grid-cols-3">
            {draft.chores.map((chore) => (
              <li
                key={chore.id}
                className="flex flex-col items-start gap-1 rounded-xl border border-border/30 bg-surface p-3"
              >
                <p className="text-xs font-semibold tracking-[0.02em] text-foreground">
                  {chore.title}
                </p>
                <p className="pb-1 text-xs text-subtle-foreground">
                  {chore.schedule}
                </p>
                <span className="rounded bg-muted px-2 py-0.5 text-[0.6875rem] text-muted-foreground">
                  {assigneeLabel(chore)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 border-t border-muted pt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold tracking-[0.01em] text-foreground">
            <ReceiptText aria-hidden className="size-5 text-brand" />
            Monthly Utilities Configuration
          </h3>
          <ul className="flex flex-col gap-2">
            {draft.utilities.map((utility) => {
              const Icon = UTILITY_ICONS[utility.kind]
              const share = utilityShare(utility, draft.memberCount)
              return (
                <li
                  key={utility.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card text-brand">
                      <Icon aria-hidden className="size-3.5" />
                    </span>
                    <div className="min-w-0 text-xs">
                      <p className="font-semibold tracking-[0.02em] text-foreground">
                        {utility.name}
                      </p>
                      <p className="mt-1 text-subtle-foreground">
                        {utility.dueNote} · {splitRatioLabel(draft.memberCount)}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-foreground">
                    {utility.isEstimate && "~"}
                    {formatUsd(share)} / person
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </StepCard>
  )
}
