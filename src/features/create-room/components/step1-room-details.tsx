import { Bookmark, ChevronDown, Home, Lock, MapPin, Minus, Plus, Rocket, Users } from "lucide-react"
import { cn } from "cn"
import type { CreateRoomFormData } from "../types"

type Step1RoomDetailsProps = {
  formData: CreateRoomFormData
  onChange: (updates: Partial<CreateRoomFormData>) => void
  onNext: () => void
  onCreateRoom?: () => void
  onSaveDraft: () => void
}

const DISTRICT_OPTIONS = [
  "Toul Kork, Phnom Penh",
  "Chamkarmon / BKK1, Phnom Penh",
  "Daun Penh, Phnom Penh",
  "Sen Sok, Phnom Penh",
  "Chroy Changvar, Phnom Penh",
  "Boeung Keng Kang, Phnom Penh",
  "Russey Keo, Phnom Penh",
  "Tuol Kouk, Phnom Penh",
]

export function Step1RoomDetails({
  formData,
  onChange,
  onNext,
  onCreateRoom,
  onSaveDraft,
}: Step1RoomDetailsProps) {
  const rentPerPerson = formData.householdMembers > 0
    ? Math.round(formData.monthlyRent / formData.householdMembers)
    : formData.monthlyRent

  return (
    <section aria-label="Step 1: Room details" className="rounded-3xl border border-[#e8dfd8] bg-white p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f0e8e0] pb-6">
        <div className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#7a3418] text-sm font-bold text-white shadow-2xs">
            1
          </span>
          <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground sm:text-[1.65rem]">
            Step 1: Room details
          </h2>
        </div>
        <span className="rounded-full bg-[#d7ecd8] px-3 py-1 text-xs font-semibold text-[#276e33]">
          Active Step
        </span>
      </div>

      {/* Form Fields */}
      <div className="mt-6 space-y-6">
        {/* Home or Apartment Name */}
        <div className="space-y-1.5">
          <label htmlFor="room-name" className="text-sm font-semibold text-[#221c19]">
            Home or Apartment Name
          </label>
          <div className="relative flex items-center">
            <input
              id="room-name"
              type="text"
              value={formData.roomName}
              onChange={(e) => onChange({ roomName: e.target.value })}
              placeholder="e.g. Sunflower Sanctuary"
              className="w-full rounded-xl border border-[#ebe3da] bg-[#f4efe8] py-3 pr-10 pl-4 text-sm text-[#1c1c18] transition-colors placeholder:text-muted-foreground/60 focus:border-[#7a3418] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7a3418]"
            />
            <Home className="pointer-events-none absolute right-3.5 size-4.5 text-muted-foreground/70" />
          </div>
          <p className="text-xs text-muted-foreground">
            A cozy, memorable title that your future roommates will identify with.
          </p>
        </div>

        {/* District & Landmark Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* District / Sangkat */}
          <div className="space-y-1.5">
            <label htmlFor="district-select" className="text-sm font-semibold text-[#221c19]">
              District / Sangkat
            </label>
            <div className="relative flex items-center">
              <select
                id="district-select"
                value={formData.district}
                onChange={(e) => onChange({ district: e.target.value })}
                className="w-full appearance-none rounded-xl border border-[#ebe3da] bg-[#f4efe8] py-3 pr-10 pl-4 text-sm text-[#1c1c18] transition-colors focus:border-[#7a3418] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7a3418]"
              >
                {DISTRICT_OPTIONS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 size-4.5 text-muted-foreground/70" />
            </div>
          </div>

          {/* Street or Landmark */}
          <div className="space-y-1.5">
            <label htmlFor="landmark-input" className="text-sm font-semibold text-[#221c19]">
              Street or Landmark
            </label>
            <div className="relative flex items-center">
              <input
                id="landmark-input"
                type="text"
                value={formData.landmark}
                onChange={(e) => onChange({ landmark: e.target.value })}
                placeholder="e.g. St 315, near TK Avenue"
                className="w-full rounded-xl border border-[#ebe3da] bg-[#f4efe8] py-3 pr-10 pl-4 text-sm text-[#1c1c18] transition-colors placeholder:text-muted-foreground/60 focus:border-[#7a3418] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7a3418]"
              />
              <MapPin className="pointer-events-none absolute right-3.5 size-4.5 text-muted-foreground/70" />
            </div>
          </div>
        </div>

        {/* Rent, Move-in, Lease End Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Monthly Rent */}
          <div className="space-y-1.5">
            <label htmlFor="rent-input" className="text-sm font-semibold text-[#221c19]">
              Total Monthly Rent (USD)
            </label>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-3.5 text-sm font-medium text-[#7a3418]">
                $
              </span>
              <input
                id="rent-input"
                type="number"
                min="50"
                step="10"
                value={formData.monthlyRent}
                onChange={(e) => onChange({ monthlyRent: Number(e.target.value) || 0 })}
                className="w-full rounded-xl border border-[#ebe3da] bg-[#f4efe8] py-3 pr-3 pl-8 text-sm text-[#1c1c18] transition-colors focus:border-[#7a3418] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7a3418]"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Split evenly is ${rentPerPerson}/p
            </p>
          </div>

          {/* Move-in Date */}
          <div className="space-y-1.5">
            <label htmlFor="move-in-input" className="text-sm font-semibold text-[#221c19]">
              Move-in Date
            </label>
            <input
              id="move-in-input"
              type="text"
              value={formData.moveInDate}
              onChange={(e) => onChange({ moveInDate: e.target.value })}
              placeholder="MM/DD/YYYY"
              className="w-full rounded-xl border border-[#ebe3da] bg-[#f4efe8] py-3 px-4 text-sm text-[#1c1c18] transition-colors placeholder:text-muted-foreground/60 focus:border-[#7a3418] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7a3418]"
            />
          </div>

          {/* Lease End Date */}
          <div className="space-y-1.5">
            <label htmlFor="lease-end-input" className="text-sm font-semibold text-[#221c19]">
              Lease End Date
            </label>
            <input
              id="lease-end-input"
              type="text"
              value={formData.leaseEndDate}
              onChange={(e) => onChange({ leaseEndDate: e.target.value })}
              placeholder="MM/DD/YYYY"
              className="w-full rounded-xl border border-[#ebe3da] bg-[#f4efe8] py-3 px-4 text-sm text-[#1c1c18] transition-colors placeholder:text-muted-foreground/60 focus:border-[#7a3418] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7a3418]"
            />
          </div>
        </div>

        {/* Room Arrangement Type */}
        <div className="space-y-2.5">
          <label className="text-sm font-semibold text-[#221c19]">
            Room Arrangement Type
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Private rooms option */}
            <button
              type="button"
              onClick={() => onChange({ arrangementType: "private" })}
              className={cn(
                "flex flex-col items-start rounded-2xl p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7a3418]",
                formData.arrangementType === "private"
                  ? "border-2 border-[#7a3418] bg-[#fcf8f4] shadow-xs"
                  : "border border-[#ebe3da] bg-white hover:border-[#d9cbbe]"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border transition-colors",
                    formData.arrangementType === "private"
                      ? "border-[#7a3418] bg-white"
                      : "border-[#c4b5a6]"
                  )}
                >
                  {formData.arrangementType === "private" && (
                    <span className="size-2.5 rounded-full bg-[#7a3418]" />
                  )}
                </span>
                <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                  Private rooms
                  <Lock className="size-3.5 text-[#7a3418]" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-2.5 pl-7 text-xs leading-relaxed text-muted-foreground">
                Each roommate has an individual private bedroom, sharing common areas like kitchen & living room.
              </p>
            </button>

            {/* Shared room option */}
            <button
              type="button"
              onClick={() => onChange({ arrangementType: "shared" })}
              className={cn(
                "flex flex-col items-start rounded-2xl p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7a3418]",
                formData.arrangementType === "shared"
                  ? "border-2 border-[#7a3418] bg-[#fcf8f4] shadow-xs"
                  : "border border-[#ebe3da] bg-white hover:border-[#d9cbbe]"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border transition-colors",
                    formData.arrangementType === "shared"
                      ? "border-[#7a3418] bg-white"
                      : "border-[#c4b5a6]"
                  )}
                >
                  {formData.arrangementType === "shared" && (
                    <span className="size-2.5 rounded-full bg-[#7a3418]" />
                  )}
                </span>
                <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                  Shared room
                  <Users className="size-3.5 text-muted-foreground" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-2.5 pl-7 text-xs leading-relaxed text-muted-foreground">
                Roommates share the same master bedroom studio or twin room setups for maximum budget efficiency.
              </p>
            </button>
          </div>
        </div>

        {/* Total household members counter */}
        <div className="flex flex-col gap-3 border-t border-[#f0e8e0] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#221c19]">
              Total household members
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Including yourself. You can add or reassign slots anytime.
            </p>
          </div>

          <div className="flex items-center self-start sm:self-center">
            <div className="inline-flex items-center rounded-full border border-[#ded5cb] bg-[#f4efe8] p-1 shadow-2xs">
              <button
                type="button"
                aria-label="Decrease household members"
                disabled={formData.householdMembers <= 1}
                onClick={() =>
                  onChange({
                    householdMembers: Math.max(1, formData.householdMembers - 1),
                  })
                }
                className="flex size-7 items-center justify-center rounded-full text-foreground transition-colors hover:bg-[#eae3db] disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-9 text-center text-sm font-bold text-foreground">
                {formData.householdMembers}
              </span>
              <button
                type="button"
                aria-label="Increase household members"
                disabled={formData.householdMembers >= 8}
                onClick={() =>
                  onChange({
                    householdMembers: Math.min(8, formData.householdMembers + 1),
                  })
                }
                className="flex size-7 items-center justify-center rounded-full text-foreground transition-colors hover:bg-[#eae3db] disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-[#f0e8e0] pt-6">
        <button
          type="button"
          onClick={onSaveDraft}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#55433c] transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7a3418]"
        >
          <Bookmark className="size-4" />
          Save draft
        </button>

        <button
          type="button"
          onClick={onCreateRoom || onNext}
          className="inline-flex items-center gap-2.5 rounded-full bg-[#7a3418] px-7 py-3.5 text-sm font-medium text-white shadow-xs transition-transform hover:bg-[#682c14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7a3418] focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          <Rocket className="size-4.5" aria-hidden="true" />
          <span>Create room & Open My Home</span>
        </button>
      </div>
    </section>
  )
}
