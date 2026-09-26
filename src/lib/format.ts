export function formatUsd(amount: number) {
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
}

/** "2027-10-31" → "Oct 2027". Parsed as a local date to avoid a UTC shift. */
export function formatMonthYear(isoDate: string) {
  if (!isoDate) return ""
  return new Date(`${isoDate.slice(0, 10)}T00:00:00`).toLocaleDateString(
    "en-US",
    { month: "short", year: "numeric" }
  )
}

/** "Sopheak Chan" → "SC". */
export function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  )
}

/** "22:00" → "10:00 PM", or "10 PM" when `compact` drops whole hours. */
export function formatTime(value: string, { compact = false } = {}) {
  const [hours, minutes] = value.split(":").map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value
  const period = hours >= 12 ? "PM" : "AM"
  const hour12 = hours % 12 || 12
  if (compact && minutes === 0) return `${hour12} ${period}`
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`
}
