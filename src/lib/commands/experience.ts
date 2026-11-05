import type { Command } from '../../types/command'

export const experienceCommand: Command = {
  name: 'experience',
  description: 'Open experience',
  run: () => ({
    lines: [
      [{ text: 'opened experience', fileId: 'experience', tone: 'accent' }],
    ],
    effects: [{ kind: 'open', fileId: 'experience' }],
  }),
}
