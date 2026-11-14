import type {
  ContributionCalendar,
  ContributionDay,
  ContributionWeek,
} from '../../types/github'

export const weekdayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

function daysOf(weeks: readonly ContributionWeek[]): ContributionDay[] {
  return weeks.flat().filter((day): day is ContributionDay => day !== null)
}

export function recentWeeks(
  calendar: ContributionCalendar,
  count: number,
): readonly ContributionWeek[] {
  return calendar.weeks.slice(-count)
}

export function sumWeeks(weeks: readonly ContributionWeek[]): number {
  return daysOf(weeks).reduce((sum, day) => sum + day.count, 0)
}

/** Today does not break the current streak until it is over, like GitHub's profile. */
export function streaks(calendar: ContributionCalendar) {
  const days = daysOf(calendar.weeks)
  const last = days.length - 1
  let current = 0
  for (let i = days[last]?.count ? last : last - 1; days[i]?.count; i--)
    current++

  let longest = 0
  let run = 0
  for (const day of days) {
    run = day.count ? run + 1 : 0
    longest = Math.max(longest, run)
  }
  return { current, longest }
}

export function busiestDay(
  calendar: ContributionCalendar,
): ContributionDay | null {
  return daysOf(calendar.weeks).reduce<ContributionDay | null>(
    (best, day) => (day.count > (best?.count ?? 0) ? day : best),
    null,
  )
}

/** Totals per weekday, Sunday first. */
export function weekdayTotals(calendar: ContributionCalendar): number[] {
  const totals = Array<number>(7).fill(0)
  for (const week of calendar.weeks)
    week.forEach((day, weekday) => (totals[weekday] += day?.count ?? 0))
  return totals
}

const sparks = '▁▂▃▄▅▆▇█'

export function sparkline(values: readonly number[]): string {
  const max = Math.max(...values, 1)
  return values
    .map((value) => sparks[Math.round((value / max) * (sparks.length - 1))])
    .join('')
}

export function formatDay(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
