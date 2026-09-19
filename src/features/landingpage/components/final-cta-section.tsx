import { ButtonLink } from "@/components/common/button-link"
import { Eyebrow } from "@/components/common/eyebrow"
import { trustSignals } from "@/features/landingpage/data/landing-content"

function FinalCtaSection() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden rounded-xl bg-brand-surface px-6 py-14 text-center shadow-raised sm:px-8 lg:py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 size-64 rounded-full bg-brand opacity-50 blur-[32px]"
      />

      <div className="relative mx-auto flex max-w-[42rem] flex-col items-center gap-4">
        <Eyebrow className="text-brand-surface-accent">
          Start your journey
        </Eyebrow>
        <h2
          id="final-cta-heading"
          className="font-heading text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.25] tracking-[-0.02em] text-balance text-brand-surface-foreground"
        >
          Ready to discover your living rhythm?
        </h2>
        <p className="max-w-[36rem] text-lg leading-[1.6] text-pretty text-brand-surface-muted">
          Take our quick 3-minute lifestyle compatibility test. Compare student
          matches near CADT, RUPP, ITC, and across Phnom Penh.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink
            href="/compatibility-test"
            variant="on-brand"
            size="pill-lg"
            className="shadow-raised"
          >
            Start Lifestyle Compatibility Test
          </ButtonLink>
          <ButtonLink
            href="/browse"
            variant="brand"
            size="pill-lg"
            className="px-6"
          >
            Browse Verified Rooms
          </ButtonLink>
        </div>

        <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.8125rem] leading-[1.5] text-brand-surface-muted">
          {trustSignals.map(({ id, icon: Icon, label }) => (
            <li key={id} className="flex items-center gap-2">
              <Icon aria-hidden className="size-3.5 shrink-0" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { FinalCtaSection }
