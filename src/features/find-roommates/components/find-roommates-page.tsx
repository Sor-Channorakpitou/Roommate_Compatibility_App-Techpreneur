import React from "react"
import { Check, Filter, RotateCcw, Search } from "lucide-react"

import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import {
  ROOMMATES_DATA,
  type FilterState,
  type RoommateProfile,
} from "../data/roommates-data"
import { BreakdownDialog } from "./breakdown-dialog"
import { FilterSidebar } from "./filter-sidebar"
import { RoommateCard } from "./roommate-card"

type SortOption = "best-match" | "budget"

export function FindRoommatesPage() {
  const [filters, setFilters] = React.useState<FilterState>({
    area: "All areas",
    budget: "Any budget",
    moveInDate: "Any date",
  })

  const [sortBy, setSortBy] = React.useState<SortOption>("best-match")
  const [selectedBreakdown, setSelectedBreakdown] =
    React.useState<RoommateProfile | null>(null)
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false)

  // Clear toast notification after 4 seconds
  React.useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const handleClearAllFilters = () => {
    setFilters({
      area: "All areas",
      budget: "Any budget",
      moveInDate: "Any date",
    })
  }

  // Filter candidates based on selected criteria
  const filteredRoommates = React.useMemo(() => {
    return ROOMMATES_DATA.filter((candidate) => {
      // Area filter
      if (filters.area !== "All areas" && candidate.area !== filters.area) {
        return false
      }

      // Budget filter
      if (filters.budget !== "Any budget") {
        if (filters.budget === "Under $200" && candidate.priceMin >= 200) {
          return false
        }
        if (filters.budget === "$200–$300" && (candidate.priceMax < 200 || candidate.priceMin > 300)) {
          return false
        }
        if (filters.budget === "$300–$400" && (candidate.priceMax < 300 || candidate.priceMin > 400)) {
          return false
        }
        if (filters.budget === "$400–$500" && (candidate.priceMax < 400 || candidate.priceMin > 500)) {
          return false
        }
        if (filters.budget === "$500+" && candidate.priceMax < 500) {
          return false
        }
      }

      // Move-in date filter
      if (
        filters.moveInDate !== "Any date" &&
        candidate.moveInMonth !== filters.moveInDate
      ) {
        return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === "best-match") {
        return b.matchScore - a.matchScore
      }
      return a.priceMin - b.priceMin
    })
  }, [filters, sortBy])

  const handleSendMatch = (profile: RoommateProfile) => {
    setToastMessage(`Match request sent to ${profile.name}!`)
  }

  return (
    <Container className="pt-8 pb-16 font-roboto-slab">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#6d2504] px-5 py-3.5 text-white shadow-xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex size-7 items-center justify-center rounded-full bg-white/20">
            <Check className="size-4" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Screen Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="font-roboto-slab text-4xl font-normal tracking-tight text-foreground md:text-5xl">
            {filteredRoommates.length} matches
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-sans">
            People in Phnom Penh who live the way you do
          </p>
        </div>

        {/* Header Right Controls (Sort Tabs & Mobile Filter Toggle) */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button Toggle */}
          <Button
            variant="outline"
            size="pill-xs"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 text-xs"
          >
            <Filter className="size-3.5" />
            Filters
          </Button>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Sort:
            </span>
            <div className="flex items-center gap-1.5 rounded-full bg-[#f1ebd3]/60 dark:bg-muted p-1">
              <button
                type="button"
                onClick={() => setSortBy("best-match")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  sortBy === "best-match"
                    ? "bg-[#6d2504] text-white shadow-xs"
                    : "text-foreground hover:text-primary"
                }`}
              >
                Best match
              </button>
              <button
                type="button"
                onClick={() => setSortBy("budget")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  sortBy === "budget"
                    ? "bg-[#6d2504] text-white shadow-xs"
                    : "text-foreground hover:text-primary"
                }`}
              >
                Budget
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onClearAll={handleClearAllFilters}
            className="sticky top-28"
          />
        </div>

        {/* Mobile Filter Collapsible Area */}
        {isMobileFilterOpen && (
          <div className="lg:hidden col-span-1 mb-4">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onClearAll={handleClearAllFilters}
            />
          </div>
        )}

        {/* Roommates Card Grid Column */}
        <div className="lg:col-span-3">
          {filteredRoommates.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredRoommates.map((profile) => (
                <RoommateCard
                  key={profile.id}
                  profile={profile}
                  onSeeBreakdown={setSelectedBreakdown}
                  onSendMatch={handleSendMatch}
                />
              ))}
            </div>
          ) : (
            /* Empty State Fallback */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-card p-12 text-center shadow-xs">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
                <Search className="size-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-medium text-foreground">
                No roommate matches found
              </h3>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Try widening your area, budget, or move-in date filters to see more candidates in Phnom Penh.
              </p>
              <Button
                variant="outline"
                size="pill-xs"
                onClick={handleClearAllFilters}
                className="mt-6 flex items-center gap-2"
              >
                <RotateCcw className="size-3.5" />
                Reset all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Compatibility Breakdown Dialog Modal */}
      <BreakdownDialog
        profile={selectedBreakdown}
        onClose={() => setSelectedBreakdown(null)}
        onSendMatch={handleSendMatch}
      />
    </Container>
  )
}
