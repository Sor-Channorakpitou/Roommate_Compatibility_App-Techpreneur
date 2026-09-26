import * as React from "react"
import { Link } from "react-router-dom"
import {
  BadgeCheck,
  ChevronRight,
  CircleHelp,
  DoorOpen,
  Eye,
  Heart,
  Home,
  LockKeyhole,
  LogOut,
  Mail,
  Moon,
  Pencil,
  Sparkles,
  Sun,
  TriangleAlert,
  UserRound,
  Volume2,
} from "lucide-react"
import { toast } from "sonner"

import { SignInPanel, StatePanel } from "@/components/common/state-panel"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { useAuth, type User } from "@/context/auth-context"
import { getErrorMessage } from "@/lib/api-error"
import { answerLabel, HABITS, hasCompletedQuiz, type HabitKey } from "@/lib/compatibility"
import { getInitials } from "@/lib/format"
import { listMyRooms } from "@/lib/rooms-api"
import { getStudent, updateMyProfile, type Student } from "@/lib/students-api"
import { isSupabaseConfigured, type Room } from "@/lib/supabase"

const BIO_MAX_LENGTH = 500
const GENDERS = ["Male", "Female", "Other"] as const

const HABIT_ICONS: Record<HabitKey, typeof Moon> = {
  sleep: Moon,
  weekend: Sun,
  cleanliness: Sparkles,
  noise: Volume2,
}

