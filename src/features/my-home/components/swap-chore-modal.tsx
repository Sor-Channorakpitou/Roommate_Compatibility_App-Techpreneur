import * as React from "react"
import { ArrowLeftRight, X } from "lucide-react"
import { toast } from "sonner"

import type { RoomChore } from "@/lib/room-settings"
import type { ChoreAssignee } from "../types"

type SwapChoreModalProps = {
  isOpen: boolean
  onClose: () => void
  chores: RoomChore[]
  assignees: ChoreAssignee[]
  onSwapChores: (choreId1: string, choreId2: string) => void
}

export function SwapChoreModal({
  isOpen,
  onClose,
  chores,
  assignees,
  onSwapChores,
}: SwapChoreModalProps) {
  const [selectedFirst, setSelectedFirst] = React.useState<string>("")
  const [selectedSecond, setSelectedSecond] = React.useState<string>("")

  const first = chores.find((c) => c.id === selectedFirst) ?? chores[0]
  // Only chores held by someone else are worth swapping with.
  const candidates = chores.filter((c) => c.assignee !== first?.assignee)
  const second =
    candidates.find((c) => c.id === selectedSecond) ?? candidates[0]

  if (!isOpen) return null

  const labelOf = (chore: RoomChore) =>
    `${chore.title} (${assignees.find((a) => a.id === chore.assignee)?.label ?? "Everyone"})`

  function handleConfirmSwap() {
    if (!first || !second) {
      toast.error("Pick two chores held by different people")
      return
    }
    onSwapChores(first.id, second.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#e8dfd8] bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#f0ebe5] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#faece6] text-[#7a3418]">
              <ArrowLeftRight className="size-4" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Swap Household Chore
              </h3>
              <p className="text-xs text-muted-foreground">Trade duties for the week</p>
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
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Chore
            </label>
            <select
              aria-label="First chore"
              value={first?.id ?? ""}
              onChange={(e) => {
                setSelectedFirst(e.target.value)
                setSelectedSecond("")
              }}
              className="w-full rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3.5 py-2 text-xs text-foreground focus:border-[#7a3418] focus:outline-none"
            >
              {chores.map((c) => (
                <option key={c.id} value={c.id}>
                  {labelOf(c)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#f0ebe5] text-[#7a3418]">
              <ArrowLeftRight className="size-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Swap assignees with
            </label>
            <select
              aria-label="Second chore"
              value={second?.id ?? ""}
              disabled={candidates.length === 0}
              onChange={(e) => setSelectedSecond(e.target.value)}
              className="w-full rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3.5 py-2 text-xs text-foreground focus:border-[#7a3418] focus:outline-none"
            >
              {candidates.length === 0 && (
                <option value="">No chores held by someone else</option>
              )}
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {labelOf(c)}
                </option>
              ))}
            </select>
          </div>

          <p className="text-center text-[11px] text-muted-foreground">
            The two chores trade assignees. Everything else stays the same.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#f0ebe5] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#d6cbbe] px-4 py-1.5 text-xs font-medium text-[#4a3b34] hover:bg-[#f6efe8]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmSwap}
            className="rounded-full bg-[#7a3418] px-5 py-1.5 text-xs font-medium text-white hover:bg-[#682c14]"
          >
            Confirm Swap
          </button>
        </div>
      </div>
    </div>
  )
}
