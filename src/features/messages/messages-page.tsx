import * as React from "react"
import { Check, Clock3, X } from "lucide-react"
import { toast } from "sonner"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { isSupabaseConfigured, supabase, type ListingInterest, type Message as DatabaseMessage } from "@/lib/supabase"

import { ChatEmptyState } from "@/features/messages/components/chat-empty-state"
import { ChatWindow } from "@/features/messages/components/chat-window"
import { InboxSidebar } from "@/features/messages/components/inbox-sidebar"
import { ProfileDrawer } from "@/features/messages/components/profile-drawer"
import { INITIAL_CONVERSATIONS } from "@/features/messages/data/mock-conversations"
import type { Conversation, Message } from "@/features/messages/types"

const MESSAGES_STORAGE_KEY = "roomiematch_conversations"

function getStoredConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // Fall back to initial mock data if parsing fails.
  }
  return INITIAL_CONVERSATIONS
}

function messageTime(value: string) {
  return new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
}

function toConversation(interest: ListingInterest, userId: string, messages: DatabaseMessage[]): Conversation {
  const isOwner = interest.owner_id === userId
  const otherUserId = isOwner ? interest.interested_user_id : interest.owner_id
  const name = isOwner ? interest.interested_name : interest.owner_name
  const thread = messages.filter((message) => message.interest_id === interest.id)
  const mappedMessages: Message[] = thread.map((message) => ({
    id: String(message.id),
    sender: message.sender_id === userId ? "user" : "other",
    text: message.content,
    time: messageTime(message.created_at),
    status: message.sender_id === userId ? (message.read ? "Read" : "Sent") : undefined,
  }))
  const lastMessage = thread[thread.length - 1]
  const isRoomRequest = interest.status === "pending"
  return {
    id: interest.id,
    interestId: interest.id,
    otherUserId,
    isRealMatch: interest.status === "accepted",
    isRoomRequest,
    requestDirection: isRoomRequest ? (isOwner ? "incoming" : "outgoing") : undefined,
    name,
    initials: name.split(" ").map((part) => part[0]).filter(Boolean).slice(0, 2).join("").toUpperCase(),
    avatarBg: "bg-[#f2dfcf] text-[#7a3418]",
    verified: false,
    statusText: isRoomRequest ? (isOwner ? "Interested in your listing" : "Waiting for the owner to respond") : "Connected · You can message each other",
    matchScore: 0,
    location: interest.listing_location,
    interestedIn: `${interest.listing_name} · ${interest.listing_location} · $${interest.price_min}–${interest.price_max}/mo`,
    moveInDate: interest.available_date,
    budget: `$${interest.price_min}–${interest.price_max} / mo`,
    occupation: "RoomieMatch member",
    age: 0,
    fullLocation: interest.listing_location,
    keyHabits: [],
    unread: thread.some((message) => message.receiver_id === userId && !message.read),
    lastMessageTime: lastMessage ? messageTime(lastMessage.created_at) : "New",
    lastMessageText: lastMessage?.content || (isRoomRequest ? (isOwner ? `${interest.interested_name} is interested in ${interest.listing_name}.` : "Your request is waiting for a response.") : "You’re connected. Say hello!"),
    messages: mappedMessages,
  }
}

