import * as React from "react"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/api-error"
import { scoreMatch, type CompatibilityAnswers } from "@/lib/compatibility"
import {
  listMyMessages,
  markConversationRead,
  sendMessage,
  subscribeToMessages,
} from "@/lib/messages-api"
import { getStudents, type Student } from "@/lib/students-api"
import type { Message } from "@/lib/supabase"
import type { ChatMessage, Conversation } from "../types"

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready" }

function toChatMessage(message: Message, myId: string): ChatMessage {
  return {
    id: message.id,
    fromMe: message.sender_id === myId,
    text: message.content,
    createdAt: message.created_at,
    read: message.read,
  }
}

function partnerOf(message: Message, myId: string) {
  return message.sender_id === myId ? message.receiver_id : message.sender_id
}

/**
 * The signed-in user's conversations, built from the `messages` table and
 * kept live with Realtime. `openWith` adds an empty conversation so a new
 * chat can start from Browse.
 */
export function useConversations(myId: string, openWith: string | null) {
  const [state, setState] = React.useState<LoadState>({ status: "loading" })
  const [messages, setMessages] = React.useState<Message[]>([])
  const [pending, setPending] = React.useState<(ChatMessage & { to: string })[]>([])
  const [people, setPeople] = React.useState<Map<string, Student>>(new Map())
  const [reloadKey, setReloadKey] = React.useState(0)
  const requestedIds = React.useRef(new Set<string>())

  const loadPeople = React.useCallback(async (ids: string[]) => {
    const missing = ids.filter((id) => !requestedIds.current.has(id))
    if (missing.length === 0) return
    missing.forEach((id) => requestedIds.current.add(id))
    try {
      const students = await getStudents(missing)
      setPeople((prev) => {
        const next = new Map(prev)
        students.forEach((s) => next.set(s.id, s))
        return next
      })
    } catch {
      // Let a later message retry these profiles.
      missing.forEach((id) => requestedIds.current.delete(id))
    }
  }, [])

  React.useEffect(() => {
    let isCurrent = true
    listMyMessages()
      .then((rows) => {
        if (!isCurrent) return
        setMessages(rows)
        setState({ status: "ready" })
        const ids = new Set(rows.map((m) => partnerOf(m, myId)))
        ids.add(myId)
        if (openWith) ids.add(openWith)
        void loadPeople([...ids])
      })
      .catch(
        (error: unknown) =>
          isCurrent && setState({ status: "error", message: getErrorMessage(error) })
      )
    return () => {
      isCurrent = false
    }
  }, [myId, openWith, loadPeople, reloadKey])

  // Realtime: add new messages and pick up read receipts.
  React.useEffect(
    () =>
      subscribeToMessages(myId, (message) => {
        setMessages((prev) => {
          const index = prev.findIndex((m) => m.id === message.id)
          if (index === -1) {
            return [...prev, message].sort((a, b) =>
              a.created_at.localeCompare(b.created_at)
            )
          }
          const next = [...prev]
          next[index] = message
          return next
        })
        void loadPeople([partnerOf(message, myId)])
      }),
    [myId, loadPeople]
  )

  const conversations = React.useMemo(() => {
    const myAnswers: CompatibilityAnswers | undefined = people.get(myId)?.answers
    const byPartner = new Map<string, ChatMessage[]>()
    for (const message of messages) {
      const id = partnerOf(message, myId)
      byPartner.set(id, [...(byPartner.get(id) ?? []), toChatMessage(message, myId)])
    }
    for (const message of pending) {
      byPartner.set(message.to, [...(byPartner.get(message.to) ?? []), message])
    }
    if (openWith && openWith !== myId && !byPartner.has(openWith)) {
      byPartner.set(openWith, [])
    }

    const list: Conversation[] = [...byPartner].map(([partnerId, thread]) => {
      const partner = people.get(partnerId) ?? null
      return {
        partnerId,
        partner,
        match: scoreMatch(myAnswers, partner?.answers),
        messages: thread,
        unreadCount: thread.filter((m) => !m.fromMe && !m.read).length,
        lastActivity: thread.at(-1)?.createdAt ?? new Date().toISOString(),
      }
    })
    return list.sort((a, b) => b.lastActivity.localeCompare(a.lastActivity))
  }, [messages, pending, people, myId, openWith])

  const send = React.useCallback(async (partnerId: string, text: string) => {
    const temp = {
      id: `pending-${crypto.randomUUID()}`,
      to: partnerId,
      fromMe: true,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      read: false,
      status: "sending" as const,
    }
    setPending((prev) => [...prev, temp])
    try {
      const saved = await sendMessage(partnerId, text)
      setMessages((prev) =>
        prev.some((m) => m.id === saved.id) ? prev : [...prev, saved]
      )
      setPending((prev) => prev.filter((m) => m.id !== temp.id))
    } catch (error) {
      setPending((prev) =>
        prev.map((m) => (m.id === temp.id ? { ...m, status: "failed" } : m))
      )
      toast.error("Message not sent", { description: getErrorMessage(error) })
    }
  }, [])

  const markRead = React.useCallback(
    (partnerId: string) => {
      const hasUnread = messages.some(
        (m) => m.sender_id === partnerId && m.receiver_id === myId && !m.read
      )
      if (!hasUnread) return
      setMessages((prev) =>
        prev.map((m) =>
          m.sender_id === partnerId && m.receiver_id === myId ? { ...m, read: true } : m
        )
      )
      markConversationRead(partnerId).catch(() => {
        // The badge corrects itself on the next load.
      })
    },
    [messages, myId]
  )

  const reload = React.useCallback(() => {
    setState({ status: "loading" })
    setReloadKey((key) => key + 1)
  }, [])

  return { state, conversations, send, markRead, reload }
}
