import type { Command } from '../../types/command'
import { plainTextLine } from './line'

export const plainCommand: Command = {
  name: 'plain',
  description: 'Enable portfolio view',
  run: () => ({
    lines: [
      plainTextLine(
        'Portfolio view enabled.',
      ),
    ],
    effects: [{ kind: 'plain', enabled: true }],
  }),
}
