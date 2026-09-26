import type { MatchResult } from "@/lib/compatibility"
import type { Student } from "@/lib/students-api"

export type ChatMessage = {
  id: string
  fromMe: boolean
  text: string
  createdAt: string
  read: boolean
  /** Shown before the database confirms the insert. */
  status?: "sending" | "failed"
}

export type Conversation = {
  partnerId: string
  /** Null while the partner's profile loads, or if it no longer exists. */
  partner: Student | null
  match: MatchResult | null
  messages: ChatMessage[]
  unreadCount: number
  /** Latest message time, for ordering the inbox. */
  lastActivity: string
}
