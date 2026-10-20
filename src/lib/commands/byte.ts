import type { Command } from '../../types/command'

export const byteCommand: Command = {
  name: 'byte',
  description: 'Open Byte',
  run: () => ({ lines: [], effects: [{ kind: 'byte', open: true }] }),
}
