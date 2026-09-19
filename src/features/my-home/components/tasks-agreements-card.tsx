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

import type {
  ChoreAssignee,
  ChoreItem,
  ExpenseItem,
  HouseRule,
} from "../types"
import { ASSIGNEE_ROTHANA, ASSIGNEE_SOPHEAK } from "../data/my-home-data"

type TasksAgreementsCardProps = {
  chores: ChoreItem[]
  houseRules: HouseRule[]
  expenses: ExpenseItem[]
  onToggleChore: (choreId: string) => void
  onReassignChore: (choreId: string, assignee: ChoreAssignee) => void
  onAddChoreClick: () => void
  onSwapChoreClick: () => void
  onPayExpenseClick?: (expense: ExpenseItem) => void
}

type TabType = "house-rules" | "chores" | "expenses"

export function TasksAgreementsCard({
  chores,
  houseRules,
  expenses,
  onToggleChore,
  onReassignChore,
  onAddChoreClick,
  onSwapChoreClick,
  onPayExpenseClick,
}: TasksAgreementsCardProps) {
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

        <span className="text-xs text-muted-foreground">Updated 2d ago</span>
      </div>

      {/* Tab Panel 1: Chores (matches screenshot) */}
      {activeTab === "chores" && (
        <div className="mt-5 space-y-3">
          <div className="space-y-2.5">
            {chores.map((chore) => {
              const isDropdownOpen = openDropdownId === chore.id

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
                      aria-checked={chore.isCompleted}
                      aria-label={`Mark "${chore.title}" as ${chore.isCompleted ? "incomplete" : "complete"}`}
                      onClick={() => onToggleChore(chore.id)}
                      className={`flex size-5 shrink-0 items-center justify-center rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        chore.isCompleted
                          ? "bg-[#6d2504] text-white"
                          : "border border-[#c5b8ac] bg-white hover:border-[#8c7e77]"
                      }`}
                    >
                      {chore.isCompleted && <Check className="size-3.5 stroke-[3]" />}
                    </button>

                    <div>
                      <h4
                        className={`text-sm font-semibold transition-all ${
                          chore.isCompleted
                            ? "font-heading text-[#8c7e77] line-through sm:text-base"
                            : "text-foreground sm:text-base"
                        }`}
                      >
                        {chore.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {chore.recurrence}
                        {chore.completedNote ? ` • ${chore.completedNote}` : ""}
                        {chore.dueNote ? ` • ${chore.dueNote}` : ""}
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
                          backgroundColor: chore.assignee.badgeBg,
                          color: chore.assignee.textColor,
                        }}
                      >
                        <span className="font-bold">{chore.assignee.initials}</span>
                        <span>{chore.assignee.shortLabel}</span>
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
                            <button
                              type="button"
                              onClick={() => {
                                onReassignChore(chore.id, ASSIGNEE_SOPHEAK)
                                setOpenDropdownId(null)
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
                            >
                              <span className="flex size-5 items-center justify-center rounded-full bg-[#fce5dc] text-[10px] font-bold text-[#9c4220]">
                                SC
                              </span>
                              <span>Sopheak (You)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onReassignChore(chore.id, ASSIGNEE_ROTHANA)
                                setOpenDropdownId(null)
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
                            >
                              <span className="flex size-5 items-center justify-center rounded-full bg-[#d8edd9] text-[10px] font-bold text-[#276e33]">
                                RP
                              </span>
                              <span>Rothana P.</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Done vs Pending status badge */}
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        chore.isCompleted
                          ? "bg-[#e2f3e4] text-[#276e33]"
                          : "bg-[#faece6] text-[#b8532c]"
                      }`}
                    >
                      {chore.isCompleted ? "Done" : "Pending"}
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
                Auto-rotates Sunday 8 PM
              </span>
              <span aria-hidden="true">•</span>
              <button
                type="button"
                onClick={onSwapChoreClick}
                className="font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-2 transition-colors hover:text-primary hover:decoration-primary"
              >
                Swap Chore
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                Assignee: <strong className="font-semibold text-foreground">Sopheak (You)</strong>
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
                          Mutual Rule
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {rule.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#eee6dc] pt-2.5 text-[11px] text-muted-foreground">
                    <span>Category: {rule.category}</span>
                    <span className="inline-flex items-center gap-1 text-[#276e33]">
                      <ShieldCheck className="size-3" />
                      Both agreed
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between border-t border-[#f0ebe5] pt-4 text-xs text-muted-foreground">
            <span>Rules are signed during lease onboarding</span>
            <span className="font-medium text-foreground">Last updated: Oct 12, 2026</span>
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
                      Due {exp.dueDate} • Total ${exp.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-sm font-bold text-foreground">
                    Your share: ${exp.yourShare}
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
                    {exp.status === "Pending" && onPayExpenseClick && (
                      <button
                        type="button"
                        onClick={() => onPayExpenseClick(exp)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#7a3418] px-2.5 py-0.5 text-xs font-medium text-white hover:bg-[#682c14]"
                      >
                        <CreditCard className="size-3" />
                        Pay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[#f0ebe5] pt-4 text-xs text-muted-foreground">
            <span>Expenses split automatically via ABA PayWay / KHQR</span>
            <span className="font-semibold text-foreground">Next billing cycle: Nov 1</span>
          </div>
        </div>
      )}
    </section>
  )
}
