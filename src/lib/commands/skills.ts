import type { Command } from '../../types/command'

export const skillsCommand: Command = {
  name: 'skills',
  description: 'Open skills',
  run: () => ({
    lines: [[{ text: 'opened skills', fileId: 'skills', tone: 'accent' }]],
    effects: [{ kind: 'open', fileId: 'skills' }],
  }),
}
