import * as React from "react"
import { toast } from "sonner"

import { Container } from "@/components/layout/container"
import {
  INITIAL_CHORES,
  INITIAL_EXPENSES,
  INITIAL_HOUSE_RULES,
  INITIAL_RESIDENTS,
} from "../data/my-home-data"
import type {
  ChoreAssignee,
  ChoreItem,
  ExpenseItem,
  HouseholdResident,
  LivingPreference,
} from "../types"
import { AddChoreModal } from "./add-chore-modal"
import { EditPreferencesModal } from "./edit-preferences-modal"
import { HouseholdResidents } from "./household-residents"
import { InviteModal } from "./invite-modal"
import { MessageModal } from "./message-modal"
import { MetricsGrid } from "./metrics-grid"
import { ProfileModal } from "./profile-modal"
import { RoomHeroCard } from "./room-hero-card"
import { RoomSettingsModal } from "./room-settings-modal"
import { SwapChoreModal } from "./swap-chore-modal"
import { TasksAgreementsCard } from "./tasks-agreements-card"

export function MyHomePage() {
  // Room state
  const [roomName, setRoomName] = React.useState("Sunflower Sanctuary")
  const [location, setLocation] = React.useState("Toul Kork, Phnom Penh")
  const [leaseEnd, setLeaseEnd] = React.useState("Oct 2027")

  // Residents state
  const [residents, setResidents] =
    React.useState<HouseholdResident[]>(INITIAL_RESIDENTS)

  // Chores state
  const [chores, setChores] = React.useState<ChoreItem[]>(INITIAL_CHORES)

  // Expenses state
  const [expenses, setExpenses] = React.useState<ExpenseItem[]>(INITIAL_EXPENSES)

  // Modal open states
  const [isInviteOpen, setIsInviteOpen] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [isAddChoreOpen, setIsAddChoreOpen] = React.useState(false)
  const [isSwapChoreOpen, setIsSwapChoreOpen] = React.useState(false)
  const [isEditPrefsOpen, setIsEditPrefsOpen] = React.useState(false)
  const [activeMessageResident, setActiveMessageResident] =
    React.useState<HouseholdResident | null>(null)
  const [activeProfileResident, setActiveProfileResident] =
    React.useState<HouseholdResident | null>(null)

  // Set document title
  React.useEffect(() => {
    document.title = `${roomName} — My Home | RoomieMatch`
  }, [roomName])

  // Calculated metrics
  const completedChoresCount = chores.filter((c) => c.isCompleted).length
  const totalChoresCount = chores.length

  // Handlers
  function handleToggleChore(choreId: string) {
    setChores((prev) =>
      prev.map((chore) => {
        if (chore.id === choreId) {
          const nextCompleted = !chore.isCompleted
          if (nextCompleted) {
            toast.success(`Completed "${chore.title}"!`)
          }
          return {
            ...chore,
            isCompleted: nextCompleted,
            completedNote: nextCompleted
              ? "Completed Today"
              : chore.completedNote,
          }
        }
        return chore
      })
    )
  }

  function handleReassignChore(choreId: string, assignee: ChoreAssignee) {
    setChores((prev) =>
      prev.map((c) => (c.id === choreId ? { ...c, assignee } : c))
    )
    toast.success(`Reassigned chore to ${assignee.name}`)
  }

  function handleAddChore(newChore: ChoreItem) {
    setChores((prev) => [...prev, newChore])
  }

  function handleSwapChores(choreId1: string, choreId2: string) {
    setChores((prev) => {
      const c1 = prev.find((c) => c.id === choreId1)
      const c2 = prev.find((c) => c.id === choreId2)
      if (!c1 || !c2) return prev

      const assignee1 = c1.assignee
      const assignee2 = c2.assignee

      return prev.map((c) => {
        if (c.id === choreId1) return { ...c, assignee: assignee2 }
        if (c.id === choreId2) return { ...c, assignee: assignee1 }
        return c
      })
    })
  }

  function handleSavePreferences(newPrefs: LivingPreference[]) {
    setResidents((prev) =>
      prev.map((r) =>
        r.isCurrentUser ? { ...r, preferences: newPrefs } : r
      )
    )
  }

  function handlePayExpense(exp: ExpenseItem) {
    setExpenses((prev) =>
      prev.map((e) => (e.id === exp.id ? { ...e, status: "Paid" } : e))
    )
    toast.success(`Paid your share of $${exp.yourShare} for ${exp.title}!`)
  }

  const currentUserResident = residents.find((r) => r.isCurrentUser)

  return (
    <div className="min-h-full bg-background py-8 sm:py-10">
      <Container className="space-y-6">
        {/* 1. Room Hero Card */}
        <RoomHeroCard
          roomName={roomName}
          location={location}
          roommatesCount={residents.length}
          leaseEnd={leaseEnd}
          onInviteClick={() => setIsInviteOpen(true)}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />

        {/* 2. Key Metrics Grid */}
        <MetricsGrid
          rentShare={280}
          rentDueDate="Due Nov 1"
          utilitiesStatus="Paid"
          utilitiesDate="Next reading Nov 3"
          completedChoresCount={completedChoresCount}
          totalChoresCount={totalChoresCount}
          choresWeek={4}
          harmonyScore={92}
        />

        {/* 3. Household Residents */}
        <HouseholdResidents
          residents={residents}
          onViewProfile={(resident) => setActiveProfileResident(resident)}
          onEditPreferences={() => setIsEditPrefsOpen(true)}
          onMessageResident={(resident) => setActiveMessageResident(resident)}
        />

        {/* 4. Household Agreements & Tasks Card */}
        <TasksAgreementsCard
          chores={chores}
          houseRules={INITIAL_HOUSE_RULES}
          expenses={expenses}
          onToggleChore={handleToggleChore}
          onReassignChore={handleReassignChore}
          onAddChoreClick={() => setIsAddChoreOpen(true)}
          onSwapChoreClick={() => setIsSwapChoreOpen(true)}
          onPayExpenseClick={handlePayExpense}
        />
      </Container>

      {/* Modals & Dialogs */}
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        roomName={roomName}
      />

      <RoomSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentName={roomName}
        currentLocation={location}
        currentLease={leaseEnd}
        onSave={(n, l, le) => {
          setRoomName(n)
          setLocation(l)
          setLeaseEnd(le)
        }}
      />

      <AddChoreModal
        isOpen={isAddChoreOpen}
        onClose={() => setIsAddChoreOpen(false)}
        onAddChore={handleAddChore}
      />

      <SwapChoreModal
        isOpen={isSwapChoreOpen}
        onClose={() => setIsSwapChoreOpen(false)}
        chores={chores}
        onSwapChores={handleSwapChores}
      />

      <EditPreferencesModal
        isOpen={isEditPrefsOpen}
        onClose={() => setIsEditPrefsOpen(false)}
        currentPreferences={currentUserResident?.preferences || []}
        onSavePreferences={handleSavePreferences}
      />

      <MessageModal
        isOpen={Boolean(activeMessageResident)}
        onClose={() => setActiveMessageResident(null)}
        resident={activeMessageResident}
      />

      <ProfileModal
        isOpen={Boolean(activeProfileResident)}
        onClose={() => setActiveProfileResident(null)}
        resident={activeProfileResident}
      />
    </div>
  )
}
