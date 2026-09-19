import * as React from "react"
import { ListPlus, X } from "lucide-react"
import { toast } from "sonner"

import type { ChoreAssignee, ChoreItem } from "../types"
import { ASSIGNEE_ROTHANA, ASSIGNEE_SOPHEAK } from "../data/my-home-data"

type AddChoreModalProps = {
  isOpen: boolean
  onClose: () => void
  onAddChore: (chore: ChoreItem) => void
}

export function AddChoreModal({
  isOpen,
  onClose,
  onAddChore,
}: AddChoreModalProps) {
  const [title, setTitle] = React.useState("")
  const [recurrence, setRecurrence] = React.useState("Weekly")
  const [dueNote, setDueNote] = React.useState("Due Sunday evening")
  const [assigneeId, setAssigneeId] = React.useState("sopheak")

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Please enter a chore title")
      return
    }

    const assignee: ChoreAssignee =
      assigneeId === "sopheak" ? ASSIGNEE_SOPHEAK : ASSIGNEE_ROTHANA

    const newChore: ChoreItem = {
      id: `chore-${Date.now()}`,
      title: title.trim(),
      recurrence,
      dueNote,
      assignee,
      isCompleted: false,
    }

    onAddChore(newChore)
    toast.success(`Added chore "${title.trim()}"!`)
    setTitle("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#e8dfd8] bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#f0ebe5] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#faece6] text-[#7a3418]">
              <ListPlus className="size-4" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Add Household Chore
              </h3>
              <p className="text-xs text-muted-foreground">Keep shared spaces aligned</p>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="chore-title" className="text-xs font-semibold text-foreground">
              Chore Name
            </label>
            <input
              id="chore-title"
              type="text"
              placeholder="e.g. Clean Refrigerator & Shelves"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3.5 py-2 text-sm text-foreground focus:border-[#7a3418] focus:outline-none"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="chore-recurrence" className="text-xs font-semibold text-foreground">
                Recurrence
              </label>
              <select
                id="chore-recurrence"
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
                className="w-full rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3 py-2 text-xs text-foreground focus:border-[#7a3418] focus:outline-none"
              >
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Rotation">Rotation</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="chore-due" className="text-xs font-semibold text-foreground">
                Due Schedule
              </label>
              <input
                id="chore-due"
                type="text"
                value={dueNote}
                onChange={(e) => setDueNote(e.target.value)}
                placeholder="Due Sunday evening"
                className="w-full rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3 py-2 text-xs text-foreground focus:border-[#7a3418] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Initial Assignee
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAssigneeId("sopheak")}
                className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs transition-colors ${
                  assigneeId === "sopheak"
                    ? "border-[#7a3418] bg-[#fce5dc]/40 font-semibold text-[#9c4220]"
                    : "border-[#eee6dc] bg-[#f9f5f0] text-muted-foreground hover:bg-[#f5ece2]"
                }`}
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-[#fce5dc] text-[11px] font-bold text-[#9c4220]">
                  SC
                </span>
                <span>Sopheak (You)</span>
              </button>

              <button
                type="button"
                onClick={() => setAssigneeId("rothana")}
                className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs transition-colors ${
                  assigneeId === "rothana"
                    ? "border-[#276e33] bg-[#d8edd9]/40 font-semibold text-[#276e33]"
                    : "border-[#eee6dc] bg-[#f9f5f0] text-muted-foreground hover:bg-[#f5ece2]"
                }`}
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-[#d8edd9] text-[11px] font-bold text-[#276e33]">
                  RP
                </span>
                <span>Rothana P.</span>
              </button>
            </div>
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
              type="submit"
              className="rounded-full bg-[#7a3418] px-5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#682c14]"
            >
              Add Chore
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
