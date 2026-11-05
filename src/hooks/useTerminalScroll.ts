import { useLayoutEffect, useRef } from 'react'
import { isNearBottom } from '../lib/terminal/history'

export function useTerminalScroll(content: unknown) {
  const logRef = useRef<HTMLDivElement>(null)
  const follow = useRef(true)
  useLayoutEffect(() => {
    if (follow.current && logRef.current)
      logRef.current.scrollTop = logRef.current.scrollHeight
  }, [content])
  function onScroll() {
    const element = logRef.current
    if (element)
      follow.current = isNearBottom(
        element.scrollTop,
        element.clientHeight,
        element.scrollHeight,
      )
  }
  return { logRef, onScroll }
}
