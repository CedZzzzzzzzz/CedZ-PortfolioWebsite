import type { Command } from '../../types/command'
import { plainTextLine } from './line'

export const huntCommand: Command = {
  name: 'hunt',
  description: 'Let Byte loose in the contribution graph',
  run: (_, ctx) => ({
    lines: ctx.github
      ? [
          plainTextLine('Byte slips into the contribution graph…', 'muted'),
          [
            {
              text: 'contributions in the last 6 months',
              graph: { weeks: 26, variant: 'hunt' },
            },
          ],
        ]
      : [plainTextLine('Byte cannot find the graph right now.', 'muted')],
  }),
}
