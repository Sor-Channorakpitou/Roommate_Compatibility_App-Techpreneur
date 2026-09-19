import { Check, SlidersHorizontal } from "lucide-react"
import { cn } from "cn"

import {
  AREA_OPTIONS,
  BUDGET_OPTIONS,
  MOVE_IN_DATE_OPTIONS,
  type FilterState,
} from "../data/roommates-data"

type FilterSidebarProps = {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onClearAll: () => void
  className?: string
}

export function FilterSidebar({
  filters,
  onFilterChange,
  onClearAll,
  className,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.area !== "All areas" ||
    filters.budget !== "Any budget" ||
    filters.moveInDate !== "Any date"

  return (
    <aside
      className={cn(
        "flex flex-col rounded-2xl bg-[#f8f5f1] dark:bg-card p-5 border border-border/50 shadow-sm",
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-2 text-foreground font-medium text-base">
          <SlidersHorizontal className="size-4 text-primary" />
          <span className="font-roboto-slab text-lg font-semibold tracking-tight">
            Filters
          </span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* AREA Section */}
      <div className="pt-4 pb-2">
        <h3 className="mb-2 text-[0.6875rem] font-bold tracking-wider text-muted-foreground uppercase">
          Area
        </h3>
        <div className="flex flex-col gap-1">
          {AREA_OPTIONS.map((area) => {
            const isSelected = filters.area === area
            return (
              <button
                key={area}
                type="button"
                onClick={() => onFilterChange({ ...filters, area })}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-all",
                  isSelected
                    ? "bg-[#efe7db] dark:bg-accent text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:bg-[#f1ebd3]/50 hover:text-foreground"
                )}
              >
                <span>{area}</span>
                {isSelected && <Check className="size-4 text-primary stroke-[2.5]" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* BUDGET Section */}
      <div className="pt-4 pb-2 border-t border-border/30">
        <h3 className="mb-2 text-[0.6875rem] font-bold tracking-wider text-muted-foreground uppercase">
          Budget
        </h3>
        <div className="flex flex-col gap-1">
          {BUDGET_OPTIONS.map((budget) => {
            const isSelected = filters.budget === budget
            return (
              <button
                key={budget}
                type="button"
                onClick={() => onFilterChange({ ...filters, budget })}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-all",
                  isSelected
                    ? "bg-[#efe7db] dark:bg-accent text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:bg-[#f1ebd3]/50 hover:text-foreground"
                )}
              >
                <span>{budget}</span>
                {isSelected && <Check className="size-4 text-primary stroke-[2.5]" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* MOVE-IN DATE Section */}
      <div className="pt-4 pb-1 border-t border-border/30">
        <h3 className="mb-2 text-[0.6875rem] font-bold tracking-wider text-muted-foreground uppercase">
          Move-in date
        </h3>
        <div className="flex flex-col gap-1">
          {MOVE_IN_DATE_OPTIONS.map((date) => {
            const isSelected = filters.moveInDate === date
            return (
              <button
                key={date}
                type="button"
                onClick={() => onFilterChange({ ...filters, moveInDate: date })}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-all",
                  isSelected
                    ? "bg-[#efe7db] dark:bg-accent text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:bg-[#f1ebd3]/50 hover:text-foreground"
                )}
              >
                <span>{date}</span>
                {isSelected && <Check className="size-4 text-primary stroke-[2.5]" />}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
