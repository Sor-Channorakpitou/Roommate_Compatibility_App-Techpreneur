import type * as React from "react"
import { cn } from "cn"

import { Eyebrow } from "@/components/common/eyebrow"

type SectionIntroProps = {
  eyebrow: string
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
}

/** Centered kicker + heading + supporting copy used by every content section. */
function SectionIntro({
  eyebrow,
  title,
  description,
  className,
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-[42rem] flex-col items-center gap-2 text-center",
        className
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-heading text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.25] tracking-[-0.015em] text-balance text-foreground">
        {title}
      </h2>
      {description ? (
        <p className="text-[0.9375rem] leading-[1.55] text-pretty text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export { SectionIntro }
