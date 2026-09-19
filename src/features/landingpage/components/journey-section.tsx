import { cn } from "cn"

import { SectionIntro } from "@/components/common/section-intro"
import { Card, CardContent } from "@/components/ui/card"
import { journeySteps } from "@/features/landingpage/data/landing-content"

function JourneySection() {
  return (
    <section
      aria-labelledby="journey-heading"
      className="flex flex-col items-center gap-12 rounded-xl bg-surface-sand p-6 sm:p-8 lg:gap-14 lg:p-12"
    >
      <SectionIntro
        eyebrow="How it works"
        title={<span id="journey-heading">Three gentle steps to move-in.</span>}
        className="max-w-[36rem] gap-1"
      />

      <ol className="grid w-full items-start gap-6 md:grid-cols-3">
        {journeySteps.map(
          ({ id, step, title, description, accentClassName }) => (
            <li key={id} className="h-full">
              <Card className="h-full rounded-xl shadow-card ring-0 [--card-spacing:--spacing(8)]">
                <CardContent className="flex flex-col gap-3">
                  <p
                    className={cn(
                      "font-heading text-2xl leading-[1.35]",
                      accentClassName
                    )}
                  >
                    {step}
                  </p>
                  <h3 className="font-heading text-xl leading-[1.4] text-foreground">
                    {title}
                  </h3>
                  <p className="text-[0.9375rem] leading-[1.55] text-muted-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            </li>
          )
        )}
      </ol>
    </section>
  )
}

export { JourneySection }
