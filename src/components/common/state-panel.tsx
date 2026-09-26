import type * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { LogIn, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function LinkButton({
  to,
  state,
  children,
}: {
  to: string
  state?: unknown
  children: React.ReactNode
}) {
  return (
    <Button
      nativeButton={false}
      variant="brand"
      size="pill-lg"
      className="text-sm font-semibold shadow-soft"
      render={<Link to={to} state={state} />}
    >
      {children}
    </Button>
  )
}

export function StatePanel({
  icon: Icon,
  title,
  description,
  action,
  tone = "neutral",
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  tone?: "neutral" | "error"
}) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card px-6 py-12 text-center shadow-soft"
    >
      <span
        className={
          tone === "error"
            ? "flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive"
            : "flex size-12 items-center justify-center rounded-full bg-peach text-peach-foreground"
        }
      >
        <Icon aria-hidden className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  )
}

/** Sends the visitor to sign in, then back to this exact page. */
export function SignInPanel({
  title,
  description,
}: {
  title: string
  description: string
}) {
  const location = useLocation()
  return (
    <StatePanel
      icon={LogIn}
      title={title}
      description={description}
      action={
        <LinkButton
          to="/sign-in"
          state={{ from: location.pathname + location.search }}
        >
          <LogIn />
          Sign in
        </LinkButton>
      }
    />
  )
}
