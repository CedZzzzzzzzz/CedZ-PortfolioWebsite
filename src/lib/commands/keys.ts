import type { Command } from '../../types/command'
import { plainTextLine } from './line'
import { shortcuts, shortcutText } from '../shortcuts/registry'

export const keysCommand: Command = {
  name: 'keys',
  description: 'Show keyboard controls',
  run: () => ({
    lines: [
      plainTextLine('Enter: run · ↑/↓: history · Tab: complete'),
      plainTextLine('Use >_ in the top bar to focus the terminal.'),
      ...shortcuts.map((shortcut) =>
        plainTextLine(
          `${shortcut.label}: ${shortcut.bindings.map(shortcutText).join(' / ')}`,
        ),
      ),
    ],
  }),
}
