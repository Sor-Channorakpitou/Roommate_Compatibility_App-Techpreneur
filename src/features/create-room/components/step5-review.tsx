import * as React from "react"
import { ArrowLeft, Check, CheckCircle2, MapPin, Moon, Users } from "lucide-react"
import type { CreateRoomFormData } from "../types"

type Step5ReviewProps = {
  formData: CreateRoomFormData
  onBack: () => void
  onPublish: () => void
  isSubmitting?: boolean
}

export function Step5Review({
  formData,
  onBack,
  onPublish,
  isSubmitting = false,
}: Step5ReviewProps) {
  const [agreed, setAgreed] = React.useState(true)
  const rentPerPerson = Math.round(formData.monthlyRent / Math.max(1, formData.householdMembers))

  return (
    <section aria-label="Step 5: Review & Publish" className="rounded-3xl border border-[#e8dfd8] bg-white p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f0e8e0] pb-6">
        <div className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#7a3418] text-sm font-bold text-white shadow-2xs">
            5
          </span>
          <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground sm:text-[1.65rem]">
            Step 5: Review & Publish
          </h2>
        </div>
        <span className="rounded-full bg-[#d7ecd8] px-3 py-1 text-xs font-semibold text-[#276e33]">
          Final Step
        </span>
      </div>

      <div className="mt-6 space-y-6">
        {/* Summary Card */}
        <div className="rounded-2xl border border-[#ebe3da] bg-[#fbf8f4] p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9c4220]">
                Room Summary
              </span>
              <h3 className="font-serif text-2xl font-medium text-foreground mt-0.5">
                {formData.roomName || "Sunflower Sanctuary"}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5 text-[#7a3418]" />
                <span>{formData.district} · {formData.landmark}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-muted-foreground">Total Rent</span>
              <div className="font-serif text-2xl font-bold text-[#7a3418]">
                ${formData.monthlyRent}
                <span className="text-xs font-normal text-muted-foreground">/mo</span>
              </div>
              <span className="text-xs text-muted-foreground">(${rentPerPerson}/person)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-[#f0e7df] pt-3 sm:grid-cols-4 text-xs">
            <div>
              <span className="text-muted-foreground">Arrangement:</span>
              <p className="font-semibold text-foreground capitalize mt-0.5">
                {formData.arrangementType === "private" ? "Private Rooms" : "Shared Room"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Household Size:</span>
              <p className="font-semibold text-foreground mt-0.5">
                {formData.householdMembers} Roommates
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Move-in Date:</span>
              <p className="font-semibold text-foreground mt-0.5">
                {formData.moveInDate || "11/01/2025"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Lease End:</span>
              <p className="font-semibold text-foreground mt-0.5">
                {formData.leaseEndDate || "10/31/2027"}
              </p>
            </div>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Rules highlight */}
          <div className="rounded-2xl border border-[#ebe3da] bg-white p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Moon className="size-3.5 text-[#7a3418]" />
              Lifestyle Alignment
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quiet hours:</span>
                <span className="font-medium text-foreground">{formData.quietHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AC guideline:</span>
                <span className="font-medium text-foreground">{formData.acGuideline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">House rules:</span>
                <span className="font-medium text-foreground">5 agreements active</span>
              </div>
            </div>
          </div>

          {/* Household roster */}
          <div className="rounded-2xl border border-[#ebe3da] bg-white p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users className="size-3.5 text-[#7a3418]" />
              Household Status
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Host:</span>
                <span className="font-medium text-foreground">You (Primary)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invitations sent:</span>
                <span className="font-medium text-foreground">{formData.invitedRoommates.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Open matches:</span>
                <span className="font-medium text-foreground">
                  {Math.max(0, formData.householdMembers - 1 - formData.invitedRoommates.length)} slots
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms agreement checkbox */}
        <button
          type="button"
          onClick={() => setAgreed(!agreed)}
          className="flex items-start gap-3 rounded-2xl border border-[#ebdccf] bg-[#fbf8f4] p-4 text-left transition-colors hover:bg-[#f8f3ec]"
        >
          <span
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border border-[#7a3418] bg-[#7a3418] text-white"
          >
            {agreed && <Check className="size-3.5 stroke-[3]" />}
          </span>
          <div className="text-xs text-[#55433c]">
            <span className="font-semibold text-foreground">
              I agree to the RoomieMatch Harmonious Co-Living Standards
            </span>
            <p className="mt-0.5 leading-relaxed text-muted-foreground">
              By confirming, all household members will share transparent digital billing records and follow mutual quiet hours and conflict resolution policies.
            </p>
          </div>
        </button>
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-[#f0e8e0] pt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#55433c] hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back: Chores & bills
        </button>

        <button
          type="button"
          disabled={!agreed || isSubmitting}
          onClick={onPublish}
          className="inline-flex items-center gap-2 rounded-full bg-[#7a3418] px-8 py-3 text-xs font-semibold text-white shadow-xs transition-transform hover:bg-[#682c14] active:scale-[0.98] disabled:opacity-50"
        >
          <CheckCircle2 className="size-4" />
          <span>{isSubmitting ? "Publishing Room..." : "Publish Room & Go to Dashboard"}</span>
        </button>
      </div>
    </section>
  )
}
