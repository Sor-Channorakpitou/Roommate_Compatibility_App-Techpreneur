import * as React from "react"
import { useSearchParams } from "react-router-dom"
import { CirclePlus, DoorOpen, RotateCw, TriangleAlert } from "lucide-react"

import {
  LinkButton,
  SignInPanel,
  StatePanel,
} from "@/components/common/state-panel"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { useAuth, type User } from "@/context/auth-context"
import type { CompatibilityAnswers } from "@/lib/compatibility"
import { formatMonthYear, formatUsd } from "@/lib/format"
import { monthKey, parseRoomSettings, type RoomChore } from "@/lib/room-settings"
import { isSupabaseConfigured, type Room } from "@/lib/supabase"
import { useMyHome } from "../hooks/use-my-home"
import {
  buildAssignees,
  buildExpenses,
  buildHouseRules,
  buildResidents,
  rentDueNote,
} from "../lib/household"
import type { ExpenseItem, HouseholdResident } from "../types"
import { AddChoreModal } from "./add-chore-modal"
import { HouseholdResidents } from "./household-residents"
import { InviteModal } from "./invite-modal"
import { MetricsGrid } from "./metrics-grid"
import { RoomHeroCard } from "./room-hero-card"
import { RoomSettingsModal } from "./room-settings-modal"
import { SwapChoreModal } from "./swap-chore-modal"
import { TasksAgreementsCard } from "./tasks-agreements-card"

export function MyHomePage() {
  const { user, isLoading } = useAuth()

  React.useEffect(() => {
    document.title = "My Home | RoomieMatch"
  }, [])

  let content: React.ReactNode
  if (!isSupabaseConfigured) {
    content = (
      <StatePanel
        icon={TriangleAlert}
        title="Supabase isn't connected"
        description="Add your project URL and anon key to .env, then restart the dev server."
      />
    )
  } else if (isLoading) {
    content = <HomeSkeleton />
  } else if (!user) {
    content = (
      <SignInPanel
        title="Sign in to see your home"
        description="My Home shows the rooms you host, with their chores, rules and bills."
      />
    )
  } else {
    content = <MyHome user={user} />
  }

  return (
    <div className="min-h-full bg-background py-8 sm:py-10">
      <Container className="space-y-6">{content}</Container>
    </div>
  )
}

