import type { LucideIcon } from "lucide-react"

export type HouseholdResident = {
  id: string
  name: string
  subtitle: string
  isCurrentUser: boolean
  /** Invitees haven't joined yet; only the host is a member. */
  status: "member" | "invited"
  initials: string
  preferencesHeader: string
  preferences: string[]
}

/** Who a chore can be assigned to: the host, an invitee, or everyone. */
export type ChoreAssignee = {
  id: string
  label: string
  initials: string
  badgeBg: string
  textColor: string
}

export type HouseRule = {
  id: string
  title: string
  description: string
  category: string
  icon: LucideIcon
}

export type ExpenseItem = {
  id: string
  title: string
  totalAmount: number
  yourShare: number
  dueNote: string
  isEstimate: boolean
  status: "Paid" | "Pending"
}
