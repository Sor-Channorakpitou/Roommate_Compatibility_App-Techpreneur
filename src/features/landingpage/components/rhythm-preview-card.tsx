import { Bookmark } from "lucide-react"

import { ButtonLink } from "@/components/common/button-link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { FeaturedMatch } from "@/features/landingpage/data/landing-content"
import { getInitials } from "@/lib/utils"

function RhythmPreviewCard({ match }: { match: FeaturedMatch }) {
  return (
    <Card className="rounded-xl shadow-raised ring-0 [--card-spacing:--spacing(6)]">
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Badge className="h-auto shrink-0 bg-sage px-2.5 py-1 text-[0.6875rem] leading-[1.2] font-bold tracking-[0.08em] text-sage-foreground uppercase">
              {match.matchScore}% Rhythm match
            </Badge>
            <span className="truncate text-[0.8125rem] text-muted-foreground">
              {match.hub}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Save ${match.name}'s room`}
            className="shrink-0 rounded-full bg-muted hover:bg-muted/70"
          >
            <Bookmark className="size-3.5" />
          </Button>
        </div>

        <div className="relative h-52 overflow-hidden rounded-lg shadow-[inset_0_2px_4px_0_rgb(0_0_0/0.05)]">
          <img
            src={match.roomImage}
            alt={match.roomImageAlt}
            className="size-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <p className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 backdrop-blur-md">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full bg-sage-foreground"
            />
            <span className="text-xs font-medium tracking-[0.02em] text-foreground">
              {match.quietHours}
            </span>
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-12 shrink-0">
              <AvatarImage src={match.avatarImage} alt="" />
              <AvatarFallback>{getInitials(match.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-heading text-xl leading-[1.4] text-foreground">
                {match.name}
              </p>
              <p className="truncate text-[0.8125rem] leading-[1.5] text-muted-foreground">
                {match.meta}
              </p>
            </div>
          </div>
          <ButtonLink
            href={match.profileHref}
            size="pill-sm"
            className="shrink-0"
          >
            View Profile
          </ButtonLink>
        </div>
      </CardContent>
    </Card>
  )
}

export { RhythmPreviewCard }
