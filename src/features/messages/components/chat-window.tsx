import * as React from "react"
import { ArrowLeft, ChevronRight, Send, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/format"
import { MESSAGE_MAX_LENGTH } from "@/lib/messages-api"
import type { Conversation } from "@/features/messages/types"
import {
  formatDayDivider,
  formatMessageTime,
  isSameDay,
} from "@/features/messages/lib/format-time"

const QUICK_SUGGESTIONS = [
  "Can we schedule a visit?",
  "Is the room still available?",
  "Tell me about your schedule",
]

type ChatWindowProps = {
  conversation: Conversation
  /** Pre-filled text, e.g. an inquiry about a room from Browse. */
  initialDraft?: string
  onSendMessage: (text: string) => void
  onToggleProfile: () => void
  showProfile: boolean
  onBackToInbox: () => void
  onCloseChat: () => void
}

export function ChatWindow({
  conversation,
  initialDraft = "",
  onSendMessage,
  onToggleProfile,
  showProfile,
  onBackToInbox,
  onCloseChat,
}: ChatWindowProps) {
  const [inputText, setInputText] = React.useState(initialDraft)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const name = conversation.partner?.name ?? "RoomieMatch member"

  // Scroll inner chat container to bottom when messages update, WITHOUT scrolling the main window page
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [conversation.partnerId, conversation.messages.length])

  function handleSend(textOverride?: string) {
    const text = (textOverride ?? inputText).trim()
    if (!text) return
    onSendMessage(text)
    if (textOverride === undefined) setInputText("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-card">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-border/40 p-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBackToInbox}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted sm:hidden"
            aria-label="Back to inbox"
          >
            <ArrowLeft className="size-4" />
          </button>

          <Avatar className="size-10 border border-border/40">
            {conversation.partner?.avatar_url && (
              <AvatarImage src={conversation.partner.avatar_url} alt="" />
            )}
            <AvatarFallback className="bg-[#e8d8c8] text-xs font-bold text-[#522b12]">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="truncate font-heading text-base font-bold text-foreground">
              {name}
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              {[
                conversation.partner?.university,
                conversation.match && `${conversation.match.score}% match`,
              ]
                .filter(Boolean)
                .join(" · ") || "Student"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggleProfile}
            aria-expanded={showProfile}
            className="flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:underline"
          >
            {showProfile ? "Hide profile" : "View profile"}
            <ChevronRight
              className={`size-3.5 transition-transform ${
                showProfile ? "rotate-90" : ""
              }`}
            />
          </button>

          <div className="h-4 w-px bg-border/60" />

          <button
            type="button"
            onClick={onCloseChat}
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close chat"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Inner Container */}
      <div
        ref={scrollContainerRef}
        aria-live="polite"
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        {conversation.messages.length === 0 && (
          <p className="py-10 text-center text-xs text-muted-foreground">
            No messages yet. Say hello to {name.split(" ")[0]}!
          </p>
        )}

        {conversation.messages.map((msg, index) => {
          const previous = conversation.messages[index - 1]
          const showDivider = !previous || !isSameDay(previous.createdAt, msg.createdAt)
          const isUser = msg.fromMe
          const status =
            msg.status === "sending"
              ? "Sending…"
              : msg.status === "failed"
                ? "Not sent"
                : isUser
                  ? msg.read
                    ? "Read"
                    : "Sent"
                  : null
          return (
            <React.Fragment key={msg.id}>
              {showDivider && (
                <div className="my-2 flex items-center justify-center">
                  <span className="rounded-full bg-muted/80 px-3 py-1 text-[0.6875rem] font-semibold text-muted-foreground">
                    {formatDayDivider(msg.createdAt)}
                  </span>
                </div>
              )}
              <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <Avatar className="size-7 shrink-0 border border-border/40 mt-1">
                    <AvatarFallback className="bg-[#e8d8c8] text-[0.625rem] font-bold text-[#522b12]">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`flex max-w-[80%] sm:max-w-[70%] flex-col ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-tr-xs shadow-xs"
                        : "bg-[#faf8f5] dark:bg-muted border border-border/60 text-foreground rounded-tl-xs shadow-xs"
                    } ${msg.status ? "opacity-70" : ""}`}
                  >
                    {msg.text}
                  </div>
                  <span
                    className={`mt-1 text-[0.6875rem] ${
                      msg.status === "failed" ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {formatMessageTime(msg.createdAt)}
                    {status && ` · ${status}`}
                  </span>
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>

      {/* Quick Suggestions */}
      <div className="border-t border-border/30 bg-card/60 px-4 pt-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.6875rem] font-semibold text-muted-foreground">
            Suggestions:
          </span>
          {QUICK_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => handleSend(sug)}
              className="rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-medium text-foreground transition-all hover:border-primary/50 hover:bg-primary/5"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Bar */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1.5 pl-4 shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <input
            type="text"
            aria-label={`Message ${name}`}
            placeholder={`Message ${name}...`}
            value={inputText}
            maxLength={MESSAGE_MAX_LENGTH}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder:text-muted-foreground"
          />

          <Button
            type="button"
            size="icon"
            aria-label="Send message"
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="size-8 rounded-full shadow-xs disabled:opacity-40 shrink-0"
          >
            <Send className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
