import { useEffect, useRef } from 'react'

// Preserve elapsed time across visibility changes, and restart for a new event.
export function usePausableTimeout(
  callback: () => void,
  delay: number,
  active: boolean,
  eventId: number,
) {
  const action = useRef(callback)
  useEffect(() => {
    action.current = callback
  }, [callback])
  const remaining = useRef(delay)
  const previousEvent = useRef(eventId)
  useEffect(() => {
    if (previousEvent.current !== eventId) {
      remaining.current = delay
      previousEvent.current = eventId
    }
    if (!active) return
    const started = Date.now()
    const timer = setTimeout(() => {
      remaining.current = 0
      action.current()
    }, remaining.current)
    return () => {
      clearTimeout(timer)
      remaining.current = Math.max(
        0,
        remaining.current - (Date.now() - started),
      )
    }
  }, [delay, active, eventId])
}
