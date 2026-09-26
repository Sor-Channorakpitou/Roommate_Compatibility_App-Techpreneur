import * as React from "react"
import {
  CigaretteOff,
  CirclePlus,
  Moon,
  Snowflake,
  SprayCan,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AC_TEMPERATURE,
  GUEST_POLICY_OPTIONS,
  HOUSE_HABITS,
} from "../../data/create-room-defaults"
import type { RoomDraftActions } from "../../hooks/use-room-draft"
import { acModeLabel, countConfiguredRules } from "../../lib/room-calculations"
import type { RoomDraft } from "../../types"
import { fieldControlClass } from "../../lib/form-field-helpers"
import { StepCard, type WizardStepProps } from "../step-card"

type HouseRulesStepProps = Pick<
  RoomDraftActions,
  "updateRules" | "addGuideline" | "removeGuideline"
> & {
  draft: RoomDraft
} & WizardStepProps

export function HouseRulesStep({
  draft,
  updateRules,
  addGuideline,
  removeGuideline,
  footer,
}: HouseRulesStepProps) {
  const { rules } = draft
  const guestPolicy = GUEST_POLICY_OPTIONS.find(
    (option) => option.value === rules.guestPolicy
  )

  return (
    <StepCard
      id="house-rules"
      number={3}
      title="House rules & routine harmony"
      description="Eliminate misunderstandings with upfront shared expectations."
      footer={footer}
      aside={
        <span className="text-xs text-muted-foreground">
          {countConfiguredRules(draft)} rules configured
        </span>
      }
    >
      <div className="grid gap-6 @2xl:grid-cols-2">
        <RuleTile
          icon={Moon}
          title="Quiet Hours"
          titleId="quiet-hours-title"
          aside={
            <span className="text-xs font-bold text-sage-foreground">
              Active
            </span>
          }
        >
          <div
            role="group"
            aria-labelledby="quiet-hours-title"
            className="grid grid-cols-2 gap-2"
          >
            <TimeBox
              label="Start"
              value={rules.quietHours.start}
              onChange={(start) =>
                updateRules({ quietHours: { ...rules.quietHours, start } })
              }
            />
            <TimeBox
              label="End"
              value={rules.quietHours.end}
              onChange={(end) =>
                updateRules({ quietHours: { ...rules.quietHours, end } })
              }
            />
          </div>
        </RuleTile>

        <RuleTile
          icon={Users}
          title="Guest Policy"
          titleId="guest-policy-title"
        >
          <div
            role="radiogroup"
            aria-labelledby="guest-policy-title"
            className="grid grid-cols-3 gap-1.5"
          >
            {GUEST_POLICY_OPTIONS.map((option) => {
              const isSelected = option.value === rules.guestPolicy
              return (
                <label
                  key={option.value}
                  className={cn(
                    "cursor-pointer rounded-full border px-2 py-[0.4375rem] text-center text-xs whitespace-nowrap transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                    isSelected
                      ? "border-brand bg-brand font-bold text-brand-foreground"
                      : "border-border text-muted-foreground hover:bg-card"
                  )}
                >
                  <input
                    type="radio"
                    name="guest-policy"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => updateRules({ guestPolicy: option.value })}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              )
            })}
          </div>
          <p className="text-xs text-subtle-foreground">
            {rules.guestPolicy === "with-notice" ? "Notice window" : "Policy"}:{" "}
            <strong className="font-bold">{guestPolicy?.detail}</strong>
          </p>
        </RuleTile>

        <RuleTile
          icon={Snowflake}
          title="AC Eco Temp"
          titleId="ac-temp-title"
          aside={
            <output
              htmlFor="ac-temperature"
              className="font-heading text-xl whitespace-nowrap text-primary"
            >
              {rules.acTemperature}°C {acModeLabel(rules.acTemperature)}
            </output>
          }
        >
          <input
            id="ac-temperature"
            type="range"
            min={AC_TEMPERATURE.min}
            max={AC_TEMPERATURE.max}
            step={1}
            value={rules.acTemperature}
            onChange={(e) =>
              updateRules({ acTemperature: Number(e.target.value) })
            }
            aria-labelledby="ac-temp-title"
            aria-valuetext={`${rules.acTemperature} degrees, ${acModeLabel(rules.acTemperature)}`}
            className="mt-1 h-4 w-full cursor-pointer accent-brand"
          />
          <div className="flex justify-between gap-2 text-[0.6875rem] whitespace-nowrap text-subtle-foreground">
            <span>Cool (22°C)</span>
            <span>Balanced (25°C)</span>
            <span>Eco (26°C+)</span>
          </div>
        </RuleTile>

        <RuleTile icon={SprayCan} title="Cleanliness & Habits">
          <ul className="flex flex-col gap-2">
            {HOUSE_HABITS.map((habit) => (
              <li
                key={habit.label}
                className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 rounded-lg border border-border/30 bg-card px-3 py-[0.4375rem] text-xs"
              >
                <span className="text-muted-foreground">{habit.label}</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 font-bold",
                    habit.tone === "negative"
                      ? "text-destructive"
                      : "text-sage-foreground"
                  )}
                >
                  {habit.tone === "negative" && (
                    <CigaretteOff aria-hidden className="size-2.5" />
                  )}
                  {habit.value}
                </span>
              </li>
            ))}
          </ul>
        </RuleTile>
      </div>

      <CustomGuidelines
        guidelines={rules.customGuidelines}
        onAdd={addGuideline}
        onRemove={removeGuideline}
      />
    </StepCard>
  )
}

