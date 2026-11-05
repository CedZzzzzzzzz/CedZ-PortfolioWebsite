import type { Command } from '../../types/command'
import { plainTextLine } from './line'

export const githubCommand: Command = {
  name: 'github',
  description: 'Open GitHub',
  run: (_, ctx) => ({
    lines: [plainTextLine('Opening GitHub')],
    effects: [
      {
        kind: 'external',
        href: `https://github.com/${encodeURIComponent(ctx.content.profile.github)}`,
      },
    ],
  }),
}
