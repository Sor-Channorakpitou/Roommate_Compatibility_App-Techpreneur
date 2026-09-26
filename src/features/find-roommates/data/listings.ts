import {
  habitTags,
  hasCompletedQuiz,
  scoreMatch,
  type CompatibilityAnswers,
  type MatchResult,
} from "@/lib/compatibility"
import { formatUsd } from "@/lib/format"
import type { Student } from "@/lib/students-api"
import type { OpenRoom } from "@/lib/supabase"

export type ListingType = "student" | "place"

/** A card on the Browse page: a student, or a room with open spots. */
export type RoommateListing = {
  id: string
  type: ListingType
  name: string
  subtitle: string
  description: string
  tags: string[]
  /** Match against the viewer; null until both sides have taken the quiz. */
  match: MatchResult | null
  /** The person to message about this listing. */
  contactId: string
  contactName: string
  avatarUrl: string | null
  student?: Student
  room?: OpenRoom
  /** Rent per person, for places. */
  rentShare?: number
}

export type FilterState = {
  categoryTab: "all" | "roommates" | "places"
  searchQuery: string
  sortBy: "best-match" | "budget" | "move-in"
  housingType: "all" | "private" | "shared"
  area: string
  budgetRange: "any" | "under-250" | "250-400" | "400-plus"
  lifestyleRhythms: string[]
  moveInHorizon: "anytime" | "next-30-days" | "2-3-months"
}

export const DEFAULT_FILTERS: FilterState = {
  categoryTab: "all",
  searchQuery: "",
  sortBy: "best-match",
  housingType: "all",
  area: "all",
  budgetRange: "any",
  lifestyleRhythms: [],
  moveInHorizon: "anytime",
}

export const HOUSING_TYPE_OPTIONS = [
  { id: "all", label: "All arrangements" },
  { id: "private", label: "Private rooms" },
  { id: "shared", label: "Shared room" },
] as const

export const BUDGET_OPTIONS = [
  { id: "any", label: "Any" },
  { id: "under-250", label: "< $250" },
  { id: "250-400", label: "$250–$400" },
  { id: "400-plus", label: "$400+" },
] as const

/** Quiz answers each lifestyle filter accepts. */
export const LIFESTYLE_OPTIONS = [
  { id: "early-bird", label: "Early bird", habit: "sleep", answers: ["early-bird"] },
  { id: "night-owl", label: "Night owl", habit: "sleep", answers: ["night-owl"] },
  { id: "tidy", label: "Tidy", habit: "cleanliness", answers: ["meticulous", "tidy"] },
  { id: "quiet", label: "Quiet home", habit: "noise", answers: ["quiet"] },
] as const

export const MOVE_IN_OPTIONS = [
  { id: "anytime", label: "Anytime / Flexible" },
  { id: "next-30-days", label: "Within 30 days" },
  { id: "2-3-months", label: "Within 3 months" },
] as const

const DAY_MS = 24 * 60 * 60 * 1000
const MOVE_IN_WINDOW_DAYS = { "next-30-days": 30, "2-3-months": 90 } as const

/** "2026-11-01" → "Nov 1", parsed as a local date. */
export function formatShortDate(isoDate: string) {
  return new Date(`${isoDate.slice(0, 10)}T00:00:00`).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" }
  )
}

export function studentListing(
  student: Student,
  myAnswers: CompatibilityAnswers | null
): RoommateListing {
  const tookQuiz = hasCompletedQuiz(student.answers)
  return {
    id: `student-${student.id}`,
    type: "student",
    name: student.name || "RoomieMatch student",
    // University gets its own line on the card.
    subtitle: student.gender && student.gender !== "Other" ? student.gender : "",
    description:
      student.bio?.trim() ||
      (tookQuiz
        ? "Took the compatibility quiz. Say hello to learn more."
        : "Hasn't taken the compatibility quiz yet."),
    tags: habitTags(student.answers),
    match: scoreMatch(myAnswers, student.answers),
    contactId: student.id,
    contactName: student.name,
    avatarUrl: student.avatar_url || null,
    student,
  }
}

