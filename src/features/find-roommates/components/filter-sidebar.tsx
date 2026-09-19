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
        "flex flex-col rounded-2xl border border-border/50 bg-card p-5 shadow-sm",
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-2 text-base font-medium text-foreground">
          <SlidersHorizontal className="size-4 text-primary" />
          <span className="font-heading text-lg font-semibold tracking-tight">
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
                    ? "bg-secondary font-semibold text-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{area}</span>
                {isSelected && (
                  <Check className="size-4 stroke-[2.5] text-primary" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* BUDGET Section */}
      <div className="border-t border-border/30 pt-4 pb-2">
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
                    ? "bg-secondary font-semibold text-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{budget}</span>
                {isSelected && (
                  <Check className="size-4 stroke-[2.5] text-primary" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* MOVE-IN DATE Section */}
      <div className="border-t border-border/30 pt-4 pb-1">
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
                    ? "bg-secondary font-semibold text-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{date}</span>
                {isSelected && (
                  <Check className="size-4 stroke-[2.5] text-primary" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
