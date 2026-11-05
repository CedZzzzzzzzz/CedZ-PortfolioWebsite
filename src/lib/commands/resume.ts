import type { Command } from '../../types/command'

export const resumeCommand: Command = {
  name: 'resume',
  description: 'Open resume',
  run: () => ({
    lines: [[{ text: 'opened resume', fileId: 'resume', tone: 'accent' }]],
    effects: [{ kind: 'open', fileId: 'resume' }],
  }),
}
