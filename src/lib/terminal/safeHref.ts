export function safeHref(value: string): string | null {
  const trimmed = value.trim()
  if (
    !/^(https?:\/\/|mailto:)/i.test(trimmed) ||
    [...trimmed].some(
      (character) =>
        character.charCodeAt(0) <= 32 || character.charCodeAt(0) === 127,
    )
  )
    return null
  try {
    const url = new URL(trimmed)
    return ['http:', 'https:', 'mailto:'].includes(url.protocol)
      ? url.href
      : null
  } catch {
    return null
  }
}
