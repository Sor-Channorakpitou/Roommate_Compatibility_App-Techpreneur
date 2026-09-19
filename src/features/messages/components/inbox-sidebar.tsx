import { Search, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Conversation } from "@/features/messages/types"


type InboxSidebarProps = {
  conversations: Conversation[]
  selectedId: string | null
  onSelectConversation: (id: string) => void
  filterTab: "all" | "unread" | "requests"
  onFilterChange: (tab: "all" | "unread" | "requests") => void
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
  const activeCount = conversations.filter((c) => c.unread).length

  const filteredConversations = conversations.filter((c) => {
    const matchesTab =
      filterTab === "all"
        ? true
        : filterTab === "unread"
        ? c.unread
        : c.isRoomRequest
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessageText.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
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
            {activeCount > 0 ? `${activeCount} unread` : `${conversations.length} active`}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full rounded-full border border-border/70 bg-card pl-9 pr-4 text-xs placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {searchQuery && (
            <button
              type="button"
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
            { id: "requests", label: "Room Requests" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
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
            No conversations found.
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isSelected = selectedId === conv.id
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelectConversation(conv.id)}
                className={`group relative flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all ${
                  isSelected
                    ? "bg-[#f2ece4] dark:bg-muted/80 shadow-xs ring-1 ring-primary/20"
                    : "hover:bg-muted/60"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <Avatar className="size-11 border border-border/40">
                    <AvatarFallback className={`text-xs font-bold ${conv.avatarBg}`}>
                      {conv.initials}
                    </AvatarFallback>
                  </Avatar>
                  {conv.unread && (
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-emerald-500" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h2 className="truncate text-xs font-bold text-foreground">
                      {conv.name}
                    </h2>
                    <span className="shrink-0 text-[0.6875rem] text-muted-foreground">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  <p
                    className={`mt-0.5 truncate text-[0.75rem] ${
                      conv.unread
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {conv.lastMessageText}
                  </p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {conv.isRoomRequest ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[0.6875rem] font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        Request
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.6875rem] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {conv.matchScore}% match
                      </span>
                    )}
                    <span className="text-[0.6875rem] text-muted-foreground">
                      {conv.location}
                    </span>
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
