import type { Line, Tone } from '../../types/command'

export function plainTextLine(text: string, tone?: Tone): Line {
  return [{ text, tone }]
}
