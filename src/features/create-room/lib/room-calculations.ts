import { formatMonthYear, formatTime, formatUsd } from "@/lib/format"
import type { RoomDraft, RoomDraftErrors, Utility } from "../types"

// Re-exported so wizard components keep a single import site.
export { formatMonthYear, formatTime, formatUsd }

export const ROOM_NAME_MAX_LENGTH = 80
const MONTHLY_RENT_MAX = 100_000

function splitEvenly(total: number, members: number) {
  return Math.round(total / Math.max(members, 1))
}

export function rentPerPerson(draft: RoomDraft) {
  return splitEvenly(draft.monthlyRent ?? 0, draft.memberCount)
}

export function utilityShare(utility: Utility, members: number) {
  return splitEvenly(utility.monthlyTotal, members)
}

export function utilitiesPerPerson(draft: RoomDraft) {
  return draft.utilities.reduce(
    (sum, utility) => sum + utilityShare(utility, draft.memberCount),
    0
  )
}

export function splitRatioLabel(members: number) {
  return members === 2 ? "Split 50/50" : `Split ${members} ways`
}

export function equalShareLabel(members: number) {
  return `Equal ${Math.round(100 / members)}% split`
}

export function acModeLabel(temperature: number) {
  if (temperature <= 23) return "Cool"
  if (temperature <= 25) return "Balanced"
  return "Eco"
}

export function joinLink(draft: RoomDraft) {
  const slug =
    draft.name
      .toLowerCase()
      .trim()
      .split(/\s+/)[0]
      ?.replace(/[^a-z0-9-]/g, "") || "room"
  return `roomiematch.kh/join/${slug}-${draft.joinCode}`
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TELEGRAM_HANDLE_PATTERN = /^@[a-zA-Z0-9_]{5,32}$/

export function isValidInviteContact(value: string) {
  return EMAIL_PATTERN.test(value) || TELEGRAM_HANDLE_PATTERN.test(value)
}

/** Quiet hours, guest policy, AC, and the two fixed habits, plus custom ones. */
export function countConfiguredRules(draft: RoomDraft) {
  return 5 + draft.rules.customGuidelines.length
}

export function validateRoomDraft(draft: RoomDraft): RoomDraftErrors {
  const errors: RoomDraftErrors = {}

  const name = draft.name.trim()
  if (!name) errors.name = "Give your home a name."
  else if (name.length > ROOM_NAME_MAX_LENGTH) {
    errors.name = `Keep the name under ${ROOM_NAME_MAX_LENGTH} characters.`
  }
  if (!draft.district) errors.district = "Choose a district."
  const rent = draft.monthlyRent
  if (rent === null || !Number.isFinite(rent) || rent <= 0) {
    errors.monthlyRent = "Enter the total monthly rent."
  } else if (rent > MONTHLY_RENT_MAX) {
    errors.monthlyRent = "That rent looks too high. Check the amount."
  }
  if (!draft.moveInDate) errors.moveInDate = "Pick a move-in date."
  if (!draft.leaseEndDate) {
    errors.leaseEndDate = "Pick a lease end date."
  } else if (draft.moveInDate && draft.leaseEndDate <= draft.moveInDate) {
    errors.leaseEndDate = "Lease must end after move-in."
  }

  return errors
}