function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = React.useState<Conversation[]>([])
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [filterTab, setFilterTab] = React.useState<"all" | "unread" | "requests">("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showProfile, setShowProfile] = React.useState(false)

  const loadRemoteConversations = React.useCallback(async () => {
    if (!user || !isSupabaseConfigured) return
    const { data: interestRows, error } = await supabase
      .from("listing_interests")
      .select("*")
      .or(`owner_id.eq.${user.id},interested_user_id.eq.${user.id}`)
      .in("status", ["pending", "accepted"])
      .order("created_at", { ascending: false })
    if (error) {
      console.error("Could not load connections:", error.message)
      return
    }
    const interests = (interestRows || []) as ListingInterest[]
    const acceptedIds = interests.filter((interest) => interest.status === "accepted").map((interest) => interest.id)
    let messages: DatabaseMessage[] = []
    if (acceptedIds.length) {
      const result = await supabase.from("messages").select("*").in("interest_id", acceptedIds).order("created_at", { ascending: true })
      if (result.error) console.error("Could not load chat messages:", result.error.message)
      else messages = (result.data || []) as DatabaseMessage[]
    }
    setConversations(interests.map((interest) => toConversation(interest, user.id, messages)))
  }, [user])

  React.useEffect(() => {
    if (!isSupabaseConfigured) {
      setConversations(getStoredConversations())
      return
    }
    if (!user) {
      setConversations([])
      return
    }
    void loadRemoteConversations()
    const timer = window.setInterval(() => void loadRemoteConversations(), 10000)
    return () => window.clearInterval(timer)
  }, [user, loadRemoteConversations])

  React.useEffect(() => {
    if (!isSupabaseConfigured) {
      try { localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(conversations)) } catch { /* Ignore storage failures. */ }
    }
  }, [conversations])

  const selectedConv = conversations.find((conversation) => conversation.id === selectedId)

  async function handleSelectConversation(id: string) {
    setSelectedId(id)
    const conversation = conversations.find((item) => item.id === id)
    if (conversation?.isRealMatch && user) {
      await supabase.from("messages").update({ read: true }).eq("interest_id", id).eq("receiver_id", user.id).eq("read", false)
      setConversations((previous) => previous.map((item) => item.id === id ? { ...item, unread: false, messages: item.messages.map((message) => message.sender === "user" ? message : { ...message, status: message.status }) } : item))
      void loadRemoteConversations()
    } else {
      setConversations((previous) => previous.map((item) => item.id === id ? { ...item, unread: false } : item))
    }
  }

  async function handleSendMessage(text: string) {
    if (!selectedId) return
    const selected = conversations.find((conversation) => conversation.id === selectedId)
    if (selected?.isRealMatch && selected.interestId && selected.otherUserId && user) {
      const { error } = await supabase.from("messages").insert({
        interest_id: selected.interestId,
        sender_id: user.id,
        receiver_id: selected.otherUserId,
        content: text.trim(),
      })
      if (error) {
        toast.error("Could not send message", { description: error.message })
        return
      }
      void loadRemoteConversations()
      return
    }
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "Delivered",
    }
    setConversations((previous) => previous.map((conversation) => conversation.id === selectedId ? {
      ...conversation,
      lastMessageText: text.trim(),
      lastMessageTime: "Just now",
      messages: [...conversation.messages, newMessage],
    } : conversation))
  }

  async function decideRequest(conversation: Conversation, status: "accepted" | "declined") {
    if (!user || !conversation.interestId) return
    const { error } = await supabase.from("listing_interests").update({ status }).eq("id", conversation.interestId).eq("owner_id", user.id)
    if (error) {
      toast.error("Could not update request", { description: error.message })
      return
    }
    toast.success(status === "accepted" ? "You’re connected" : "Request declined")
    if (status === "declined") setSelectedId(null)
    await loadRemoteConversations()
  }

  function handleAttachFile() {
    toast.info("File attachments aren’t available yet.")
  }

  function handleSendInvite(name: string) {
    if (selectedConv?.isRealMatch) {
      void handleSendMessage(`Would you like to arrange a time to see the place?`)
      return
    }
    toast.success(`Room invite sent to ${name}.`)
  }

  function handleViewFullProfile(name: string) {
    toast.info(`Public profile for ${name} is coming soon.`)
  }

  return (
    <Container className="py-6 sm:py-8">
      <div className="relative flex min-h-[calc(100svh-9rem)] w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
        <InboxSidebar
          conversations={conversations}
          selectedId={selectedId}
          onSelectConversation={(id) => void handleSelectConversation(id)}
          filterTab={filterTab}
          onFilterChange={setFilterTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        {selectedConv?.isRoomRequest ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-accent text-primary"><Clock3 className="size-6" /></div>
            <h2 className="mt-4 font-heading text-xl">{selectedConv.requestDirection === "incoming" ? "Roommate interest" : "Request sent"}</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              {selectedConv.requestDirection === "incoming"
                ? `${selectedConv.name} is interested in ${selectedConv.interestedIn}. Accept to confirm mutual interest and open a private chat.`
                : `Your interest in ${selectedConv.interestedIn} is waiting for the listing owner. A chat opens if they accept.`}
            </p>
            {selectedConv.requestDirection === "incoming" && <div className="mt-6 flex gap-3"><Button variant="outline" onClick={() => void decideRequest(selectedConv, "declined")}><X /> Decline</Button><Button onClick={() => void decideRequest(selectedConv, "accepted")}><Check /> Accept and connect</Button></div>}
            {selectedConv.requestDirection === "outgoing" && <Button className="mt-6" variant="outline" onClick={() => setSelectedId(null)}>Back to inbox</Button>}
          </div>
        ) : selectedConv ? (
          <ChatWindow
            conversation={selectedConv}
            onSendMessage={(text) => void handleSendMessage(text)}
            onAttachFile={handleAttachFile}
            onToggleProfile={() => setShowProfile((previous) => !previous)}
            showProfile={showProfile}
            onBackToInbox={() => setSelectedId(null)}
            onCloseChat={() => setSelectedId(null)}
          />
        ) : (
          <ChatEmptyState />
        )}
        {selectedConv && !selectedConv.isRoomRequest && showProfile && (
          <ProfileDrawer
            conversation={selectedConv}
            onClose={() => setShowProfile(false)}
            onSendInvite={handleSendInvite}
            onViewFullProfile={handleViewFullProfile}
          />
        )}
      </div>
    </Container>
  )
}

export { MessagesPage }
