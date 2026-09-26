export type StepId =
  "room-details" | "roommates" | "house-rules" | "chores-bills" | "review"

export type RoomArrangement = "private" | "shared"

export type GuestPolicy = "never" | "with-notice" | "anytime"

export type Invitee = {
  id: string
  /** Display name; falls back to the handle until the invite is accepted. */
  name: string
  /** Telegram @handle or email address the invite was sent to. */
  contact: string
}

/** Who a chore belongs to: the host, an invitee's id, or everyone. */
export type ChoreAssignee = "host" | "shared" | (string & {})

export type Chore = {
  id: string
  title: string
  schedule: string
  assignee: ChoreAssignee
}

export type UtilityKind = "electricity" | "water" | "internet"

export type Utility = {
  id: string
  kind: UtilityKind
  name: string
  dueNote: string
  /** Household total per month, in USD. */
  monthlyTotal: number
  /** Metered bills vary month to month, so their share is shown as `~$`. */
  isEstimate: boolean
}

export type HouseRules = {
  quietHours: { start: string; end: string }
  guestPolicy: GuestPolicy
  acTemperature: number
  customGuidelines: string[]
}

export type RoomDraft = {
  name: string
  district: string
  street: string
  monthlyRent: number | null
  moveInDate: string
  leaseEndDate: string
  arrangement: RoomArrangement
  memberCount: number
  invitees: Invitee[]
  joinCode: string
  rules: HouseRules
  rotateChoresWeekly: boolean
  chores: Chore[]
  utilities: Utility[]
}

export type RoomDraftErrors = Partial<
  Record<
    "name" | "district" | "monthlyRent" | "moveInDate" | "leaseEndDate",
    string
  >
>
