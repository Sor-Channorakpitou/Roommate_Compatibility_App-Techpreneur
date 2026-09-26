/** Shared look for every text-like control in the wizard. */
export const fieldControlClass =
  "h-auto rounded-xl border-border/60 bg-surface px-4 py-3 text-[0.9375rem] leading-[1.55] text-foreground md:text-[0.9375rem] placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-brand/20"

/** ARIA wiring for a control rendered inside `FormField`. */
export function fieldAria(id: string, error?: string, hasHint = false) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error
      ? `${id}-error`
      : hasHint
        ? `${id}-hint`
        : undefined,
  } as const
}
