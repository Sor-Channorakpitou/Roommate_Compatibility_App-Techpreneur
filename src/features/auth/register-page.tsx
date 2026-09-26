import * as React from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
} from "lucide-react"

import { useAuth } from "@/context/auth-context"
import { Eyebrow } from "@/components/common/eyebrow"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const UNIVERSITIES = [
  {
    value: "CADT",
    label: "CADT",
    fullName: "Cambodia Academy of Digital Technology",
  },
  { value: "RUPP", label: "RUPP", fullName: "Royal University of Phnom Penh" },
  {
    value: "ITC",
    label: "ITC",
    fullName: "Institute of Technology of Cambodia",
  },
  {
    value: "RULE",
    label: "RULE",
    fullName: "Royal University of Law and Economics",
  },
  { value: "NUM", label: "NUM", fullName: "National University of Management" },
  {
    value: "Other",
    label: "Other",
    fullName: "Other University / Institution",
  },
] as const

const GENDERS = ["Male", "Female", "Other"] as const

type FormErrors = Record<string, string>

// ---------------------------------------------------------------------------
// Custom Smooth Dropdown Component
// ---------------------------------------------------------------------------

type UniversitySelectProps = {
  value: string
  onChange: (val: string) => void
  error?: string
  disabled?: boolean
}

