import { Home } from "lucide-react"

type WizardHeaderProps = {
  lastSavedText?: string
}

export function WizardHeader({
  lastSavedText = "Draft autosaved 2m ago",
}: WizardHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9c4220]">
        <Home className="size-3.5 text-[#9c4220]" aria-hidden="true" />
        <span>Room Setup Wizard</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#5e250e] sm:text-4xl lg:text-[2.6rem]">
            Create your room
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Set up your shared home in a few minutes. Build quiet rules, split transparent bills, and invite your crew.
          </p>
        </div>

        <div className="self-start sm:self-center shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ebdccf] bg-[#f7f2ea] px-3.5 py-1 text-xs font-medium text-[#55433c] shadow-2xs">
            <span className="size-2 rounded-full bg-emerald-600 animate-pulse" aria-hidden="true" />
            <span>{lastSavedText}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