function SectionCard({
  id,
  title,
  description,
  children,
  action,
}: {
  id?: string
  title: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl border border-border/45 bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-border/35 pb-3">
        <div>
          <h2 className="font-heading text-lg font-medium">{title}</h2>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function EmptyDetail({ icon: Icon, title, description, href, action }: { icon: typeof Home; title: string; description: string; href: string; action: string }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl bg-muted/55 p-4 sm:flex-row sm:items-center">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-primary"><Icon className="size-4" /></span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <Button nativeButton={false} render={<Link to={href} />} variant="outline" size="sm" className="rounded-full">{action}</Button>
    </div>
  )
}

export function ProfilePage() {
  const { user, isLoading } = useAuth()

  React.useEffect(() => {
    document.title = "My profile | RoomieMatch"
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
    content = <div className="mx-auto h-96 max-w-6xl animate-pulse rounded-2xl bg-muted/50" />
  } else if (!user) {
    content = (
      <SignInPanel
        title="Sign in to see your profile"
        description="Your profile is how other students get to know you."
      />
    )
  } else {
    content = <Profile user={user} />
  }

  return <Container className="py-8 sm:py-10">{content}</Container>
}

function Profile({ user }: { user: User }) {
  const { logout, refreshUser } = useAuth()
  const [student, setStudent] = React.useState<Student | null>(null)
  const [rooms, setRooms] = React.useState<Room[] | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [reloadKey, setReloadKey] = React.useState(0)

  React.useEffect(() => {
    let isCurrent = true
    getStudent(user.id)
      .then((s) => isCurrent && setStudent(s))
      .catch(() => {
        // Fall back to the auth details already on screen.
      })
    listMyRooms(user.id)
      .then((r) => isCurrent && setRooms(r))
      .catch(() => isCurrent && setRooms([]))
    return () => {
      isCurrent = false
    }
  }, [user.id, reloadKey])

  const answers = student?.answers ?? {}
  const tookQuiz = hasCompletedQuiz(answers)
  const bio = student?.bio?.trim() ?? ""
  const checklist = [
    Boolean(user.name),
    Boolean(user.university),
    Boolean(bio),
    tookQuiz,
  ]
  const completeness = Math.round(
    (checklist.filter(Boolean).length / checklist.length) * 100
  )
  const memberSince = student?.created_at
    ? new Date(student.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null

  async function handleSaved() {
    await refreshUser()
    setReloadKey((key) => key + 1)
    setIsEditing(false)
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
      <aside className="space-y-4">
        <div className="rounded-2xl border border-border/45 bg-card p-5 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center overflow-hidden rounded-full bg-accent text-xl font-semibold text-primary">
            {student?.avatar_url ? <img src={student.avatar_url} alt="" className="size-full object-cover" /> : getInitials(user.name)}
          </div>
          <h2 className="mt-3 font-heading text-lg">{user.name}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{user.university || "RoomieMatch member"}</p>
          {memberSince && (
            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"><BadgeCheck className="size-3.5" /> Member since {memberSince}</div>
          )}
        </div>
        <nav aria-label="Profile sections" className="rounded-2xl border border-border/45 bg-card p-2 shadow-sm">
          <a href="#summary" className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-sm font-medium text-primary"><UserRound className="size-4" /> My Profile</a>
          <a href="#lifestyle" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"><Heart className="size-4" /> Lifestyle</a>
          <Link to="/rooms" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"><DoorOpen className="size-4" /> My Rooms</Link>
          <a href="#account" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"><LockKeyhole className="size-4" /> Account</a>
        </nav>
        <button type="button" onClick={() => { void logout(); toast.success("Signed out successfully") }} className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:underline"><LogOut className="size-4" /> Log out</button>
      </aside>

      <div className="space-y-5">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-semibold tracking-wide text-primary">YOUR ACCOUNT</p><h1 className="mt-1 font-heading text-3xl">My Profile</h1><p className="mt-1 text-sm text-muted-foreground">This is how other students can get to know you.</p></div>
          {!isEditing && <Button type="button" onClick={() => setIsEditing(true)} className="rounded-full"><Pencil /> Edit profile</Button>}
        </header>

        <SectionCard id="summary" title="Profile Summary">
          {isEditing ? (
            <ProfileForm
              user={user}
              bio={bio}
              onCancel={() => setIsEditing(false)}
              onSaved={handleSaved}
            />
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-accent text-2xl font-semibold text-primary">{getInitials(user.name)}</div>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-xl">{user.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{[user.university || "University not added yet", user.gender].filter(Boolean).join(" · ")}</p>
                <p className="mt-3 max-w-2xl whitespace-pre-line rounded-lg bg-muted/60 p-3 text-sm leading-relaxed text-muted-foreground">{bio || "Add a short introduction so potential roommates can learn a little about you."}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs"><span className="font-medium">Profile {completeness}% complete</span>{!tookQuiz && <Link to="/compatibility-test" className="text-primary hover:underline">Take the compatibility quiz <ChevronRight className="inline size-3" /></Link>}</div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={completeness} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completeness"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completeness}%` }} /></div>
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard
          id="lifestyle"
          title="Lifestyle and Habits"
          description="Used to calculate your compatibility score with other students."
          action={tookQuiz ? <Link to="/compatibility-test" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline"><Pencil className="size-3" /> Retake</Link> : undefined}
        >
          {!tookQuiz && <EmptyDetail icon={Moon} title="Your compatibility profile is ready to build" description="Answer four quick questions to see match scores on Browse." href="/compatibility-test" action="Take compatibility quiz" />}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {HABITS.map(({ key, label }) => {
              const Icon = HABIT_ICONS[key]
              return <div key={key} className="rounded-xl bg-muted/55 p-3"><Icon className="size-4 text-primary" /><p className="mt-2 text-xs font-medium">{label}</p><p className="mt-1 text-[11px] text-muted-foreground">{answerLabel(key, answers[key]) ?? "Not answered"}</p></div>
            })}
          </div>
        </SectionCard>

        <SectionCard title="My Rooms" action={<Link to="/rooms" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline">Manage <ChevronRight className="size-3" /></Link>}>
          {rooms === null ? (
            <div className="h-16 animate-pulse rounded-xl bg-muted/55" />
          ) : rooms.length === 0 ? (
            <EmptyDetail icon={Home} title="You're not hosting a room yet" description="Create a room to find roommates and manage chores and bills together." href="/rooms/new" action="Create a room" />
          ) : (
            <ul className="space-y-2">
              {rooms.map((room) => (
                <li key={room.id}>
                  <Link to={`/my-home?room=${room.id}`} className="flex items-center justify-between gap-3 rounded-xl bg-muted/55 p-3 text-sm hover:bg-muted">
                    <span className="min-w-0"><span className="block truncate font-medium">{room.name}</span><span className="block truncate text-xs text-muted-foreground">{room.district}</span></span>
                    <span className="shrink-0 text-xs text-muted-foreground">{room.accepting_roommates ? "Accepting roommates" : "Closed"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard id="account" title="Contact Info & Privacy">
          <div className="flex flex-wrap items-center gap-3 rounded-lg bg-muted/55 p-3"><Mail className="size-4 text-primary" /><div className="min-w-0 flex-1"><p className="text-[10px] text-muted-foreground">Email address</p><p className="truncate text-sm">{user.email}</p></div><span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><Eye className="size-3" /> Private</span></div>
        </SectionCard>
        <p className="flex items-center gap-2 px-1 text-xs text-muted-foreground"><CircleHelp className="size-3.5" /> Other students see your name, university, bio and quiz answers, never your email.</p>
      </div>
    </div>
  )
}

function ProfileForm({
  user,
  bio,
  onCancel,
  onSaved,
}: {
  user: User
  bio: string
  onCancel: () => void
  onSaved: () => Promise<void>
}) {
  const [values, setValues] = React.useState({
    name: user.name,
    university: user.university,
    gender: user.gender || "Other",
    bio,
  })
  const [isSaving, setIsSaving] = React.useState(false)
  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = values.name.trim()
    if (!name) {
      toast.error("Your name can't be empty.")
      return
    }
    setIsSaving(true)
    try {
      await updateMyProfile({
        name,
        university: values.university.trim(),
        gender: values.gender,
        bio: values.bio.trim(),
      })
      toast.success("Profile updated")
      await onSaved()
    } catch (error) {
      toast.error("Couldn't save your profile", { description: getErrorMessage(error) })
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1.5 text-xs font-semibold">
          <span>Name</span>
          <input className={inputClass} value={values.name} maxLength={80} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} />
        </label>
        <label className="space-y-1.5 text-xs font-semibold">
          <span>University</span>
          <input className={inputClass} value={values.university} maxLength={120} onChange={(e) => setValues((v) => ({ ...v, university: e.target.value }))} />
        </label>
        <label className="space-y-1.5 text-xs font-semibold">
          <span>Gender</span>
          <select className={inputClass} value={values.gender} onChange={(e) => setValues((v) => ({ ...v, gender: e.target.value }))}>
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
      </div>
      <label className="block space-y-1.5 text-xs font-semibold">
        <span>About you</span>
        <textarea className={`${inputClass} min-h-28 resize-y`} value={values.bio} maxLength={BIO_MAX_LENGTH} placeholder="Your routine, what you study, what makes a good home for you…" onChange={(e) => setValues((v) => ({ ...v, bio: e.target.value }))} />
        <span className="block text-right font-normal text-muted-foreground">{values.bio.length}/{BIO_MAX_LENGTH}</span>
      </label>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" className="rounded-full" onClick={onCancel} disabled={isSaving}>Cancel</Button>
        <Button type="submit" className="rounded-full" disabled={isSaving}>{isSaving ? "Saving…" : "Save profile"}</Button>
      </div>
    </form>
  )
}