function UniversitySelect({ value, onChange, error, disabled }: UniversitySelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedUni = UNIVERSITIES.find((u) => u.value === value)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        id="reg-university"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`flex h-10 w-full items-center justify-between rounded-lg border bg-card px-3 py-2 text-sm transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60 ${
          error
            ? "border-destructive ring-1 ring-destructive/30"
            : isOpen
              ? "border-primary shadow-sm ring-2 ring-primary/20"
              : "border-input hover:border-primary/40"
        }`}
      >
        <span
          className={
            selectedUni
              ? "font-medium text-foreground"
              : "text-muted-foreground"
          }
        >
          {selectedUni
            ? `${selectedUni.label} (${selectedUni.fullName})`
            : "Select your university"}
        </span>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <div
          role="listbox"
          aria-label="University selection"
          className="absolute z-50 mt-1 max-h-60 w-full animate-in overflow-auto rounded-xl border border-border bg-card p-1.5 shadow-floating backdrop-blur-md transition-all duration-150 fade-in-0 zoom-in-95"
        >
          {UNIVERSITIES.map((u) => {
            const isSelected = value === u.value
            return (
              <button
                key={u.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(u.value)
                  setIsOpen(false)
                }}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  isSelected
                    ? "bg-primary/12 font-semibold text-primary"
                    : "text-foreground hover:bg-muted/80"
                }`}
              >
                <div className="flex min-w-0 flex-col pr-2">
                  <span className="leading-snug font-semibold">{u.label}</span>
                  <span className="truncate text-[0.75rem] text-muted-foreground">
                    {u.fullName}
                  </span>
                </div>
                {isSelected && (
                  <Check className="size-4 shrink-0 text-primary" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Register Page Component
// ---------------------------------------------------------------------------

function RegisterPage() {
  const { register, isSubmitting, user } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [university, setUniversity] = React.useState("")
  const [customUniversity, setCustomUniversity] = React.useState("")
  const [gender, setGender] = React.useState("")
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [serverError, setServerError] = React.useState("")

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (user) {
      navigate("/", { replace: true })
    }
  }, [user, navigate])

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!name.trim()) e.name = "Full name is required."
    if (!email.trim()) e.email = "Email is required."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Enter a valid email address."
    if (!password) e.password = "Password is required."
    else if (password.length < 6) e.password = "Password must be at least 6 characters."
    if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match."
    if (!university) e.university = "Please select your university."
    if (university === "Other" && !customUniversity.trim()) {
      e.customUniversity = "Please enter your university name."
    }
    if (!gender) e.gender = "Please select your gender."
    return e
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (isSubmitting) return

    setServerError("")
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Validation Error", {
        description: "Please fix the highlighted errors in the form.",
      })
      return
    }

    const finalUniversity =
      university === "Other" ? customUniversity.trim() : university

    const result = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      university: finalUniversity,
      gender,
    })

    if (result.ok) {
      if (result.requiresEmailVerification) {
        toast.info("Account Created!", {
          description:
            result.message ||
            "Please check your email to confirm your account before signing in.",
          duration: 8000,
        })
        navigate("/sign-in")
      } else {
        toast.success(`Welcome to RoomieMatch, ${name}!`, {
          description:
            "Your account is created. Let's start your compatibility quiz!",
        })
        navigate("/compatibility-test")
      }
    } else {
      const msg = result.error ?? "Registration failed. Please try again."
      setServerError(msg)
      if (msg.toLowerCase().includes("already exists")) {
        setErrors((prev) => ({ ...prev, email: "An account with this email already exists." }))
      }
      toast.error("Registration Failed", {
        description: msg,
      })
    }
  }

  return (
    <Container className="flex min-h-[calc(100svh-5rem)] items-center justify-center py-12">
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="mb-8 text-center">
          <Eyebrow className="mb-2">Join RoomieMatch</Eyebrow>
          <h1 className="font-heading text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.25] tracking-[-0.015em] text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-[0.9375rem] leading-[1.55] text-muted-foreground">
            Set up your profile and find your perfect roommate match.
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 rounded-xl bg-card p-6 text-sm text-card-foreground ring-1 ring-foreground/10 sm:p-8"
        >
          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-[0.8125rem] text-destructive"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-destructive" />
              <div className="flex-1 leading-snug">{serverError}</div>
            </div>
          )}

          {/* Full Name */}
          <fieldset className="flex flex-col gap-1.5" disabled={isSubmitting}>
            <label
              htmlFor="reg-name"
              className="text-[0.8125rem] font-semibold text-foreground"
            >
              Full Name
            </label>
            <Input
              id="reg-name"
              placeholder="e.g. Dara Chea"
              autoComplete="name"
              value={name}
              disabled={isSubmitting}
              onChange={(e) => {
                setName(e.target.value)
                if (serverError) setServerError("")
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
              }}
              aria-invalid={!!errors.name}
              className="h-10"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </fieldset>

          {/* Email */}
          <fieldset className="flex flex-col gap-1.5" disabled={isSubmitting}>
            <label
              htmlFor="reg-email"
              className="text-[0.8125rem] font-semibold text-foreground"
            >
              Email Address
            </label>
            <Input
              id="reg-email"
              type="email"
              placeholder="you@university.edu.kh"
              autoComplete="email"
              value={email}
              disabled={isSubmitting}
              onChange={(e) => {
                setEmail(e.target.value)
                if (serverError) setServerError("")
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
              }}
              aria-invalid={!!errors.email}
              className="h-10"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </fieldset>

          {/* Password row */}
          <div className="grid gap-5 sm:grid-cols-2">
            <fieldset className="flex flex-col gap-1.5" disabled={isSubmitting}>
              <label
                htmlFor="reg-password"
                className="text-[0.8125rem] font-semibold text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={password}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (serverError) setServerError("")
                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
                  }}
                  aria-invalid={!!errors.password}
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
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-1.5" disabled={isSubmitting}>
              <label
                htmlFor="reg-confirm"
                className="text-[0.8125rem] font-semibold text-foreground"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="reg-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={confirmPassword}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (serverError) setServerError("")
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                    }
                  }}
                  aria-invalid={!!errors.confirmPassword}
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  disabled={isSubmitting}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </fieldset>
          </div>

          {/* University - Custom Smooth Dropdown */}
          <fieldset className="flex flex-col gap-1.5" disabled={isSubmitting}>
            <label
              htmlFor="reg-university"
              className="text-[0.8125rem] font-semibold text-foreground"
            >
              University
            </label>
            <UniversitySelect
              value={university}
              disabled={isSubmitting}
              onChange={(val) => {
                setUniversity(val)
                if (serverError) setServerError("")
                if (errors.university) {
                  setErrors((prev) => ({ ...prev, university: "" }))
                }
                if (val !== "Other") setCustomUniversity("")
              }}
              error={errors.university}
            />
            {errors.university && (
              <p className="text-xs text-destructive">{errors.university}</p>
            )}

            {/* If Other is chosen, show extra input field */}
            {university === "Other" && (
              <div className="mt-2 flex animate-in flex-col gap-1.5 duration-200 fade-in-0">
                <label
                  htmlFor="reg-custom-uni"
                  className="text-[0.8125rem] font-semibold text-foreground"
                >
                  Specify University Name
                </label>
                <Input
                  id="reg-custom-uni"
                  placeholder="e.g. Paragon International University"
                  value={customUniversity}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setCustomUniversity(e.target.value)
                    if (serverError) setServerError("")
                    if (errors.customUniversity) {
                      setErrors((prev) => ({ ...prev, customUniversity: "" }))
                    }
                  }}
                  aria-invalid={!!errors.customUniversity}
                  className="h-10"
                />
                {errors.customUniversity && (
                  <p className="text-xs text-destructive">
                    {errors.customUniversity}
                  </p>
                )}
              </div>
            )}
          </fieldset>

          {/* Gender */}
          <fieldset className="flex flex-col gap-2" disabled={isSubmitting}>
            <legend className="text-[0.8125rem] font-semibold text-foreground">
              Gender
            </legend>
            <div className="flex flex-wrap gap-3">
              {GENDERS.map((g) => (
                <label
                  key={g}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-all ${
                    isSubmitting ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                  } ${
                    gender === g
                      ? "border-primary bg-primary/8 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    disabled={isSubmitting}
                    checked={gender === g}
                    onChange={() => {
                      setGender(g)
                      if (serverError) setServerError("")
                      if (errors.gender) setErrors((prev) => ({ ...prev, gender: "" }))
                    }}
                    className="sr-only"
                  />
                  {g}
                </label>
              ))}
            </div>
            {errors.gender && (
              <p className="text-xs text-destructive">{errors.gender}</p>
            )}
          </fieldset>

          {/* Submit */}
          <Button
            type="submit"
            size="pill-lg"
            disabled={isSubmitting}
            className="mt-2 w-full shadow-floating transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating account…
              </>
            ) : (
              <>
                <UserPlus className="size-4" />
                Create Account
                <ArrowRight className="size-3" />
              </>
            )}
          </Button>

          {/* Footer link */}
          <p className="text-center text-[0.8125rem] text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </Container>
  )
}

export { RegisterPage }
