import { useEffect, useState } from 'react'
import {
  contributionsLoader,
  type ContributionsResult,
} from '../lib/github/contributionsLoader'

/** The GitHub calendar: `undefined` while loading, `null` when unavailable. */
export function useContributions(): ContributionsResult {
  const [calendar, setCalendar] = useState(contributionsLoader.peek)

  useEffect(() => {
    let live = true
    void contributionsLoader.load().then((result) => {
      if (live) setCalendar(result)
    })
    return () => {
      live = false
    }
  }, [])

  return calendar
}
