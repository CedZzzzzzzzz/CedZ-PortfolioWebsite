import { useCallback, useEffect, useRef } from 'react'
import { classifyTouch, classifyWheel } from '../lib/navigation/swipe'
import { useWorkspaceState } from '../state/useWorkspaceState'
import { useWorkspaceDispatch } from '../state/useWorkspaceDispatch'
function blocked(target: EventTarget | null) {
  if (!(target instanceof Element)) return true
  if (
    target.closest('input,textarea,[role="dialog"],.byte-panel,.image-overlay')
  )
    return true
  let parent = target.parentElement
  while (parent) {
    if (
      getComputedStyle(parent).overflowX === 'auto' ||
      getComputedStyle(parent).overflowX === 'scroll'
    )
      return true
    parent = parent.parentElement
  }
  return false
}
export function useSwipeNav() {
  const { tabs, activeFileId, plainView } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  const last = useRef(-1000)
  const touch = useRef<readonly [number, number][]>([])
  const move = useCallback((direction: -1 | 1) => {
    if (plainView || !activeFileId) return false
    const index = tabs.indexOf(activeFileId),
      next = tabs[index + direction]
    if (!next) return false
    dispatch({ type: 'set-active-tab', fileId: next })
    return true
  }, [activeFileId, dispatch, plainView, tabs])
  useEffect(() => {
    const wheel = (event: WheelEvent) => {
      if (blocked(event.target)) return
      const direction = classifyWheel(
        event.deltaX,
        event.deltaY,
        Date.now(),
        last.current,
      )
      if (!direction) return
      if (move(direction)) last.current = Date.now()
    }
    const start = (event: TouchEvent) => {
      if (blocked(event.target)) return
      touch.current = [...event.touches].map(
        (t) => [t.clientX, t.clientY] as [number, number],
      )
    }
    const end = (event: TouchEvent) => {
      if (blocked(event.target)) return
      const points = [...event.changedTouches].map(
        (t) => [t.clientX, t.clientY] as [number, number],
      )
      const direction = classifyTouch(touch.current, points)
      if (direction) move(direction)
      touch.current = []
    }
    window.addEventListener('wheel', wheel, { passive: true })
    window.addEventListener('touchstart', start, { passive: true })
    window.addEventListener('touchend', end, { passive: true })
    return () => {
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('touchstart', start)
      window.removeEventListener('touchend', end)
    }
  }, [move])
}
