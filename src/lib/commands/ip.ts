import type { Command } from '../../types/command'
import { plainTextLine } from './line'

export const ipCommand: Command = {
  name: 'ip',
  description: 'Show the pretend home address',
  run: () => ({
    lines: [plainTextLine('127.0.0.1 (home sweet home, no tracking here)')],
  }),
}
