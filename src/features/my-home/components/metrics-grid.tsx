import { Heart, Paintbrush, ReceiptText, Zap } from "lucide-react"

type MetricsGridProps = {
  rentShare?: number
  rentDueDate?: string
  utilitiesStatus?: string
  utilitiesDate?: string
  completedChoresCount?: number
  totalChoresCount?: number
  choresWeek?: number
  harmonyScore?: number
}

export function MetricsGrid({
  rentShare = 280,
  rentDueDate = "Due Nov 1",
  utilitiesStatus = "Paid",
  utilitiesDate = "Next reading Nov 3",
  completedChoresCount = 2,
  totalChoresCount = 3,
  choresWeek = 4,
  harmonyScore = 92,
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
            Rent share ${rentShare}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-[#9b4221]" aria-hidden="true" />
            <span>({rentDueDate})</span>
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
            Electricity: {utilitiesStatus}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-[#2d7338]" aria-hidden="true" />
            <span>{utilitiesDate}</span>
          </div>
        </div>
      </article>

      {/* 3. Weekly Tasks */}
      <article className="group flex flex-col justify-between rounded-2xl border border-[#e8dfd8] bg-card p-5 shadow-sm transition-all hover:border-[#dbcac0] hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#8b7a70] uppercase">
            Weekly Tasks
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
            <span>Week {choresWeek} of rotation</span>
          </div>
        </div>
      </article>

      {/* 4. Index Score */}
      <article className="group flex flex-col justify-between rounded-2xl border border-[#e8dfd8] bg-card p-5 shadow-sm transition-all hover:border-[#dbcac0] hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#8b7a70] uppercase">
            Index Score
          </span>
          <div className="flex size-9 items-center justify-center rounded-full bg-[#eaf3eb] text-[#2d7338] transition-transform group-hover:scale-105">
            <Heart className="size-4 fill-current" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-3">
          <p className="text-xl font-bold tracking-tight text-foreground sm:text-[1.375rem]">
            Harmony: {harmonyScore}%
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-[#2d7338]" aria-hidden="true" />
            <span>Living habits in sync</span>
          </div>
        </div>
      </article>
    </section>
  )
}
