import type { Command } from '../../types/command'

export const playCommand: Command = {
  name: 'play',
  description: 'Play with Byte',
  run: () => ({ lines: [], effects: [{ kind: 'pet', action: 'play' }] }),
}
