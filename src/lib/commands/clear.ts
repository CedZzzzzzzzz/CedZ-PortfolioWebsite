import type { Command } from '../../types/command'

export const clearCommand: Command = {
  name: 'clear',
  description: 'clear screen',
  run() {
    return { lines: [], clear: true }
  },
}
