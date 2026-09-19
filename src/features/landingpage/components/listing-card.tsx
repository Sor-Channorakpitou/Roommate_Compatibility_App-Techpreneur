import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import {
  listingMetaIcon,
  type Listing,
} from "@/features/landingpage/data/landing-content"

function ListingCard({ listing }: { listing: Listing }) {
  const MetaIcon = listingMetaIcon[listing.kind]

  return (
    <a
      href={listing.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card transition-shadow outline-none hover:shadow-floating focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="relative h-44 shrink-0 overflow-hidden bg-muted">
        <img
          src={listing.image}
          alt={listing.imageAlt}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute bottom-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
          <Badge
            className={cn(
              "h-auto px-2.5 py-0.5 text-[0.6875rem] leading-[1.2] font-bold tracking-[0.08em] text-white shadow-card",
              listing.statusClassName
            )}
          >
            {listing.status}
          </Badge>
          <Badge className="h-auto bg-card/90 px-2.5 py-0.5 text-[0.6875rem] leading-[1.2] font-bold tracking-[0.08em] text-primary shadow-card backdrop-blur-md">
            {listing.price}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-heading text-base leading-6 font-semibold text-foreground">
          {listing.title}
        </h3>
        <p
          className={cn(
            "text-xs leading-[1.25] font-medium tracking-[0.02em]",
            listing.kind === "room" ? "text-primary" : "text-sage-foreground"
          )}
        >
          {listing.subtitle}
        </p>
        <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-[1.5] text-muted-foreground">
          {listing.description}
        </p>
        <p className="mt-auto flex items-start gap-1.5 border-t border-border/40 pt-2.5 text-xs leading-4 text-muted-foreground">
          <MetaIcon aria-hidden className="mt-0.5 size-3 shrink-0" />
          <span>{listing.meta}</span>
        </p>
      </div>
    </a>
  )
}

export { ListingCard }
