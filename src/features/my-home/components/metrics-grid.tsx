import { Paintbrush, ReceiptText, Users, Zap } from "lucide-react"

import { formatUsd } from "@/lib/format"

type MetricsGridProps = {
  rentShare: number
  rentDueNote: string
  utilitiesShare: number
  utilitiesNote: string
  completedChoresCount: number
  totalChoresCount: number
  choresNote: string
  /** Spots not taken by the host or a pending invite. */
  openSpots: number
  totalSpots: number
  isAcceptingRoommates: boolean
}

export function MetricsGrid({
  rentShare,
  rentDueNote,
  utilitiesShare,
  utilitiesNote,
  completedChoresCount,
  totalChoresCount,
  choresNote,
  openSpots,
  totalSpots,
  isAcceptingRoommates,
}: MetricsGridProps) {
  return (
    <section aria-label="Key Household Metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Monthly Share */}
      <article className="group flex flex-col justify-between rounded-2xl border border-[#e8dfd8] bg-card p-5 shadow-sm transition-all hover:border-[#dbcac0] hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#8b7a70] uppercase">
            Monthly Share
          </span>
          <div className="flex size-9 items-center justify-center rounded-full bg-[#faece6] text-[#9b4221] transition-transform group-hover:scale-105">
            <ReceiptText className="size-4" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-3">
          <p className="text-xl font-bold tracking-tight text-foreground sm:text-[1.375rem]">
            Rent share {formatUsd(rentShare)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-[#9b4221]" aria-hidden="true" />
            <span>{rentDueNote}</span>
          </div>
        </div>
      </article>

      {/* 2. Utilities */}
      <article className="group flex flex-col justify-between rounded-2xl border border-[#e8dfd8] bg-card p-5 shadow-sm transition-all hover:border-[#dbcac0] hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#8b7a70] uppercase">
            Utilities
          </span>
          <div className="flex size-9 items-center justify-center rounded-full bg-[#eaf3eb] text-[#2d7338] transition-transform group-hover:scale-105">
            <Zap className="size-4" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-3">
          <p className="text-xl font-bold tracking-tight text-foreground sm:text-[1.375rem]">
            Bills ~{formatUsd(utilitiesShare)}/mo
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-[#2d7338]" aria-hidden="true" />
            <span>{utilitiesNote}</span>
          </div>
        </div>
      </article>

      {/* 3. Weekly Tasks */}
      <article className="group flex flex-col justify-between rounded-2xl border border-[#e8dfd8] bg-card p-5 shadow-sm transition-all hover:border-[#dbcac0] hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#8b7a70] uppercase">
            Chores
          </span>
          <div className="flex size-9 items-center justify-center rounded-full bg-[#faece6] text-[#9b4221] transition-transform group-hover:scale-105">
            <Paintbrush className="size-4" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-3">
          <p className="text-xl font-bold tracking-tight text-foreground sm:text-[1.375rem]">
            Chores: {completedChoresCount} of {totalChoresCount} done
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-[#2d7338]" aria-hidden="true" />
            <span>{choresNote}</span>
          </div>
        </div>
      </article>

      {/* 4. Index Score */}
      <article className="group flex flex-col justify-between rounded-2xl border border-[#e8dfd8] bg-card p-5 shadow-sm transition-all hover:border-[#dbcac0] hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#8b7a70] uppercase">
            Household
          </span>
          <div className="flex size-9 items-center justify-center rounded-full bg-[#eaf3eb] text-[#2d7338] transition-transform group-hover:scale-105">
            <Users className="size-4" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-3">
          <p className="text-xl font-bold tracking-tight text-foreground sm:text-[1.375rem]">
            {openSpots} of {totalSpots} spots open
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className={`size-2 rounded-full ${isAcceptingRoommates ? "bg-[#2d7338]" : "bg-[#9b4221]"}`}
              aria-hidden="true"
            />
            <span>
              {isAcceptingRoommates ? "Accepting roommates" : "Not accepting roommates"}
            </span>
          </div>
        </div>
      </article>
    </section>
  )
}
