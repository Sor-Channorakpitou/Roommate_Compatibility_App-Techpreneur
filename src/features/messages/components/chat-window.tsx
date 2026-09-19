import * as React from "react"
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Paperclip,
  Send,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { QUICK_SUGGESTIONS } from "@/features/messages/data/mock-conversations"
import type { Conversation } from "@/features/messages/types"


type ChatWindowProps = {
  conversation: Conversation
  onSendMessage: (text: string) => void
  onAttachFile: () => void
  onToggleProfile: () => void
  showProfile: boolean
  onBackToInbox: () => void
  onCloseChat: () => void
}

export function ChatWindow({
  conversation,
  onSendMessage,
  onAttachFile,
  onToggleProfile,
  showProfile,
  onBackToInbox,
  onCloseChat,
}: ChatWindowProps) {
  const [inputText, setInputText] = React.useState("")
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Scroll inner chat container to bottom when messages update, WITHOUT scrolling the main window page
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [conversation.id, conversation.messages.length])

  function handleSend(textOverride?: string) {
    const text = (textOverride ?? inputText).trim()
    if (!text) return
    onSendMessage(text)
    setInputText("")
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
        <div className="flex items-center gap-3">
          {/* Mobile Back Button */}
          <button
            type="button"
            onClick={onBackToInbox}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted sm:hidden"
            title="Back to inbox"
          >
            <ArrowLeft className="size-4" />
          </button>

          <Avatar className="size-10 border border-border/40">
            <AvatarFallback className={`text-xs font-bold ${conversation.avatarBg}`}>
              {conversation.initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-base font-bold text-foreground">
                {conversation.name}
              </h2>
              {conversation.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[0.6875rem] font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <CheckCircle2 className="size-3 text-emerald-600" />
                  Verified student
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{conversation.statusText}</p>
          </div>
        </div>

        {/* Right Header Actions: View profile + Close Chat */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleProfile}
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
            title="Close chat (Back to Your Messages)"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Interested Sub-header Banner */}
      <div className="flex items-center justify-between border-b border-border/30 bg-[#faf8f5]/80 px-4 py-2 text-xs text-muted-foreground dark:bg-muted/30 sm:px-6">
        <div className="flex items-center gap-1.5 truncate">
          <span className="font-semibold text-foreground">Interested in:</span>
          <span className="truncate">{conversation.interestedIn}</span>
        </div>
        <div className="shrink-0 text-[0.75rem]">
          Move-in: <span className="font-semibold text-foreground">{conversation.moveInDate}</span>
        </div>
      </div>

      {/* Chat Messages Inner Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        {/* Date divider */}
        <div className="my-2 flex items-center justify-center">
          <span className="rounded-full bg-muted/80 px-3 py-1 text-[0.6875rem] font-semibold text-muted-foreground">
            Today, October 14
          </span>
        </div>

        {conversation.messages.map((msg) => {
          const isUser = msg.sender === "user"
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <Avatar className="size-7 shrink-0 border border-border/40 mt-1">
                  <AvatarFallback
                    className={`text-[0.625rem] font-bold ${conversation.avatarBg}`}
                  >
                    {conversation.initials}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`flex max-w-[80%] sm:max-w-[70%] flex-col ${
                  isUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-xs shadow-xs"
                      : "bg-[#faf8f5] dark:bg-muted border border-border/60 text-foreground rounded-tl-xs shadow-xs"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="mt-1 text-[0.6875rem] text-muted-foreground">
                  {msg.time} {msg.status && `· ${msg.status}`}
                </span>
              </div>
            </div>
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
          <button
            type="button"
            onClick={onAttachFile}
            className="text-muted-foreground transition-colors hover:text-foreground"
            title="Attach file"
          >
            <Paperclip className="size-4" />
          </button>

          <input
            type="text"
            placeholder={`Message ${conversation.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder:text-muted-foreground"
          />

          <Button
            type="button"
            size="icon"
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
