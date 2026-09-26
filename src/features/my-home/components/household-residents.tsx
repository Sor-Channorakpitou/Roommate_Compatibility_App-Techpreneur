import { Link } from "react-router-dom"
import { Clock, Sparkles, UserMinus } from "lucide-react"

import type { HouseholdResident } from "../types"

type HouseholdResidentsProps = {
  residents: HouseholdResident[]
  onRemoveInvitee: (resident: HouseholdResident) => void
  isSaving: boolean
}

export function HouseholdResidents({
  residents,
  onRemoveInvitee,
  isSaving,
}: HouseholdResidentsProps) {
  const invitedCount = residents.filter((r) => r.status === "invited").length

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
          {invitedCount > 0 ? `You + ${invitedCount} invited` : "Just you so far"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {residents.map((resident) => (
          <article
            key={resident.id}
            className="flex flex-col justify-between rounded-2xl border border-[#e8dfd8] bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div>
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-full text-base font-bold select-none ${
                    resident.isCurrentUser
                      ? "bg-[#fce5dc] text-[#9c4220]"
                      : "bg-[#d8edd9] text-[#276e33]"
                  }`}
                >
                  {resident.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-sans text-base font-bold text-foreground sm:text-lg">
                      {resident.name}
                    </h3>

                    {resident.isCurrentUser ? (
                      <span className="rounded-full bg-[#f0ebe5] px-2.5 py-0.5 text-xs font-medium text-[#6e625a]">
                        Your Profile
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-xs font-semibold text-[#78350f]">
                        <Clock className="size-3" aria-hidden="true" />
                        Invited
                      </span>
                    )}
                  </div>

                  <p className="truncate text-sm text-muted-foreground">
                    {resident.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <p className="text-[11px] font-bold tracking-wider text-[#8b7a70] uppercase">
                  {resident.preferencesHeader}
                </p>

                {resident.preferences.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {resident.preferences.map((pref) => (
                      <span
                        key={pref}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#ebe2d8] bg-[#f8f4ef] px-3 py-1.5 text-xs font-medium text-[#55433a]"
                      >
                        {resident.isCurrentUser && (
                          <Sparkles className="size-3.5 text-[#8c7e77]" aria-hidden="true" />
                        )}
                        {pref}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Take the compatibility quiz so roommates can see your habits.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#f0ebe5] pt-4">
              {resident.isCurrentUser ? (
                <>
                  <Link
                    to="/profile"
                    className="group inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    <span>View full profile</span>
                    <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                      →
                    </span>
                  </Link>
                  <Link
                    to="/compatibility-test"
                    className="rounded-full border border-[#d6cbbe] px-4 py-1.5 text-xs font-medium text-[#4a3b34] transition-colors hover:bg-[#f6efe8]"
                  >
                    {resident.preferences.length > 0 ? "Retake quiz" : "Take quiz"}
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-xs text-muted-foreground">
                    Waiting for them to join
                  </span>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => onRemoveInvitee(resident)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#d6cbbe] px-4 py-1.5 text-xs font-medium text-[#4a3b34] transition-colors hover:bg-[#f6efe8] disabled:opacity-50"
                  >
                    <UserMinus className="size-3.5" aria-hidden="true" />
                    Remove invite
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
