import { useEffect, useState } from 'react'

export function useTypewriter(
  text: string,
  active: boolean,
  reducedMotion: boolean,
  key: string | number = 0,
) {
  const [progress, setProgress] = useState({ text, key, count: 0 })
  const characters = Array.from(text)
  const count = reducedMotion
    ? characters.length
    : progress.text === text && progress.key === key
      ? progress.count
      : 0
  const complete = count >= characters.length
  useEffect(() => {
    const length = Array.from(text).length
    if (reducedMotion) {
      setProgress((previous) =>
        previous.text === text &&
        previous.key === key &&
        previous.count === length
          ? previous
          : { text, key, count: length },
      )
      return
    }
    if (!active || complete) return
    const timer = setInterval(
      () =>
        setProgress((previous) => ({
          text,
          key,
          count: Math.min(
            length,
            (previous.text === text && previous.key === key
              ? previous.count
              : 0) + 2,
          ),
        })),
      24,
    )
    return () => clearInterval(timer)
  }, [text, key, active, reducedMotion, complete])
  return { text: characters.slice(0, count).join(''), complete }
}
