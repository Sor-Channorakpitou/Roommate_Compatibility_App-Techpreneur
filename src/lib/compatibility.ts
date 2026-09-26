/**
 * The habits the compatibility quiz asks about, and how two students' answers
 * are scored against each other. Options are ordered along a scale, so
 * neighbouring answers count as a partial match.
 */

export type HabitKey = "sleep" | "weekend" | "cleanliness" | "noise"

export type CompatibilityAnswers = Partial<Record<HabitKey, string>>

type HabitOption = { id: string; label: string }

type Habit = {
  key: HabitKey
  /** Heading used in match breakdowns. */
  category: string
  /** Short column label used in side-by-side comparisons. */
  label: string
  /** Relative importance in the overall score. */
  weight: number
  options: HabitOption[]
}

export const HABITS: Habit[] = [
  {
    key: "sleep",
    category: "Sleep & Wake Rhythm",
    label: "Sleep schedule",
    weight: 3,
    options: [
      { id: "early-bird", label: "Early bird" },
      { id: "fluid", label: "Flexible sleeper" },
      { id: "night-owl", label: "Night owl" },
    ],
  },
  {
    key: "weekend",
    category: "Weekend Mornings",
    label: "Weekend mornings",
    weight: 1,
    options: [
      { id: "early-up", label: "Up by 8 AM" },
      { id: "quiet-until-10", label: "Quiet until 10 AM" },
      { id: "sleep-in", label: "Sleeps in late" },
    ],
  },
  {
    key: "cleanliness",
    category: "Cleanliness & Chores",
    label: "Cleanliness",
    weight: 3,
    options: [
      { id: "meticulous", label: "Meticulous" },
      { id: "tidy", label: "Reasonably tidy" },
      { id: "relaxed", label: "Relaxed about mess" },
    ],
  },
  {
    key: "noise",
    category: "Noise & Social",
    label: "Noise level",
    weight: 3,
    options: [
      { id: "quiet", label: "Library quiet" },
      { id: "moderate", label: "Moderate noise" },
      { id: "lively", label: "Lively & social" },
    ],
  },
]

/** Answers are complete once every habit has a response. */
export function hasCompletedQuiz(
  answers: CompatibilityAnswers | null | undefined
): answers is Required<CompatibilityAnswers> {
  return Boolean(answers && HABITS.every(({ key }) => answers[key]))
}

/** Reads a stored `answers` document, dropping anything the quiz doesn't know. */
export function parseAnswers(value: unknown): CompatibilityAnswers {
  if (!value || typeof value !== "object") return {}
  const answers: CompatibilityAnswers = {}
  for (const habit of HABITS) {
    const answer = (value as Record<string, unknown>)[habit.key]
    if (habit.options.some((option) => option.id === answer)) {
      answers[habit.key] = answer as string
    }
  }
  return answers
}

export function answerLabel(key: HabitKey, answer: string | undefined) {
  const habit = HABITS.find((h) => h.key === key)
  return habit?.options.find((o) => o.id === answer)?.label
}

/** The student's answers as short tags, e.g. ["Early bird", "Meticulous"]. */
export function habitTags(answers: CompatibilityAnswers) {
  return HABITS.filter(({ key }) => key !== "weekend")
    .map(({ key }) => answerLabel(key, answers[key]))
    .filter((label): label is string => Boolean(label))
}

export type HabitComparison = {
  key: HabitKey
  category: string
  label: string
  you: string
  them: string
  /** 0–100: 100 for the same answer, less the further apart on the scale. */
  score: number
}

export type MatchResult = {
  score: number
  rating: string
  comparisons: HabitComparison[]
}

const SCORE_BY_DISTANCE = [100, 60, 20]

/**
 * Scores two students' answers. Returns null unless both finished the quiz,
 * since a partial comparison would overstate how well they fit.
 */
export function scoreMatch(
  mine: CompatibilityAnswers | null | undefined,
  theirs: CompatibilityAnswers | null | undefined
): MatchResult | null {
  if (!hasCompletedQuiz(mine) || !hasCompletedQuiz(theirs)) return null

  let weighted = 0
  let totalWeight = 0
  const comparisons = HABITS.map((habit) => {
    const ids = habit.options.map((o) => o.id)
    const distance = Math.abs(
      ids.indexOf(mine[habit.key]) - ids.indexOf(theirs[habit.key])
    )
    const score = SCORE_BY_DISTANCE[distance] ?? 0
    weighted += score * habit.weight
    totalWeight += habit.weight
    return {
      key: habit.key,
      category: habit.category,
      label: habit.label,
      you: answerLabel(habit.key, mine[habit.key]) ?? "",
      them: answerLabel(habit.key, theirs[habit.key]) ?? "",
      score,
    }
  })

  const score = Math.round(weighted / totalWeight)
  return { score, rating: matchRating(score), comparisons }
}

export function matchRating(score: number) {
  if (score >= 90) return "Exceptional match"
  if (score >= 75) return "Great harmony"
  if (score >= 60) return "Good match"
  return "Different rhythms"
}

/** One line explaining a habit comparison, for breakdown lists. */
export function comparisonDetail(comparison: HabitComparison) {
  if (comparison.score === 100) return `You're both: ${comparison.you}`
  return `You: ${comparison.you} · Them: ${comparison.them}`
}

/**
 * Columns stored beside the raw answers so they can be queried directly.
 * `cleanliness_score` runs 1 (relaxed) to 3 (meticulous).
 */
export function toResponseColumns(answers: Required<CompatibilityAnswers>) {
  const cleanliness = HABITS.find((h) => h.key === "cleanliness")!.options
  return {
    answers,
    sleep_schedule: answers.sleep,
    cleanliness_score:
      cleanliness.length - cleanliness.findIndex((o) => o.id === answers.cleanliness),
    social_habit: answers.noise,
  }
}