function MyHome({ user }: { user: User }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { state, reload, saveRoom, isSaving } = useMyHome(user.id)

  if (state.status === "loading") return <HomeSkeleton />
  if (state.status === "error") {
    return (
      <StatePanel
        icon={TriangleAlert}
        tone="error"
        title="We couldn't load your home"
        description={state.message}
        action={
          <Button type="button" variant="outline" size="pill-lg" onClick={reload}>
            <RotateCw />
            Try again
          </Button>
        }
      />
    )
  }
  if (state.rooms.length === 0) {
    return (
      <StatePanel
        icon={DoorOpen}
        title="You don't have a home yet"
        description="Create a room to set house rules, split bills and share chores."
        action={
          <LinkButton to="/rooms/new">
            <CirclePlus />
            Create a room
          </LinkButton>
        }
      />
    )
  }

  const room =
    state.rooms.find((r) => r.id === searchParams.get("room")) ?? state.rooms[0]

  return (
    <>
      {state.rooms.length > 1 && (
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Showing
          <select
            value={room.id}
            onChange={(e) => setSearchParams({ room: e.target.value })}
            className="rounded-full border border-[#d6cbbe] bg-card px-3 py-1.5 text-sm font-medium text-foreground"
          >
            {state.rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <Household
        // A fresh set of dialogs per room.
        key={room.id}
        room={room}
        user={user}
        myAnswers={state.myAnswers}
        isSaving={isSaving}
        saveRoom={saveRoom}
      />
    </>
  )
}

function Household({
  room,
  user,
  myAnswers,
  isSaving,
  saveRoom,
}: {
  room: Room
  user: User
  myAnswers: CompatibilityAnswers
  isSaving: boolean
  saveRoom: ReturnType<typeof useMyHome>["saveRoom"]
}) {
  const [isInviteOpen, setIsInviteOpen] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [isAddChoreOpen, setIsAddChoreOpen] = React.useState(false)
  const [isSwapChoreOpen, setIsSwapChoreOpen] = React.useState(false)

  React.useEffect(() => {
    document.title = `${room.name} — My Home | RoomieMatch`
  }, [room.name])

  const settings = parseRoomSettings(room)
  const residents = buildResidents(user, myAnswers, settings)
  const assignees = buildAssignees(user.name, settings)
  const expenses = buildExpenses(room, settings)
  const members = Math.max(room.member_count, 1)
  const openSpots = Math.max(room.member_count - 1 - settings.invitees.length, 0)
  const utilitiesShare = settings.utilities.reduce(
    (sum, u) => sum + Math.round(u.monthlyTotal / members),
    0
  )
  const completedChores = settings.chores.filter((c) => c.completed).length

  function saveChores(chores: RoomChore[], message?: string) {
    return saveRoom(room, { settings: { chores } }, message)
  }

  function handleToggleChore(choreId: string) {
    const chore = settings.chores.find((c) => c.id === choreId)
    if (!chore) return
    void saveChores(
      settings.chores.map((c) =>
        c.id === choreId ? { ...c, completed: !c.completed } : c
      ),
      chore.completed ? undefined : `Completed "${chore.title}"`
    )
  }

  function handleReassignChore(choreId: string, assigneeId: string) {
    const label = assignees.find((a) => a.id === assigneeId)?.label
    void saveChores(
      settings.chores.map((c) =>
        c.id === choreId ? { ...c, assignee: assigneeId } : c
      ),
      `Reassigned to ${label}`
    )
  }

  function handleSwapChores(firstId: string, secondId: string) {
    const first = settings.chores.find((c) => c.id === firstId)
    const second = settings.chores.find((c) => c.id === secondId)
    if (!first || !second) return
    void saveChores(
      settings.chores.map((c) =>
        c.id === firstId
          ? { ...c, assignee: second.assignee }
          : c.id === secondId
            ? { ...c, assignee: first.assignee }
            : c
      ),
      "Chores swapped"
    )
  }

  function handleMarkPaid(expense: ExpenseItem) {
    const key = monthKey()
    const paid = settings.payments[key] ?? []
    void saveRoom(
      room,
      {
        settings: {
          payments: { ...settings.payments, [key]: [...paid, expense.id] },
        },
      },
      `Marked ${expense.title} as paid`
    )
  }

  function handleRemoveInvitee(resident: HouseholdResident) {
    void saveRoom(
      room,
      {
        settings: {
          invitees: settings.invitees.filter((i) => i.id !== resident.id),
          // Their chores fall back to the whole household, as in the wizard.
          chores: settings.chores.map((c) =>
            c.assignee === resident.id ? { ...c, assignee: "shared" } : c
          ),
        },
      },
      `Removed ${resident.name}'s invite`
    )
  }

  return (
    <>
      <RoomHeroCard
        roomName={room.name}
        location={[room.district, room.street].filter(Boolean).join(" · ")}
        roommatesCount={room.member_count}
        leaseEnd={formatMonthYear(room.lease_end_date)}
        onInviteClick={() => setIsInviteOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <MetricsGrid
        rentShare={Math.round(room.monthly_rent / members)}
        rentDueNote={rentDueNote(room)}
        utilitiesShare={utilitiesShare}
        utilitiesNote={
          settings.utilities.length > 0
            ? `${settings.utilities.length} bills split ${members} ways`
            : "No shared bills set up"
        }
        completedChoresCount={completedChores}
        totalChoresCount={settings.chores.length}
        choresNote={settings.rotateChoresWeekly ? "Rotates weekly" : "Fixed assignments"}
        openSpots={openSpots}
        totalSpots={room.member_count}
        isAcceptingRoommates={room.accepting_roommates}
      />

      <HouseholdResidents
        residents={residents}
        onRemoveInvitee={handleRemoveInvitee}
        isSaving={isSaving}
      />

      <TasksAgreementsCard
        chores={settings.chores}
        assignees={assignees}
        houseRules={buildHouseRules(settings)}
        expenses={expenses}
        rotateChoresWeekly={settings.rotateChoresWeekly}
        updatedAt={room.updated_at}
        isSaving={isSaving}
        onToggleChore={handleToggleChore}
        onReassignChore={handleReassignChore}
        onAddChoreClick={() => setIsAddChoreOpen(true)}
        onSwapChoreClick={() => setIsSwapChoreOpen(true)}
        onMarkPaid={handleMarkPaid}
      />

      <p className="text-center text-xs text-muted-foreground">
        Total rent {formatUsd(room.monthly_rent)}/mo · Move-in{" "}
        {new Date(`${room.move_in_date}T00:00:00`).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        roomName={room.name}
        joinCode={settings.joinCode}
        openSpots={openSpots}
        onInvite={(invitee) =>
          saveRoom(
            room,
            { settings: { invitees: [...settings.invitees, invitee] } },
            `Added ${invitee.name} to the household`
          )
        }
      />

      <RoomSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        room={room}
        onSave={(values) =>
          saveRoom(room, { columns: values }, "Room settings updated")
        }
      />

      <AddChoreModal
        isOpen={isAddChoreOpen}
        onClose={() => setIsAddChoreOpen(false)}
        assignees={assignees}
        onAddChore={(chore) =>
          saveChores([...settings.chores, chore], `Added "${chore.title}"`)
        }
      />

      <SwapChoreModal
        isOpen={isSwapChoreOpen}
        onClose={() => setIsSwapChoreOpen(false)}
        chores={settings.chores}
        assignees={assignees}
        onSwapChores={handleSwapChores}
      />
    </>
  )
}

function HomeSkeleton() {
  return (
    <div role="status" aria-label="Loading your home" className="space-y-6">
      <div className="h-32 animate-pulse rounded-2xl bg-muted/60" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((key) => (
          <div key={key} className="h-28 animate-pulse rounded-2xl bg-muted/50" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-muted/40" />
    </div>
  )
}
