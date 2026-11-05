import { useCallback, useEffect, useRef } from 'react'

export function useTerminalSounds() {
  const audioContext = useRef<AudioContext | null>(null)

  useEffect(
    () => () => {
      void audioContext.current?.close()
      audioContext.current = null
    },
    [],
  )

  const playTick = useCallback(
    (frequency: number, duration: number, delay = 0, volumeLevel = 0.018) => {
      const AudioContextConstructor = window.AudioContext
      if (!AudioContextConstructor) return

      const context = audioContext.current ?? new AudioContextConstructor()
      audioContext.current = context
      if (context.state === 'suspended') void context.resume()

      const oscillator = context.createOscillator()
      const volume = context.createGain()
      const now = context.currentTime + delay

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(frequency, now)
      volume.gain.setValueAtTime(0.0001, now)
      volume.gain.exponentialRampToValueAtTime(volumeLevel, now + 0.001)
      volume.gain.exponentialRampToValueAtTime(0.0001, now + duration)
      oscillator.connect(volume)
      volume.connect(context.destination)
      oscillator.start(now)
      oscillator.stop(now + duration)
    },
    [],
  )

  const playAction = useCallback(() => {
    playTick(720, 0.012)
    playTick(520, 0.012, 0.045)
  }, [playTick])
  const playKey = useCallback(() => playTick(980, 0.009, 0, 0.012), [playTick])

  return { playAction, playKey }
}
