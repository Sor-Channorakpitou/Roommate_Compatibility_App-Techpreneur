import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "cn"

export const WIZARD_STEPS = [
  { step: 1, label: "Room details" },
  { step: 2, label: "Roommates" },
  { step: 3, label: "House rules" },
  { step: 4, label: "Chores & bills" },
  { step: 5, label: "Review" },
]

type StepWizardNavProps = {
  currentStep: number
  onStepChange: (step: number) => void
}

export function StepWizardNav({
  currentStep,
  onStepChange,
}: StepWizardNavProps) {
  return (
    <nav aria-label="Room setup progress" className="w-full overflow-x-auto py-2">
      <ol className="flex min-w-[620px] items-center justify-between gap-3">
        {WIZARD_STEPS.map((item, index) => {
          const isActive = item.step === currentStep
          const isCompleted = item.step < currentStep

          return (
            <React.Fragment key={item.step}>
              <li className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onStepChange(item.step)}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-full text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7a3418] focus-visible:ring-offset-2",
                    isActive && "cursor-default"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                      isActive && "bg-[#7a3418] text-white shadow-xs",
                      isCompleted && "bg-[#d8eed9] text-[#24672e]",
                      !isActive && !isCompleted && "bg-[#ede4da] text-[#7a3418] group-hover:bg-[#e2d7cb]"
                    )}
                  >
                    {isCompleted ? <Check className="size-3.5" /> : item.step}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium whitespace-nowrap transition-colors",
                      isActive
                        ? "font-semibold text-[#7a3418]"
                        : isCompleted
                          ? "text-foreground font-medium"
                          : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </li>

              {index < WIZARD_STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "h-px flex-1 min-w-6 transition-colors",
                    item.step < currentStep ? "bg-[#7a3418]/30" : "bg-[#e5dbd1]"
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
