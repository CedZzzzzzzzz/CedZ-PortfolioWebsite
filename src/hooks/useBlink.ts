import { useEffect, useState } from 'react'

export function useBlink(active: boolean, reducedMotion: boolean) {
  const [blink, setBlink] = useState(false)
  useEffect(() => {
    setBlink(false)
    if (!active || reducedMotion) return
    let timer: ReturnType<typeof setTimeout>
    function schedule() {
      timer = setTimeout(
        () => {
          setBlink(true)
          timer = setTimeout(() => {
            setBlink(false)
            schedule()
          }, 140)
        },
        2500 + Math.random() * 2500,
      )
    }
    schedule()
    return () => clearTimeout(timer)
  }, [active, reducedMotion])
  return active && !reducedMotion && blink
}
