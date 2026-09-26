import type * as React from "react"

import type { StepId } from "../types"

/** Props every step receives from the wizard shell. */
export type WizardStepProps = {
  /** Back / save / next controls, rendered pinned to the card's bottom edge. */
  footer: React.ReactNode
}

type StepCardProps = WizardStepProps & {
  id: StepId
  number: number
  title: string
  description?: string
  /** Status shown on the right of the header, e.g. a rule count. */
  aside?: React.ReactNode
  children: React.ReactNode
}

export function StepCard({
  id,
  number,
  title,
  description,
  aside,
  footer,
  children,
}: StepCardProps) {
  const headingId = `${id}-heading`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="@container flex flex-col gap-6 rounded-2xl border border-border/60 bg-card p-5 shadow-soft sm:p-8"
    >
      <header className="flex flex-col items-start gap-3 border-b border-muted pb-6 @xl:flex-row @xl:items-center @xl:justify-between @xl:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span
            aria-hidden
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground"
          >
            {number}
          </span>
          <div>
            <h2
              id={headingId}
              // Focus target after moving between steps.
              tabIndex={-1}
              className="font-heading text-xl leading-[1.35] text-foreground outline-none @md:text-2xl"
            >
              Step {number}: {title}
            </h2>
            {description && (
              <p className="text-[0.8125rem] text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </header>

      {children}

      {/* Sticks to the viewport bottom while a tall step is scrolled, so the
          next action is always in reach. */}
      <div className="sticky bottom-0 z-10 -mx-5 -mb-5 rounded-b-2xl border-t border-muted bg-card/95 px-5 py-4 backdrop-blur-sm sm:-mx-8 sm:-mb-8 sm:px-8 sm:py-5">
        {footer}
      </div>
    </section>
  )
}
