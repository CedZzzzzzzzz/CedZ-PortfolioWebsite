/** GitHub's own quartile bucket for a day, 0 = no contributions. */
export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
  /** ISO date, `YYYY-MM-DD`. */
  date: string
  count: number
  level: ContributionLevel
}

/** One graph column: seven slots, Sunday first; null where the range starts or ends mid-week. */
export type ContributionWeek = readonly (ContributionDay | null)[]

export interface ContributionCalendar {
  login: string
  /** Contributions over the whole calendar (GitHub's "in the last year" figure). */
  total: number
  weeks: readonly ContributionWeek[]
}
