import * as React from "react"
import { ArrowLeftRight, X } from "lucide-react"
import { toast } from "sonner"

import type { ChoreItem } from "../types"

type SwapChoreModalProps = {
  isOpen: boolean
  onClose: () => void
  chores: ChoreItem[]
  onSwapChores: (choreId1: string, choreId2: string) => void
}

export function SwapChoreModal({
  isOpen,
  onClose,
  chores,
  onSwapChores,
}: SwapChoreModalProps) {
  const sopheakChores = chores.filter((c) => c.assignee.id === "sopheak")
  const rothanaChores = chores.filter((c) => c.assignee.id === "rothana")

  const [selectedMyChore, setSelectedMyChore] = React.useState<string>(
    sopheakChores[0]?.id || ""
  )
  const [selectedTheirChore, setSelectedTheirChore] = React.useState<string>(
    rothanaChores[0]?.id || ""
  )

  React.useEffect(() => {
    if (sopheakChores[0] && !selectedMyChore) {
      setSelectedMyChore(sopheakChores[0].id)
    }
    if (rothanaChores[0] && !selectedTheirChore) {
      setSelectedTheirChore(rothanaChores[0].id)
    }
  }, [sopheakChores, rothanaChores, selectedMyChore, selectedTheirChore])

  if (!isOpen) return null

  function handleConfirmSwap() {
    if (!selectedMyChore || !selectedTheirChore) {
      toast.error("Please select both chores to swap")
      return
    }
    onSwapChores(selectedMyChore, selectedTheirChore)
    toast.success("Chores swapped successfully with Rothana!")
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
              Your Current Chore
            </label>
            <select
              value={selectedMyChore}
              onChange={(e) => setSelectedMyChore(e.target.value)}
              className="w-full rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3.5 py-2 text-xs text-foreground focus:border-[#7a3418] focus:outline-none"
            >
              {sopheakChores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.recurrence})
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
              Trade with Rothana P.'s Chore
            </label>
            <select
              value={selectedTheirChore}
              onChange={(e) => setSelectedTheirChore(e.target.value)}
              className="w-full rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3.5 py-2 text-xs text-foreground focus:border-[#7a3418] focus:outline-none"
            >
              {rothanaChores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.recurrence})
                </option>
              ))}
            </select>
          </div>

          <p className="text-center text-[11px] text-muted-foreground">
            Both roommates will receive a notification and the rotation will adjust automatically.
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
