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
  { label: "Discovery", href: "/discovery", icon: Search },
  {
    label: "Compatibility Test",
    href: "/compatibility-test",
    icon: BrainCircuit,
  },
  { label: "Agreements", href: "/agreements", icon: Gavel },
  { label: "Chores & Household", href: "/chores", icon: ListChecks },
  { label: "Phnom Penh Hubs", href: "/hubs", icon: MapPin },
]

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Living", href: "/terms" },
  { label: "Safety Guidelines", href: "/safety" },
]
