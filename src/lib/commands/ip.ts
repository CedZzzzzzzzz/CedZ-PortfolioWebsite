import type { Command } from '../../types/command'
import { createRandomIp } from '../randomIp'
import { plainTextLine } from './line'

export const ipCommand: Command = {
  name: 'ip',
  description: 'Show IP address',
  run: () => ({
    lines: [plainTextLine(createRandomIp())],
  }),
}
