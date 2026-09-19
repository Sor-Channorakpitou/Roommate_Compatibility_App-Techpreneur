import * as React from "react"
import { toast } from "sonner"
import { Container } from "@/components/layout/container"

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
    // Fall back to initial mock data if parse fails
  }
  return INITIAL_CONVERSATIONS
}

function MessagesPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>(getStoredConversations)
  const [selectedId, setSelectedId] = React.useState<string | null>(null) // null = initial inbox-only state
  const [filterTab, setFilterTab] = React.useState<"all" | "unread" | "requests">("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showProfile, setShowProfile] = React.useState(false)

  // Persist conversations to localStorage whenever state changes
  React.useEffect(() => {
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(conversations))
    } catch {
      // Storage error fallback
    }
  }, [conversations])

  const selectedConv = conversations.find((c) => c.id === selectedId)

  // Mark conversation as read on selection
  function handleSelectConversation(id: string) {
    setSelectedId(id)
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
    )
  }

  // Send a message and update state & LocalStorage
  function handleSendMessage(text: string) {
    if (!selectedId) return

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "Delivered",
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            lastMessageText: text.trim(),
            lastMessageTime: "Just now",
            messages: [...c.messages, newMsg],
          }
        }
        return c
      })
    )
  }

  function handleAttachFile() {
    toast.success("Attachment ready", {
      description: "Sample file attached to message.",
    })
  }

  function handleSendInvite(name: string) {
    toast.success("Room invite sent!", {
      description: `Official room invitation delivered to ${name}.`,
    })
  }

  function handleViewFullProfile(name: string) {
    toast.info(`Viewing full profile for ${name}`, {
      description: "Redirecting to detailed profile page...",
    })
  }

  return (
    <Container className="py-6 sm:py-8">
      {/* Outer rounded card container matching design */}
      <div className="relative flex min-h-[calc(100svh-9rem)] w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
        {/* Left Column: Inbox Sidebar */}
        <InboxSidebar
          conversations={conversations}
          selectedId={selectedId}
          onSelectConversation={handleSelectConversation}
          filterTab={filterTab}
          onFilterChange={setFilterTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Middle Column: Chat Window or Empty State */}
        {selectedConv ? (
          <ChatWindow
            conversation={selectedConv}
            onSendMessage={handleSendMessage}
            onAttachFile={handleAttachFile}
            onToggleProfile={() => setShowProfile((prev) => !prev)}
            showProfile={showProfile}
            onBackToInbox={() => setSelectedId(null)}
            onCloseChat={() => setSelectedId(null)}
          />
        ) : (
          <ChatEmptyState />
        )}

        {/* Right Column: Profile Detail Drawer */}
        {selectedConv && showProfile && (
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
