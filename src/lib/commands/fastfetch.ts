import type { Command } from '../../types/command'
import { plainTextLine } from './line'

export const fastfetchCommand: Command = {
  name: 'fastfetch',
  aliases: ['neofetch'],
  description: 'Show portfolio information',
  run: (_, ctx) => ({
    lines: [
      plainTextLine('cedz.portfolio', 'accent'),
      plainTextLine(
        `${ctx.content.projects.length} projects · ${ctx.content.skills.length} skill groups · ${ctx.themes.length} themes`,
      ),
      plainTextLine(`active file: ${ctx.activeFileId ?? 'none'}`),
    ],
  }),
}
