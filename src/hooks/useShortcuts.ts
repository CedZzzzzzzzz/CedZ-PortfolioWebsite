import { useEffect } from 'react'
import { matchShortcut, type ShortcutAction } from '../lib/shortcuts/registry'
function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  )
}
export function useShortcuts(
  handlers: Partial<Record<ShortcutAction, () => boolean>>,
) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const action = matchShortcut({
        key: event.key,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        altKey: event.altKey,
        composing: event.isComposing,
        typing: isTyping(event.target),
      })
      if (!action) return
      const handled = handlers[action]?.() ?? false
      if (handled) event.preventDefault()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handlers])
}
