import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import {
  CirclePlus,
  DoorOpen,
  LogIn,
  RotateCw,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"

import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { isSupabaseConfigured } from "@/lib/supabase"
import { RoomListCard } from "./components/room-list-card"
import { useMyRooms } from "./hooks/use-my-rooms"

export function MyRoomsPage() {
  const location = useLocation()
  const { user, isLoading: isAuthLoading } = useAuth()
  const { state, pendingIds, reload, toggleAcceptingRoommates, removeRoom } =
    useMyRooms(user?.id)
  const createdRoomId = (location.state as { createdRoomId?: string } | null)
    ?.createdRoomId

  React.useEffect(() => {
    document.title = "My rooms | RoomieMatch"
  }, [])

  function renderContent() {
    if (!isSupabaseConfigured) {
      return (
        <StatePanel
          icon={TriangleAlert}
          title="Supabase isn't connected"
          description="Add your project URL and anon key to .env, then restart the dev server."
        />
      )
    }
    if (isAuthLoading) return <RoomListSkeleton />
    if (!user) {
      return (
        <StatePanel
          icon={LogIn}
          title="Sign in to see your rooms"
          description="Rooms are private to the host who created them."
          action={
            <LinkButton to="/sign-in" state={{ from: location.pathname }}>
              <LogIn />
              Sign in
            </LinkButton>
          }
        />
      )
    }

    switch (state.status) {
      case "loading":
        return <RoomListSkeleton />
      case "error":
        return (
          <StatePanel
            icon={TriangleAlert}
            tone="error"
            title="We couldn't load your rooms"
            description={state.message}
            action={
              <Button
                type="button"
                variant="outline"
                size="pill-lg"
                onClick={reload}
              >
                <RotateCw />
                Try again
              </Button>
            }
          />
        )
      case "ready":
        if (state.rooms.length === 0) {
          return (
            <StatePanel
              icon={DoorOpen}
              title="No rooms yet"
              description="Create your first room to invite roommates and set house rules."
              action={
                <LinkButton to="/rooms/new">
                  <CirclePlus />
                  Create your first room
                </LinkButton>
              }
            />
          )
        }
        return (
          <ul className="grid gap-6 md:grid-cols-2">
            {state.rooms.map((room) => (
              <li key={room.id}>
                <RoomListCard
                  room={room}
                  isNew={room.id === createdRoomId}
                  isPending={pendingIds.has(room.id)}
                  onToggleAccepting={() => toggleAcceptingRoommates(room)}
                  onDelete={() => removeRoom(room)}
                />
              </li>
            ))}
          </ul>
        )
    }
  }

  return (
    <>
      <section className="border-b border-border/20 bg-surface py-10">
        <Container className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.05em] text-brand uppercase">
              <DoorOpen aria-hidden className="size-3.5" />
              Hosting
            </p>
            <h1 className="font-heading text-4xl leading-tight tracking-[-0.025em] text-primary">
              My rooms
            </h1>
            <p className="text-[0.9375rem] text-muted-foreground">
              Every room you publish, straight from the database.
            </p>
          </div>
          {user && (
            <LinkButton to="/rooms/new">
              <CirclePlus />
              Create room
            </LinkButton>
          )}
        </Container>
      </section>

      <Container className="py-10" aria-live="polite">
        {renderContent()}
      </Container>
    </>
  )
}

function LinkButton({
  to,
  state,
  children,
}: {
  to: string
  state?: unknown
  children: React.ReactNode
}) {
  return (
    <Button
      nativeButton={false}
      variant="brand"
      size="pill-lg"
      className="text-sm font-semibold shadow-soft"
      render={<Link to={to} state={state} />}
    >
      {children}
    </Button>
  )
}

function StatePanel({
  icon: Icon,
  title,
  description,
  action,
  tone = "neutral",
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  tone?: "neutral" | "error"
}) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card px-6 py-12 text-center shadow-soft"
    >
      <span
        className={
          tone === "error"
            ? "flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive"
            : "flex size-12 items-center justify-center rounded-full bg-peach text-peach-foreground"
        }
      >
        <Icon aria-hidden className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  )
}

function RoomListSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading your rooms"
      className="grid gap-6 md:grid-cols-2"
    >
      {[0, 1].map((key) => (
        <div
          key={key}
          className="flex animate-pulse flex-col gap-5 rounded-2xl border border-border/40 bg-card p-6"
        >
          <div className="h-7 w-2/3 rounded-lg bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
          <div className="h-20 rounded-xl bg-surface" />
          <div className="h-8 rounded-lg bg-muted/70" />
        </div>
      ))}
    </div>
  )
}
