import type { GuestPolicy, RoomArrangement, RoomDraft, StepId } from "../types"

/** `cta` completes the "Next: …" button that leads into the step. */
export const WIZARD_STEPS: { id: StepId; label: string; cta: string }[] = [
  { id: "room-details", label: "Room details", cta: "Room details" },
  { id: "roommates", label: "Roommates", cta: "Invite roommates" },
  { id: "house-rules", label: "House rules", cta: "House rules" },
  { id: "chores-bills", label: "Chores & bills", cta: "Chores & bills" },
  { id: "review", label: "Review", cta: "Review & publish" },
]

export const PHNOM_PENH_DISTRICTS = [
  "BKK1, Phnom Penh",
  "Chamkar Mon, Phnom Penh",
  "Daun Penh, Phnom Penh",
  "Russey Keo, Phnom Penh",
  "Sen Sok, Phnom Penh",
  "Toul Kork, Phnom Penh",
  "Toul Tom Poung, Phnom Penh",
] as const

/** Host label shown while the creator is not signed in. */
export const GUEST_HOST_NAME = "You"

export const MEMBER_LIMITS = { min: 2, max: 6 } as const

export const AC_TEMPERATURE = { min: 22, max: 28 } as const

export const ARRANGEMENT_OPTIONS: {
  value: RoomArrangement
  title: string
  summary: string
  description: string
}[] = [
  {
    value: "private",
    title: "Private rooms",
    summary: "Private rooms",
    description:
      "Each roommate has an individual private bedroom, sharing common areas like kitchen & living room.",
  },
  {
    value: "shared",
    title: "Shared room",
    summary: "Shared room",
    description:
      "Roommates share the same master bedroom studio or twin room setups for maximum budget efficiency.",
  },
]

export const GUEST_POLICY_OPTIONS: {
  value: GuestPolicy
  label: string
  detail: string
  summary: string
}[] = [
  {
    value: "never",
    label: "Never",
    detail: "No overnight guests in the shared home",
    summary: "No overnight guests",
  },
  {
    value: "with-notice",
    label: "With notice",
    detail: "24 hours heads-up in Telegram chat",
    summary: "Guest notice: 24 hours",
  },
  {
    value: "anytime",
    label: "Anytime",
    detail: "Guests welcome, just keep common areas tidy",
    summary: "Guests welcome anytime",
  },
]

/** Fixed habits every RoomieMatch household starts from. */
export const HOUSE_HABITS = [
  { label: "Smoking Policy", value: "Not allowed indoors", tone: "negative" },
  { label: "Dish washing", value: "Clean after each meal", tone: "positive" },
] as const

export const DEFAULT_ROOM_DRAFT: RoomDraft = {
  name: "Sunflower Sanctuary",
  district: "Toul Kork, Phnom Penh",
  street: "St 315, near TK Avenue",
  monthlyRent: 560,
  moveInDate: "2025-11-01",
  leaseEndDate: "2027-10-31",
  arrangement: "private",
  memberCount: 2,
  invitees: [{ id: "sokha", name: "Sokha Lim", contact: "@sokha_pp" }],
  joinCode: "78c9",
  rules: {
    quietHours: { start: "22:00", end: "07:00" },
    guestPolicy: "with-notice",
    acTemperature: 26,
    customGuidelines: [],
  },
  rotateChoresWeekly: true,
  chores: [
    {
      id: "kitchen",
      title: "Deep Kitchen Clean",
      schedule: "Weekly on Sundays",
      assignee: "host",
    },
    {
      id: "trash",
      title: "Recycling & Trash",
      schedule: "Every Tuesday & Friday",
      assignee: "sokha",
    },
    {
      id: "vacuum",
      title: "Living Room Vacuum",
      schedule: "Bi-weekly Saturdays",
      assignee: "shared",
    },
  ],
  utilities: [
    {
      id: "electricity",
      kind: "electricity",
      name: "Electricity (EDC Meter)",
      dueNote: "Due 5th of every month",
      monthlyTotal: 70,
      isEstimate: true,
    },
    {
      id: "water",
      kind: "water",
      name: "Clean Water (PPWSA)",
      dueNote: "Due 10th of every month",
      monthlyTotal: 12,
      isEstimate: true,
    },
    {
      id: "internet",
      kind: "internet",
      name: "High Speed Fiber Wi-Fi",
      dueNote: "Fixed fee $28/mo",
      monthlyTotal: 28,
      isEstimate: false,
    },
  ],
}
