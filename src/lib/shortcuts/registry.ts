export type ShortcutAction =
  'launcher' | 'terminal' | 'byte' | 'prev-tab' | 'next-tab'
export interface ShortcutBinding {
  key: string
  ctrl?: boolean
  meta?: boolean
  alt?: boolean
}
export interface Shortcut {
  id: ShortcutAction
  label: string
  bindings: ShortcutBinding[]
  allowWhileTyping?: boolean
  hint?: boolean
}
export const shortcuts: readonly Shortcut[] = [
  {
    id: 'launcher',
    label: 'Open launcher',
    bindings: [
      { key: ' ', ctrl: true },
      { key: 'k', ctrl: true },
      { key: 'k', meta: true },
      { key: '/' },
    ],
    hint: true,
  },
  {
    id: 'terminal',
    label: 'Focus terminal',
    bindings: [{ key: '`', ctrl: true }],
  },
  { id: 'byte', label: 'Toggle Byte', bindings: [{ key: 'b' }] },
  {
    id: 'prev-tab',
    label: 'Previous tab',
    bindings: [{ key: 'ArrowLeft', ctrl: true }],
  },
  {
    id: 'next-tab',
    label: 'Next tab',
    bindings: [{ key: 'ArrowRight', ctrl: true }],
  },
]
export function shortcutText(binding: ShortcutBinding) {
  return `${binding.ctrl ? 'Ctrl+' : ''}${binding.meta ? 'Cmd+' : ''}${binding.alt ? 'Alt+' : ''}${binding.key === ' ' ? 'Space' : binding.key}`
}
export interface ShortcutContext {
  key: string
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
  composing?: boolean
  typing?: boolean
}
export function matchShortcut(event: ShortcutContext): ShortcutAction | null {
  if (event.composing) return null
  const typing =
    event.typing && !event.ctrlKey && !event.metaKey && !event.altKey
  for (const shortcut of shortcuts)
    for (const binding of shortcut.bindings) {
      if (binding.key.toLowerCase() !== event.key.toLowerCase()) continue
      if (
        Boolean(binding.ctrl) !== event.ctrlKey ||
        Boolean(binding.meta) !== event.metaKey ||
        Boolean(binding.alt) !== event.altKey
      )
        continue
      if (typing && !shortcut.allowWhileTyping) continue
      return shortcut.id
    }
  return null
}
