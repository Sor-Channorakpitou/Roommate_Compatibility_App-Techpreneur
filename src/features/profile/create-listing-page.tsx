import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, Home, LoaderCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Container } from "@/components/layout/container"
import { useAuth } from "@/context/auth-context"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"

type PostType = "roommate" | "has_room" | "place"

const POST_TYPES: { value: PostType; title: string; description: string }[] = [
  { value: "roommate", title: "I’m looking for a room", description: "Introduce yourself and find a place or roommates." },
  { value: "has_room", title: "I have a room available", description: "Find a compatible person to join your home." },
  { value: "place", title: "I have a place to share", description: "Post a flat or home that is available to share." },
]

const AREAS = [
  ["bkk", "BKK 1 & BKK 2"],
  ["daun-penh", "Daun Penh / Riverside"],
  ["russian-market", "Toul Tom Poung (Russian Market)"],
  ["toul-kork", "Toul Kork"],
] as const

const HOUSING_TYPES = [
  ["private-bath", "Private room"],
  ["room-available", "Room in shared home"],
  ["entire-flat", "Entire place to share"],
] as const

export function CreateListingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [type, setType] = React.useState<PostType>("roommate")
  const [name, setName] = React.useState(user?.name || "")
  const [details, setDetails] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [area, setArea] = React.useState<(typeof AREAS)[number][0] | "">("")
  const [housingType, setHousingType] = React.useState<(typeof HOUSING_TYPES)[number][0] | "">("")
  const [priceMin, setPriceMin] = React.useState("")
  const [priceMax, setPriceMax] = React.useState("")
  const [availableDate, setAvailableDate] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [tags, setTags] = React.useState("")
  const [isPreview, setIsPreview] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState("")
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (user && !name) setName(user.name)
  }, [user, name])

  async function saveListing(isPublished: boolean) {
    if (!user) {
      navigate("/sign-in", { state: { from: "/rooms/new" } })
      return
    }
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured. Add your Supabase URL and public key before publishing.")
      return
    }
    setIsSaving(true)
    setError("")
    const label = type === "roommate" ? "ROOM SEEKER" : type === "has_room" ? "ROOM AVAILABLE" : "PLACE AVAILABLE"
    const { error: saveError } = await supabase.from("roommate_listings").insert({
      id: crypto.randomUUID(),
      owner_id: user.id,
      owner_name: user.name,
      is_published: isPublished,
      type,
      badge_label: label,
      name: name.trim(),
      age: null,
      match_score: null,
      price_min: Number(priceMin),
      price_max: Number(priceMax),
      subtitle: details.trim(),
      location: location.trim(),
      available_date: availableDate,
      quote: bio.trim() || details.trim(),
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      housing_type: housingType,
      area_category: area,
      lifestyle_rhythms: [],
      move_in_horizon: "anytime",
      bio: bio.trim() || null,
      habit_comparisons: [],
      breakdown: [],
    })
    setIsSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }
    toast.success(isPublished ? "Your listing is published" : "Draft saved")
    navigate("/profile#listings")
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isPreview) {
      setIsPreview(true)
      return
    }
    void saveListing(true)
  }

  return (
    <Container className="max-w-4xl py-8 sm:py-12">
      <Link to="/profile" className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Back to profile</Link>
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Create a post</p>
        <h1 className="mt-1 font-heading text-3xl sm:text-4xl">{isPreview ? "Preview your listing" : "Find your next roommate"}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Choose what you’re offering or looking for. Review your post before it goes live.</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {!isPreview ? <>
          <section className="rounded-2xl border border-border/45 bg-card p-5 shadow-sm sm:p-6">
            <h2 className="mb-3 font-heading text-xl">What would you like to post?</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {POST_TYPES.map((option) => <button type="button" key={option.value} onClick={() => setType(option.value)} className={`rounded-xl border p-4 text-left transition-colors ${type === option.value ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border hover:border-primary/40"}`}><Home className="mb-3 size-5 text-primary" /><span className="block text-sm font-semibold">{option.title}</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{option.description}</span></button>)}
            </div>
          </section>
          <section className="grid gap-4 rounded-2xl border border-border/45 bg-card p-5 shadow-sm sm:grid-cols-2 sm:p-6">
            <label className="space-y-1.5 text-sm font-medium">{type === "roommate" ? "Your name" : "Listing title"}<Input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className="h-10" placeholder={type === "roommate" ? "Your name" : "Sunny room near campus"} /></label>
            <label className="space-y-1.5 text-sm font-medium">Short description<Input required maxLength={140} value={details} onChange={(event) => setDetails(event.target.value)} className="h-10" placeholder="Seeking one roommate for a shared apartment" /></label>
            <label className="space-y-1.5 text-sm font-medium">District
              <select required value={area} onChange={(event) => setArea(event.target.value as typeof area)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">Choose a district</option>{AREAS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">Neighborhood / location<Input required maxLength={100} value={location} onChange={(event) => setLocation(event.target.value)} className="h-10" placeholder="Toul Kork" /></label>
            <label className="space-y-1.5 text-sm font-medium">Room or housing type
              <select required value={housingType} onChange={(event) => setHousingType(event.target.value as typeof housingType)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">Choose one</option>{HOUSING_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">Available from<Input required type="date" value={availableDate} onChange={(event) => setAvailableDate(event.target.value)} className="h-10" /></label>
            <label className="space-y-1.5 text-sm font-medium">Minimum monthly budget ($)<Input required type="number" min="0" value={priceMin} onChange={(event) => setPriceMin(event.target.value)} className="h-10" /></label>
            <label className="space-y-1.5 text-sm font-medium">Maximum monthly budget ($)<Input required type="number" min={priceMin || "0"} value={priceMax} onChange={(event) => setPriceMax(event.target.value)} className="h-10" /></label>
            <label className="space-y-1.5 text-sm font-medium sm:col-span-2">About this post<textarea required maxLength={800} value={bio} onChange={(event) => setBio(event.target.value)} className="min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" placeholder="Share what makes this a good fit and what kind of roommate or place you hope to find." /></label>
            <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Lifestyle tags (comma separated, optional)<Input value={tags} onChange={(event) => setTags(event.target.value)} className="h-10" placeholder="Early bird, quiet hours, non-smoker" /></label>
          </section>
        </> : <section className="overflow-hidden rounded-2xl border border-border/45 bg-card shadow-sm">
          <div className="bg-accent/60 p-6 sm:p-8"><span className="rounded-full bg-card px-3 py-1 text-[11px] font-semibold tracking-wide text-primary">{type === "roommate" ? "ROOM SEEKER" : type === "has_room" ? "ROOM AVAILABLE" : "PLACE AVAILABLE"}</span><h2 className="mt-3 font-heading text-2xl">{name}</h2><p className="mt-1 text-sm text-muted-foreground">{details}</p></div>
          <div className="space-y-4 p-6 sm:p-8"><div className="flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-muted px-3 py-1">{location}</span><span className="rounded-full bg-muted px-3 py-1">{HOUSING_TYPES.find(([value]) => value === housingType)?.[1]}</span><span className="rounded-full bg-muted px-3 py-1">${priceMin}–${priceMax}/mo</span><span className="rounded-full bg-muted px-3 py-1">Available {availableDate}</span></div><p className="whitespace-pre-wrap text-sm leading-relaxed">{bio}</p>{tags.trim() && <div className="flex flex-wrap gap-2">{tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs">{tag}</span>)}</div>}</div>
        </section>}

        {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        <div className="flex flex-wrap justify-between gap-3">
          {isPreview ? <Button type="button" variant="outline" onClick={() => setIsPreview(false)}><ArrowLeft /> Edit listing</Button> : <Button nativeButton={false} render={<Link to="/profile" />} variant="outline">Cancel</Button>}
          <div className="flex gap-2">
            {!isPreview && <Button type="button" variant="outline" disabled={isSaving} onClick={() => { if (formRef.current?.reportValidity()) void saveListing(false) }}>Save draft</Button>}
            <Button type="submit" disabled={isSaving}>{isSaving ? <LoaderCircle className="animate-spin" /> : isPreview ? <CheckCircle2 /> : <Eye />}{isPreview ? (isSaving ? "Publishing…" : "Publish listing") : "Preview listing"}{!isPreview && <ArrowRight />}</Button>
          </div>
        </div>
        {!user && <p className="text-center text-xs text-muted-foreground">You’ll be asked to sign in before your post is saved.</p>}
      </form>
    </Container>
  )
}
