import { describe, expect, it, vi } from 'vitest'
import {
  fetchContributionCalendar,
  toContributionCalendar,
} from './githubContributions'

function reply(days: Array<[string, number, string]>) {
  return {
    data: {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: days.reduce((sum, [, count]) => sum + count, 0),
            weeks: [
              {
                contributionDays: days.map(([date, count, level]) => ({
                  date,
                  contributionCount: count,
                  contributionLevel: level,
                })),
              },
            ],
          },
        },
      },
    },
  }
}

describe('toContributionCalendar', () => {
  it('places a partial week by weekday and maps levels', () => {
    // 2026-11-12 is a Thursday, 2026-11-14 a Saturday.
    const calendar = toContributionCalendar(
      'someone',
      reply([
        ['2026-11-12', 0, 'NONE'],
        ['2026-11-13', 4, 'SECOND_QUARTILE'],
        ['2026-11-14', 12, 'FOURTH_QUARTILE'],
      ]),
    )
    expect(calendar.total).toBe(16)
    expect(calendar.weeks[0]).toEqual([
      null,
      null,
      null,
      null,
      { date: '2026-11-12', count: 0, level: 0 },
      { date: '2026-11-13', count: 4, level: 2 },
      { date: '2026-11-14', count: 12, level: 4 },
    ])
  })

  it('rejects an unknown user and malformed replies', () => {
    expect(() =>
      toContributionCalendar('ghost', { data: { user: null } }),
    ).toThrow('not found')
    expect(() =>
      toContributionCalendar('x', reply([['2026-11-14', -1, 'NONE']])),
    ).toThrow()
    expect(() => toContributionCalendar('x', { errors: [] })).toThrow()
  })
})

describe('fetchContributionCalendar', () => {
  it('sends the token and login to the GraphQL API', async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json(reply([['2026-11-14', 1, 'FIRST_QUARTILE']])),
    )
    const calendar = await fetchContributionCalendar('someone', 't0k', fetchImpl)
    expect(calendar.login).toBe('someone')
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://api.github.com/graphql')
    expect((init.headers as Record<string, string>).Authorization).toBe(
      'Bearer t0k',
    )
    expect(JSON.parse(init.body as string).variables).toEqual({
      login: 'someone',
    })
  })

  it('throws on a non-2xx reply', async () => {
    const fetchImpl = vi.fn(async () => new Response('nope', { status: 401 }))
    await expect(
      fetchContributionCalendar('someone', 'bad', fetchImpl),
    ).rejects.toThrow('401')
  })
})
