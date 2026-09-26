import { Minus, Plus } from "lucide-react"

type MemberCounterProps = {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  labelledBy: string
}

export function MemberCounter({
  value,
  min,
  max,
  onChange,
  labelledBy,
}: MemberCounterProps) {
  const buttonClass =
    "flex size-9 items-center justify-center rounded-full bg-card text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3.5"

  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      className="flex shrink-0 items-center rounded-full border border-border/60 bg-surface p-1"
    >
      <button
        type="button"
        aria-label="Remove a member"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={buttonClass}
      >
        <Minus />
      </button>
      <output
        aria-live="polite"
        className="min-w-16 text-center font-heading text-xl text-primary"
      >
        {value}
      </output>
      <button
        type="button"
        aria-label="Add a member"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={buttonClass}
      >
        <Plus />
      </button>
    </div>
  )
}
