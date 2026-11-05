import type { Command } from '../../types/command'

export const aboutCommand: Command = {
  name: 'about',
  description: 'Open about',
  run: () => ({
    lines: [[{ text: 'opened about', fileId: 'about', tone: 'accent' }]],
    effects: [{ kind: 'open', fileId: 'about' }],
  }),
}
