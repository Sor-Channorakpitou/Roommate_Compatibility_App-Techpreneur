import * as React from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, LogIn } from "lucide-react"

import { useAuth } from "@/context/auth-context"
import { Eyebrow } from "@/components/common/eyebrow"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function LoginPage() {
  const { login, isSubmitting, user } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (user) {
      navigate("/", { replace: true })
    }
  }, [user, navigate])

  function validate() {
    const e: Record<string, string> = {}
    if (!email.trim()) {
      e.email = "Email is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "Please enter a valid email address."
    }
    if (!password) {
      e.password = "Password is required."
    }
    return e
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (isSubmitting) return

    setError("")
    const errs = validate()
    setFieldErrors(errs)

    if (Object.keys(errs).length > 0) {
      toast.error("Validation Error", {
        description: "Please check your email and password.",
      })
      return
    }

    const result = await login(email, password)
    if (result.ok) {
      toast.success(`Welcome back, ${result.user?.name ?? "User"}!`, {
        description: "Signed in successfully via Supabase.",
      })
      navigate("/")
    } else {
      const msg = result.error ?? "Failed to sign in. Please try again."
      setError(msg)
      toast.error("Sign in failed", {
        description: msg,
      })
    }
  }

  return (
    <Container className="flex min-h-[calc(100svh-5rem)] items-center justify-center py-12">
      <div className="w-full max-w-[420px]">
        {/* Header */}
        <div className="mb-8 text-center">
          <Eyebrow className="mb-2">Welcome Back</Eyebrow>
          <h1 className="font-heading text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.25] tracking-[-0.015em] text-foreground">
            Sign in to RoomieMatch
          </h1>
          <p className="mt-2 text-[0.9375rem] leading-[1.55] text-muted-foreground">
            Enter your credentials to access your account.
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 rounded-xl bg-card p-6 text-sm text-card-foreground ring-1 ring-foreground/10 sm:p-8"
        >
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-[0.8125rem] text-destructive"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-destructive" />
              <div className="flex-1 leading-snug">{error}</div>
            </div>
          )}

          {/* Email */}
          <fieldset className="flex flex-col gap-1.5" disabled={isSubmitting}>
            <label
              htmlFor="login-email"
              className="text-[0.8125rem] font-semibold text-foreground"
            >
              Email Address
            </label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@university.edu.kh"
              autoComplete="email"
              value={email}
              disabled={isSubmitting}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError("")
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: "" }))
                }
              }}
              aria-invalid={!!fieldErrors.email}
              className="h-10"
            />
            {fieldErrors.email && (
              <p className="text-xs text-destructive">{fieldErrors.email}</p>
            )}
          </fieldset>

          {/* Password */}
          <fieldset className="flex flex-col gap-1.5" disabled={isSubmitting}>
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="text-[0.8125rem] font-semibold text-foreground"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                disabled={isSubmitting}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError("")
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: "" }))
                  }
                }}
                aria-invalid={!!fieldErrors.password}
                className="h-10 pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                disabled={isSubmitting}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-destructive">{fieldErrors.password}</p>
            )}
          </fieldset>

          {/* Submit */}
          <Button
            type="submit"
            size="pill-lg"
            disabled={isSubmitting}
            className="mt-1 w-full shadow-floating transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <LogIn className="size-4" />
                Sign In
                <ArrowRight className="size-3" />
              </>
            )}
          </Button>

          {/* Footer link */}
          <p className="text-center text-[0.8125rem] text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </Container>
  )
}

export { LoginPage }

