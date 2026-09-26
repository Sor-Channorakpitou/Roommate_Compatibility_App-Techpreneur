import * as React from "react"
import { ArrowLeft, ArrowRight, Bookmark, Check, Copy, Mail, Plus, Trash2, UserPlus, Users } from "lucide-react"
import { toast } from "sonner"
import type { CreateRoomFormData } from "../types"

type Step2RoommatesProps = {
  formData: CreateRoomFormData
  onChange: (updates: Partial<CreateRoomFormData>) => void
  onNext: () => void
  onBack: () => void
  onSaveDraft: () => void
}

export function Step2Roommates({
  formData,
  onChange,
  onNext,
  onBack,
  onSaveDraft,
}: Step2RoommatesProps) {
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviteName, setInviteName] = React.useState("")
  const [copied, setCopied] = React.useState(false)

  function handleAddInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    const newInvite = {
      id: `invite-${Date.now()}`,
      name: inviteName.trim() || inviteEmail.split("@")[0],
      email: inviteEmail.trim(),
      role: `Roommate ${formData.invitedRoommates.length + 1}`,
      status: "invited" as const,
    }

    onChange({
      invitedRoommates: [...formData.invitedRoommates, newInvite],
      householdMembers: Math.max(formData.householdMembers, formData.invitedRoommates.length + 2),
    })

    setInviteEmail("")
    setInviteName("")
    toast.success(`Invitation queued for ${newInvite.email}`)
  }

  function handleRemoveInvite(id: string) {
    onChange({
      invitedRoommates: formData.invitedRoommates.filter((item) => item.id !== id),
    })
    toast.info("Invite removed")
  }

  function handleCopyInviteLink() {
    const link = `${window.location.origin}/invite/room-${Math.random().toString(36).substring(7)}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    toast.success("Invite link copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section aria-label="Step 2: Roommates" className="rounded-3xl border border-[#e8dfd8] bg-white p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f0e8e0] pb-6">
        <div className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#7a3418] text-sm font-bold text-white shadow-2xs">
            2
          </span>
          <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground sm:text-[1.65rem]">
            Step 2: Roommates & Invites
          </h2>
        </div>
        <span className="rounded-full bg-[#d7ecd8] px-3 py-1 text-xs font-semibold text-[#276e33]">
          Active Step
        </span>
      </div>

      <div className="mt-6 space-y-6">
        {/* Quick invite link box */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[#ebdccf] bg-[#fbf8f4] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-[#221c19] flex items-center gap-1.5">
              <UserPlus className="size-4 text-[#7a3418]" />
              Shareable Direct Room Invite Link
            </span>
            <p className="text-xs text-muted-foreground">
              Send this private link to potential co-living candidates or friends to join.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyInviteLink}
            className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-full border border-[#d6cbbe] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#55433c] shadow-2xs hover:bg-[#f6eee7] transition-colors"
          >
            {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5 text-[#7a3418]" />}
            <span>{copied ? "Copied Link" : "Copy Link"}</span>
          </button>
        </div>

        {/* Add invite form */}
        <form onSubmit={handleAddInvite} className="space-y-3">
          <label className="text-sm font-semibold text-[#221c19]">
            Invite by Email or Username
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Full name (optional)"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full rounded-xl border border-[#ebe3da] bg-[#fbf8f4] py-2.5 px-4 text-sm text-[#1c1c18] placeholder:text-muted-foreground/60 focus:border-[#7a3418] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7a3418]"
              />
            </div>
            <div className="relative flex items-center sm:col-span-2">
              <input
                type="email"
                required
                placeholder="student@university.edu.kh"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full rounded-xl border border-[#ebe3da] bg-[#fbf8f4] py-2.5 pr-9 pl-4 text-sm text-[#1c1c18] placeholder:text-muted-foreground/60 focus:border-[#7a3418] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7a3418]"
              />
              <Mail className="pointer-events-none absolute right-3 size-4 text-muted-foreground/70" />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#7a3418] py-2.5 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-[#682c14] transition-colors"
            >
              <Plus className="size-3.5" />
              Add Invite
            </button>
          </div>
        </form>

        {/* Room Slot Roster */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Household Slots ({formData.householdMembers} Total)</span>
            <span>Status</span>
          </div>

          <div className="space-y-2.5">
            {/* Slot 1: You */}
            <div className="flex items-center justify-between rounded-xl border border-[#ebdccf] bg-[#fdfaf7] p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#f8dfd4] text-xs font-bold text-[#8c3b19]">
                  MH
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    You (Host)
                    <span className="rounded bg-[#f5e6dd] px-1.5 py-0.2 text-[10px] font-bold text-[#7a3418]">
                      Primary
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">Master Bedroom · Rent $ {Math.round(formData.monthlyRent / formData.householdMembers)}/mo</div>
                </div>
              </div>
              <span className="rounded-full bg-[#d7ecd8] px-2.5 py-0.5 text-xs font-semibold text-[#276e33]">
                Confirmed
              </span>
            </div>

            {/* Custom Invites */}
            {formData.invitedRoommates.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between rounded-xl border border-[#ebe3da] bg-white p-3.5 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#d9edd9] text-xs font-bold text-[#2b7235]">
                    {invite.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{invite.name}</div>
                    <div className="text-xs text-muted-foreground">{invite.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#faedd9] px-2.5 py-0.5 text-xs font-semibold text-[#8b591b]">
                    Invitation Pending
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInvite(invite.id)}
                    aria-label={`Remove ${invite.name}`}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Open / Unassigned Slots */}
            {Array.from({
              length: Math.max(0, formData.householdMembers - 1 - formData.invitedRoommates.length),
            }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-dashed border-[#dcd2c8] bg-[#fbf9f6] p-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full border border-dashed border-[#cbbdb0] text-xs text-muted-foreground">
                    <Users className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Open Roommate Slot {formData.invitedRoommates.length + idx + 2}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Will be listed on RoomieMatch public discover board
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-[#eee7de] px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  Open for Match
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-[#f0e8e0] pt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#55433c] hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back: Room details
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSaveDraft}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bookmark className="size-4" />
            Save draft
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-full bg-[#7a3418] px-6 py-3 text-xs font-semibold text-white shadow-xs transition-transform hover:bg-[#682c14] active:scale-[0.98]"
          >
            <span>Next: House rules</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
