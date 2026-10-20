import type { Command } from '../../types/command'

export const contactCommand: Command = {
  name: 'contact',
  description: 'Open contact',
  run: () => ({
    lines: [[{ text: 'opened contact', fileId: 'contact', tone: 'accent' }]],
    effects: [{ kind: 'open', fileId: 'contact' }],
  }),
}
