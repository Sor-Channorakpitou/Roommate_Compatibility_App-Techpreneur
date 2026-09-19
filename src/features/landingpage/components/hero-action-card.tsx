import { ArrowRight } from "lucide-react"
import { cn } from "cn"

import { ButtonLink } from "@/components/common/button-link"
import type { HeroAction } from "@/features/landingpage/data/landing-content"

function HeroActionCard({ action }: { action: HeroAction }) {
  const { title, description, cta, href, icon: Icon, accentClassName } = action

  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-border/50 bg-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-xl leading-7 font-semibold text-foreground">
            {title}
          </h3>
          <p className="mt-0.5 text-[0.8125rem] leading-[1.5] text-muted-foreground">
            {description}
          </p>
        </div>
        <span
          aria-hidden
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            accentClassName
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>

      <ButtonLink href={href} size="pill" className="w-full shadow-card">
        {cta}
        <ArrowRight aria-hidden className="size-3" />
      </ButtonLink>
    </div>
  )
}

export { HeroActionCard }
