import * as React from "react"
import {
  Check,
  ChevronDown,
  CreditCard,
  DollarSign,
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"

import type { RoomChore } from "@/lib/room-settings"
import { formatUsd } from "@/lib/format"
import { formatUpdatedAgo } from "../lib/household"
import type { ChoreAssignee, ExpenseItem, HouseRule } from "../types"

type TasksAgreementsCardProps = {
  chores: RoomChore[]
  assignees: ChoreAssignee[]
  houseRules: HouseRule[]
  expenses: ExpenseItem[]
  rotateChoresWeekly: boolean
  updatedAt: string
  isSaving: boolean
  onToggleChore: (choreId: string) => void
  onReassignChore: (choreId: string, assigneeId: string) => void
  onAddChoreClick: () => void
  onSwapChoreClick: () => void
  onMarkPaid: (expense: ExpenseItem) => void
}

type TabType = "house-rules" | "chores" | "expenses"

export function TasksAgreementsCard({
  chores,
  assignees,
  houseRules,
  expenses,
  rotateChoresWeekly,
  updatedAt,
  isSaving,
  onToggleChore,
  onReassignChore,
  onAddChoreClick,
  onSwapChoreClick,
  onMarkPaid,
}: TasksAgreementsCardProps) {
  const assigneeOf = (id: string) =>
    assignees.find((a) => a.id === id) ?? assignees[assignees.length - 1]
  const myChoreCount = chores.filter((c) => c.assignee === "host").length
  const [activeTab, setActiveTab] = React.useState<TabType>("chores")
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null)

  return (
    <section aria-label="Household Tasks and Agreements" className="rounded-2xl border border-[#e8dfd8] bg-card p-6 shadow-sm sm:p-7">
      {/* Top Header with Tab Switcher and Timestamp */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center rounded-full bg-[#f0ebe5] p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("house-rules")}
            className={`rounded-full px-3.5 py-1.5 font-medium transition-all ${
              activeTab === "house-rules"
                ? "bg-[#7a3418] text-white shadow-sm"
                : "text-[#6e625a] hover:text-foreground"
            }`}
          >
            House Rules
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chores")}
            className={`rounded-full px-4 py-1.5 font-medium transition-all ${
              activeTab === "chores"
                ? "bg-[#7a3418] text-white shadow-sm"
                : "text-[#6e625a] hover:text-foreground"
            }`}
          >
            Chores
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("expenses")}
            className={`rounded-full px-3.5 py-1.5 font-medium transition-all ${
              activeTab === "expenses"
                ? "bg-[#7a3418] text-white shadow-sm"
                : "text-[#6e625a] hover:text-foreground"
            }`}
          >
            Expenses
          </button>
        </div>

        <span className="text-xs text-muted-foreground">
          Updated {formatUpdatedAgo(updatedAt)}
        </span>
      </div>

      {/* Tab Panel 1: Chores (matches screenshot) */}
      {activeTab === "chores" && (
        <div className="mt-5 space-y-3">
          <div className="space-y-2.5">
            {chores.length === 0 && (
              <p className="rounded-xl border border-dashed border-[#e0d6cc] p-6 text-center text-xs text-muted-foreground">
                No chores yet. Add the first one to share the load.
              </p>
            )}
            {chores.map((chore) => {
              const isDropdownOpen = openDropdownId === chore.id
              const isCompleted = Boolean(chore.completed)
              const assignee = assigneeOf(chore.assignee)

              return (
                <div
                  key={chore.id}
                  className="group relative flex flex-col justify-between gap-3 rounded-xl border border-[#eee6dc] bg-[#f9f5f0] p-4 transition-colors hover:bg-[#f5ece2] sm:flex-row sm:items-center"
                >
                  {/* Left: Checkbox + Title + Meta */}
                  <div className="flex items-center gap-3.5">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isCompleted}
                      disabled={isSaving}
                      aria-label={`Mark "${chore.title}" as ${isCompleted ? "incomplete" : "complete"}`}
                      onClick={() => onToggleChore(chore.id)}
                      className={`flex size-5 shrink-0 items-center justify-center rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isCompleted
                          ? "bg-[#6d2504] text-white"
                          : "border border-[#c5b8ac] bg-white hover:border-[#8c7e77]"
                      }`}
                    >
                      {isCompleted && <Check className="size-3.5 stroke-[3]" />}
                    </button>

                    <div>
                      <h4
                        className={`text-sm font-semibold transition-all ${
                          isCompleted
                            ? "font-heading text-[#8c7e77] line-through sm:text-base"
                            : "text-foreground sm:text-base"
                        }`}
                      >
                        {chore.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {chore.schedule}
                      </p>
                    </div>
                  </div>

                  {/* Right: Assignee Pill + Status Badge */}
                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    {/* Assignee pill with interactive dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        aria-expanded={isDropdownOpen}
                        onClick={() =>
                          setOpenDropdownId(isDropdownOpen ? null : chore.id)
                        }
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors hover:ring-1 hover:ring-black/10 focus-visible:outline-none"
                        style={{
                          backgroundColor: assignee.badgeBg,
                          color: assignee.textColor,
                        }}
                      >
                        <span className="font-bold">{assignee.initials}</span>
                        <span>{assignee.label}</span>
                        <ChevronDown className="size-3 opacity-70" aria-hidden="true" />
                      </button>

                      {isDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenDropdownId(null)}
                          />
                          <div className="absolute right-0 top-full z-20 mt-1.5 w-44 rounded-xl border border-[#e8dfd8] bg-card p-1.5 shadow-lg ring-1 ring-black/5">
                            <p className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                              Assign to
                            </p>
                            {assignees.map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => {
                                  if (option.id !== chore.assignee) {
                                    onReassignChore(chore.id, option.id)
                                  }
                                  setOpenDropdownId(null)
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
                              >
                                <span
                                  className="flex size-5 items-center justify-center rounded-full text-[9px] font-bold"
                                  style={{
                                    backgroundColor: option.badgeBg,
                                    color: option.textColor,
                                  }}
                                >
                                  {option.initials}
                                </span>
                                <span>{option.label}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Done vs Pending status badge */}
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        isCompleted
                          ? "bg-[#e2f3e4] text-[#276e33]"
                          : "bg-[#faece6] text-[#b8532c]"
                      }`}
                    >
                      {isCompleted ? "Done" : "Pending"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Chore Controls Bar */}
          <div className="flex flex-col gap-3 border-t border-[#f0ebe5] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw className="size-3.5 text-muted-foreground/80" aria-hidden="true" />
                {rotateChoresWeekly ? "Rotates weekly" : "Fixed assignments"}
              </span>
              <span aria-hidden="true">•</span>
              <button
                type="button"
                onClick={onSwapChoreClick}
                disabled={chores.length < 2}
                className="font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-2 transition-colors hover:text-primary hover:decoration-primary"
              >
                Swap Chore
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                Yours: <strong className="font-semibold text-foreground">{myChoreCount}</strong>
              </span>

              <button
                type="button"
                onClick={onAddChoreClick}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#7a3418] px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[#682c14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7a3418] active:scale-98"
              >
                <Plus className="size-3.5" aria-hidden="true" />
                Add chore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Panel 2: House Rules */}
      {activeTab === "house-rules" && (
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {houseRules.map((rule) => {
              const Icon = rule.icon
              return (
                <div
                  key={rule.id}
                  className="flex flex-col justify-between rounded-xl border border-[#eee6dc] bg-[#f9f5f0] p-4 transition-colors hover:bg-[#f5ece2]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f0ebe5] text-[#7a3418]">
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">
                          {rule.title}
                        </h4>
                        <span className="rounded-full bg-[#e8f2e9] px-2 py-0.5 text-[10px] font-semibold text-[#276e33]">
                          {rule.category}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {rule.description}
                      </p>
                    </div>
                  </div>


                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between border-t border-[#f0ebe5] pt-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-[#276e33]" />
              Set when you created the room
            </span>
            <span className="font-medium text-foreground">
              Last updated {formatUpdatedAgo(updatedAt)}
            </span>
          </div>
        </div>
      )}

      {/* Tab Panel 3: Expenses */}
      {activeTab === "expenses" && (
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between rounded-xl border border-[#eee6dc] bg-[#f9f5f0] p-4 transition-colors hover:bg-[#f5ece2]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#fce5dc] text-[#9c4220]">
                    <DollarSign className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {exp.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {exp.dueNote} • Total {exp.isEstimate ? "~" : ""}
                      {formatUsd(exp.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-sm font-bold text-foreground">
                    Your share: {exp.isEstimate ? "~" : ""}
                    {formatUsd(exp.yourShare)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        exp.status === "Paid"
                          ? "bg-[#e2f3e4] text-[#276e33]"
                          : "bg-[#faece6] text-[#b8532c]"
                      }`}
                    >
                      {exp.status}
                    </span>
                    {exp.status === "Pending" && (
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => onMarkPaid(exp)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#7a3418] px-2.5 py-0.5 text-xs font-medium text-white hover:bg-[#682c14] disabled:opacity-50"
                      >
                        <CreditCard className="size-3" />
                        Mark paid
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[#f0ebe5] pt-4 text-xs text-muted-foreground">
            <span>Split evenly across the household. Paid status resets each month.</span>
            <span className="font-semibold text-foreground">
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      )}
    </section>
  )
}
