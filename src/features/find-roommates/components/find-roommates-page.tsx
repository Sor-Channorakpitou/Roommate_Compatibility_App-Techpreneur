import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  Filter,
  Grid,
  Home,
  RotateCcw,
  RotateCw,
  Search,
  Shuffle,
  Sparkles,
  TriangleAlert,
  Users,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "cn"

import { StatePanel } from "@/components/common/state-panel"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import {
  DEFAULT_FILTERS,
  filterListings,
  type FilterState,
  type RoommateListing,
} from "../data/listings"
import { useBrowseListings } from "../hooks/use-browse-listings"
import { FilterSidebar } from "./filter-sidebar"
import { RoommateCard } from "./roommate-card"
import { ViewDetailDialog } from "./view-detail-dialog"

export function FindRoommatesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoading: isAuthLoading } = useAuth()
  const { state, reload, viewerTookQuiz } = useBrowseListings(
    user?.id,
    !isAuthLoading
  )

  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS)
  const [selectedProfile, setSelectedProfile] =
    React.useState<RoommateListing | null>(null)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false)

  React.useEffect(() => {
    document.title = "Browse roommates & rooms | RoomieMatch"
  }, [])

  const handleClearAllFilters = () => setFilters(DEFAULT_FILTERS)

  const listings = React.useMemo(
    () => (state.status === "ready" ? state.listings : []),
    [state]
  )
  const filteredListings = React.useMemo(
    () => filterListings(listings, filters),
    [listings, filters]
  )

  // Opens (or starts) a real conversation with the student or room host.
  const handleSendMatch = (profile: RoommateListing) => {
    const params = new URLSearchParams({ to: profile.contactId })
    if (profile.room) params.set("about", profile.room.name)
    const target = `/messages?${params}`
    if (!user) {
      toast.error("Sign in to send a message")
      navigate("/sign-in", { state: { from: target } })
      return
    }
    navigate(target)
  }

  const roommatesCount = listings.filter((l) => l.type === "student").length
  const placesCount = listings.filter((l) => l.type === "place").length
  const totalMatchesCount = listings.length

  return (
    <div className="min-h-screen bg-[#faf8f4] dark:bg-background text-foreground pb-20 pt-6">
      <Container className="space-y-6">
        {/* Top Category Switcher Tabs matching Browse.png */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* All Matches Pill */}
          <button
            type="button"
            onClick={() => setFilters({ ...filters, categoryTab: "all" })}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all border",
              filters.categoryTab === "all"
                ? "bg-[#5c2005] border-[#5c2005] text-white shadow-xs"
                : "bg-white dark:bg-card border-[#e6ddd1] dark:border-stone-800 text-[#4c443b] dark:text-stone-300 hover:bg-[#f6f1ea]"
            )}
          >
            <Grid className="size-3.5" />
            <span>All Matches</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-bold",
                filters.categoryTab === "all"
                  ? "bg-white/20 text-white"
                  : "bg-[#eee6db] dark:bg-stone-800 text-[#695d4e] dark:text-stone-400"
              )}
            >
              {totalMatchesCount}
            </span>
          </button>

          {/* Find Your Roommates Pill */}
          <button
            type="button"
            onClick={() => setFilters({ ...filters, categoryTab: "roommates" })}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all border",
              filters.categoryTab === "roommates"
                ? "bg-[#5c2005] border-[#5c2005] text-white shadow-xs"
                : "bg-white dark:bg-card border-[#e6ddd1] dark:border-stone-800 text-[#4c443b] dark:text-stone-300 hover:bg-[#f6f1ea]"
            )}
          >
            <Users className="size-3.5" />
            <span>Find Your Roommates</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-bold",
                filters.categoryTab === "roommates"
                  ? "bg-white/20 text-white"
                  : "bg-[#eee6db] dark:bg-stone-800 text-[#695d4e] dark:text-stone-400"
              )}
            >
              {roommatesCount}
            </span>
          </button>

          {/* Places (Available Rooms) Pill */}
          <button
            type="button"
            onClick={() => setFilters({ ...filters, categoryTab: "places" })}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all border",
              filters.categoryTab === "places"
                ? "bg-[#5c2005] border-[#5c2005] text-white shadow-xs"
                : "bg-white dark:bg-card border-[#e6ddd1] dark:border-stone-800 text-[#4c443b] dark:text-stone-300 hover:bg-[#f6f1ea]"
            )}
          >
            <Home className="size-3.5" />
            <span>Places (Available Rooms)</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-bold",
                filters.categoryTab === "places"
                  ? "bg-white/20 text-white"
                  : "bg-[#eee6db] dark:bg-stone-800 text-[#695d4e] dark:text-stone-400"
              )}
            >
              {placesCount}
            </span>
          </button>
        </div>

        {/* Search & Sort Row matching Browse.png */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input Pill */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#8a7e72]" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters({ ...filters, searchQuery: e.target.value })
              }
              placeholder="Search by name, university, district, or rhythm (e.g. Toul Kork, Early bird)"
              className="w-full rounded-full border border-[#ded4c6] dark:border-stone-800 bg-white dark:bg-card py-2.5 pl-11 pr-5 text-xs sm:text-sm text-foreground placeholder:text-[#9e9285] focus:border-[#5c2005] focus:outline-none focus:ring-1 focus:ring-[#5c2005]"
            />
          </div>

          {/* Sort Controls matching Browse.png */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 rounded-full border border-[#ded4c6] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#483f34]"
            >
              <Filter className="size-3.5" />
              Filters
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#7c7165] dark:text-stone-400">
                Sort by :
              </span>
              <div className="flex items-center gap-1 rounded-full border border-[#ded4c6] dark:border-stone-800 bg-white dark:bg-card p-1">
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, sortBy: "best-match" })}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-all",
                    filters.sortBy === "best-match"
                      ? "bg-[#5c2005] text-white shadow-xs"
                      : "text-[#544d44] hover:text-[#211d18] dark:text-stone-300"
                  )}
                >
                  Best match
                </button>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, sortBy: "budget" })}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-all",
                    filters.sortBy === "budget"
                      ? "bg-[#5c2005] text-white shadow-xs"
                      : "text-[#544d44] hover:text-[#211d18] dark:text-stone-300"
                  )}
                >
                  Budget: Low to High
                </button>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, sortBy: "move-in" })}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-all",
                    filters.sortBy === "move-in"
                      ? "bg-[#5c2005] text-white shadow-xs"
                      : "text-[#544d44] hover:text-[#211d18] dark:text-stone-300"
                  )}
                >
                  Move-in date
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Main Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Sidebar (approx 3 cols) */}
          <div className="hidden lg:block lg:col-span-3">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onClearAll={handleClearAllFilters}
              className="sticky top-24"
            />
          </div>

          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="lg:hidden col-span-1">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onClearAll={handleClearAllFilters}
              />
            </div>
          )}

          {/* Right Main Column (approx 9 cols) */}
          <div className="lg:col-span-9 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ece4d8] dark:border-stone-800 pb-3">
              <p className="text-xs sm:text-sm font-semibold text-[#322b22] dark:text-stone-200">
                {state.status === "ready"
                  ? `Showing ${filteredListings.length} of ${totalMatchesCount}`
                  : "Loading listings…"}{" "}
                <span className="font-normal text-[#756a5c] dark:text-stone-400">
                  • Live from RoomieMatch members
                </span>
              </p>
            </div>

            {state.status === "ready" && !viewerTookQuiz && (
              <div className="flex flex-col gap-3 rounded-2xl border border-[#e8dfd2] bg-[#fdf8f1] p-4 text-xs text-[#544d44] sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-300">
                <p className="flex items-center gap-2">
                  <Sparkles className="size-4 shrink-0 text-[#682506]" />
                  {user
                    ? "Take the compatibility quiz to see your match score with each student."
                    : "Sign in and take the compatibility quiz to see match scores."}
                </p>
                <Link
                  to={user ? "/compatibility-test" : "/sign-in"}
                  state={user ? undefined : { from: location.pathname }}
                  className="shrink-0 font-semibold text-[#5c2005] underline underline-offset-2"
                >
                  {user ? "Take the quiz" : "Sign in"}
                </Link>
              </div>
            )}

            {state.status === "loading" ? (
              <div
                role="status"
                aria-label="Loading listings"
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {[0, 1, 2].map((key) => (
                  <div
                    key={key}
                    className="h-80 animate-pulse rounded-[22px] border border-[#e8dfd2] bg-white dark:bg-card"
                  />
                ))}
              </div>
            ) : state.status === "error" ? (
              <StatePanel
                icon={TriangleAlert}
                tone="error"
                title="We couldn't load listings"
                description={state.message}
                action={
                  <Button type="button" variant="outline" size="pill-lg" onClick={reload}>
                    <RotateCw />
                    Try again
                  </Button>
                }
              />
            ) : filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredListings.map((listing) => (
                  <RoommateCard
                    key={listing.id}
                    profile={listing}
                    onSeeBreakdown={setSelectedProfile}
                    onSendMatch={handleSendMatch}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[#dcd3c5] bg-white dark:bg-card p-12 text-center shadow-xs">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#f5eee4] text-[#682506] mb-4">
                  <Search className="size-6" />
                </div>
                <h3 className="font-roboto-slab text-xl font-medium text-foreground">
                  {totalMatchesCount === 0
                    ? "No listings yet"
                    : "No matches found for your filter criteria"}
                </h3>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                  {filters.categoryTab === "places" && !state.roomsAvailable
                    ? "Room listings need the latest database migration (supabase/migrations/20260927000000_public_room_listings.sql)."
                    : totalMatchesCount === 0
                      ? "Be the first: create a room or invite classmates to sign up."
                      : "Try adjusting your budget, neighborhoods, or lifestyle rhythms to discover more potential roommates."}
                </p>
                {totalMatchesCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#ded4c6] bg-white px-5 py-2 text-xs font-semibold text-[#5c2005] hover:bg-[#f8f4ee]"
                  >
                    <RotateCcw className="size-3.5" />
                    Reset all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* "How Mindful Roommate Matching Works" Section matching Browse.png */}
        <section
          aria-labelledby="mindful-matching-heading"
          className="mt-12 rounded-[28px] border border-[#e8dfd2] dark:border-stone-800 bg-[#f9f7f2] dark:bg-stone-900/50 p-6 sm:p-9 shadow-xs"
        >
          {/* Header Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-[#682506] dark:text-amber-400">
                <Shuffle className="size-3.5" />
                <span>HOW MINDFUL ROOMMATE MATCHING WORKS</span>
              </div>
              <h2
                id="mindful-matching-heading"
                className="font-roboto-slab text-2xl sm:text-3xl font-bold tracking-tight text-[#211d18] dark:text-stone-100"
              >
                From First Match to a Balanced Shared Home
              </h2>
              <p className="text-xs sm:text-sm text-[#706456] dark:text-stone-400">
                We guide you step-by-step to prevent domestic friction before contracts are signed.
              </p>
            </div>

            <Link
              to="/rooms/new"
              className="inline-flex items-center gap-2 rounded-full bg-[#5c2005] hover:bg-[#481903] active:scale-98 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all shrink-0 self-start sm:self-center"
            >
              <span>List or Create a Room</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* 3 Step Cards Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Step 1 */}
            <div className="flex items-start gap-4 rounded-2xl bg-white dark:bg-card p-5 border border-[#ece4d8] dark:border-stone-800 shadow-xs">
              <div className="flex size-9 items-center justify-center rounded-full bg-[#5c2005] text-white font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h3 className="font-roboto-slab text-sm font-bold text-[#211d18] dark:text-stone-100 mb-1">
                  Connect & Compare Rhythms
                </h3>
                <p className="text-xs text-[#6e6357] dark:text-stone-400 leading-relaxed">
                  Analyze sleep, noise, and visitor philosophies side-by-side.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 rounded-2xl bg-white dark:bg-card p-5 border border-[#ece4d8] dark:border-stone-800 shadow-xs">
              <div className="flex size-9 items-center justify-center rounded-full bg-[#27532a] text-white font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h3 className="font-roboto-slab text-sm font-bold text-[#211d18] dark:text-stone-100 mb-1">
                  Co-Tour or Create Room
                </h3>
                <p className="text-xs text-[#6e6357] dark:text-stone-400 leading-relaxed">
                  Form a pair to scout apartments, or apply directly to verified rooms.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 rounded-2xl bg-white dark:bg-card p-5 border border-[#ece4d8] dark:border-stone-800 shadow-xs">
              <div className="flex size-9 items-center justify-center rounded-full bg-[#7a6442] text-white font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h3 className="font-roboto-slab text-sm font-bold text-[#211d18] dark:text-stone-100 mb-1">
                  Shared Home Agreement
                </h3>
                <p className="text-xs text-[#6e6357] dark:text-stone-400 leading-relaxed">
                  Set quiet hours, utility split, and chore rotations in 'My Home'.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Container>

      {/* View Detail Modal matching view_detail.png */}
      <ViewDetailDialog
        profile={selectedProfile}
        viewerTookQuiz={viewerTookQuiz}
        onClose={() => setSelectedProfile(null)}
        onSendMatch={handleSendMatch}
      />
    </div>
  )
}
