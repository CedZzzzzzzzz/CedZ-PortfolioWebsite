import type { Command, Line } from '../../types/command'
import {
  busiestDay,
  formatDay,
  streaks,
  weekdayNames,
  weekdayTotals,
} from '../github/contributionStats'
import { plainTextLine } from './line'

const BAR_WIDTH = 18

export const githubCommand: Command = {
  name: 'github',
  description: 'Contribution graph and GitHub link (--year for 53 weeks)',
  run: (args, ctx) => {
    const login = ctx.content.profile.github
    const link: Line = [
      { text: 'open ', tone: 'muted' },
      {
        text: `github.com/${login} ↗`,
        tone: 'accent',
        href: `https://github.com/${encodeURIComponent(login)}`,
      },
    ]
    const year = args[0]?.toLowerCase() === '--year'
    if (args.length > (year ? 1 : 0))
      return { lines: [plainTextLine('usage: github [--year]', 'error')] }

    const calendar = ctx.github
    if (!calendar)
      return {
        lines: [
          plainTextLine('contribution graph unavailable right now', 'muted'),
          link,
        ],
      }

    const { current, longest } = streaks(calendar)
    const busiest = busiestDay(calendar)
    const totals = weekdayTotals(calendar)
    const max = Math.max(...totals, 1)

    return {
      lines: [
        [{ text: `@${login}`, tone: 'accent' }],
        [
          {
            text: year
              ? 'contributions in the last year'
              : 'contributions in the last 6 months',
            graph: { weeks: year ? 53 : 26, variant: 'scan' },
          },
        ],
        [
          { text: 'streak   ', tone: 'muted' },
          { text: `${current} days now · best ${longest}` },
        ],
        ...(busiest
          ? [
              [
                { text: 'busiest  ', tone: 'muted' },
                {
                  text: `${formatDay(busiest.date)} · ${busiest.count} contributions`,
                },
              ] satisfies Line,
            ]
          : []),
        ...totals.map((total, weekday): Line => {
          const width = Math.round((total / max) * BAR_WIDTH)
          return [
            { text: `${weekdayNames[weekday]}      `, tone: 'muted' },
            {
              text: '█'.repeat(width),
              tone: total === max ? 'accent' : 'normal',
            },
            {
              text: `${'░'.repeat(BAR_WIDTH - width)} ${total}`,
              tone: 'muted',
            },
          ]
        }),
        link,
        ...(year
          ? []
          : [
              [
                { text: 'tip: ', tone: 'muted' },
                {
                  text: 'github --year',
                  tone: 'accent',
                  command: 'github --year',
                },
                { text: ' shows all 53 weeks', tone: 'muted' },
              ] satisfies Line,
            ]),
      ],
    }
  },
}
