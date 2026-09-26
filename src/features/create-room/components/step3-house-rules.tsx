import { ArrowLeft, ArrowRight, BellOff, Bookmark, Check, Flame, Moon, ShieldCheck, Sparkles, Users } from "lucide-react"
import { cn } from "cn"
import type { CreateRoomFormData } from "../types"

type Step3HouseRulesProps = {
  formData: CreateRoomFormData
  onChange: (updates: Partial<CreateRoomFormData>) => void
  onNext: () => void
  onBack: () => void
  onSaveDraft: () => void
}

const PRESET_RULES = [
  {
    id: "quiet-hours",
    title: "Quiet Hours Policy",
    desc: "Low volume between 10:00 PM and 7:00 AM on weekdays.",
    icon: BellOff,
  },
  {
    id: "overnight-guests",
    title: "Overnight Guests Courtesy",
    desc: "At least 24 hours heads-up in shared chat before hosting overnight visitors.",
    icon: Users,
  },
  {
    id: "kitchen-clean",
    title: "Kitchen Cleanliness Guarantee",
    desc: "Wash pans and wipe counters immediately after cooking.",
    icon: Sparkles,
  },
  {
    id: "eco-ac",
    title: "Climate & Energy Eco-Mode",
    desc: "Air conditioner defaults to 26°C Eco mode with timer; turn off lights when leaving.",
    icon: Flame,
  },
  {
    id: "entry-safety",
    title: "Front Door Lock & Key Safety",
    desc: "Lock doors after 9 PM. Keep common keys in designated entrance tray.",
    icon: ShieldCheck,
  },
]

export function Step3HouseRules({
  formData,
  onChange,
  onNext,
  onBack,
  onSaveDraft,
}: Step3HouseRulesProps) {
  function toggleRule(ruleTitle: string) {
    const exists = formData.houseRules.includes(ruleTitle)
    const updated = exists
      ? formData.houseRules.filter((r) => r !== ruleTitle)
      : [...formData.houseRules, ruleTitle]
    onChange({ houseRules: updated })
  }

  return (
    <section aria-label="Step 3: House rules" className="rounded-3xl border border-[#e8dfd8] bg-white p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f0e8e0] pb-6">
        <div className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#7a3418] text-sm font-bold text-white shadow-2xs">
            3
          </span>
          <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground sm:text-[1.65rem]">
            Step 3: House rules & Quiet rhythms
          </h2>
        </div>
        <span className="rounded-full bg-[#d7ecd8] px-3 py-1 text-xs font-semibold text-[#276e33]">
          Active Step
        </span>
      </div>

      <div className="mt-6 space-y-6">
        {/* Core Rhythms (Quiet hours & AC) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Quiet Hours */}
          <div className="space-y-1.5">
            <label htmlFor="quiet-hours-input" className="text-sm font-semibold text-[#221c19] flex items-center gap-1.5">
              <Moon className="size-4 text-[#7a3418]" />
              Quiet Hours
            </label>
            <input
              id="quiet-hours-input"
              type="text"
              value={formData.quietHours}
              onChange={(e) => onChange({ quietHours: e.target.value })}
              placeholder="e.g. 10:00 PM - 7:00 AM"
              className="w-full rounded-xl border border-[#ebe3da] bg-[#fbf8f4] py-3 px-4 text-sm text-[#1c1c18] focus:border-[#7a3418] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7a3418]"
            />
            <p className="text-xs text-muted-foreground">
              Shown directly on your room profile and live preview.
            </p>
          </div>

          {/* AC Guideline */}
          <div className="space-y-1.5">
            <label htmlFor="ac-input" className="text-sm font-semibold text-[#221c19] flex items-center gap-1.5">
              <Flame className="size-4 text-[#7a3418]" />
              AC & Climate Setting
            </label>
            <input
              id="ac-input"
              type="text"
              value={formData.acGuideline}
              onChange={(e) => onChange({ acGuideline: e.target.value })}
              placeholder="e.g. 26°C Eco mode"
              className="w-full rounded-xl border border-[#ebe3da] bg-[#fbf8f4] py-3 px-4 text-sm text-[#1c1c18] focus:border-[#7a3418] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7a3418]"
            />
            <p className="text-xs text-muted-foreground">
              Prevents surprise EDC electricity spikes.
            </p>
          </div>
        </div>

        {/* Preset House Rules Checklist */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-[#221c19]">
            Select Community Agreements
          </label>
          <div className="space-y-2.5">
            {PRESET_RULES.map((item) => {
              const Icon = item.icon
              const isSelected =
                formData.houseRules.includes(item.title) ||
                (formData.houseRules.length === 0 && true)

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleRule(item.title)}
                  className={cn(
                    "flex w-full items-start justify-between rounded-2xl border p-4 text-left transition-all",
                    isSelected
                      ? "border-[#7a3418]/60 bg-[#fdf9f5]"
                      : "border-[#ebe3da] bg-white hover:border-[#d9cbbe]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f4ece3] text-[#7a3418]">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "mt-1 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
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
          Back: Roommates
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
            <span>Next: Chores & bills</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
