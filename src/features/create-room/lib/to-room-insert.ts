import type { RoomInsert } from "@/lib/rooms-api"
import type { RoomDraft } from "../types"

/** Maps a validated wizard draft onto a `rooms` row. */
export function toRoomInsert(draft: RoomDraft): RoomInsert {
  return {
    name: draft.name.trim(),
    district: draft.district,
    street: draft.street.trim(),
    monthly_rent: draft.monthlyRent ?? 0,
    move_in_date: draft.moveInDate,
    lease_end_date: draft.leaseEndDate,
    arrangement: draft.arrangement,
    member_count: draft.memberCount,
    settings: {
      joinCode: draft.joinCode,
      invitees: draft.invitees,
      rules: draft.rules,
      rotateChoresWeekly: draft.rotateChoresWeekly,
      chores: draft.chores,
      utilities: draft.utilities,
    },
  }
}
