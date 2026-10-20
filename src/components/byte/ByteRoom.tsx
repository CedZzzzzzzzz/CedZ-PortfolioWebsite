import { useEffect, useState, type CSSProperties } from 'react'
import { useByte } from '../../hooks/useByte'
import { usePausableTimeout } from '../../hooks/usePausableTimeout'
import { ByteSprite } from './ByteSprite'

export function ByteRoom() {
  const { pet, active, reducedMotion, interact } = useByte()
  const [position, setPosition] = useState({ percent: 50, direction: 1 })
  const [particleEvent, setParticleEvent] = useState(0)
  const [particles, setParticles] = useState(false)
  useEffect(() => {
    if (!active || reducedMotion) return
    const timer = setInterval(
      () =>
        setPosition((previous) => {
          const percent = Math.random() * 100
          return { percent, direction: percent < previous.percent ? -1 : 1 }
        }),
      4200,
    )
    return () => clearInterval(timer)
  }, [active, reducedMotion])
  usePausableTimeout(
    () => setParticles(false),
    600,
    active && particles,
    particleEvent,
  )
  return (
    <div className="byte-room">
      <div
        className="byte-travel"
        style={{
          left: `calc((100% - 130px) * ${reducedMotion ? 0.5 : position.percent / 100})`,
        }}
      >
        <div
          style={{
            transform: `scaleX(${reducedMotion ? 1 : position.direction})`,
          }}
        >
          <button
            className="byte-pet"
            aria-label="Poke Byte"
            onClick={() => {
              interact('poke')
              if (!reducedMotion) {
                setParticles(true)
                setParticleEvent((previous) => previous + 1)
              }
            }}
          >
            <span
              key={pet.gesture === 'play' ? pet.eventId : 'rest'}
              className={pet.gesture === 'play' ? 'byte-flip' : 'byte-bob'}
            >
              <ByteSprite />
            </span>
          </button>
        </div>
      </div>
      {particles && !reducedMotion && (
        <div key={particleEvent} className="byte-particles" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <span
              key={index}
              style={
                {
                  '--particle-x': `${(index - 1.5) * 35}px`,
                  '--particle-y': `${-25 - (index % 2) * 25}px`,
                } as CSSProperties
              }
            >
              ✦
            </span>
          ))}
        </div>
      )}
      <div className="byte-floor" aria-hidden="true">
        ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
      </div>
    </div>
  )
}
