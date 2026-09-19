import * as React from "react"
import { Send, X } from "lucide-react"
import { toast } from "sonner"

import type { HouseholdResident } from "../types"

type MessageModalProps = {
  isOpen: boolean
  onClose: () => void
  resident: HouseholdResident | null
}

export function MessageModal({ isOpen, onClose, resident }: MessageModalProps) {
  const [message, setMessage] = React.useState("")
  const [messages, setMessages] = React.useState<
    Array<{ sender: "user" | "other"; text: string; time: string }>
  >([
    {
      sender: "other",
      text: "Hey Sopheak! I finished the deep kitchen clean this afternoon.",
      time: "Tuesday 3:45 PM",
    },
    {
      sender: "user",
      text: "Awesome, thank you Rothana! I'll take care of the balcony watering tomorrow.",
      time: "Tuesday 4:10 PM",
    },
  ])

  if (!isOpen || !resident) return null

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim() || !resident) return

    const newMsg = {
      sender: "user" as const,
      text: message.trim(),
      time: "Just now",
    }
    setMessages((prev) => [...prev, newMsg])
    setMessage("")
    toast.success(`Message sent to ${resident.name}`)

    // Simulate friendly reply after 1.2s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "other" as const,
          text: "Got it, sounds great! Have a peaceful evening 🌿",
          time: "Just now",
        },
      ])
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex h-[480px] w-full max-w-md flex-col rounded-2xl border border-[#e8dfd8] bg-card shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0ebe5] p-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-10 items-center justify-center rounded-full text-xs font-bold ${resident.avatarBg} ${resident.avatarTextColor}`}
            >
              {resident.avatarInitials}
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">
                {resident.name}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {resident.occupation} • Online
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "rounded-br-xs bg-[#7a3418] text-white"
                    : "rounded-bl-xs bg-[#f4eee6] text-[#33261f]"
                }`}
              >
                {msg.text}
              </div>
              <span className="mt-1 px-1 text-[10px] text-muted-foreground">
                {msg.time}
              </span>
            </div>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSend} className="border-t border-[#f0ebe5] p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Message ${resident.name.split(" ")[0]}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-full border border-[#eee6dc] bg-[#f9f5f0] px-4 py-2 text-xs text-foreground focus:border-[#7a3418] focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="flex size-9 items-center justify-center rounded-full bg-[#7a3418] text-white shadow-sm transition-all hover:bg-[#682c14] disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
