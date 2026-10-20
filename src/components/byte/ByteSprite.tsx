import { useEffect, useState } from 'react'
import { spriteFrame } from '../../lib/byte/sprite'
import { useBlink } from '../../hooks/useBlink'
import { useByte } from '../../hooks/useByte'

export function ByteSprite() {
  const { pet, active, reducedMotion } = useByte()
  const blinking = useBlink(active, reducedMotion)
  const [mouthOpen, setMouthOpen] = useState(false)
  useEffect(() => {
    if (!active || reducedMotion || pet.mode !== 'talking') return
    const timer = setInterval(() => setMouthOpen((previous) => !previous), 140)
    return () => clearInterval(timer)
  }, [active, reducedMotion, pet.mode])
  const frame = spriteFrame({
    eyes: pet.cheer ? 'happy' : blinking ? 'blink' : 'open',
    mouth:
      pet.gesture === 'feed'
        ? 'eating'
        : pet.mode === 'talking' && !reducedMotion
          ? mouthOpen
            ? 'talk-open'
            : 'talk-closed'
          : pet.cheer
            ? 'happy'
            : 'neutral',
  })
  return (
    <pre aria-hidden="true" className="byte-sprite">
      {frame.map((line, index) => (
        <span className="byte-sprite-line" key={index}>
          {line.map((part, partIndex) => (
            <span
              key={partIndex}
              className={`byte-tone-${part.tone}${part.scarf ? ' byte-scarf' : ''}`}
            >
              {part.text}
            </span>
          ))}
        </span>
      ))}
    </pre>
  )
}
