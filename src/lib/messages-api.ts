import { ApiError, ensureSignedIn } from "@/lib/api-error"
import { supabase, type Message } from "@/lib/supabase"

const NOT_SIGNED_IN = "Sign in to send and read messages."

export const MESSAGE_MAX_LENGTH = 2000

/** Every message the signed-in user sent or received, oldest first. */
export async function listMyMessages(): Promise<Message[]> {
  const userId = await ensureSignedIn(NOT_SIGNED_IN)
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    // RLS already limits rows to the user's own; the filter keeps it explicit.
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: true })
  if (error) throw new ApiError(error.message)
  return data
}

export async function sendMessage(receiverId: string, content: string) {
  const senderId = await ensureSignedIn(NOT_SIGNED_IN)
  const text = content.trim().slice(0, MESSAGE_MAX_LENGTH)
  if (!text) throw new ApiError("Write a message first.")
  if (receiverId === senderId) throw new ApiError("You can't message yourself.")
  const { data, error } = await supabase
    .from("messages")
    .insert({ sender_id: senderId, receiver_id: receiverId, content: text })
    .select()
    .single()
  if (error) throw new ApiError(error.message)
  return data
}

/** Marks everything `senderId` sent to the signed-in user as read. */
export async function markConversationRead(senderId: string) {
  const userId = await ensureSignedIn(NOT_SIGNED_IN)
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("sender_id", senderId)
    .eq("receiver_id", userId)
    .eq("read", false)
  if (error) throw new ApiError(error.message)
}

export async function countUnread(userId: string) {
  const { count, error } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("receiver_id", userId)
    .eq("read", false)
  if (error) throw new ApiError(error.message)
  return count ?? 0
}

let channelCount = 0

/**
 * Calls `onChange` for new or updated messages that involve `userId`.
 * Returns an unsubscribe function.
 */
export function subscribeToMessages(
  userId: string,
  onChange: (message: Message, event: "INSERT" | "UPDATE") => void
) {
  // Channel names must be unique per subscription on the shared client.
  const channel = supabase.channel(`messages:${userId}:${++channelCount}`)
  for (const column of ["receiver_id", "sender_id"] as const) {
    for (const event of ["INSERT", "UPDATE"] as const) {
      channel.on(
        "postgres_changes",
        {
          event,
          schema: "public",
          table: "messages",
          filter: `${column}=eq.${userId}`,
        },
        (payload) => onChange(payload.new as Message, event)
      )
    }
  }
  channel.subscribe()
  return () => {
    void supabase.removeChannel(channel)
  }
}
