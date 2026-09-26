import { Building2, Check } from "lucide-react"
import { cn } from "cn"

import { Container } from "@/components/layout/container"
import { WIZARD_STEPS } from "../data/create-room-defaults"
import { useNow } from "../hooks/use-now"
import type { StepId } from "../types"

type WizardHeaderProps = {
  activeStep: StepId
  /** Index of the furthest step reached; later steps stay locked. */
  furthestIndex: number
  savedAt: number | null
  onStepSelect: (step: StepId) => void
}

function formatSavedAgo(savedAt: number, now: number) {
  const minutes = Math.floor(Math.max(0, now - savedAt) / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return new Date(savedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function WizardHeader({
  activeStep,
  furthestIndex,
  savedAt,
  onStepSelect,
}: WizardHeaderProps) {
  const now = useNow()
  const activeIndex = WIZARD_STEPS.findIndex((step) => step.id === activeStep)

  return (
    <section className="border-b border-border/20 bg-surface pt-8 pb-6">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.05em] text-brand uppercase">
              <Building2 aria-hidden className="size-3.5" />
              Room setup wizard
            </p>
            <h1 className="font-heading text-4xl leading-tight tracking-[-0.025em] text-primary">
              Create your room
            </h1>
            <p className="text-[0.9375rem] leading-normal text-muted-foreground">
              Set up your shared home in a few minutes. Build quiet rules, split
              transparent bills, and invite your crew.
            </p>
          </div>

          <p
            aria-live="polite"
            className="flex items-center gap-3 rounded-full border border-border/40 bg-background px-4 py-1.5 text-[0.8125rem] text-muted-foreground shadow-soft"
          >
            <span
              aria-hidden
              className={cn(
                "size-2 rounded-full",
                savedAt ? "bg-sage-foreground" : "bg-surface-dim"
              )}
            />
            {savedAt
              ? `Draft autosaved ${formatSavedAgo(savedAt, now)}`
              : "Draft not saved yet"}
          </p>
        </div>

        <nav
          aria-label="Room setup progress"
          className="no-scrollbar overflow-x-auto pb-2"
        >
          <ol className="relative flex min-w-[700px] items-center justify-between">
            <span
              aria-hidden
              className="absolute inset-x-6 top-1/2 h-0.5 -translate-y-1/2 bg-surface-dim"
            />
            {WIZARD_STEPS.map((step, index) => {
              const status =
                index === activeIndex
                  ? "active"
                  : index <= furthestIndex
                    ? "complete"
                    : "upcoming"
              return (
                <li
                  key={step.id}
                  className="relative bg-surface px-4 first:pl-0 last:pr-0"
                >
                  <button
                    type="button"
                    onClick={() => onStepSelect(step.id)}
                    disabled={status === "upcoming"}
                    aria-current={status === "active" ? "step" : undefined}
                    className="flex items-center gap-3 rounded-full text-sm tracking-[0.01em] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 enabled:cursor-pointer disabled:cursor-not-allowed [&:enabled:not([aria-current])]:hover:opacity-80"
                  >
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full text-xs ring-4 ring-surface",
                        status === "active" &&
                          "bg-brand font-bold text-brand-foreground shadow-card",
                        status === "complete" &&
                          "bg-peach font-semibold text-peach-foreground",
                        status === "upcoming" &&
                          "bg-surface-dim font-semibold text-muted-foreground"
                      )}
                    >
                      {status === "complete" ? (
                        <Check aria-label="Completed" className="size-3.5" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span
                      className={cn(
                        status === "active"
                          ? "font-bold text-primary"
                          : "font-semibold text-muted-foreground",
                        status === "complete" && "text-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>
      </Container>
    </section>
  )
}
