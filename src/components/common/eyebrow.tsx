import type * as React from "react"
import { cn } from "cn"

/**
 * Small uppercase kicker that sits above a section heading.
 *
 * `tracking` mirrors the two values used in the design: the default 0.05em for
 * section kickers, and 0.08em for the tighter badge-style labels.
 */
function Eyebrow({
  className,
  tracking = "wide",
  ...props
}: React.ComponentProps<"p"> & { tracking?: "wide" | "wider" }) {
  return (
    <p
      data-slot="eyebrow"
      className={cn(
        "text-[0.6875rem] leading-[1.2] font-bold text-primary uppercase",
        tracking === "wide" ? "tracking-[0.05em]" : "tracking-[0.08em]",
        className
      )}
      {...props}
    />
  )
}

export { Eyebrow }
