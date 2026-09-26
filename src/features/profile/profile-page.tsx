import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  LoaderCircle,
  Eye,
  Heart,
  Home,
  LockKeyhole,
  LogOut,
  Mail,
  Moon,
  Pencil,
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"

import { useAuth, type ProfileUpdate } from "@/context/auth-context"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isSupabaseConfigured, supabase, type ListingRow } from "@/lib/supabase"

type HousingPreferences = {
  lookingFor?: string
  budgetMin?: number
  budgetMax?: number
  districts?: string[]
  moveInDate?: string
  leaseDuration?: string
  roomType?: string
  roommateGender?: string
  roommateAgeRange?: string
  dealBreakers?: string[]
}

function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
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
    <section id={id} className="rounded-2xl border border-border/45 bg-card p-5 shadow-sm sm:p-6">
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

function EditLink({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline">
      <Pencil className="size-3" /> Edit
    </button>
  )
}

export function ProfilePage() {
  const { user, logout, updateProfile, isSubmitting } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = React.useState<"profile" | "preferences" | "listings" | "privacy" | "account">("profile")
  const [isEditing, setIsEditing] = React.useState(false)
  const [draft, setDraft] = React.useState<ProfileUpdate>({ name: "", university: "", gender: "Other" })
  const [editError, setEditError] = React.useState("")
  const [housingPreferences, setHousingPreferences] = React.useState<HousingPreferences | null>(null)
  const [lifestyleAnswers, setLifestyleAnswers] = React.useState<Array<{ category: string; answer: string; subAnswer?: string | null }>>([])
  const [preferencesLoading, setPreferencesLoading] = React.useState(false)
  const [isEditingPreferences, setIsEditingPreferences] = React.useState(false)
  const [preferenceDraft, setPreferenceDraft] = React.useState<HousingPreferences>({})
  const [preferenceError, setPreferenceError] = React.useState("")
  const [isSavingPreferences, setIsSavingPreferences] = React.useState(false)
  const [myListings, setMyListings] = React.useState<ListingRow[]>([])
  const [listingsLoading, setListingsLoading] = React.useState(false)
  const name = user?.name || "Your profile"
  const initials = user ? getInitials(user.name) : "RM"
  const hasHousingNeeds = Boolean(housingPreferences && (housingPreferences.lookingFor || housingPreferences.budgetMin !== undefined || housingPreferences.budgetMax !== undefined || housingPreferences.districts?.length || housingPreferences.moveInDate || housingPreferences.leaseDuration || housingPreferences.roomType))
  const hasRoommatePreferences = Boolean(housingPreferences && (housingPreferences.roommateGender || housingPreferences.roommateAgeRange || housingPreferences.dealBreakers?.length))

  React.useEffect(() => {
    const tab = location.hash.slice(1)
    setActiveTab(tab === "preferences" || tab === "listings" || tab === "privacy" || tab === "account" ? tab : "profile")
  }, [location.hash])

  function selectTab(tab: "profile" | "preferences" | "listings" | "privacy" | "account") {
    setActiveTab(tab)
    navigate(tab === "profile" ? "/profile#summary" : `/profile#${tab}`)
  }

  React.useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      setHousingPreferences(null)
      setLifestyleAnswers([])
      setMyListings([])
      setPreferencesLoading(false)
      setListingsLoading(false)
      return
    }

    let active = true
    setPreferencesLoading(true)
    setListingsLoading(true)
    void Promise.all([
      supabase.from("profiles").select("housing_preferences").eq("id", user.id).maybeSingle(),
      supabase.from("compatibility_responses").select("responses").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("roommate_listings").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
    ]).then(([profileResult, compatibilityResult, listingResult]) => {
      if (!active) return
      setHousingPreferences(profileResult.data?.housing_preferences as HousingPreferences | null || null)
      const responses = compatibilityResult.data?.responses
      setLifestyleAnswers(Array.isArray(responses) ? responses.filter((item): item is { category: string; answer: string; subAnswer?: string | null } => Boolean(item && typeof item === "object" && "category" in item && "answer" in item && typeof item.answer === "string" && item.answer.trim())) : [])
      setMyListings(listingResult.data || [])
    }).catch((error: unknown) => {
      if (active) console.error("Could not load profile preferences and listings:", error)
    }).finally(() => {
      if (active) {
        setPreferencesLoading(false)
        setListingsLoading(false)
      }
    })
    return () => { active = false }
  }, [user])

  function openEditor() {
    setDraft({ name: user?.name ?? "", university: user?.university ?? "", gender: user?.gender ?? "Other" })
    setEditError("")
    setIsEditing(true)
  }

  async function handleProfileSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = await updateProfile(draft)
    if (!result.ok) {
      setEditError(result.error || "Could not save your profile. Please try again.")
      return
    }
    setIsEditing(false)
    toast.success("Profile updated")
  }

  function openPreferencesEditor() {
    setPreferenceDraft(housingPreferences || {})
    setPreferenceError("")
    setIsEditingPreferences(true)
  }

  async function handlePreferencesSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !isSupabaseConfigured) {
      setPreferenceError("Sign in and configure Supabase to save preferences.")
      return
    }
    const cleaned = {
      ...preferenceDraft,
      districts: preferenceDraft.districts?.filter(Boolean) || [],
      dealBreakers: preferenceDraft.dealBreakers?.filter(Boolean) || [],
    }
    const hasPreferences = Boolean(
      cleaned.lookingFor || cleaned.budgetMin !== undefined || cleaned.budgetMax !== undefined ||
      cleaned.districts.length || cleaned.moveInDate || cleaned.leaseDuration || cleaned.roomType ||
      cleaned.roommateGender || cleaned.roommateAgeRange || cleaned.dealBreakers.length
    )
    const savedPreferences = hasPreferences ? cleaned : null
    setIsSavingPreferences(true)
    const { error } = await supabase.from("profiles").update({ housing_preferences: savedPreferences }).eq("id", user.id)
    setIsSavingPreferences(false)
    if (error) {
      setPreferenceError(error.message)
      return
    }
    setHousingPreferences(savedPreferences)
    setIsEditingPreferences(false)
    toast.success("Preferences saved")
  }

  async function publishDraft(listing: ListingRow) {
    if (!user || !isSupabaseConfigured) return
    const { error } = await supabase.from("roommate_listings").update({ is_published: true }).eq("id", listing.id).eq("owner_id", user.id)
    if (error) {
      toast.error("Could not publish your listing", { description: error.message })
      return
    }
    setMyListings((current) => current.map((item) => item.id === listing.id ? { ...item, is_published: true } : item))
    toast.success("Your listing is published")
  }

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
            <button type="button" onClick={() => selectTab("profile")} aria-current={activeTab === "profile" ? "page" : undefined} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm ${activeTab === "profile" ? "bg-muted font-medium text-primary" : "text-muted-foreground hover:bg-muted"}`}><UserRound className="size-4" /> My Profile</button>
            <button type="button" onClick={() => selectTab("preferences")} aria-current={activeTab === "preferences" ? "page" : undefined} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm ${activeTab === "preferences" ? "bg-muted font-medium text-primary" : "text-muted-foreground hover:bg-muted"}`}><Heart className="size-4" /> Preferences</button>
            <button type="button" onClick={() => selectTab("listings")} aria-current={activeTab === "listings" ? "page" : undefined} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm ${activeTab === "listings" ? "bg-muted font-medium text-primary" : "text-muted-foreground hover:bg-muted"}`}><Home className="size-4" /> My Listings</button>
            <button type="button" onClick={() => selectTab("privacy")} aria-current={activeTab === "privacy" ? "page" : undefined} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm ${activeTab === "privacy" ? "bg-muted font-medium text-primary" : "text-muted-foreground hover:bg-muted"}`}><ShieldCheck className="size-4" /> Privacy &amp; Verification</button>
            <button type="button" onClick={() => selectTab("account")} aria-current={activeTab === "account" ? "page" : undefined} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm ${activeTab === "account" ? "bg-muted font-medium text-primary" : "text-muted-foreground hover:bg-muted"}`}><LockKeyhole className="size-4" /> Account Settings</button>
          </nav>
          {user ? <button type="button" onClick={() => { void logout(); toast.success("Signed out successfully") }} className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:underline"><LogOut className="size-4" /> Log out</button> : <Link to="/sign-in" className="block px-3 py-2 text-sm text-primary hover:underline">Sign in</Link>}
        </aside>

        <div className="space-y-5">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-semibold tracking-wide text-primary">YOUR ACCOUNT</p><h1 className="mt-1 font-heading text-3xl">{activeTab === "preferences" ? "Preferences" : activeTab === "listings" ? "My Listings" : activeTab === "privacy" ? "Privacy & Verification" : activeTab === "account" ? "Account Settings" : "My Profile"}</h1><p className="mt-1 text-sm text-muted-foreground">{activeTab === "profile" ? "This is how other students can get to know you." : activeTab === "preferences" ? "Manage your housing needs and living style." : activeTab === "listings" ? "Manage your drafts and published room posts." : activeTab === "privacy" ? "Review your private contact details and verification status." : "Manage your account details and sign-in information."}</p></div>
            {activeTab === "profile" && <Button type="button" onClick={openEditor} className="rounded-full"><Pencil /> Edit profile</Button>}
          </header>

          {activeTab === "profile" && <>
          <SectionCard id="summary" title="Profile Summary" action={<EditLink onClick={openEditor} />}>
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
          </>}

          {activeTab === "privacy" && <>
          <SectionCard id="privacy" title="Contact Info & Privacy">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 rounded-lg bg-muted/55 p-3"><Mail className="size-4 text-primary" /><div className="min-w-0 flex-1"><p className="text-[10px] text-muted-foreground">Email address</p><p className="truncate text-sm">{user?.email || "Sign in to view your email"}</p></div><span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><Eye className="size-3" /> Private</span></div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/55 p-3"><LockKeyhole className="size-4 text-primary" /><div className="flex-1"><p className="text-[10px] text-muted-foreground">Phone number</p><p className="text-sm text-muted-foreground">Not added</p></div><span className="text-[10px] text-muted-foreground">Private</span></div>
            </div>
          </SectionCard>
          <p className="flex items-center gap-2 px-1 text-xs text-muted-foreground"><CircleHelp className="size-3.5" /> You control what information you share with other students.</p>
          </>}

          {activeTab === "account" && <SectionCard id="account" title="Account details" description="Your sign-in email is private and is not shown on public listings.">
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-muted/55 p-3"><Mail className="size-4 text-primary" /><div className="min-w-0 flex-1"><p className="text-[10px] text-muted-foreground">Sign-in email</p><p className="truncate text-sm">{user?.email || "Not signed in"}</p></div><LockKeyhole className="size-4 text-muted-foreground" /></div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/55 p-3"><div><p className="text-sm font-medium">Profile information</p><p className="mt-1 text-xs text-muted-foreground">Update your name, university, or gender.</p></div><Button type="button" variant="outline" size="sm" onClick={openEditor}><Pencil /> Edit profile</Button></div>
              {user && <Button type="button" variant="outline" onClick={() => { void logout(); toast.success("Signed out successfully") }}><LogOut /> Log out</Button>}
            </div>
          </SectionCard>}

          {activeTab === "preferences" && <>
          <SectionCard id="preferences" title="Preferences" description="Housing, roommate, and lifestyle details only appear here after you provide them." action={<Button type="button" size="sm" variant="outline" onClick={openPreferencesEditor}><Pencil /> {housingPreferences ? "Edit housing" : "Add housing"}</Button>}>
            {preferencesLoading ? <p className="text-sm text-muted-foreground">Loading your preferences…</p> : <div className="space-y-5">
              {housingPreferences && hasHousingNeeds && <div className="rounded-xl bg-muted/50 p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Home className="size-4 text-primary" /> Housing needs</h3>
                <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  {housingPreferences.lookingFor && <div><p className="text-xs text-muted-foreground">Looking for</p><p className="mt-1">{housingPreferences.lookingFor}</p></div>}
                  {(housingPreferences.budgetMin !== undefined || housingPreferences.budgetMax !== undefined) && <div><p className="text-xs text-muted-foreground">Monthly budget</p><p className="mt-1">${housingPreferences.budgetMin ?? 0}–${housingPreferences.budgetMax ?? "Any"}</p></div>}
                  {!!housingPreferences.districts?.length && <div><p className="text-xs text-muted-foreground">Preferred districts</p><p className="mt-1">{housingPreferences.districts.join(", ")}</p></div>}
                  {housingPreferences.moveInDate && <div><p className="text-xs text-muted-foreground">Move-in date</p><p className="mt-1 flex items-center gap-1"><CalendarDays className="size-3.5 text-primary" /> {housingPreferences.moveInDate}</p></div>}
                  {housingPreferences.leaseDuration && <div><p className="text-xs text-muted-foreground">Lease duration</p><p className="mt-1">{housingPreferences.leaseDuration}</p></div>}
                  {housingPreferences.roomType && <div><p className="text-xs text-muted-foreground">Room type</p><p className="mt-1">{housingPreferences.roomType}</p></div>}
                </div>
              </div>}
              {housingPreferences && hasRoommatePreferences && <div className="rounded-xl bg-muted/50 p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Heart className="size-4 text-primary" /> Roommate preferences</h3>
                <div className="space-y-2 text-sm">
                  {(housingPreferences.roommateGender || housingPreferences.roommateAgeRange) && <p>{[housingPreferences.roommateGender, housingPreferences.roommateAgeRange].filter(Boolean).join(" · ")}</p>}
                  {!!housingPreferences.dealBreakers?.length && <p className="text-muted-foreground">Deal-breakers: {housingPreferences.dealBreakers.join(", ")}</p>}
                </div>
              </div>}
              {!!lifestyleAnswers.length && <div className="rounded-xl bg-muted/50 p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Moon className="size-4 text-primary" /> Lifestyle and habits</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {lifestyleAnswers.map((item) => <div key={item.category} className="rounded-lg bg-card p-3"><p className="text-xs text-muted-foreground">{item.category}</p><p className="mt-1 text-sm font-medium">{item.answer}</p>{item.subAnswer && <p className="mt-1 text-xs text-muted-foreground">{item.subAnswer}</p>}</div>)}
                </div>
              </div>}
              {!housingPreferences && !lifestyleAnswers.length && <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">You haven’t added housing, roommate, or lifestyle preferences yet. They’ll show here after you add them.</div>}
            </div>}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={openPreferencesEditor}><Plus /> Housing preferences</Button>
              {!lifestyleAnswers.length && <Button nativeButton={false} render={<Link to="/compatibility-test" />} variant="outline" size="sm"><Plus /> Living style quiz</Button>}
            </div>
          </SectionCard>
          </>}

          {activeTab === "listings" && <>
          <SectionCard id="listings" title="My listings" description="Create a room-seeker or available-room post, preview it, then publish it." action={<Button nativeButton={false} render={<Link to="/rooms/new" />} size="sm"><Plus /> Create listing</Button>}>
            {listingsLoading ? <p className="text-sm text-muted-foreground">Loading your listings…</p> : myListings.length ? <div className="space-y-2">{myListings.map((listing) => <div key={listing.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/50 p-4"><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{listing.name}</p><p className="mt-1 text-xs text-muted-foreground">{listing.badge_label} · {listing.location}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${listing.is_published ? "bg-sage/40 text-sage-foreground" : "bg-accent text-primary"}`}>{listing.is_published ? "Published" : "Draft"}</span>{!listing.is_published && <Button type="button" size="sm" onClick={() => void publishDraft(listing)}><Check /> Publish</Button>}</div>)}</div> : <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">You haven’t published a listing yet. Create a post if you’re looking for a room or have a place available.</div>}
          </SectionCard>
          </>}
        </div>
      </div>
      {isEditing && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-foreground/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmitting) setIsEditing(false) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" className="my-auto w-full max-w-lg rounded-2xl border border-border/50 bg-card p-6 shadow-2xl">
            <div className="mb-5">
              <h2 id="edit-profile-title" className="font-heading text-2xl">Edit profile</h2>
              <p className="mt-1 text-sm text-muted-foreground">Update the details shown on your RoomieMatch profile.</p>
            </div>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <label className="block space-y-1.5 text-sm font-medium">Full name
                <Input autoFocus required maxLength={80} value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className="h-10" />
              </label>
              <label className="block space-y-1.5 text-sm font-medium">University
                <Input required maxLength={120} value={draft.university} onChange={(event) => setDraft((current) => ({ ...current, university: event.target.value }))} className="h-10" />
              </label>
              <label className="block space-y-1.5 text-sm font-medium">Gender
                <select value={draft.gender} onChange={(event) => setDraft((current) => ({ ...current, gender: event.target.value }))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </label>
              {editError && <p role="alert" className="text-sm text-destructive">{editError}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
                  {isSubmitting ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
      {isEditingPreferences && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-foreground/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsEditingPreferences(false) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="edit-preferences-title" className="my-auto w-full max-w-2xl rounded-2xl border border-border/50 bg-card p-6 shadow-2xl">
            <div className="mb-5"><h2 id="edit-preferences-title" className="font-heading text-2xl">Housing preferences</h2><p className="mt-1 text-sm text-muted-foreground">Tell people what you’re looking for. Leave any field blank to keep it private.</p></div>
            <form onSubmit={handlePreferencesSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-medium">Looking for
                  <select value={preferenceDraft.lookingFor || ""} onChange={(event) => setPreferenceDraft((current) => ({ ...current, lookingFor: event.target.value }))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">Choose one</option><option>A room</option><option>A roommate</option><option>A place to share</option></select>
                </label>
                <label className="space-y-1.5 text-sm font-medium">Room type
                  <select value={preferenceDraft.roomType || ""} onChange={(event) => setPreferenceDraft((current) => ({ ...current, roomType: event.target.value }))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">No preference</option><option>Private room</option><option>Shared room</option><option>Entire place</option></select>
                </label>
                <label className="space-y-1.5 text-sm font-medium">Minimum monthly budget ($)
                  <Input type="number" min="0" value={preferenceDraft.budgetMin ?? ""} onChange={(event) => setPreferenceDraft((current) => ({ ...current, budgetMin: event.target.value ? Number(event.target.value) : undefined }))} className="h-10" />
                </label>
                <label className="space-y-1.5 text-sm font-medium">Maximum monthly budget ($)
                  <Input type="number" min="0" value={preferenceDraft.budgetMax ?? ""} onChange={(event) => setPreferenceDraft((current) => ({ ...current, budgetMax: event.target.value ? Number(event.target.value) : undefined }))} className="h-10" />
                </label>
                <label className="space-y-1.5 text-sm font-medium">Preferred districts (comma separated)
                  <Input value={preferenceDraft.districts?.join(", ") || ""} onChange={(event) => setPreferenceDraft((current) => ({ ...current, districts: event.target.value.split(",").map((part) => part.trim()).filter(Boolean) }))} className="h-10" placeholder="Toul Kork, BKK1" />
                </label>
                <label className="space-y-1.5 text-sm font-medium">Move-in date
                  <Input type="date" value={preferenceDraft.moveInDate || ""} onChange={(event) => setPreferenceDraft((current) => ({ ...current, moveInDate: event.target.value }))} className="h-10" />
                </label>
                <label className="space-y-1.5 text-sm font-medium">Lease duration
                  <select value={preferenceDraft.leaseDuration || ""} onChange={(event) => setPreferenceDraft((current) => ({ ...current, leaseDuration: event.target.value }))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">No preference</option><option>6 months</option><option>12 months</option><option>Flexible</option></select>
                </label>
                <label className="space-y-1.5 text-sm font-medium">Preferred roommate
                  <select value={preferenceDraft.roommateGender || ""} onChange={(event) => setPreferenceDraft((current) => ({ ...current, roommateGender: event.target.value }))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">Any gender</option><option>Women</option><option>Men</option><option>Any gender</option></select>
                </label>
                <label className="space-y-1.5 text-sm font-medium">Preferred age range
                  <Input value={preferenceDraft.roommateAgeRange || ""} onChange={(event) => setPreferenceDraft((current) => ({ ...current, roommateAgeRange: event.target.value }))} className="h-10" placeholder="e.g. 20–30" />
                </label>
                <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Deal-breakers (comma separated)
                  <Input value={preferenceDraft.dealBreakers?.join(", ") || ""} onChange={(event) => setPreferenceDraft((current) => ({ ...current, dealBreakers: event.target.value.split(",").map((part) => part.trim()).filter(Boolean) }))} className="h-10" placeholder="Smoking, loud guests" />
                </label>
              </div>
              {preferenceError && <p role="alert" className="text-sm text-destructive">{preferenceError}</p>}
              <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" disabled={isSavingPreferences} onClick={() => setIsEditingPreferences(false)}>Cancel</Button><Button type="submit" disabled={isSavingPreferences}>{isSavingPreferences && <LoaderCircle className="size-4 animate-spin" />}{isSavingPreferences ? "Saving…" : "Save preferences"}</Button></div>
            </form>
          </section>
        </div>
      )}
    </Container>
  )
}
