import { ShieldCheck } from "lucide-react"

import { Eyebrow } from "@/components/common/eyebrow"
import { HeroActionCard } from "@/features/landingpage/components/hero-action-card"
import { RhythmPreviewCard } from "@/features/landingpage/components/rhythm-preview-card"
import {
  featuredMatch,
  heroActions,
} from "@/features/landingpage/data/landing-content"

function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="grid items-center gap-12 lg:grid-cols-12 lg:gap-6"
    >
      <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
        <div>
          <Eyebrow>Harmonious shared housing</Eyebrow>
          <h1
            id="hero-heading"
            className="mt-2 font-heading text-[clamp(2.25rem,5.5vw,3.5rem)] leading-[1.25] tracking-[-0.025em] text-balance text-foreground"
          >
            Find a roommate who fits your{" "}
            <em className="font-semibold text-primary not-italic">
              lifestyle rhythm.
            </em>
          </h1>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {heroActions.map((action) => (
            <li key={action.id}>
              <HeroActionCard action={action} />
            </li>
          ))}
        </ul>

        <p className="flex items-center gap-2 text-[0.8125rem] leading-[1.5] font-medium text-muted-foreground">
          <ShieldCheck aria-hidden className="size-3.5 shrink-0" />
          100% free for verified users
        </p>
      </div>

      <div className="relative min-w-0 lg:col-span-5 lg:col-start-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-6 -right-6 size-32 rounded-full bg-peach/40 blur-[20px]"
        />
        <RhythmPreviewCard match={featuredMatch} />
      </div>
    </section>
  )
}

export { HeroSection }
