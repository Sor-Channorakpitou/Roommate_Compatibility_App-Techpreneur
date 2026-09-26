import {
  BellOff,
  CigaretteOff,
  Snowflake,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react"

import {
  GUEST_POLICY_OPTIONS,
  HOUSE_HABITS,
} from "@/features/create-room/data/create-room-defaults"
import {
  acModeLabel,
  firstName,
} from "@/features/create-room/lib/room-calculations"
import { habitTags, type CompatibilityAnswers } from "@/lib/compatibility"
import { formatTime, getInitials } from "@/lib/format"
import { monthKey, type RoomSettings } from "@/lib/room-settings"
import type { Room } from "@/lib/supabase"
import type {
  ChoreAssignee,
  ExpenseItem,
  HouseholdResident,
  HouseRule,
} from "../types"

const ASSIGNEE_COLORS = [
  { badgeBg: "#fce5dc", textColor: "#9c4220" },
  { badgeBg: "#d8edd9", textColor: "#276e33" },
  { badgeBg: "#e0e7ff", textColor: "#3730a3" },
  { badgeBg: "#fef3c7", textColor: "#78350f" },
  { badgeBg: "#fce7f3", textColor: "#831843" },
]

export function buildResidents(
  host: { name: string; university: string },
  answers: CompatibilityAnswers,
  settings: RoomSettings
): HouseholdResident[] {
  const tags = habitTags(answers)
  return [
    {
      id: "host",
      name: host.name,
      subtitle: host.university ? `Host · ${host.university}` : "Host",
      isCurrentUser: true,
      status: "member",
      initials: getInitials(host.name),
      preferencesHeader: "LIVING PREFERENCES",
      preferences: tags,
    },
    ...settings.invitees.map((invitee) => ({
      id: invitee.id,
      name: invitee.name,
      subtitle: `Invited via ${invitee.contact}`,
      isCurrentUser: false,
      status: "invited" as const,
      initials: getInitials(invitee.name),
      preferencesHeader: "INVITATION",
      preferences: ["Hasn't joined yet"],
    })),
  ]
}

/** The host, each invitee, and "Everyone", matching the wizard's ids. */
export function buildAssignees(
  hostName: string,
  settings: RoomSettings
): ChoreAssignee[] {
  return [
    {
      id: "host",
      label: `${firstName(hostName)} (You)`,
      initials: getInitials(hostName),
      ...ASSIGNEE_COLORS[0],
    },
    ...settings.invitees.map((invitee, index) => ({
      id: invitee.id,
      label: firstName(invitee.name),
      initials: getInitials(invitee.name),
      ...ASSIGNEE_COLORS[(index + 1) % ASSIGNEE_COLORS.length],
    })),
    {
      id: "shared",
      label: "Everyone",
      initials: "All",
      badgeBg: "#efe9e1",
      textColor: "#55433c",
    },
  ]
}

export function buildHouseRules(settings: RoomSettings): HouseRule[] {
  const { rules } = settings
  const guest = GUEST_POLICY_OPTIONS.find((o) => o.value === rules.guestPolicy)
  const habitIcons: Record<string, LucideIcon> = {
    "Smoking Policy": CigaretteOff,
    "Dish washing": Sparkles,
  }
  return [
    {
      id: "quiet-hours",
      title: "Quiet Hours",
      description: `Keep music and calls low between ${formatTime(
        rules.quietHours.start
      )} and ${formatTime(rules.quietHours.end)}.`,
      category: "Quiet Hours",
      icon: BellOff,
    },
    {
      id: "guests",
      title: `Guests: ${guest?.label ?? "With notice"}`,
      description: guest?.detail ?? "Give notice before overnight guests.",
      category: "Guests",
      icon: Users,
    },
    {
      id: "ac",
      title: `AC at ${rules.acTemperature}°C`,
      description: `Air conditioning defaults to ${rules.acTemperature}°C (${acModeLabel(
        rules.acTemperature
      )} mode).`,
      category: "Shared Spaces",
      icon: Snowflake,
    },
    ...HOUSE_HABITS.map((habit) => ({
      id: habit.label,
      title: habit.label,
      description: habit.value,
      category: "Cleanliness",
      icon: habitIcons[habit.label] ?? Sparkles,
    })),
    ...rules.customGuidelines.map((text, index) => ({
      id: `custom-${index}`,
      title: "House guideline",
      description: text,
      category: "Shared Spaces",
      icon: Sparkles,
    })),
  ]
}

function ordinal(day: number) {
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th"
  return `${day}${suffix}`
}

/** Rent falls due on the move-in day of each month. */
export function rentDueNote(room: Room) {
  const day = Number(room.move_in_date.slice(8, 10))
  return `Due the ${ordinal(day)} of each month`
}

export function buildExpenses(room: Room, settings: RoomSettings): ExpenseItem[] {
  const members = Math.max(room.member_count, 1)
  const paid = new Set(settings.payments[monthKey()] ?? [])
  return [
    {
      id: "rent",
      title: "Monthly Rent",
      totalAmount: room.monthly_rent,
      yourShare: Math.round(room.monthly_rent / members),
      dueNote: rentDueNote(room),
      isEstimate: false,
      status: paid.has("rent") ? "Paid" : "Pending",
    },
    ...settings.utilities.map((utility) => ({
      id: utility.id,
      title: utility.name,
      totalAmount: utility.monthlyTotal,
      yourShare: Math.round(utility.monthlyTotal / members),
      dueNote: utility.dueNote,
      isEstimate: utility.isEstimate,
      status: paid.has(utility.id) ? ("Paid" as const) : ("Pending" as const),
    })),
  ]
}

/** "just now", "5m ago", "3h ago", "2d ago", else a date. */
export function formatUpdatedAgo(iso: string, now = Date.now()) {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
