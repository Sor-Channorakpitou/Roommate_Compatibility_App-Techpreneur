import { ArrowLeft, ArrowRight, Bookmark, Loader2, Rocket } from "lucide-react"

import { Button } from "@/components/ui/button"

type WizardFooterProps = {
  /** Label of the following step; omitted on the last step. */
  nextLabel?: string
  canGoBack: boolean
  isPublishing: boolean
  onBack: () => void
  onNext: () => void
  onSaveDraft: () => void
  onPublish: () => void
}

/** Secondary labels collapse to icons on narrow cards to keep one compact row. */
const collapsibleLabel = "sr-only @xl:not-sr-only"

export function WizardFooter({
  nextLabel,
  canGoBack,
  isPublishing,
  onBack,
  onNext,
  onSaveDraft,
  onPublish,
}: WizardFooterProps) {
  return (
    <div className="flex items-center gap-2 @xl:gap-4">
      {canGoBack && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="size-11 shrink-0 rounded-full border-border/80 bg-card p-0 text-sm font-semibold @xl:w-auto @xl:px-6"
        >
          <ArrowLeft className="size-3.5" />
          <span className={collapsibleLabel}>Back</span>
        </Button>
      )}

      <Button
        type="button"
        variant="ghost"
        onClick={onSaveDraft}
        className="ml-auto size-11 shrink-0 rounded-full p-0 text-sm font-semibold text-subtle-foreground hover:bg-muted/60 hover:text-foreground @xl:w-auto @xl:px-4"
      >
        <Bookmark />
        <span className={collapsibleLabel}>Save draft</span>
      </Button>

      {nextLabel ? (
        <Button
          type="button"
          variant="brand"
          onClick={onNext}
          className="h-11 flex-1 rounded-full px-5 text-sm font-semibold shadow-soft @xl:flex-none @xl:px-8"
        >
          Next: {nextLabel}
          <ArrowRight data-icon="inline-end" className="size-3.5" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="brand"
          onClick={onPublish}
          disabled={isPublishing}
          aria-busy={isPublishing}
          className="h-12 flex-1 gap-3 rounded-full px-5 text-sm font-semibold shadow-lifted @xl:flex-none @xl:px-10"
        >
          {isPublishing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Publishing…
            </>
          ) : (
            <>
              <Rocket className="size-4" />
              Create room
            </>
          )}
        </Button>
      )}
    </div>
  )
}
