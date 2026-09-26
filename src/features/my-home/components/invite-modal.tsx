import * as React from "react"
import { Check, Copy, UserPlus, Users, X } from "lucide-react"
import { toast } from "sonner"

import { isValidInviteContact } from "@/features/create-room/lib/room-calculations"
import type { Invitee } from "@/features/create-room/types"

type InviteModalProps = {
  isOpen: boolean
  onClose: () => void
  roomName: string
  joinCode: string
  /** Spots left once the host and pending invites are counted. */
  openSpots: number
  /** Resolves true once saved. */
  onInvite: (invitee: Invitee) => Promise<boolean>
}

const inputClass =
  "w-full rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3 py-2 text-xs text-foreground focus:border-[#7a3418] focus:outline-none"

export function InviteModal({
  isOpen,
  onClose,
  roomName,
  joinCode,
  openSpots,
  onInvite,
}: InviteModalProps) {
  const [copied, setCopied] = React.useState(false)
  const [name, setName] = React.useState("")
  const [contact, setContact] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen) return null

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(joinCode)
      setCopied(true)
      toast.success("Join code copied")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Couldn't copy. Select the code and copy it manually.")
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    const value = contact.trim()
    if (!isValidInviteContact(value)) {
      toast.error("Enter an email or a Telegram @handle (5+ characters).")
      return
    }
    setIsSubmitting(true)
    const saved = await onInvite({
      id: `invitee-${crypto.randomUUID()}`,
      name: name.trim() || value,
      contact: value,
    })
    setIsSubmitting(false)
    if (!saved) return
    setName("")
    setContact("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-[#e8dfd8] bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between border-b border-[#f0ebe5] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#faece6] text-[#7a3418]">
              <Users className="size-4" />
            </div>
            <div>
              <h3 id="invite-title" className="font-heading text-lg font-semibold text-foreground">
                Invite Roommate
              </h3>
              <p className="text-xs text-muted-foreground">{roomName}</p>
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

        <div className="mt-4 space-y-5">
          {joinCode && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-foreground">Household join code</p>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3.5 py-2.5">
                <span className="font-mono text-base font-bold tracking-widest text-[#7a3418]">
                  {joinCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#7a3418] px-3 py-1 text-xs font-medium text-white hover:bg-[#682c14]"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Share it with roommates you've already met here in Messages.
              </p>
            </div>
          )}

          <form onSubmit={handleInvite} className="space-y-3 border-t border-[#f0ebe5] pt-4">
            <p className="text-xs font-semibold text-foreground">
              Add someone to the household list
            </p>
            {openSpots > 0 ? (
              <>
                <input
                  type="text"
                  aria-label="Name (optional)"
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    aria-label="Email or Telegram handle"
                    placeholder="email@example.com or @telegram"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className={inputClass}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#7a3418] px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-[#682c14] disabled:opacity-50"
                  >
                    <UserPlus className="size-3.5" />
                    Add
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {openSpots} {openSpots === 1 ? "spot" : "spots"} left in this household.
                </p>
              </>
            ) : (
              <p className="rounded-xl bg-[#f9f5f0] p-3 text-xs text-muted-foreground">
                Every spot is taken. Remove an invite first to add someone new.
              </p>
            )}
          </form>
        </div>

        <div className="mt-6 flex items-center justify-end border-t border-[#f0ebe5] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#d6cbbe] px-4 py-1.5 text-xs font-medium text-[#4a3b34] hover:bg-[#f6efe8]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
