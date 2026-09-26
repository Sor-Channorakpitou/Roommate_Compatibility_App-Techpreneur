import type * as React from "react"
import { cn } from "cn"

type FormFieldProps = {
  label: string
  htmlFor: string
  hint?: React.ReactNode
  error?: string
  className?: string
  children: React.ReactNode
}

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm leading-[1.3] font-semibold tracking-[0.01em] text-foreground"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${htmlFor}-hint`}
          className="text-[0.8125rem] text-muted-foreground"
        >
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/** Positions a decorative icon or affix inside a control's padding. */
export function FieldAdornment({
  side,
  children,
}: {
  side: "start" | "end"
  children: React.ReactNode
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center text-muted-foreground [&_svg]:size-4",
        side === "start" ? "left-3.5" : "right-3.5"
      )}
    >
      {children}
    </span>
  )
}
