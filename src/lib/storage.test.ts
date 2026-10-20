import { describe, expect, it, vi } from 'vitest'
import { readStoredJson, writeStoredJson } from './storage'

describe('JSON storage', () => {
  const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((item) => typeof item === 'string')

  it('reads valid JSON and falls back for missing, invalid, or wrong-shaped data', () => {
    const storage = { getItem: vi.fn(() => '["dark"]'), setItem: vi.fn() }
    expect(readStoredJson(storage, 'themes', [], isStringArray)).toEqual([
      'dark',
    ])
    storage.getItem.mockReturnValue('bad json')
    expect(readStoredJson(storage, 'themes', [], isStringArray)).toEqual([])
    storage.getItem.mockReturnValue('{"wrong":true}')
    expect(readStoredJson(storage, 'themes', [], isStringArray)).toEqual([])
  })

  it('falls back when storage access is blocked', () => {
    const storage = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: vi.fn(),
    }
    expect(readStoredJson(storage, 'themes', ['dark'], isStringArray)).toEqual([
      'dark',
    ])
  })

  it('reports quota and serialization errors without throwing', () => {
    const storage = {
      getItem: vi.fn(),
      setItem: vi.fn(() => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError')
      }),
    }
    expect(writeStoredJson(storage, 'key', { value: 1 })).toBe(false)
    const circular: { self?: unknown } = {}
    circular.self = circular
    expect(writeStoredJson(storage, 'key', circular)).toBe(false)
  })

  it('writes JSON when storage is available', () => {
    const storage = { getItem: vi.fn(), setItem: vi.fn() }
    expect(writeStoredJson(storage, 'key', { value: 1 })).toBe(true)
    expect(storage.setItem).toHaveBeenCalledWith('key', '{"value":1}')
    expect(writeStoredJson(storage, 'key', undefined)).toBe(false)
  })
})
