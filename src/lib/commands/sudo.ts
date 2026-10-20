import type { Command } from '../../types/command'
import { plainTextLine } from './line'

export const sudoCommand: Command = {
  name: 'sudo',
  description: 'Try administrator privileges',
  run: () => ({
    lines: [
      plainTextLine(
        'Permission denied. Even tiny dragon ninjas need a break.',
        'warn',
      ),
    ],
  }),
}
