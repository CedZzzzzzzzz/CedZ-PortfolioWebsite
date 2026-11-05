import { useEffect, useState } from 'react'
import { useMotionEnabled } from '../motion/useMotionEnabled'

// Adapted from React Bits' DecryptedText component. See REACT_BITS_LICENSE.md.
const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+'

export function DecryptedText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const animated = useMotionEnabled()
  const [shown, setShown] = useState(text)

  useEffect(() => {
    if (!animated) {
      setShown(text)
      return
    }
    let progress = 0
    setShown(
      [...text]
        .map((character) =>
          character === ' '
            ? ' '
            : glyphs[Math.floor(Math.random() * glyphs.length)],
        )
        .join(''),
    )
    const timer = window.setInterval(() => {
      progress += 1
      setShown(
        [...text]
          .map((character, index) => {
            if (character === ' ' || index < progress) return character
            return glyphs[Math.floor(Math.random() * glyphs.length)]
          })
          .join(''),
      )
      if (progress >= text.length) window.clearInterval(timer)
    }, 28)
    return () => window.clearInterval(timer)
  }, [animated, text])

  return (
    <span className={className}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  )
}
