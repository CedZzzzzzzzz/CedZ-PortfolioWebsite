import type { Command } from '../../types/command'
import { plainTextLine } from './line'

export const openCommand: Command = {
  name: 'open',
  aliases: ['cat', 'code'],
  description: 'Open a file by name or id',
  run(args, ctx) {
    const query = args
      .join(' ')
      .toLowerCase()
      .replace(/^projects\//, '')
    const file = ctx.content.files.find(
      (file) =>
        file.id.toLowerCase() === query ||
        file.name.toLowerCase() === args.join(' ').toLowerCase() ||
        file.name.toLowerCase() === query,
    )
    return file
      ? {
          lines: [
            [{ text: `opened ${file.name}`, fileId: file.id, tone: 'accent' }],
          ],
          effects: [{ kind: 'open', fileId: file.id }],
        }
      : {
          lines: [
            plainTextLine(
              args.length
                ? `file not found: ${args.join(' ')}`
                : 'usage: open <file>',
              'error',
            ),
          ],
        }
  },
}
