import * as React from "react"
import { useSearchParams } from "react-router-dom"
import { RotateCw, TriangleAlert } from "lucide-react"

import { SignInPanel, StatePanel } from "@/components/common/state-panel"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { parseRoomSettings } from "@/lib/room-settings"
import { listMyRooms } from "@/lib/rooms-api"
import { isSupabaseConfigured, type Room } from "@/lib/supabase"
import { ChatEmptyState } from "@/features/messages/components/chat-empty-state"
import { ChatWindow } from "@/features/messages/components/chat-window"
import {
  InboxSidebar,
  type InboxFilter,
} from "@/features/messages/components/inbox-sidebar"
import { ProfileDrawer } from "@/features/messages/components/profile-drawer"
import { useConversations } from "@/features/messages/hooks/use-conversations"

function MessagesPage() {
  const { user, isLoading } = useAuth()

  React.useEffect(() => {
    document.title = "Messages | RoomieMatch"
  }, [])

  function renderGate() {
    if (!isSupabaseConfigured) {
      return (
        <StatePanel
          icon={TriangleAlert}
          title="Supabase isn't connected"
          description="Add your project URL and anon key to .env, then restart the dev server."
        />
      )
    }
    if (isLoading) {
      return <div className="h-[calc(100svh-9rem)] animate-pulse rounded-2xl bg-muted/50" />
    }
    return (
      <SignInPanel
        title="Sign in to see your messages"
        description="Conversations are private to the two students in them."
      />
    )
  }

  return (
    <Container className="py-6 sm:py-8">
      {user && isSupabaseConfigured ? <Inbox myId={user.id} /> : renderGate()}
    </Container>
  )
}

function Inbox({ myId }: { myId: string }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const openWith = searchParams.get("to")
  const about = searchParams.get("about")

  const { state, conversations, send, markRead, reload } = useConversations(
    myId,
    openWith
  )
  const [selectedId, setSelectedId] = React.useState<string | null>(openWith)
  const [filterTab, setFilterTab] = React.useState<InboxFilter>("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showProfile, setShowProfile] = React.useState(false)
  const [inviteRoom, setInviteRoom] = React.useState<Room | null>(null)

  // Offer the host's room (preferring one still accepting roommates) for invites.
  React.useEffect(() => {
    let isCurrent = true
    listMyRooms(myId)
      .then((rooms) => {
        if (!isCurrent) return
        setInviteRoom(rooms.find((r) => r.accepting_roommates) ?? rooms[0] ?? null)
      })
      .catch(() => {
        // Invites are optional; the drawer just hides the button.
      })
    return () => {
      isCurrent = false
    }
  }, [myId])

  const selectedConv = conversations.find((c) => c.partnerId === selectedId)

  // Opening a conversation (or receiving into the open one) marks it read.
  React.useEffect(() => {
    if (selectedConv && selectedConv.unreadCount > 0) {
      markRead(selectedConv.partnerId)
    }
  }, [selectedConv, markRead])

  function handleSelectConversation(id: string) {
    setSelectedId(id)
    // Drop Browse's hand-off params once the user moves on.
    if (searchParams.has("to")) setSearchParams({}, { replace: true })
  }

  function handleSendInvite(room: Room) {
    if (!selectedId) return
    const { joinCode } = parseRoomSettings(room)
    send(
      selectedId,
      `I'd like to invite you to join my room "${room.name}" in ${room.district}.` +
        (joinCode ? ` Join code: ${joinCode}.` : "")
    )
  }

  if (state.status === "error") {
    return (
      <StatePanel
        icon={TriangleAlert}
        tone="error"
        title="We couldn't load your messages"
        description={state.message}
        action={
          <Button type="button" variant="outline" size="pill-lg" onClick={reload}>
            <RotateCw />
            Try again
          </Button>
        }
      />
    )
  }

  const initialDraft =
    about && selectedId === openWith
      ? `Hi! Is there still a spot open in "${about}"?`
      : ""

  return (
    <div className="relative flex min-h-[calc(100svh-9rem)] w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
      {state.status === "loading" ? (
        <div role="status" aria-label="Loading conversations" className="flex-1 animate-pulse bg-muted/30" />
      ) : (
        <>
          <InboxSidebar
            conversations={conversations}
            selectedId={selectedId}
            onSelectConversation={handleSelectConversation}
            filterTab={filterTab}
            onFilterChange={setFilterTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {selectedConv ? (
            <ChatWindow
              // Re-mount per conversation so each keeps its own draft.
              key={selectedConv.partnerId}
              conversation={selectedConv}
              initialDraft={initialDraft}
              onSendMessage={(text) => send(selectedConv.partnerId, text)}
              onToggleProfile={() => setShowProfile((prev) => !prev)}
              showProfile={showProfile}
              onBackToInbox={() => setSelectedId(null)}
              onCloseChat={() => setSelectedId(null)}
            />
          ) : (
            <ChatEmptyState />
          )}

          {selectedConv && showProfile && (
            <ProfileDrawer
              conversation={selectedConv}
              inviteRoom={inviteRoom}
              onClose={() => setShowProfile(false)}
              onSendInvite={handleSendInvite}
            />
          )}
        </>
      )}
    </div>
  )
}

export { MessagesPage }
