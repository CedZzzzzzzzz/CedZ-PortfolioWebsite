import { useEffect, useState } from 'react'

/** Counts from 0 up to `total`, one step every `interval` ms; returns `total` at once when motion is off. */
export function useStepper(
  total: number,
  interval: number,
  animate: boolean,
): number {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!animate || step >= total) return
    const timer = setTimeout(() => setStep(step + 1), interval)
    return () => clearTimeout(timer)
  }, [step, total, interval, animate])

  return animate ? Math.min(step, total) : total
}
