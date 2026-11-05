import { useEffect, useState } from 'react'
import { useBlink } from '../../hooks/useBlink'
import { useByte } from '../../hooks/useByte'
import {
  spriteFrame,
  spritePalette,
  type SpriteFrameName,
  type SpritePixel,
} from '../../lib/byte/sprite'

function pixelColor(pixel: SpritePixel) {
  return pixel === '.' ? 'transparent' : spritePalette[pixel]
}

export function ByteSprite() {
  const { pet, active, reducedMotion } = useByte()
  const blinking = useBlink(active, reducedMotion)
  const [talkFrame, setTalkFrame] = useState(false)

  useEffect(() => {
    if (!active || reducedMotion || pet.mode !== 'talking') return
    const timer = setInterval(() => setTalkFrame((previous) => !previous), 140)
    return () => clearInterval(timer)
  }, [active, reducedMotion, pet.mode])

  let frame: SpriteFrameName = 'idle'
  if (pet.gesture === 'feed') frame = 'eating'
  else if (pet.mode === 'thinking') frame = 'thinking'
  else if (pet.mode === 'talking') frame = talkFrame ? 'talk-b' : 'talk-a'
  else if (pet.cheer || pet.mode === 'playing') frame = 'happy'
  else if (blinking) frame = 'blink'

  const pixels = spriteFrame(frame)

  return (
    <svg
      aria-hidden="true"
      className="byte-sprite"
      data-frame={frame}
      focusable="false"
      height="110"
      shapeRendering="crispEdges"
      viewBox="0 0 24 22"
      width="120"
    >
      {pixels.map((row, y) => {
        const runs: { color: string; start: number; length: number }[] = []
        row.forEach((pixel, x) => {
          if (pixel === '.') return
          const color = pixelColor(pixel)
          const lastRun = runs.at(-1)
          if (lastRun?.color === color && lastRun.start + lastRun.length === x)
            lastRun.length++
          else runs.push({ color, start: x, length: 1 })
        })

        return runs.map((run) => (
          <rect
            key={`${y}-${run.start}`}
            fill={run.color}
            height="1"
            width={run.length}
            x={run.start}
            y={y}
          />
        ))
      })}
    </svg>
  )
}
