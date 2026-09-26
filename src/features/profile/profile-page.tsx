import { Link } from "react-router-dom"
import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  DoorOpen,
  Eye,
  Heart,
  Home,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Pencil,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/context/auth-context"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
}

function SectionCard({
  title,
  description,
  children,
  action,
}: {
  title: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border/45 bg-card p-5 shadow-sm sm:p-6">
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

function EditLink({ href = "/register" }: { href?: string }) {
  return (
    <Link to={href} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline">
      <Pencil className="size-3" /> Edit
    </Link>
  )
}

function EmptyDetail({ icon: Icon, title, href, action }: { icon: typeof Home; title: string; href: string; action: string }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl bg-muted/55 p-4 sm:flex-row sm:items-center">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-primary"><Icon className="size-4" /></span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Add these details to help potential roommates get to know you.</p>
      </div>
      <Button nativeButton={false} render={<Link to={href} />} variant="outline" size="sm" className="rounded-full">{action}</Button>
    </div>
  )
}

export function ProfilePage() {
  const { user, logout } = useAuth()
  const name = user?.name || "Your profile"
  const initials = user ? getInitials(user.name) : "RM"

  return (
    <Container className="py-8 sm:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/45 bg-card p-5 text-center shadow-sm">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent text-xl font-semibold text-primary">{initials}</div>
            <h2 className="mt-3 font-heading text-lg">{name}</h2>
            {user?.university ? <p className="mt-1 text-xs text-muted-foreground">{user.university}</p> : <p className="mt-1 text-xs text-muted-foreground">RoomieMatch member</p>}
            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"><BadgeCheck className="size-3.5" /> Account created</div>
          </div>
          <nav aria-label="Profile sections" className="rounded-2xl border border-border/45 bg-card p-2 shadow-sm">
            <a href="#summary" className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-sm font-medium text-primary"><UserRound className="size-4" /> My Profile</a>
            <Link to="/rooms" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"><DoorOpen className="size-4" /> My Rooms</Link>
            <a href="#preferences" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"><Heart className="size-4" /> Preferences</a>
            <a href="#privacy" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"><ShieldCheck className="size-4" /> Privacy &amp; Verification</a>
            <a href="#account" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"><LockKeyhole className="size-4" /> Account Settings</a>
          </nav>
          {user ? <button type="button" onClick={() => { void logout(); toast.success("Signed out successfully") }} className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:underline"><LogOut className="size-4" /> Log out</button> : <Link to="/sign-in" className="block px-3 py-2 text-sm text-primary hover:underline">Sign in</Link>}
        </aside>

        <div className="space-y-5">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-semibold tracking-wide text-primary">YOUR ACCOUNT</p><h1 className="mt-1 font-heading text-3xl">My Profile</h1><p className="mt-1 text-sm text-muted-foreground">This is how other students can get to know you.</p></div>
            <Button nativeButton={false} render={<Link to="/register" />} className="rounded-full"><Pencil /> Edit profile</Button>
          </header>

          <SectionCard title="Profile Summary" action={<EditLink />}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-accent text-2xl font-semibold text-primary">{initials}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><h3 className="font-heading text-xl">{name}</h3><span className="inline-flex items-center gap-1 rounded-full bg-sage/35 px-2 py-0.5 text-[11px] font-medium text-sage-foreground"><Check className="size-3" /> Account</span></div>
                <p className="mt-1 text-sm text-muted-foreground">{user?.university || "University not added yet"}</p>
                <p className="mt-3 max-w-2xl rounded-lg bg-muted/60 p-3 text-sm leading-relaxed text-muted-foreground">{user?.gender ? `${user.gender} student` : "Add a short introduction so potential roommates can learn a little about you."}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs"><span className="font-medium">Profile details</span><Link to="/compatibility-test" className="text-primary hover:underline">Build your roommate profile <ChevronRight className="inline size-3" /></Link></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-1/3 rounded-full bg-primary" /></div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Housing Needs" action={<EditLink />}>
            <EmptyDetail icon={Home} title="Tell roommates what you’re looking for" href="/my-home" action="Add housing details" />
            <div className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
              <div><p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">University</p><p className="mt-1">{user?.university || "Not added"}</p></div>
              <div><p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Preferred area</p><p className="mt-1 flex items-center gap-1"><MapPin className="size-3.5 text-primary" /> Not set</p></div>
              <div><p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Move-in date</p><p className="mt-1 flex items-center gap-1"><CalendarDays className="size-3.5 text-primary" /> Not set</p></div>
            </div>
          </SectionCard>

          <SectionCard title="Lifestyle and Habits" description="Used to calculate your compatibility score with other roommates." action={<EditLink href="/compatibility-test" />}>
            <EmptyDetail icon={Moon} title="Your compatibility profile is ready to build" href="/compatibility-test" action="Take compatibility quiz" />
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[{ icon: Moon, label: "Sleep schedule" }, { icon: Sparkles, label: "Cleanliness" }, { icon: BookOpen, label: "Study habits" }, { icon: Heart, label: "Social style" }].map(({ icon: Icon, label }) => <div key={label} className="rounded-xl bg-muted/55 p-3"><Icon className="size-4 text-primary" /><p className="mt-2 text-xs font-medium">{label}</p><p className="mt-1 text-[11px] text-muted-foreground">Not answered</p></div>)}
            </div>
          </SectionCard>

          <SectionCard title="Roommate Preferences" action={<EditLink href="/compatibility-test" />}>
            <p className="rounded-lg bg-muted/55 p-3 text-sm text-muted-foreground">Add your roommate preferences and any deal-breakers.</p>
            <Link to="/compatibility-test" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Set preferences <ChevronRight className="size-3" /></Link>
          </SectionCard>

          <SectionCard title="Contact Info & Privacy" action={<EditLink />}>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 rounded-lg bg-muted/55 p-3"><Mail className="size-4 text-primary" /><div className="min-w-0 flex-1"><p className="text-[10px] text-muted-foreground">Email address</p><p className="truncate text-sm">{user?.email || "Sign in to view your email"}</p></div><span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><Eye className="size-3" /> Private</span></div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/55 p-3"><LockKeyhole className="size-4 text-primary" /><div className="flex-1"><p className="text-[10px] text-muted-foreground">Phone number</p><p className="text-sm text-muted-foreground">Not added</p></div><span className="text-[10px] text-muted-foreground">Private</span></div>
            </div>
          </SectionCard>
          <p className="flex items-center gap-2 px-1 text-xs text-muted-foreground"><CircleHelp className="size-3.5" /> You control what information you share with other students.</p>
        </div>
      </div>
    </Container>
  )
}
