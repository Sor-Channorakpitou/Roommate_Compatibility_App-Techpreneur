import {
  BellOff,
  Flame,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"

import type {
  ChoreAssignee,
  ChoreItem,
  ExpenseItem,
  HouseholdResident,
  HouseRule,
} from "../types"

export const ASSIGNEE_SOPHEAK: ChoreAssignee = {
  id: "sopheak",
  name: "Sopheak Chan",
  shortLabel: "Sopheak (You)",
  initials: "SC",
  badgeBg: "#fce5dc",
  textColor: "#9c4220",
}

export const ASSIGNEE_ROTHANA: ChoreAssignee = {
  id: "rothana",
  name: "Rothana P.",
  shortLabel: "Rothana P.",
  initials: "RP",
  badgeBg: "#d8edd9",
  textColor: "#276e33",
}

export const INITIAL_RESIDENTS: HouseholdResident[] = [
  {
    id: "user-sopheak",
    name: "Sopheak Chan",
    age: 26,
    occupation: "Software Developer",
    isCurrentUser: true,
    avatarInitials: "SC",
    avatarBg: "bg-[#fce5dc]",
    avatarTextColor: "text-[#9c4220]",
    preferencesHeader: "LIVING PREFERENCES",
    preferences: [
      { id: "p1", label: "Early bird (10:30 PM)", iconName: "moon" },
      { id: "p2", label: "Clean daily", iconName: "sparkles" },
      { id: "p3", label: "24h heads-up", iconName: "users" },
      { id: "p4", label: "Quiet after 10 PM", iconName: "volume-x" },
      { id: "p5", label: "26°C Eco", iconName: "snowflake" },
    ],
  },
  {
    id: "user-rothana",
    name: "Rothana P.",
    age: 25,
    occupation: "Architecture Student",
    isCurrentUser: false,
    matchScore: 92,
    avatarInitials: "RP",
    avatarBg: "bg-[#d8edd9]",
    avatarTextColor: "text-[#276e33]",
    preferencesHeader: "SHARED ALIGNMENT",
    preferences: [
      { id: "r1", label: "Early bird (11:00 PM)", iconName: "moon" },
      { id: "r2", label: "Clean daily", iconName: "sparkles" },
      { id: "r3", label: "Weekends only", iconName: "calendar" },
      { id: "r4", label: "Quiet after 10 PM", iconName: "volume-x" },
      { id: "r5", label: "26°C Eco", iconName: "snowflake" },
    ],
  },
]

export const INITIAL_CHORES: ChoreItem[] = [
  {
    id: "chore-1",
    title: "Deep Kitchen Clean",
    recurrence: "Rotation",
    completedNote: "Completed Tuesday",
    assignee: ASSIGNEE_ROTHANA,
    isCompleted: true,
  },
  {
    id: "chore-2",
    title: "Balcony & Plant Watering",
    recurrence: "Rotation",
    completedNote: "Completed Yesterday",
    assignee: ASSIGNEE_SOPHEAK,
    isCompleted: true,
  },
  {
    id: "chore-3",
    title: "Recycling & Trash Duty",
    recurrence: "Weekly",
    dueNote: "Due Sunday evening",
    assignee: ASSIGNEE_ROTHANA,
    isCompleted: false,
  },
  {
    id: "chore-4",
    title: "Living Room Vacuum",
    recurrence: "Bi-weekly",
    dueNote: "Due Saturday",
    assignee: ASSIGNEE_SOPHEAK,
    isCompleted: false,
  },
]

export const INITIAL_HOUSE_RULES: HouseRule[] = [
  {
    id: "rule-1",
    title: "Quiet Hours Policy",
    description: "Keep music and call volume low between 10:00 PM and 7:00 AM on weekdays.",
    category: "Quiet Hours",
    icon: BellOff,
  },
  {
    id: "rule-2",
    title: "Overnight Guests Courtesy",
    description: "Provide at least 24 hours heads-up in our shared chat before hosting overnight visitors.",
    category: "Guests",
    icon: Users,
  },
  {
    id: "rule-3",
    title: "Kitchen Cleanliness Guarantee",
    description: "Wash pans, cookware, and wipe induction counters immediately after cooking.",
    category: "Cleanliness",
    icon: Sparkles,
  },
  {
    id: "rule-4",
    title: "Energy & Climate Eco-Mode",
    description: "Air conditioner defaults to 26°C with timer; turn off living room lights when leaving.",
    category: "Shared Spaces",
    icon: Flame,
  },
  {
    id: "rule-5",
    title: "Shared Respect & Safety",
    description: "Lock both front doors after 9 PM. Keep common keys in designated entry tray.",
    category: "Shared Spaces",
    icon: ShieldCheck,
  },
]

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: "exp-1",
    title: "Master Lease Apartment Rent",
    totalAmount: 560,
    yourShare: 280,
    dueDate: "Nov 1, 2026",
    status: "Pending",
    category: "Rent",
  },
  {
    id: "exp-2",
    title: "EDC Electricity & Water Bill",
    totalAmount: 76,
    yourShare: 38,
    dueDate: "Nov 3, 2026",
    status: "Paid",
    category: "Utilities",
  },
  {
    id: "exp-3",
    title: "Metfone Fiber 100Mbps Internet",
    totalAmount: 32,
    yourShare: 16,
    dueDate: "Nov 10, 2026",
    status: "Paid",
    category: "Internet",
  },
  {
    id: "exp-4",
    title: "Shared Cleaning Supplies & Trash Bags",
    totalAmount: 18,
    yourShare: 9,
    dueDate: "Nov 15, 2026",
    status: "Pending",
    category: "Household",
  },
]
