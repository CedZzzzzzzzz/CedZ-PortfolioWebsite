import type { Command } from '../../types/command'
import { plainTextLine } from './line'

export const plainCommand: Command = {
  name: 'plain',
  description: 'Enable plain view',
  run: () => ({
    lines: [
      plainTextLine(
        'Plain view enabled; the scrolling page arrives in Phase 9.',
      ),
    ],
    effects: [{ kind: 'plain', enabled: true }],
  }),
}
