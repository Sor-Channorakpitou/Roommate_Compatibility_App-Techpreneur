import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Moon, Sparkles, Zap } from "lucide-react"

import { Eyebrow } from "@/components/common/eyebrow"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { getErrorMessage, isUnauthenticatedError } from "@/lib/api-error"
import {
  hasCompletedQuiz,
  parseAnswers,
  type CompatibilityAnswers,
  type HabitKey,
} from "@/lib/compatibility"
import { getMyAnswers, saveMyAnswers } from "@/lib/students-api"

// ---------------------------------------------------------------------------
// Quiz content. Option ids must match `HABITS` in @/lib/compatibility.
// ---------------------------------------------------------------------------

type QuizOption = {
  id: string
  label: string
  time?: string
  description: string
  icon: React.ReactNode
}

type SubOption = {
  id: string
  label: string
}

type QuizQuestion = {
  key: HabitKey
  category: string
  title: string
  subtitle: string
  options: QuizOption[]
  subGroup?: {
    key: HabitKey
    label: string
    labelRight?: string
    options: SubOption[]
  }
}

const QUESTIONS: QuizQuestion[] = [
  {
    key: "sleep",
    category: "Sleep Schedule",
    title: "When do your lights usually go out on weekdays?",
    subtitle:
      "Select the schedule that best reflects your natural daily rhythm.",
    options: [
      {
        id: "early-bird",
        label: "Early Bird",
        time: "10:00 PM – 11:30 PM",
        description:
          "Up early with the morning light; wind down early for quiet, restful evenings.",
        icon: <Moon className="size-4" />,
      },
      {
        id: "night-owl",
        label: "Night Owl",
        time: "After 1:00 AM",
        description:
          "Most productive well past midnight; mornings are calm and unhurried.",
        icon: <Sparkles className="size-4" />,
      },
      {
        id: "fluid",
        label: "Fluid & Adaptable",
        time: "Varies",
        description:
          "Flexible cadence shifting with project deadlines, work, or social plans.",
        icon: <Zap className="size-4" />,
      },
    ],
    subGroup: {
      key: "weekend",
      label: "Weekend mornings",
      labelRight: "Desired atmosphere",
      options: [
        { id: "early-up", label: "Early up (8 AM)" },
        { id: "quiet-until-10", label: "Quiet until 10 AM" },
        { id: "sleep-in", label: "Sleep in late" },
      ],
    },
  },
  {
    key: "cleanliness",
    category: "Cleanliness",
    title: "How would you describe your cleaning habits?",
    subtitle: "Be honest — there are no wrong answers, only compatible ones.",
    options: [
      {
        id: "meticulous",
        label: "Meticulous",
        time: "Daily",
        description:
          "Everything has a place; surfaces are wiped, dishes never sit overnight.",
        icon: <Sparkles className="size-4" />,
      },
      {
        id: "tidy",
        label: "Reasonably Tidy",
        time: "A few times a week",
        description:
          "Common areas stay presentable; deep cleaning happens on weekends.",
        icon: <Zap className="size-4" />,
      },
      {
        id: "relaxed",
        label: "Relaxed",
        time: "Weekly",
        description:
          "Comfortable with a little clutter; cleaning happens when needed.",
        icon: <Moon className="size-4" />,
      },
    ],
  },
  {
    key: "noise",
    category: "Noise & Social",
    title: "What's your ideal noise level at home?",
    subtitle: "Think about a typical weekday evening in your shared space.",
    options: [
      {
        id: "quiet",
        label: "Library Quiet",
        time: "Always",
        description:
          "Headphones on, soft voices, no surprises. Peace is non-negotiable.",
        icon: <Moon className="size-4" />,
      },
      {
        id: "moderate",
        label: "Moderate",
        time: "Balanced",
        description:
          "Music at a reasonable volume, casual conversation, occasional movie nights.",
        icon: <Zap className="size-4" />,
      },
      {
        id: "lively",
        label: "Lively & Social",
        time: "Often",
        description:
          "Love having friends over; the apartment is a hub of activity and energy.",
        icon: <Sparkles className="size-4" />,
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/** Keeps answers across the sign-in round trip for visitors who start signed out. */
const PROGRESS_KEY = "roomiematch:quiz-progress"

function readProgress(): CompatibilityAnswers {
  try {
    return parseAnswers(JSON.parse(sessionStorage.getItem(PROGRESS_KEY) ?? "{}"))
  } catch {
    return {}
  }
}

function writeProgress(answers: CompatibilityAnswers) {
  try {
    sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(answers))
  } catch {
    // Storage can be blocked; the quiz still works in memory.
  }
}

function clearProgress() {
  try {
    sessionStorage.removeItem(PROGRESS_KEY)
  } catch {
    // Nothing to clear.
  }
}

function CompatibilityPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [answers, setAnswers] = React.useState<CompatibilityAnswers>(readProgress)
  // Back from signing in with every answer given: pick up at the finish.
  const [currentIndex, setCurrentIndex] = React.useState(() =>
    hasCompletedQuiz(answers) ? QUESTIONS.length - 1 : 0
  )
  const [isSaving, setIsSaving] = React.useState(false)

  // Retakes start from the answers already on file, unless some are in progress.
  React.useEffect(() => {
    if (!user) return
    let isCurrent = true
    getMyAnswers()
      .then((saved) => {
        if (!isCurrent) return
        setAnswers((current) =>
          Object.keys(current).length > 0 ? current : saved
        )
      })
      .catch(() => {
        // No saved answers to prefill; the quiz starts blank.
      })
    return () => {
      isCurrent = false
    }
  }, [user])

  React.useEffect(() => {
    document.title = "Compatibility test | RoomieMatch"
  }, [])

  const question = QUESTIONS[currentIndex]
  const selectedOption = answers[question.key] ?? ""
  const selectedSub = question.subGroup ? (answers[question.subGroup.key] ?? "") : ""

  // User must select both main option and sub-option if sub-group exists
  const isStepComplete =
    Boolean(selectedOption) && (!question.subGroup || Boolean(selectedSub))
  const isLastStep = currentIndex === QUESTIONS.length - 1

  function setAnswer(key: HabitKey, optionId: string) {
    setAnswers((prev) => {
      const next = { ...prev, [key]: optionId }
      writeProgress(next)
      return next
    })
  }

  function handleSelect(optionId: string) {
    setAnswer(question.key, optionId)
  }

  function handleSubSelect(subId: string) {
    if (question.subGroup) setAnswer(question.subGroup.key, subId)
  }

  function goToSignIn() {
    toast.error("Sign in to save your answers", {
      description: "Your answers are kept. You'll come right back here.",
    })
    navigate("/sign-in", { state: { from: location.pathname } })
  }

  async function handleNext() {
    if (!isStepComplete || isSaving) return

    if (!isLastStep) {
      setCurrentIndex((i) => i + 1)
      return
    }
    if (!hasCompletedQuiz(answers)) return
    if (!user) {
      goToSignIn()
      return
    }

    setIsSaving(true)
    try {
      await saveMyAnswers(answers)
      clearProgress()
      toast.success("Compatibility test completed!", {
        description: "Your match scores are ready.",
      })
      navigate("/browse")
    } catch (error) {
      if (isUnauthenticatedError(error)) goToSignIn()
      else {
        toast.error("Could not save your answers", {
          description: getErrorMessage(error),
        })
      }
      setIsSaving(false)
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
    }
  }

  return (
    <Container className="flex min-h-[calc(100svh-5rem)] flex-col py-8">
      <div className="mx-auto w-full max-w-[680px] flex-1">
        {/* Progress header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eyebrow className="text-primary">
              Step {currentIndex + 1} of {QUESTIONS.length}
            </Eyebrow>
            <span className="border-l border-primary/30 pl-3 text-sm font-semibold text-primary underline decoration-primary underline-offset-4">
              {question.category}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {user ? "Answers save to your profile" : "Sign in at the end to save"}
          </p>
        </div>

        {/* Question */}
        <h1 className="font-heading text-[clamp(1.5rem,3.5vw,2rem)] leading-[1.3] tracking-[-0.015em] text-foreground">
          {question.title}
        </h1>
        <p className="mt-2 text-[0.9375rem] leading-[1.55] text-muted-foreground">
          {question.subtitle}
        </p>

        {/* Options */}
        <div className="mt-8 flex flex-col gap-3">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                className={`group flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-card shadow-card ring-1 ring-primary/30"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-card"
                }`}
              >
                {/* Icon */}
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isSelected
                      ? "bg-primary/12 text-primary"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/8 group-hover:text-primary"
                  }`}
                >
                  {opt.icon}
                </span>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.9375rem] font-bold text-foreground">
                      {opt.label}
                    </span>
                    {opt.time && (
                      <span className="text-xs font-medium text-muted-foreground">
                        {opt.time}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[0.8125rem] leading-[1.5] text-muted-foreground">
                    {opt.description}
                  </p>
                </div>

                {/* Radio indicator */}
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    isSelected ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {isSelected && (
                    <svg
                      viewBox="0 0 12 12"
                      className="size-3 text-primary-foreground"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        {/* Sub-options */}
        {question.subGroup && (
          <div className="mt-8 rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-foreground">
                {question.subGroup.label}{" "}
                <span className="text-xs font-normal text-destructive">
                  *Required
                </span>
              </p>
              {question.subGroup.labelRight && (
                <p className="text-sm text-muted-foreground">
                  {question.subGroup.labelRight}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {question.subGroup.options.map((sub) => {
                const isActive = selectedSub === sub.id
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSubSelect(sub.id)}
                    className={`rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-all ${
                      isActive
                        ? "border-primary bg-primary/12 font-semibold text-primary ring-1 ring-primary/30"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {sub.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Requirements hint if incomplete */}
        {!isStepComplete && (
          <p className="mt-4 text-center text-xs text-muted-foreground/80 italic">
            {!selectedOption && question.subGroup && !selectedSub
              ? "Please select a main option and a weekend preference to continue."
              : !selectedOption
                ? "Please select an option to continue."
                : "Please select a weekend preference to continue."}
          </p>
        )}

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between border-t border-border/40 pt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </button>

          <Button
            size="pill-lg"
            onClick={handleNext}
            disabled={!isStepComplete || isSaving}
            className="shadow-floating"
          >
            {isLastStep ? (isSaving ? "Saving…" : "Finish Test") : "Next Question"}
            <ArrowRight className="size-3" />
          </Button>
        </div>
      </div>
    </Container>
  )
}

export { CompatibilityPage }
