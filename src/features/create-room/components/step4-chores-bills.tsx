import { ArrowLeft, ArrowRight, Bookmark, Check, DollarSign, ListChecks, Sparkles } from "lucide-react"
import { cn } from "cn"
import type { CreateRoomFormData } from "../types"

type Step4ChoresBillsProps = {
  formData: CreateRoomFormData
  onChange: (updates: Partial<CreateRoomFormData>) => void
  onNext: () => void
  onBack: () => void
  onSaveDraft: () => void
}

const DEFAULT_CHORES = [
  "Deep Kitchen Clean & Counter Wipe",
  "Balcony & Plant Watering Rotation",
  "Recycling & Trash Duty",
  "Common Area & Living Room Vacuum",
]

export function Step4ChoresBills({
  formData,
  onChange,
  onNext,
  onBack,
  onSaveDraft,
}: Step4ChoresBillsProps) {
  function toggleChore(chore: string) {
    const exists = formData.chores.includes(chore)
    const updated = exists
      ? formData.chores.filter((c) => c !== chore)
      : [...formData.chores, chore]
    onChange({ chores: updated })
  }

  const rentPerPerson = Math.round(formData.monthlyRent / Math.max(1, formData.householdMembers))
  const splitPercent = Math.round(100 / Math.max(1, formData.householdMembers))

  return (
    <section aria-label="Step 4: Chores & bills" className="rounded-3xl border border-[#e8dfd8] bg-white p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f0e8e0] pb-6">
        <div className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#7a3418] text-sm font-bold text-white shadow-2xs">
            4
          </span>
          <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground sm:text-[1.65rem]">
            Step 4: Chores & Bill splitting
          </h2>
        </div>
        <span className="rounded-full bg-[#d7ecd8] px-3 py-1 text-xs font-semibold text-[#276e33]">
          Active Step
        </span>
      </div>

      <div className="mt-6 space-y-6">
        {/* Bill Split Strategy */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-[#221c19] flex items-center gap-1.5">
            <DollarSign className="size-4 text-[#7a3418]" />
            Rent & Utilities Split Method
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onChange({ billSplitMethod: "equal" })}
              className={cn(
                "rounded-2xl p-4 text-left transition-all",
                formData.billSplitMethod === "equal"
                  ? "border-2 border-[#7a3418] bg-[#fcf8f4] shadow-xs"
                  : "border border-[#ebe3da] bg-white hover:border-[#d9cbbe]"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-foreground">
                  Equal Share ({splitPercent}% each)
                </span>
                <span className="rounded bg-[#d7ecd8] px-2 py-0.5 text-[11px] font-bold text-[#276e33]">
                  Recommended
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Rent is split equally at ${rentPerPerson}/person among all {formData.householdMembers} household members.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onChange({ billSplitMethod: "custom" })}
              className={cn(
                "rounded-2xl p-4 text-left transition-all",
                formData.billSplitMethod === "custom"
                  ? "border-2 border-[#7a3418] bg-[#fcf8f4] shadow-xs"
                  : "border border-[#ebe3da] bg-white hover:border-[#d9cbbe]"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-foreground">
                  Room Size / Weighted Split
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Assign customized rates based on master bedroom vs secondary rooms or balcony access.
              </p>
            </button>
          </div>
        </div>

        {/* Chores Rotation Setup */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-[#221c19] flex items-center gap-1.5">
            <ListChecks className="size-4 text-[#7a3418]" />
            Default Weekly Chore Rotation
          </label>
          <p className="text-xs text-muted-foreground">
            These will be seeded onto your household's automated chore tracker in My Home.
          </p>

          <div className="space-y-2.5">
            {DEFAULT_CHORES.map((chore) => {
              const isSelected =
                formData.chores.includes(chore) ||
                formData.chores.length === 0

              return (
                <button
                  type="button"
                  key={chore}
                  onClick={() => toggleChore(chore)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all",
                    isSelected
                      ? "border-[#7a3418]/60 bg-[#fdf9f5]"
                      : "border-[#ebe3da] bg-white hover:border-[#d9cbbe]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="size-4 text-[#7a3418]" />
                    <span className="text-xs font-semibold text-foreground">{chore}</span>
                  </div>

                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                      isSelected
                        ? "border-[#7a3418] bg-[#7a3418] text-white"
                        : "border-[#c4b5a6] bg-white"
                    )}
                  >
                    {isSelected && <Check className="size-3.5 stroke-[3]" />}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-[#f0e8e0] pt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#55433c] hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back: House rules
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSaveDraft}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bookmark className="size-4" />
            Save draft
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-full bg-[#7a3418] px-6 py-3 text-xs font-semibold text-white shadow-xs transition-transform hover:bg-[#682c14] active:scale-[0.98]"
          >
            <span>Next: Review</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
