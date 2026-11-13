import { describe, expect, it, vi } from 'vitest'
import type { ContributionCalendar, ContributionDay } from '../../types/github'
import { createContributionsLoader } from './contributionsLoader'
import {
  busiestDay,
  formatDay,
  recentWeeks,
  sparkline,
  streaks,
  sumWeeks,
  weekdayTotals,
} from './contributionStats'

const day = (date: string, count: number): ContributionDay => ({
  date,
  count,
  level: count ? 2 : 0,
})

// Two weeks, Sun 2026-11-01 .. Sat 2026-11-14.
const counts = [0, 1, 2, 0, 3, 3, 0, 5, 1, 1, 0, 2, 4, 0]
const days = counts.map((count, i) =>
  day(`2026-11-${String(i + 1).padStart(2, '0')}`, count),
)
const calendar: ContributionCalendar = {
  login: 'someone',
  total: 22,
  weeks: [days.slice(0, 7), days.slice(7)],
}

describe('contribution stats', () => {
  it('sums recent weeks', () => {
    expect(sumWeeks(recentWeeks(calendar, 1))).toBe(13)
    expect(sumWeeks(recentWeeks(calendar, 53))).toBe(22)
  })

  it('keeps a streak alive through an empty today', () => {
    expect(streaks(calendar)).toEqual({ current: 2, longest: 3 })
    const active = {
      ...calendar,
      weeks: [days.slice(0, 7), [...days.slice(7, 13), day('2026-11-14', 1)]],
    }
    expect(streaks(active).current).toBe(3)
  })

  it('finds the busiest day and weekday totals', () => {
    expect(busiestDay(calendar)?.date).toBe('2026-11-08')
    expect(weekdayTotals(calendar)).toEqual([5, 2, 3, 0, 5, 7, 0])
    expect(busiestDay({ ...calendar, weeks: [] })).toBeNull()
  })

  it('draws a sparkline and formats dates in UTC', () => {
    expect(sparkline([0, 5, 10])).toBe('▁▅█')
    expect(sparkline([0, 0])).toBe('▁▁')
    expect(formatDay('2026-11-01')).toBe('Nov 1, 2026')
  })
})

describe('contributions loader', () => {
  const body = {
    login: 'someone',
    total: 1,
    weeks: [[null, null, null, null, null, null, day('2026-11-14', 1)]],
  }

  it('fetches once and remembers the calendar', async () => {
    const fetchImpl = vi.fn(async () => Response.json(body))
    const loader = createContributionsLoader(fetchImpl)
    expect(loader.peek()).toBeUndefined()
    expect(await loader.load()).toEqual(body)
    await loader.load()
    expect(fetchImpl).toHaveBeenCalledTimes(1)
    expect(loader.peek()).toEqual(body)
  })

  it('settles to null on errors and bad payloads', async () => {
    for (const reply of [
      new Response('', { status: 503 }),
      Response.json({ login: 'x', total: -1, weeks: [] }),
    ]) {
      const loader = createContributionsLoader(vi.fn(async () => reply))
      expect(await loader.load()).toBeNull()
      expect(loader.peek()).toBeNull()
    }
    const offline = createContributionsLoader(
      vi.fn(() => Promise.reject(new Error('offline'))),
    )
    expect(await offline.load()).toBeNull()
  })
})
