import type { Command } from '../../types/command'

export const lsCommand: Command = {
  name: 'ls',
  description: 'list files (click to open)',
  run(_args, ctx) {
    return {
      lines: ctx.content.files.map((file) => [
        { text: file.name, tone: 'accent', fileId: file.id },
      ]),
    }
  },
}
