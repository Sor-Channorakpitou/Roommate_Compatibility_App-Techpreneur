import type {
  Chore,
  HouseRules,
  Invitee,
  Utility,
} from "@/features/create-room/types"
import type { Room } from "@/lib/supabase"

export type RoomChore = Chore & { completed?: boolean }

/** The `rooms.settings` document the Create Room wizard writes. */
export type RoomSettings = {
  joinCode: string
  invitees: Invitee[]
  rules: HouseRules
  rotateChoresWeekly: boolean
  chores: RoomChore[]
  utilities: Utility[]
  /** Expense ids marked paid, keyed by month ("2026-11"). */
  payments: Record<string, string[]>
}

const DEFAULT_RULES: HouseRules = {
  quietHours: { start: "22:00", end: "07:00" },
  guestPolicy: "with-notice",
  acTemperature: 26,
  customGuidelines: [],
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

/** Reads `settings` defensively: older rooms may be missing fields. */
export function parseRoomSettings(room: Pick<Room, "settings">): RoomSettings {
  const raw = (room.settings ?? {}) as Partial<RoomSettings>
  const rules = (raw.rules ?? {}) as Partial<HouseRules>
  return {
    joinCode: typeof raw.joinCode === "string" ? raw.joinCode : "",
    invitees: asArray<Invitee>(raw.invitees),
    rules: {
      ...DEFAULT_RULES,
      ...rules,
      quietHours: { ...DEFAULT_RULES.quietHours, ...rules.quietHours },
      customGuidelines: asArray<string>(rules.customGuidelines),
    },
    rotateChoresWeekly: raw.rotateChoresWeekly ?? false,
    chores: asArray<RoomChore>(raw.chores),
    utilities: asArray<Utility>(raw.utilities),
    payments:
      raw.payments && typeof raw.payments === "object" ? raw.payments : {},
  }
}

/** "2026-11" for the month containing `date`. */
export function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}
