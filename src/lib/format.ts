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
