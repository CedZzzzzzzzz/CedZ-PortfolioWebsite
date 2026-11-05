export const HISTORY_LIMIT = 200

export function recall(
  history: readonly string[],
  index: number,
  draft: string,
  input: string,
  direction: -1 | 1,
) {
  const savedDraft = index === history.length ? input : draft
  const next = Math.max(0, Math.min(history.length, index + direction))
  return {
    index: next,
    draft: savedDraft,
    input: next === history.length ? savedDraft : (history[next] ?? savedDraft),
  }
}

export function completeInput(
  input: string,
  matches: readonly string[],
): string {
  if (!matches.length) return input
  if (matches.length === 1) return matches[0] + ' '
  let prefix = matches[0]
  while (!matches.every((match) => match.startsWith(prefix)))
    prefix = prefix.slice(0, -1)
  return prefix.length > input.length ? prefix : input
}

export function isNearBottom(
  scrollTop: number,
  clientHeight: number,
  scrollHeight: number,
): boolean {
  return scrollHeight - scrollTop - clientHeight <= 40
}
