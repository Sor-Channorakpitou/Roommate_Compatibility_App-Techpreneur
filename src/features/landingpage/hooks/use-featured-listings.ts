import * as React from "react"

import { habitTags, hasCompletedQuiz } from "@/lib/compatibility"
import { formatUsd } from "@/lib/format"
import { listOpenRooms, listStudents, type Student } from "@/lib/students-api"
import { isSupabaseConfigured, type OpenRoom } from "@/lib/supabase"
import type { Listing } from "@/features/landingpage/data/landing-content"

const FEATURED_COUNT = 4
const MAX_FEATURED_ROOMS = 2

function roomToListing(room: OpenRoom): Listing {
  const share = Math.round(room.monthly_rent / Math.max(room.member_count, 1))
  const moveIn = new Date(`${room.move_in_date}T00:00:00`).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" }
  )
  return {
    id: `room-${room.id}`,
    kind: "room",
    title: room.name,
    subtitle: room.district,
    description: `${room.arrangement === "shared" ? "Shared room" : "Private rooms"} in a ${room.member_count}-person home${
      room.owner_name ? ` hosted by ${room.owner_name}` : ""
    }.`,
    meta: `${room.open_spots > 0 ? `${room.open_spots} spots open` : "Accepting roommates"} · Move in ${moveIn}`,
    price: `${formatUsd(share)} / mo`,
    status: "Open Room",
    statusClassName: "bg-[#652c00]",
    image: null,
    imageAlt: "",
    href: "/browse",
  }
}

function studentToListing(student: Student): Listing {
  const tags = habitTags(student.answers)
  return {
    id: `student-${student.id}`,
    kind: "seeker",
    title: student.name,
    subtitle: student.university || "RoomieMatch student",
    description:
      student.bio?.trim() || "Looking for a roommate with a matching rhythm.",
    meta: tags.length > 0 ? tags.join(" · ") : "Compatibility quiz not taken yet",
    price: null,
    status: hasCompletedQuiz(student.answers) ? "Quiz done" : "New member",
    statusClassName: hasCompletedQuiz(student.answers)
      ? "bg-sage-foreground"
      : "bg-primary",
    image: student.avatar_url || null,
    imageAlt: student.name,
    href: "/browse",
  }
}

/**
 * A few real rooms and students for the landing page, plus the total count.
 * Students who finished the quiz and wrote a bio are featured first.
 */
export function useFeaturedListings() {
  const [state, setState] = React.useState<
    { status: "loading" } | { status: "ready"; listings: Listing[]; total: number }
  >(isSupabaseConfigured ? { status: "loading" } : { status: "ready", listings: [], total: 0 })

  React.useEffect(() => {
    if (!isSupabaseConfigured) return
    let isCurrent = true
    Promise.all([listStudents(), listOpenRooms()])
      .then(([students, { rooms }]) => {
        if (!isCurrent) return
        const ranked = [...students].sort(
          (a, b) =>
            Number(hasCompletedQuiz(b.answers)) - Number(hasCompletedQuiz(a.answers)) ||
            Number(Boolean(b.bio?.trim())) - Number(Boolean(a.bio?.trim()))
        )
        const featuredRooms = rooms.slice(0, MAX_FEATURED_ROOMS).map(roomToListing)
        const listings = [
          ...featuredRooms,
          ...ranked
            .slice(0, FEATURED_COUNT - featuredRooms.length)
            .map(studentToListing),
        ]
        setState({ status: "ready", listings, total: students.length + rooms.length })
      })
      .catch(() => {
        // The section hides itself rather than showing a broken carousel.
        if (isCurrent) setState({ status: "ready", listings: [], total: 0 })
      })
    return () => {
      isCurrent = false
    }
  }, [])

  return state
}
