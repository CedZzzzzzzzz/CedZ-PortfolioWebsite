import { z } from 'zod'
import type {
  ContributionCalendar,
  ContributionDay,
  ContributionLevel,
} from '../../src/types/github'

const GRAPHQL_URL = 'https://api.github.com/graphql'

const QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`

const levels: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

const responseSchema = z.object({
  data: z.object({
    user: z
      .object({
        contributionsCollection: z.object({
          contributionCalendar: z.object({
            totalContributions: z.number().int().nonnegative(),
            weeks: z.array(
              z.object({
                contributionDays: z.array(
                  z.object({
                    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
                    contributionCount: z.number().int().nonnegative(),
                    contributionLevel: z.enum([
                      'NONE',
                      'FIRST_QUARTILE',
                      'SECOND_QUARTILE',
                      'THIRD_QUARTILE',
                      'FOURTH_QUARTILE',
                    ]),
                  }),
                ),
              }),
            ),
          }),
        }),
      })
      .nullable(),
  }),
})

/** Validates GitHub's GraphQL reply and places each day in its weekday slot. */
export function toContributionCalendar(
  login: string,
  body: unknown,
): ContributionCalendar {
  const user = responseSchema.parse(body).data.user
  if (!user) throw new Error(`GitHub user not found: ${login}`)
  const calendar = user.contributionsCollection.contributionCalendar

  return {
    login,
    total: calendar.totalContributions,
    weeks: calendar.weeks.map(({ contributionDays }) => {
      const slots: (ContributionDay | null)[] = Array(7).fill(null)
      for (const day of contributionDays) {
        const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay()
        slots[weekday] = {
          date: day.date,
          count: day.contributionCount,
          level: levels[day.contributionLevel],
        }
      }
      return slots
    }),
  }
}

export async function fetchContributionCalendar(
  login: string,
  token: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ContributionCalendar> {
  const response = await fetchImpl(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'cedz-portfolio',
    },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
  })
  if (!response.ok) throw new Error(`GitHub responded ${response.status}`)
  return toContributionCalendar(login, await response.json())
}
