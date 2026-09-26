import * as React from "react"
import { CalendarRange, MapPin, Trash2, Users } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { formatMonthYear, formatUsd } from "@/lib/format"
import type { Room } from "@/lib/supabase"

type RoomListCardProps = {
  room: Room
  isPending: boolean
  isNew: boolean
  onToggleAccepting: () => void
  onDelete: () => void
}

export function RoomListCard({
  room,
  isPending,
  isNew,
  onToggleAccepting,
  onDelete,
}: RoomListCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false)
  const rentShare = Math.round(room.monthly_rent / room.member_count)

  return (
    <article
      aria-labelledby={`room-${room.id}-name`}
      aria-busy={isPending}
      className={cn(
        "flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-soft transition-opacity",
        isNew ? "border-brand ring-3 ring-brand/15" : "border-border/60",
        isPending && "opacity-70"
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2
            id={`room-${room.id}-name`}
            className="truncate font-heading text-2xl text-foreground"
          >
            {room.name}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
            <MapPin aria-hidden className="size-3.5 shrink-0" />
            <span className="truncate">
              {[room.district, room.street].filter(Boolean).join(" · ")}
            </span>
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-xs font-bold",
            room.accepting_roommates
              ? "bg-sage text-sage-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {room.accepting_roommates ? "Open" : "Closed"}
        </span>
      </header>

      <dl className="grid grid-cols-3 gap-3 rounded-xl border border-border/30 bg-surface p-4 text-xs">
        <div>
          <dt className="font-bold tracking-[0.05em] text-subtle-foreground uppercase">
            Rent share
          </dt>
          <dd className="mt-1 font-heading text-lg text-primary">
            {formatUsd(rentShare)}
            <span className="text-xs text-muted-foreground">/person</span>
          </dd>
        </div>
        <div>
          <dt className="font-bold tracking-[0.05em] text-subtle-foreground uppercase">
            Members
          </dt>
          <dd className="mt-1 flex items-center gap-1 text-sm font-semibold text-foreground">
            <Users aria-hidden className="size-3.5 text-muted-foreground" />
            {room.member_count}
          </dd>
        </div>
        <div>
          <dt className="font-bold tracking-[0.05em] text-subtle-foreground uppercase">
            Lease
          </dt>
          <dd className="mt-1 flex items-center gap-1 text-sm font-semibold text-foreground">
            <CalendarRange
              aria-hidden
              className="size-3.5 shrink-0 text-muted-foreground"
            />
            <span className="truncate">
              {formatMonthYear(room.lease_end_date)}
            </span>
          </dd>
        </div>
      </dl>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-muted pt-4">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
          <Switch
            checked={room.accepting_roommates}
            onCheckedChange={onToggleAccepting}
            disabled={isPending}
          />
          Accepting roommates
        </label>

        {isConfirmingDelete ? (
          <div
            role="group"
            aria-label={`Confirm deleting ${room.name}`}
            className="flex items-center gap-2"
          >
            <span className="text-xs text-muted-foreground">
              Delete for good?
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsConfirmingDelete(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              autoFocus
              onClick={onDelete}
              disabled={isPending}
            >
              <Trash2 />
              {isPending ? "Deleting…" : "Delete"}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsConfirmingDelete(true)}
            disabled={isPending}
            aria-label={`Delete ${room.name}`}
            className="text-muted-foreground hover:bg-destructive/8 hover:text-destructive"
          >
            <Trash2 />
            Delete
          </Button>
        )}
      </footer>
    </article>
  )
}
