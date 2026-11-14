import { z } from 'zod'
import type { ContributionCalendar } from '../../types/github'

const daySchema = z.object({
  date: z.string(),
  count: z.number().int().nonnegative(),
  level: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
  ]),
})

const calendarSchema = z.object({
  login: z.string(),
  total: z.number().int().nonnegative(),
  weeks: z.array(z.array(daySchema.nullable()).length(7)),
})

/** `undefined` while loading, `null` when the graph is unavailable. */
export type ContributionsResult = ContributionCalendar | null | undefined

/** Fetches `/api/github` once per page load and remembers the outcome. */
export function createContributionsLoader(fetchImpl: typeof fetch) {
  let settled: ContributionsResult
  let request: Promise<ContributionCalendar | null> | undefined

  return {
    load(): Promise<ContributionCalendar | null> {
      request ??= fetchImpl('/api/github')
        .then((response) => (response.ok ? response.json() : null))
        .then((body: unknown) => (body ? calendarSchema.parse(body) : null))
        .catch(() => null)
        .then((calendar) => (settled = calendar))
      return request
    },
    peek(): ContributionsResult {
      return settled
    },
  }
}

export const contributionsLoader = createContributionsLoader((input, init) =>
  fetch(input, init),
)
