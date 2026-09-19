import * as React from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Moon, Sparkles, Zap } from "lucide-react"

import { Eyebrow } from "@/components/common/eyebrow"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"

// ---------------------------------------------------------------------------
// Quiz data (sample questions matching the screenshot aesthetic)
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
  step: number
  totalSteps: number
  category: string
  questionNumber: number
  totalQuestions: number
  title: string
  subtitle: string
  options: QuizOption[]
  subGroup?: {
    label: string
    labelRight?: string
    options: SubOption[]
  }
}

const QUESTIONS: QuizQuestion[] = [
  {
    step: 2,
    totalSteps: 8,
    category: "Sleep Schedule",
    questionNumber: 1,
    totalQuestions: 8,
    title: "When do your lights usually go out on weekdays?",
    subtitle: "Select the schedule that best reflects your natural daily rhythm.",
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
    step: 3,
    totalSteps: 8,
    category: "Cleanliness",
    questionNumber: 2,
    totalQuestions: 8,
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
    step: 4,
    totalSteps: 8,
    category: "Noise & Social",
    questionNumber: 3,
    totalQuestions: 8,
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

function CompatibilityPage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [selections, setSelections] = React.useState<Record<number, string>>({})
  const [subSelections, setSubSelections] = React.useState<Record<number, string>>({})

  const question = QUESTIONS[currentIndex]
  const selectedOption = selections[currentIndex] ?? ""
  const selectedSub = subSelections[currentIndex] ?? ""

  // User must select both main option and sub-option if sub-group exists
  const isStepComplete = Boolean(selectedOption) && (!question.subGroup || Boolean(selectedSub))
  const isLastStep = currentIndex === QUESTIONS.length - 1

  function handleSelect(optionId: string) {
    setSelections((prev) => ({ ...prev, [currentIndex]: optionId }))
  }

  function handleSubSelect(subId: string) {
    setSubSelections((prev) => ({ ...prev, [currentIndex]: subId }))
  }

  function handleNext() {
    if (!isStepComplete) return

    if (isLastStep) {
      toast.success("Compatibility test completed!", {
        description: "Your preferences have been saved. Directing to home page...",
      })
      navigate("/")
    } else {
      setCurrentIndex((i) => i + 1)
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
              Step {question.step} of {question.totalSteps}
            </Eyebrow>
            <span className="border-l border-primary/30 pl-3 text-sm font-semibold text-primary underline decoration-primary underline-offset-4">
              {question.category}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Question {question.questionNumber} of {question.totalQuestions}
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
                    ? "border-primary bg-card ring-1 ring-primary/30 shadow-card"
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
                    <span className="text-[0.9375rem] font-bold text-foreground">{opt.label}</span>
                    {opt.time && (
                      <span className="text-xs font-medium text-muted-foreground">{opt.time}</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[0.8125rem] leading-[1.5] text-muted-foreground">
                    {opt.description}
                  </p>
                </div>

                {/* Radio indicator */}
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-border"
                  }`}
                >
                  {isSelected && (
                    <svg viewBox="0 0 12 12" className="size-3 text-primary-foreground">
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
                <span className="text-xs font-normal text-destructive">*Required</span>
              </p>
              {question.subGroup.labelRight && (
                <p className="text-sm text-muted-foreground">{question.subGroup.labelRight}</p>
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
                        ? "border-primary bg-primary/12 text-primary font-semibold ring-1 ring-primary/30"
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
            disabled={!isStepComplete}
            className="shadow-floating"
          >
            {isLastStep ? "Finish Test" : "Next Question"}
            <ArrowRight className="size-3" />
          </Button>
        </div>
      </div>
    </Container>
  )
}

export { CompatibilityPage }

