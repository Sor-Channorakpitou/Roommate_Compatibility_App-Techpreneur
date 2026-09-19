import { ArrowRight, ShieldCheck } from "lucide-react"

import { ButtonLink } from "@/components/common/button-link"
import { Eyebrow } from "@/components/common/eyebrow"
import { RhythmPreviewCard } from "@/features/landing/components/rhythm-preview-card"
import { featuredMatch } from "@/features/landing/data/landing-content"

function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="grid items-center gap-12 lg:grid-cols-12 lg:gap-6"
    >
      <div className="min-w-0 lg:col-span-7">
        <Eyebrow>Harmonious shared housing</Eyebrow>
        <h1
          id="hero-heading"
          className="mt-2 font-heading text-[clamp(2.25rem,5.5vw,3.5rem)] leading-[1.25] tracking-[-0.025em] text-balance text-foreground"
        >
          Find a roommate who fits your{" "}
          <em className="text-primary italic">lifestyle rhythm.</em>
        </h1>
        <p className="mt-6 max-w-[36rem] text-lg leading-[1.6] text-pretty text-muted-foreground">
          Compare daily sleep cadences, study habits, and house rules before
          signing a lease. Thoughtful, peaceful co-living made simple.
        </p>
        <div className="mt-9">
          <ButtonLink href="/browse" size="pill-lg" className="shadow-floating">
            Find a Roommate
            <ArrowRight aria-hidden className="size-3" />
          </ButtonLink>
        </div>
        <p className="mt-8 flex items-center gap-3 text-[0.8125rem] leading-[1.5] text-muted-foreground">
          <ShieldCheck aria-hidden className="size-3.5 shrink-0" />
          100% free for verified university students in Phnom Penh
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
