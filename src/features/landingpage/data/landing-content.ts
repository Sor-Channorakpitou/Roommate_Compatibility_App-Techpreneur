import {
  Banknote,
  Compass,
  House,
  Lock,
  MapPin,
  Moon,
  Navigation,
  SprayCan,
  ThumbsUp,
  UserSearch,
  Users,
  type LucideIcon,
} from "lucide-react"

import memberSereyroth from "@/assets/images/member-sereyroth.jpg"
import roomPreview from "@/assets/images/room-preview.jpg"

export type SearchField = {
  id: string
  name: string
  label: string
  placeholder: string
  icon: LucideIcon
  inputMode?: "text" | "numeric"
}

export const searchFields: SearchField[] = [
  {
    id: "search-location",
    name: "location",
    label: "Location",
    placeholder: "District (e.g. Toul Kork, BKK1, CADT)...",
    icon: MapPin,
  },
  {
    id: "search-rhythm",
    name: "rhythm",
    label: "Lifestyle rhythm",
    placeholder: "Early riser, quiet study, vegan...",
    icon: Moon,
  },
  {
    id: "search-budget",
    name: "budget",
    label: "Monthly budget",
    placeholder: "$150 - $350 / mo",
    icon: Banknote,
  },
]

export type FeaturedMatch = {
  name: string
  meta: string
  matchScore: number
  hub: string
  quietHours: string
  roomImage: string
  roomImageAlt: string
  avatarImage: string
  profileHref: string
}

export const featuredMatch: FeaturedMatch = {
  name: "Sereyroth M.",
  meta: "Computer Science · CADT",
  matchScore: 96,
  hub: "CADT Hub",
  quietHours: "Quiet Hours 10:30 PM - 7:00 AM",
  roomImage: roomPreview,
  roomImageAlt:
    "Sunlit shared apartment with potted plants, a balcony overlooking Phnom Penh, and a wooden study desk",
  avatarImage: memberSereyroth,
  profileHref: "/browse",
}

export type LivingHabit = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  /** Tailwind classes for the icon medallion. */
  accentClassName: string
}

export const livingHabits: LivingHabit[] = [
  {
    id: "sleep",
    title: "Sleep & Wake Hours",
    description:
      "Align weeknight lights-out windows and morning routines so everyone rests uninterrupted.",
    icon: Moon,
    accentClassName: "bg-peach text-peach-foreground",
  },
  {
    id: "cleanliness",
    title: "Cleanliness Standards",
    description:
      "Transparent expectations on dish washing, shared bathrooms, and common room upkeep.",
    icon: SprayCan,
    accentClassName: "bg-sage text-sage-foreground",
  },
  {
    id: "guests",
    title: "Guests & Study Quiet",
    description:
      "Agreed visitor notice and quiet focus zones during midterms and exam season.",
    icon: Users,
    accentClassName: "bg-peach text-peach-foreground",
  },
]

export type JourneyStep = {
  id: string
  step: string
  title: string
  description: string
  accentClassName: string
}

export const journeySteps: JourneyStep[] = [
  {
    id: "clarify",
    step: "01",
    title: "Clarify Habits",
    description:
      "Complete a 3-minute lifestyle quiz detailing your sleep cadences, AC preferences, and study routines.",
    accentClassName: "text-primary",
  },
  {
    id: "compare",
    step: "02",
    title: "Compare Compatibility",
    description:
      "Browse verified students and review habit sync scores across Toul Kork, CADT, and Phnom Penh hubs.",
    accentClassName: "text-primary",
  },
  {
    id: "pact",
    step: "03",
    title: "Create Living Pact",
    description:
      "Meet for coffee and generate a mutual roommate agreement covering chores, bills, and guests.",
    accentClassName: "text-sage-foreground",
  },
]

export type TrustSignal = {
  id: string
  label: string
  icon: LucideIcon
}

export const trustSignals: TrustSignal[] = [
  { id: "privacy", label: "Student Privacy First", icon: Lock },
  { id: "free", label: "100% Free for University Students", icon: ThumbsUp },
]

export type HeroAction = {
  id: string
  title: string
  description: string
  cta: string
  href: string
  icon: LucideIcon
  /** Tailwind classes for the icon medallion. */
  accentClassName: string
}

export const heroActions: HeroAction[] = [
  {
    id: "list-room",
    title: "Need a roommate?",
    description: "List your available space",
    cta: "List your room",
    href: "/rooms/new",
    icon: House,
    accentClassName: "bg-peach/40 text-primary",
  },
  {
    id: "find-room",
    title: "Looking for a place?",
    description: "Browse compatible rooms",
    cta: "Create your profile",
    href: "/register",
    icon: UserSearch,
    accentClassName: "bg-sage/40 text-sage-foreground",
  },
]

/** A room on offer, or a student searching for one. */
export type ListingKind = "room" | "seeker"

export type Listing = {
  id: string
  kind: ListingKind
  title: string
  subtitle: string
  description: string
  meta: string
  price: string | null
  status: string
  /** Tailwind background for the solid status pill. */
  statusClassName: string
  /** Photo URL; cards without one show initials or a house icon. */
  image: string | null
  imageAlt: string
  href: string
}

/** Footer icon differs by listing kind: a place pin vs. someone searching. */
export const listingMetaIcon: Record<ListingKind, LucideIcon> = {
  room: Navigation,
  seeker: Compass,
}

