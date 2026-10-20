import type { Command } from '../../types/command'
import { plainTextLine } from './line'

export const themeCommand: Command = {
  name: 'theme',
  description: 'Set dark, blue, tokyo, or fire',
  run(args, ctx) {
    const theme = ctx.themes.find((theme) => theme === args[0]?.toLowerCase())
    return theme && args.length === 1
      ? {
          lines: [plainTextLine(`theme: ${theme}`, 'ok')],
          effects: [{ kind: 'theme', theme }],
        }
      : {
          lines: [
            plainTextLine(`usage: theme <${ctx.themes.join('|')}>`, 'error'),
          ],
        }
  },
}
