import { Search, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/format"
import type { Conversation } from "@/features/messages/types"
import { formatInboxTime } from "@/features/messages/lib/format-time"

export type InboxFilter = "all" | "unread"

type InboxSidebarProps = {
  conversations: Conversation[]
  selectedId: string | null
  onSelectConversation: (id: string) => void
  filterTab: InboxFilter
  onFilterChange: (tab: InboxFilter) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function InboxSidebar({
  conversations,
  selectedId,
  onSelectConversation,
  filterTab,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: InboxSidebarProps) {
  const unreadCount = conversations.filter((c) => c.unreadCount > 0).length
  const query = searchQuery.toLowerCase().trim()

  const filteredConversations = conversations.filter((c) => {
    if (filterTab === "unread" && c.unreadCount === 0) return false
    if (!query) return true
    return [c.partner?.name, c.partner?.university, c.messages.at(-1)?.text].some(
      (text) => text?.toLowerCase().includes(query)
    )
  })

  return (
    <div
      className={`w-full flex-col border-r border-border/40 bg-[#faf8f5]/60 dark:bg-card/40 sm:w-[320px] lg:w-[340px] shrink-0 ${
        selectedId ? "hidden sm:flex" : "flex"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border/40">
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-xl font-bold tracking-tight text-foreground">
            Inbox
          </h1>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {unreadCount > 0
              ? `${unreadCount} unread`
              : `${conversations.length} ${conversations.length === 1 ? "chat" : "chats"}`}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            aria-label="Search conversations"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full rounded-full border border-border/70 bg-card pl-9 pr-4 text-xs placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-4 pb-3 border-b border-border/30">
        {(
          [
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={filterTab === tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              filterTab === tab.id
                ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            {conversations.length === 0
              ? "No conversations yet. Find a roommate on Browse and say hello."
              : "No conversations found."}
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isSelected = selectedId === conv.partnerId
            const name = conv.partner?.name ?? "RoomieMatch member"
            const last = conv.messages.at(-1)
            const isUnread = conv.unreadCount > 0
            return (
              <button
                key={conv.partnerId}
                type="button"
                onClick={() => onSelectConversation(conv.partnerId)}
                className={`group relative flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all ${
                  isSelected
                    ? "bg-[#f2ece4] dark:bg-muted/80 shadow-xs ring-1 ring-primary/20"
                    : "hover:bg-muted/60"
                }`}
              >
                <div className="relative shrink-0">
                  <Avatar className="size-11 border border-border/40">
                    {conv.partner?.avatar_url && (
                      <AvatarImage src={conv.partner.avatar_url} alt="" />
                    )}
                    <AvatarFallback className="bg-[#e8d8c8] text-xs font-bold text-[#522b12]">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  {isUnread && (
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-emerald-500" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h2 className="truncate text-xs font-bold text-foreground">
                      {name}
                    </h2>
                    {last && (
                      <span className="shrink-0 text-[0.6875rem] text-muted-foreground">
                        {formatInboxTime(last.createdAt)}
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-0.5 truncate text-[0.75rem] ${
                      isUnread ? "font-semibold text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {last
                      ? `${last.fromMe ? "You: " : ""}${last.text}`
                      : "New conversation"}
                  </p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {conv.match && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.6875rem] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {conv.match.score}% match
                      </span>
                    )}
                    {conv.partner?.university && (
                      <span className="truncate text-[0.6875rem] text-muted-foreground">
                        {conv.partner.university}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
