import {
  BrainCircuit,
  Gavel,
  ListChecks,
  MapPin,
  Search,
  type LucideIcon,
} from "lucide-react"

export type NavLink = {
  label: string
  href: string
}

export type IconNavLink = NavLink & {
  icon: LucideIcon
}

export const siteConfig = {
  name: "RoomieMatch",
  title: "RoomieMatch — Find a roommate who fits your lifestyle rhythm",
  description:
    "Compare daily sleep cadences, study habits, and house rules before signing a lease. Free roommate matching for verified university students in Phnom Penh.",
  tagline:
    "A mindful roommate matching community built on lifestyle rhythms, mutual habits, and shared values. Elevating shared living into a calm, harmonious experience.",
} as const

export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Browse", href: "/browse" },
  { label: "My Home", href: "/my-home" },
]

export const quickLinks: IconNavLink[] = [
  { label: "Browse", href: "/browse", icon: Search },
  {
    label: "Compatibility Test",
    href: "/compatibility-test",
    icon: BrainCircuit,
  },
  { label: "Create a Room", href: "/rooms/new", icon: MapPin },
  { label: "House Agreements", href: "/my-home", icon: Gavel },
  { label: "Chores & Household", href: "/my-home", icon: ListChecks },
]

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Living", href: "/terms" },
  { label: "Safety Guidelines", href: "/safety" },
]
