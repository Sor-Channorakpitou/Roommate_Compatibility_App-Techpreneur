import { Check, SlidersHorizontal } from "lucide-react"
import { cn } from "cn"

import {
  AREA_OPTIONS,
  BUDGET_OPTIONS,
  HOUSING_TYPE_OPTIONS,
  LIFESTYLE_OPTIONS,
  MOVE_IN_OPTIONS,
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
  const toggleLifestyle = (id: string) => {
    const exists = filters.lifestyleRhythms.includes(id)
    const updated = exists
      ? filters.lifestyleRhythms.filter((r) => r !== id)
      : [...filters.lifestyleRhythms, id]
    onFilterChange({ ...filters, lifestyleRhythms: updated })
  }

  return (
    <aside
      aria-label="Filter roommates and places"
      className={cn(
        "rounded-[24px] border border-[#e8dfd2] dark:border-stone-800 bg-white dark:bg-card p-6 shadow-xs",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f2ebe0] dark:border-stone-800 pb-4">
        <div className="flex items-center gap-2.5 text-[#211d18] dark:text-stone-100">
          <SlidersHorizontal className="size-4 text-[#682506] dark:text-amber-500" />
          <h2 className="font-roboto-slab text-base font-bold tracking-tight">
            Refine Search
          </h2>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-[#7c7165] hover:text-[#211d18] dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
        >
          Reset all
        </button>
      </div>

      <div className="mt-5 space-y-6">
        {/* Housing Type */}
        <div>
          <label className="block text-[11px] font-bold tracking-wider text-[#8b8073] uppercase dark:text-stone-400 mb-2.5">
            HOUSING TYPE
          </label>
          <div className="space-y-1">
            {HOUSING_TYPE_OPTIONS.map((opt) => {
              const isSelected = filters.housingType === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, housingType: opt.id })}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors",
                    isSelected
                      ? "bg-[#f5eee3] text-[#5e2205] dark:bg-amber-950/40 dark:text-amber-300 font-semibold"
                      : "text-[#544d44] hover:bg-[#faf7f2] dark:text-stone-300 dark:hover:bg-stone-800/60"
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="size-3.5 stroke-[2.5]" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Neighborhood / Area */}
        <div className="border-t border-[#f2ebe0] dark:border-stone-800 pt-5">
          <label className="block text-[11px] font-bold tracking-wider text-[#8b8073] uppercase dark:text-stone-400 mb-2.5">
            NEIGHBORHOOD / AREA
          </label>
          <div className="space-y-1">
            {AREA_OPTIONS.map((area) => {
              const isSelected = filters.area === area.id
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, area: area.id })}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors",
                    isSelected
                      ? "bg-[#f5eee3] text-[#5e2205] dark:bg-amber-950/40 dark:text-amber-300 font-semibold"
                      : "text-[#544d44] hover:bg-[#faf7f2] dark:text-stone-300 dark:hover:bg-stone-800/60"
                  )}
                >
                  <span>{area.label}</span>
                  {isSelected && <Check className="size-3.5 stroke-[2.5]" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Monthly Budget / Rent */}
        <div className="border-t border-[#f2ebe0] dark:border-stone-800 pt-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-[11px] font-bold tracking-wider text-[#8b8073] uppercase dark:text-stone-400">
              MONTHLY BUDGET / RENT
            </label>
            <span className="text-xs font-bold text-[#682506] dark:text-amber-400">
              $150 – $550+
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {BUDGET_OPTIONS.map((b) => {
              const isSelected = filters.budgetRange === b.id
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      budgetRange: b.id as FilterState["budgetRange"],
                    })
                  }
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-center text-xs font-semibold transition-all",
                    isSelected
                      ? "border-[#5c2005] bg-[#5c2005] text-white shadow-xs"
                      : "border-[#dfd4c5] bg-white text-[#483f34] hover:bg-[#f6f2ec] dark:border-stone-700 dark:bg-stone-800/70 dark:text-stone-300"
                  )}
                >
                  {b.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Lifestyle Rhythms */}
        <div className="border-t border-[#f2ebe0] dark:border-stone-800 pt-5">
          <label className="block text-[11px] font-bold tracking-wider text-[#8b8073] uppercase dark:text-stone-400 mb-3">
            LIFESTYLE RHYTHMS
          </label>
          <div className="grid grid-cols-2 gap-2">
            {LIFESTYLE_OPTIONS.map((opt) => {
              const isChecked = filters.lifestyleRhythms.includes(opt.id)
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleLifestyle(opt.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-xs font-medium transition-colors",
                    isChecked
                      ? "border-[#5c2005]/20 bg-[#f7efe4] text-[#5c2005] dark:bg-amber-950/40 dark:text-amber-200"
                      : "border-[#e8e0d4] bg-white text-[#52493f] hover:bg-[#faf6f0] dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 items-center justify-center rounded-sm border transition-colors",
                      isChecked
                        ? "border-[#5c2005] bg-[#5c2005] text-white"
                        : "border-[#c4b6a4] bg-white dark:border-stone-600"
                    )}
                  >
                    {isChecked && <Check className="size-3 stroke-[2.5]" />}
                  </span>
                  <span className="truncate">{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Move-In Horizon */}
        <div className="border-t border-[#f2ebe0] dark:border-stone-800 pt-5">
          <label className="block text-[11px] font-bold tracking-wider text-[#8b8073] uppercase dark:text-stone-400 mb-2.5">
            MOVE-IN HORIZON
          </label>
          <div className="space-y-1">
            {MOVE_IN_OPTIONS.map((m) => {
              const isSelected = filters.moveInHorizon === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, moveInHorizon: m.id })}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors",
                    isSelected
                      ? "bg-[#f5eee3] text-[#5e2205] dark:bg-amber-950/40 dark:text-amber-300 font-semibold"
                      : "text-[#544d44] hover:bg-[#faf7f2] dark:text-stone-300 dark:hover:bg-stone-800/60"
                  )}
                >
                  <span>{m.label}</span>
                  {isSelected && <Check className="size-3.5 stroke-[2.5]" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}
