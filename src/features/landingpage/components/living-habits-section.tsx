import { cn } from "cn"

import { SectionIntro } from "@/components/common/section-intro"
import { Card, CardContent } from "@/components/ui/card"
import { livingHabits } from "@/features/landingpage/data/landing-content"

function LivingHabitsSection() {
  return (
    <section
      aria-labelledby="living-habits-heading"
      className="flex flex-col gap-12"
    >
      <SectionIntro
        eyebrow="Domestic harmony"
        title={
          <span id="living-habits-heading">
            Core living habits that matter most.
          </span>
        }
        description="Personality tests don't predict shared quiet hours or kitchen standards. We focus on real everyday routines."
      />

      <ul className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
        {livingHabits.map(
          ({ id, title, description, icon: Icon, accentClassName }) => (
            <li key={id} className="h-full">
              <Card className="h-full rounded-xl shadow-card ring-0 [--card-spacing:--spacing(8)]">
                <CardContent className="flex flex-col gap-4">
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full",
                      accentClassName
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-heading text-xl leading-[1.4] text-foreground">
                      {title}
                    </h3>
                    <p className="text-[0.9375rem] leading-[1.55] text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          )
        )}
      </ul>
    </section>
  )
}

export { LivingHabitsSection }
