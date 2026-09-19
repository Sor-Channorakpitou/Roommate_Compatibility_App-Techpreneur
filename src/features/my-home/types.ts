import type { LucideIcon } from "lucide-react"

export type LivingPreference = {
  id: string
  label: string
  iconName: "moon" | "sparkles" | "users" | "volume-x" | "snowflake" | "calendar"
}

export type HouseholdResident = {
  id: string
  name: string
  age: number
  occupation: string
  isCurrentUser: boolean
  matchScore?: number
  avatarInitials: string
  avatarBg: string
  avatarTextColor: string
  preferencesHeader: string
  preferences: LivingPreference[]
}

export type ChoreAssignee = {
  id: string
  name: string
  shortLabel: string
  initials: string
  badgeBg: string
  textColor: string
}

export type ChoreItem = {
  id: string
  title: string
  recurrence: string
  completedNote?: string
  dueNote?: string
  assignee: ChoreAssignee
  isCompleted: boolean
}

export type HouseRule = {
  id: string
  title: string
  description: string
  category: "Quiet Hours" | "Guests" | "Cleanliness" | "Shared Spaces"
  icon: LucideIcon
}

export type ExpenseItem = {
  id: string
  title: string
  totalAmount: number
  yourShare: number
  dueDate: string
  status: "Paid" | "Pending"
  category: "Rent" | "Utilities" | "Internet" | "Household"
}
