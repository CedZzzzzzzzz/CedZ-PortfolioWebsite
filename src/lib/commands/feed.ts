import type { Command } from '../../types/command'

export const feedCommand: Command = {
  name: 'feed',
  description: 'Feed Byte',
  run: () => ({ lines: [], effects: [{ kind: 'pet', action: 'feed' }] }),
}
