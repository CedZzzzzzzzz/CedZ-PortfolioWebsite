export interface JsonStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function readStoredJson<T>(
  storage: JsonStorage,
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T,
): T {
  try {
    const raw = storage.getItem(key)
    if (raw === null) return fallback
    const value: unknown = JSON.parse(raw)
    return isValid(value) ? value : fallback
  } catch {
    return fallback
  }
}

export function writeStoredJson(
  storage: JsonStorage,
  key: string,
  value: unknown,
): boolean {
  try {
    const json = JSON.stringify(value)
    if (json === undefined) return false
    storage.setItem(key, json)
    return true
  } catch {
    return false
  }
}
