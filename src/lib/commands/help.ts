import type { Command } from '../../types/command'

export const helpCommand: Command = {
  name: 'help',
  description: 'list commands',
  run(_args, ctx) {
    return {
      lines: ctx.commands.map(({ name, description }) => [
        { text: name, tone: 'accent', command: name },
        { text: `  ${description}`, tone: 'muted' },
      ]),
    }
  },
}
