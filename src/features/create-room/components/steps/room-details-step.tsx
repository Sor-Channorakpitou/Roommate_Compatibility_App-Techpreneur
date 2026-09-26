import { ChevronDown, Home, Lock, MapPin, Users } from "lucide-react"
import { cn } from "cn"

import { Input } from "@/components/ui/input"
import {
  ARRANGEMENT_OPTIONS,
  MEMBER_LIMITS,
  PHNOM_PENH_DISTRICTS,
} from "../../data/create-room-defaults"
import {
  minMemberCount,
  type RoomDraftActions,
} from "../../hooks/use-room-draft"
import {
  formatUsd,
  rentPerPerson,
  ROOM_NAME_MAX_LENGTH,
} from "../../lib/room-calculations"
import type { RoomArrangement, RoomDraft, RoomDraftErrors } from "../../types"
import { fieldAria, fieldControlClass } from "../../lib/form-field-helpers"
import { FieldAdornment, FormField } from "../form-field"
import { MemberCounter } from "../member-counter"
import { StepCard, type WizardStepProps } from "../step-card"

type RoomDetailsStepProps = Pick<
  RoomDraftActions,
  "update" | "setMemberCount"
> & {
  draft: RoomDraft
  errors: RoomDraftErrors
} & WizardStepProps

const ARRANGEMENT_ICONS: Record<RoomArrangement, typeof Lock> = {
  private: Lock,
  shared: Users,
}

export function RoomDetailsStep({
  draft,
  errors,
  update,
  setMemberCount,
  footer,
}: RoomDetailsStepProps) {
  return (
    <StepCard id="room-details" number={1} title="Room details" footer={footer}>
      <div className="flex flex-col gap-6">
        <FormField
          label="Home or Apartment Name"
          htmlFor="room-name"
          hint="A cozy, memorable title that your future roommates will identify with."
          error={errors.name}
        >
          <div className="relative">
            <Input
              {...fieldAria("room-name", errors.name, true)}
              value={draft.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="e.g. Sunflower Sanctuary"
              autoComplete="off"
              maxLength={ROOM_NAME_MAX_LENGTH}
              className={cn(fieldControlClass, "pr-10")}
            />
            <FieldAdornment side="end">
              <Home />
            </FieldAdornment>
          </div>
        </FormField>

        <div className="grid gap-4 @md:grid-cols-2">
          <FormField
            label="District / Sangkat"
            htmlFor="room-district"
            error={errors.district}
          >
            <div className="relative">
              <select
                {...fieldAria("room-district", errors.district)}
                value={draft.district}
                onChange={(e) => update({ district: e.target.value })}
                className={cn(
                  fieldControlClass,
                  "w-full appearance-none border pr-10 outline-none focus-visible:ring-3"
                )}
              >
                <option value="" disabled>
                  Select a district
                </option>
                {PHNOM_PENH_DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <FieldAdornment side="end">
                <ChevronDown />
              </FieldAdornment>
            </div>
          </FormField>

          <FormField label="Street or Landmark" htmlFor="room-street">
            <div className="relative">
              <Input
                id="room-street"
                value={draft.street}
                onChange={(e) => update({ street: e.target.value })}
                placeholder="e.g. St 315, near TK Avenue"
                className={cn(fieldControlClass, "pr-10")}
              />
              <FieldAdornment side="end">
                <MapPin />
              </FieldAdornment>
            </div>
          </FormField>
        </div>

        <div className="grid gap-4 @xl:grid-cols-3">
          <FormField
            label="Total Monthly Rent (USD)"
            htmlFor="room-rent"
            hint={
              draft.monthlyRent
                ? `Split evenly is ${formatUsd(rentPerPerson(draft))}/p`
                : undefined
            }
            error={errors.monthlyRent}
          >
            <div className="relative">
              <FieldAdornment side="start">
                <span className="text-base">$</span>
              </FieldAdornment>
              <Input
                {...fieldAria("room-rent", errors.monthlyRent, true)}
                type="number"
                inputMode="numeric"
                min={0}
                step={10}
                value={draft.monthlyRent ?? ""}
                onChange={(e) =>
                  update({
                    monthlyRent:
                      e.target.value === "" ? null : Number(e.target.value),
                  })
                }
                className={cn(fieldControlClass, "pl-8")}
              />
            </div>
          </FormField>

          <FormField
            label="Move-in Date"
            htmlFor="room-move-in"
            error={errors.moveInDate}
          >
            <Input
              {...fieldAria("room-move-in", errors.moveInDate)}
              type="date"
              value={draft.moveInDate}
              onChange={(e) => update({ moveInDate: e.target.value })}
              className={fieldControlClass}
            />
          </FormField>

          <FormField
            label="Lease End Date"
            htmlFor="room-lease-end"
            error={errors.leaseEndDate}
          >
            <Input
              {...fieldAria("room-lease-end", errors.leaseEndDate)}
              type="date"
              min={draft.moveInDate || undefined}
              value={draft.leaseEndDate}
              onChange={(e) => update({ leaseEndDate: e.target.value })}
              className={fieldControlClass}
            />
          </FormField>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-semibold tracking-[0.01em] text-foreground">
            Room Arrangement Type
          </legend>
          <div className="grid gap-4 @xl:grid-cols-2">
            {ARRANGEMENT_OPTIONS.map((option) => {
              const isSelected = draft.arrangement === option.value
              const Icon = ARRANGEMENT_ICONS[option.value]
              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer gap-4 rounded-2xl p-[1.0625rem] transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                    isSelected
                      ? "border-2 border-brand bg-surface p-4 shadow-card"
                      : "border border-border/60 bg-card hover:bg-surface/60"
                  )}
                >
                  <input
                    type="radio"
                    name="room-arrangement"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => update({ arrangement: option.value })}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                      isSelected ? "border-brand" : "border-subtle-foreground"
                    )}
                  >
                    {isSelected && (
                      <span className="size-2.5 rounded-full bg-brand" />
                    )}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 font-heading text-xl text-foreground">
                      {option.title}
                      <Icon aria-hidden className="size-3.5 text-brand" />
                    </span>
                    <span className="text-[0.8125rem] leading-normal text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-muted pt-6">
          <div>
            <h3
              id="member-count-label"
              className="text-sm font-semibold tracking-[0.01em] text-foreground"
            >
              Total household members
            </h3>
            <p className="text-[0.8125rem] text-muted-foreground">
              Including yourself. You can add or reassign slots anytime.
            </p>
          </div>
          <MemberCounter
            labelledBy="member-count-label"
            value={draft.memberCount}
            min={minMemberCount(draft)}
            max={MEMBER_LIMITS.max}
            onChange={setMemberCount}
          />
        </div>
      </div>
    </StepCard>
  )
}
