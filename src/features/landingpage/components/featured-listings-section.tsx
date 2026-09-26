import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { ButtonLink } from "@/components/common/button-link"
import { Eyebrow } from "@/components/common/eyebrow"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/features/landingpage/components/listing-card"
import { useFeaturedListings } from "@/features/landingpage/hooks/use-featured-listings"

const CARD_GAP = 24

function FeaturedListingsSection() {
  const featured = useFeaturedListings()
  const listings = featured.status === "ready" ? featured.listings : []
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = React.useState(true)
  const [atEnd, setAtEnd] = React.useState(true)

  const syncEdges = React.useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 1)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }, [])

  React.useEffect(() => {
    syncEdges()
    const el = scrollerRef.current
    if (!el) return

    el.addEventListener("scroll", syncEdges, { passive: true })
    window.addEventListener("resize", syncEdges)
    return () => {
      el.removeEventListener("scroll", syncEdges)
      window.removeEventListener("resize", syncEdges)
    }
  }, [syncEdges, listings.length])

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>("[data-listing-card]")
    const step = card ? card.offsetWidth + CARD_GAP : el.clientWidth * 0.8
    el.scrollBy({ left: direction * step, behavior: "smooth" })
  }

  // All four fit at desktop, so the arrows only earn their place once they don't.
  const isScrollable = !atStart || !atEnd

  // Nothing real to feature yet: skip the section rather than show filler.
  if (featured.status === "ready" && listings.length === 0) return null

  return (
    <section
      aria-labelledby="featured-listings-heading"
      className="flex flex-col gap-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-[42rem]">
          <Eyebrow>Featured listings</Eyebrow>
          <h2
            id="featured-listings-heading"
            className="mt-2 font-heading text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.25] tracking-[-0.015em] text-balance text-foreground"
          >
            Available Rooms &amp; Roommate Seekers
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-[1.55] text-pretty text-muted-foreground">
            Real rooms and students on RoomieMatch right now, with their
            lifestyle rhythms up front.
          </p>
        </div>

        {isScrollable ? (
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-full"
              aria-label="Scroll to previous listings"
              disabled={atStart}
              onClick={() => scrollByCard(-1)}
            >
              <ArrowLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-full"
              aria-label="Scroll to more listings"
              disabled={atEnd}
              onClick={() => scrollByCard(1)}
            >
              <ArrowRight />
            </Button>
          </div>
        ) : null}
      </div>

      <div
        ref={scrollerRef}
        tabIndex={0}
        role="group"
        aria-label="Featured rooms and roommate seekers"
        className="-mx-5 no-scrollbar snap-x snap-mandatory scroll-px-5 overflow-x-auto px-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:-mx-8 sm:scroll-px-8 sm:px-8"
      >
        <ul
          aria-busy={featured.status === "loading"}
          className="flex items-stretch gap-6 lg:grid lg:grid-cols-4"
        >
          {featured.status === "loading" &&
            [0, 1, 2, 3].map((key) => (
              <li
                key={key}
                className="h-80 w-[17.5rem] shrink-0 animate-pulse rounded-2xl bg-muted/60 sm:w-[19rem] lg:w-auto"
              />
            ))}
          {listings.map((listing) => (
            <li
              key={listing.id}
              data-listing-card
              className="w-[17.5rem] shrink-0 snap-start sm:w-[19rem] lg:w-auto"
            >
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center">
        <ButtonLink href="/browse" variant="brand-outline" size="pill">
          {featured.status === "ready"
            ? `Browse all ${featured.total} listings & roommates`
            : "Browse listings & roommates"}
          <ArrowRight aria-hidden className="size-3" />
        </ButtonLink>
      </div>
    </section>
  )
}

export { FeaturedListingsSection }
