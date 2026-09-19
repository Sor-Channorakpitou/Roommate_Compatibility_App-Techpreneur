import {
  Calendar,
  Check,
  MessageSquare,
  Moon,
  Snowflake,
  Sparkles,
  Users,
  VolumeX,
} from "lucide-react"

import type { HouseholdResident, LivingPreference } from "../types"

type HouseholdResidentsProps = {
  residents: HouseholdResident[]
  onViewProfile: (resident: HouseholdResident) => void
  onEditPreferences: () => void
  onMessageResident: (resident: HouseholdResident) => void
}

function PreferenceIcon({ name }: { name: LivingPreference["iconName"] }) {
  switch (name) {
    case "moon":
      return <Moon className="size-3.5 text-[#8c7e77]" aria-hidden="true" />
    case "sparkles":
      return <Sparkles className="size-3.5 text-[#8c7e77]" aria-hidden="true" />
    case "users":
      return <Users className="size-3.5 text-[#8c7e77]" aria-hidden="true" />
    case "volume-x":
      return <VolumeX className="size-3.5 text-[#8c7e77]" aria-hidden="true" />
    case "snowflake":
      return <Snowflake className="size-3.5 text-[#8c7e77]" aria-hidden="true" />
    case "calendar":
      return <Calendar className="size-3.5 text-[#8c7e77]" aria-hidden="true" />
    default:
      return null
  }
}

export function HouseholdResidents({
  residents,
  onViewProfile,
  onEditPreferences,
  onMessageResident,
}: HouseholdResidentsProps) {
  return (
    <section aria-labelledby="residents-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2
          id="residents-heading"
          className="font-heading text-2xl font-medium tracking-tight text-foreground"
        >
          Household Residents
        </h2>
        <span className="text-xs font-medium text-muted-foreground sm:text-sm">
          {residents.length} Verified Profiles
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {residents.map((resident) => (
          <article
            key={resident.id}
            className="flex flex-col justify-between rounded-2xl border border-[#e8dfd8] bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div>
              {/* Resident Header */}
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-full text-base font-bold select-none ${resident.avatarBg} ${resident.avatarTextColor}`}
                >
                  {resident.avatarInitials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-sans text-base font-bold text-foreground sm:text-lg">
                      {resident.name}, {resident.age}
                    </h3>

                    {resident.isCurrentUser ? (
                      <span className="rounded-full bg-[#f0ebe5] px-2.5 py-0.5 text-xs font-medium text-[#6e625a]">
                        Your Profile
                      </span>
                    ) : resident.matchScore ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#e2f3e4] px-2.5 py-0.5 text-xs font-semibold text-[#276e33]">
                        <Check className="size-3" aria-hidden="true" />
                        {resident.matchScore}% match
                      </span>
                    ) : null}
                  </div>

                  <p className="truncate text-sm text-muted-foreground">
                    {resident.occupation}
                  </p>
                </div>
              </div>

              {/* Preferences / Shared Alignment */}
              <div className="mt-5 space-y-2.5">
                <p className="text-[11px] font-bold tracking-wider text-[#8b7a70] uppercase">
                  {resident.preferencesHeader}
                </p>

                <div className="flex flex-wrap gap-2">
                  {resident.preferences.map((pref) => (
                    <span
                      key={pref.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#ebe2d8] bg-[#f8f4ef] px-3 py-1.5 text-xs font-medium text-[#55433a] transition-colors hover:bg-[#f1ebe3]"
                    >
                      <PreferenceIcon name={pref.iconName} />
                      {pref.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="mt-6 flex items-center justify-between border-t border-[#f0ebe5] pt-4">
              <button
                type="button"
                onClick={() => onViewProfile(resident)}
                className="group inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none"
              >
                <span>View full profile</span>
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                  →
                </span>
              </button>

              {resident.isCurrentUser ? (
                <button
                  type="button"
                  onClick={onEditPreferences}
                  className="rounded-full border border-[#d6cbbe] px-4 py-1.5 text-xs font-medium text-[#4a3b34] transition-colors hover:bg-[#f6efe8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-98"
                >
                  Edit Preferences
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onMessageResident(resident)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#7a3418] px-4 py-1.5 text-xs font-medium text-[#7a3418] transition-colors hover:bg-[#faece6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7a3418] active:scale-98"
                >
                  <MessageSquare className="size-3.5" aria-hidden="true" />
                  Message
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
