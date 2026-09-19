import * as React from "react"
import { Check, Copy, QrCode, Share2, Users, X } from "lucide-react"
import { toast } from "sonner"

type InviteModalProps = {
  isOpen: boolean
  onClose: () => void
  roomName?: string
}

export function InviteModal({
  isOpen,
  onClose,
  roomName = "Sunflower Sanctuary",
}: InviteModalProps) {
  const [copied, setCopied] = React.useState(false)
  const inviteCode = "SUN-7049"
  const inviteUrl = `https://roomiematch.kh/join/sunflower-sanctuary?code=${inviteCode}`

  if (!isOpen) return null

  function handleCopy() {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    toast.success("Invite link copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#e8dfd8] bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#f0ebe5] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#faece6] text-[#7a3418]">
              <Users className="size-4" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
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

        <div className="mt-4 space-y-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Share this private link with your potential roommate. They can take the lifestyle compatibility test and apply to join your household sanctuary.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Unique Household Code
            </label>
            <div className="flex items-center justify-between rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3.5 py-2.5">
              <span className="font-mono text-base font-bold tracking-widest text-[#7a3418]">
                {inviteCode}
              </span>
              <span className="rounded-full bg-[#eaf3eb] px-2 py-0.5 text-[11px] font-semibold text-[#2d7338]">
                Active
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Direct Invite Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="w-full truncate rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3 py-2 text-xs text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#7a3418] px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-[#682c14]"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-[#e0d6cc] bg-[#fdfbf7] p-3 text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-[#faece6] text-[#7a3418]">
              <QrCode className="size-5" />
            </div>
            <p className="mt-1 text-xs font-semibold text-foreground">
              Scan to join with mobile
            </p>
            <p className="text-[11px] text-muted-foreground">
              Compatible with Telegram, WhatsApp, and RoomieMatch app
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#f0ebe5] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#d6cbbe] px-4 py-1.5 text-xs font-medium text-[#4a3b34] hover:bg-[#f6efe8]"
          >
            Done
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#7a3418] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#682c14]"
          >
            <Share2 className="size-3.5" />
            Share Link
          </button>
        </div>
      </div>
    </div>
  )
}
