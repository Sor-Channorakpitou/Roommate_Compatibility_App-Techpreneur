import { Calendar, MapPin, Settings, UserPlus, Users } from "lucide-react"

type RoomHeroCardProps = {
  roomName?: string
  location?: string
  roommatesCount?: number
  leaseEnd?: string
  onInviteClick: () => void
  onSettingsClick: () => void
}

export function RoomHeroCard({
  roomName = "Sunflower Sanctuary",
  location = "Toul Kork, Phnom Penh",
  roommatesCount = 2,
  leaseEnd = "Oct 2027",
  onInviteClick,
  onSettingsClick,
}: RoomHeroCardProps) {
  return (
    <section aria-label="Room Overview" className="rounded-2xl border border-[#e8dfd8] bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              {roomName}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eee6dd] px-3 py-1 text-xs font-medium text-[#55433c]">
              <MapPin className="size-3.5 text-[#55433c]" aria-hidden="true" />
              {location}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4 text-muted-foreground/80" aria-hidden="true" />
              {roommatesCount} roommates
            </span>
            <span aria-hidden="true" className="text-muted-foreground/50">
              •
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4 text-muted-foreground/80" aria-hidden="true" />
              Lease until {leaseEnd}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <button
            type="button"
            onClick={onInviteClick}
            className="inline-flex items-center gap-2 rounded-full bg-[#7a3418] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#682c14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7a3418] focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <UserPlus className="size-4" aria-hidden="true" />
            Invite Roommate
          </button>

          <button
            type="button"
            onClick={onSettingsClick}
            aria-label="Room settings"
            className="inline-flex items-center justify-center rounded-full border border-[#d6cbbe] p-2.5 text-[#55433c] transition-colors hover:bg-[#f6efe8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
          >
            <Settings className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
