export interface SearchItem {
  id: string
  label: string
  keywords?: string[]
}
export interface SearchResult<T extends SearchItem> {
  item: T
  score: number
  index: number
}

export function fuzzySearch<T extends SearchItem>(
  query: string,
  items: readonly T[],
): SearchResult<T>[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return items.map((item, index) => ({ item, score: 0, index }))
  return items
    .map((item, index) => {
      const haystack = [item.label, ...(item.keywords ?? [])]
        .join(' ')
        .toLowerCase()
      let cursor = 0,
        score = 0,
        previous = -2
      for (const char of needle) {
        const found = haystack.indexOf(char, cursor)
        if (found < 0) return null
        score += found === 0 || /\s/.test(haystack[found - 1] ?? '') ? 8 : 1
        if (found === previous + 1) score += 5
        score -= found
        cursor = found + 1
        previous = found
      }
      return { item, score, index }
    })
    .filter((result): result is SearchResult<T> => result !== null)
    .sort((a, b) => b.score - a.score || a.index - b.index)
}
