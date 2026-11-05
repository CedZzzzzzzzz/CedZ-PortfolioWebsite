import type { Command } from '../../types/command'

export const projectsCommand: Command = {
  name: 'projects',
  description: 'Open projects',
  run: () => ({
    lines: [[{ text: 'opened projects', fileId: 'projects', tone: 'accent' }]],
    effects: [{ kind: 'open', fileId: 'projects' }],
  }),
}