function RuleTile({
  icon: Icon,
  title,
  titleId,
  aside,
  children,
}: {
  icon: LucideIcon
  title: string
  titleId?: string
  aside?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 self-start rounded-xl border border-border/30 bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <h3
          id={titleId}
          className="flex items-center gap-2 text-sm font-semibold tracking-[0.01em] text-foreground"
        >
          <Icon aria-hidden className="size-4 text-brand" />
          {title}
        </h3>
        {aside}
      </div>
      {children}
    </div>
  )
}

function TimeBox({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="flex flex-col items-center rounded-lg border border-border/40 bg-card px-2 pt-2 pb-2.5 focus-within:ring-3 focus-within:ring-ring/50">
      <span className="text-[0.6875rem] text-subtle-foreground">{label}</span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // The picker icon eats the narrow box; clicking the field opens it instead.
        onClick={(e) => e.currentTarget.showPicker?.()}
        className="w-full min-w-0 bg-transparent text-center text-base text-foreground tabular-nums outline-none [&::-webkit-calendar-picker-indicator]:hidden"
      />
    </label>
  )
}

function CustomGuidelines({
  guidelines,
  onAdd,
  onRemove,
}: {
  guidelines: string[]
  onAdd: (text: string) => void
  onRemove: (index: number) => void
}) {
  const [isAdding, setIsAdding] = React.useState(false)
  const [text, setText] = React.useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = text.trim()
    if (!value) return
    onAdd(value)
    setText("")
    setIsAdding(false)
  }

  return (
    <div className="flex flex-col gap-3">
      {guidelines.length > 0 && (
        <ul className="flex flex-col gap-2">
          {guidelines.map((guideline, index) => (
            <li
              key={`${guideline}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/30 bg-surface px-3 py-2 text-sm text-foreground"
            >
              {guideline}
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Remove guideline: ${guideline}`}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {isAdding ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 @md:flex-row"
        >
          <Input
            autoFocus
            aria-label="New household guideline"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setIsAdding(false)}
            placeholder="e.g. Shoes off at the door"
            className={cn(fieldControlClass, "flex-1 py-2.5")}
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="brand"
              className="h-auto rounded-xl px-5 py-2.5"
            >
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAdding(false)}
              className="h-auto rounded-xl px-4 py-2.5"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-semibold text-brand hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <CirclePlus aria-hidden className="size-4" />
          Add custom household guideline
        </button>
      )}
    </div>
  )
}