export function roomListing(room: OpenRoom): RoommateListing {
  const rentShare = Math.round(room.monthly_rent / Math.max(room.member_count, 1))
  const spots = room.open_spots
  return {
    id: `room-${room.id}`,
    type: "place",
    name: room.name,
    subtitle: `${room.arrangement === "shared" ? "Shared room" : "Private rooms"} • ${
      spots > 0 ? `${spots} of ${room.member_count} spots open` : "Accepting roommates"
    }`,
    description: `${room.member_count}-person home in ${room.district}. Total rent ${formatUsd(
      room.monthly_rent
    )}/mo, lease until ${new Date(`${room.lease_end_date}T00:00:00`).toLocaleDateString(
      "en-US",
      { month: "short", year: "numeric" }
    )}.`,
    tags: [
      room.arrangement === "shared" ? "Shared room" : "Private rooms",
      room.quiet_hours_start ? "Quiet hours" : null,
      room.guest_policy === "never"
        ? "No overnight guests"
        : room.guest_policy === "with-notice"
          ? "Guests with notice"
          : room.guest_policy === "anytime"
            ? "Guests welcome"
            : null,
    ].filter((tag): tag is string => Boolean(tag)),
    match: null,
    contactId: room.owner_id,
    contactName: room.owner_name ?? "the host",
    avatarUrl: null,
    room,
    rentShare,
  }
}

function matchesStudentFilters(listing: RoommateListing, filters: FilterState) {
  const answers = listing.student?.answers ?? {}
  return filters.lifestyleRhythms.every((id) => {
    const option = LIFESTYLE_OPTIONS.find((o) => o.id === id)
    if (!option) return true
    const answer = answers[option.habit]
    return (option.answers as readonly string[]).includes(answer ?? "")
  })
}

function matchesPlaceFilters(
  room: OpenRoom,
  rentShare: number,
  filters: FilterState,
  now: number
) {
  if (filters.housingType !== "all" && room.arrangement !== filters.housingType) {
    return false
  }
  if (filters.area !== "all" && room.district !== filters.area) return false
  if (filters.budgetRange === "under-250" && rentShare >= 250) return false
  if (filters.budgetRange === "250-400" && (rentShare < 250 || rentShare > 400)) {
    return false
  }
  if (filters.budgetRange === "400-plus" && rentShare < 400) return false
  if (filters.moveInHorizon !== "anytime") {
    const moveIn = new Date(`${room.move_in_date}T00:00:00`).getTime()
    if (moveIn > now + MOVE_IN_WINDOW_DAYS[filters.moveInHorizon] * DAY_MS) {
      return false
    }
  }
  return true
}

/**
 * Student filters (lifestyle) only narrow students, and room filters (area,
 * rent, arrangement, move-in) only narrow places: each kind keeps the fields
 * the other doesn't have.
 */
export function filterListings(
  listings: RoommateListing[],
  filters: FilterState,
  now = Date.now()
) {
  const query = filters.searchQuery.toLowerCase().trim()
  return listings
    .filter((item) => {
      if (filters.categoryTab === "roommates" && item.type !== "student") return false
      if (filters.categoryTab === "places" && item.type !== "place") return false

      if (query) {
        const haystack = [
          item.name,
          item.subtitle,
          item.description,
          item.room?.district,
          item.student?.university,
          ...item.tags,
        ]
        if (!haystack.some((text) => text?.toLowerCase().includes(query))) {
          return false
        }
      }

      return item.room
        ? matchesPlaceFilters(item.room, item.rentShare ?? 0, filters, now)
        : matchesStudentFilters(item, filters)
    })
    .sort((a, b) => {
      if (filters.sortBy === "budget") {
        return (a.rentShare ?? Infinity) - (b.rentShare ?? Infinity)
      }
      if (filters.sortBy === "move-in") {
        return (a.room?.move_in_date ?? "9999").localeCompare(
          b.room?.move_in_date ?? "9999"
        )
      }
      return (b.match?.score ?? -1) - (a.match?.score ?? -1)
    })
}
