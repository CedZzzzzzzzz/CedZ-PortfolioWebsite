import { describe, expect, it, vi } from 'vitest'
import type { JsonStorage } from '../lib/storage'
import { createInitialState } from './initialState'
import { loadInitialState, saveChangedState } from './persistence'

function memoryStorage(values: Record<string, string> = {}): JsonStorage {
  return {
    getItem: (key) => values[key] ?? null,
    setItem: (key, value) => {
      values[key] = value
    },
  }
}

describe('workspace persistence', () => {
  it('loads valid theme, plain view, and versioned images', () => {
    const state = loadInitialState(
      memoryStorage({
        'cedz-theme': '"blue"',
        'cedz-plain': 'true',
        'cedz-imgs': JSON.stringify({
          version: 1,
          projects: { ecobench: 'data:image/png;base64,one' },
          profile: 'data:image/jpeg;base64,two',
        }),
      }),
    )
    expect(state).toMatchObject({
      theme: 'blue',
      plainView: true,
      projectImages: { ecobench: 'data:image/png;base64,one' },
      profileImage: 'data:image/jpeg;base64,two',
    })
    expect(state.tabs).toEqual([])
  })

  it('falls back for invalid theme, plain view, or malformed image shape', () => {
    const state = loadInitialState(
      memoryStorage({
        'cedz-theme': '"light"',
        'cedz-plain': '"true"',
        'cedz-imgs': JSON.stringify({ version: 2, projects: [], profile: 5 }),
      }),
    )
    expect(state).toEqual(createInitialState())
  })

  it('drops unknown project IDs and non-image data', () => {
    const state = loadInitialState(
      memoryStorage({
        'cedz-imgs': JSON.stringify({
          version: 1,
          projects: {
            ecobench: 'data:image/png;base64,valid',
            bifrost: 'https://example.com/image.png',
            unknown: 'data:image/png;base64,unknown',
          },
          profile: null,
        }),
      }),
    )
    expect(state.projectImages).toEqual({
      ecobench: 'data:image/png;base64,valid',
    })
  })

  it('returns defaults when storage access fails', () => {
    const storage: JsonStorage = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: vi.fn(),
    }
    expect(loadInitialState(storage)).toEqual(createInitialState())
    expect(loadInitialState(null)).toEqual(createInitialState())
  })

  it('writes only changed persisted slices', () => {
    const setItem = vi.fn()
    const storage: JsonStorage = { getItem: () => null, setItem }
    const previous = createInitialState()
    saveChangedState(storage, previous, {
      ...previous,
      byteOpen: true,
      tabs: ['about'],
    })
    expect(setItem).not.toHaveBeenCalled()

    const next = {
      ...previous,
      theme: 'tokyo' as const,
      plainView: true,
      projectImages: { ecobench: 'data:image/png;base64,one' },
    }
    saveChangedState(storage, previous, next)
    expect(setItem.mock.calls.map(([key]) => key)).toEqual([
      'cedz-theme',
      'cedz-plain',
      'cedz-imgs',
    ])
    expect(JSON.parse(setItem.mock.calls[2][1])).toEqual({
      version: 1,
      projects: { ecobench: 'data:image/png;base64,one' },
      profile: null,
    })
  })

  it('does not break state when a write fails', () => {
    const storage: JsonStorage = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError')
      },
    }
    const previous = createInitialState()
    const next = { ...previous, theme: 'fire' as const }
    expect(() => saveChangedState(storage, previous, next)).not.toThrow()
    expect(next.theme).toBe('fire')
  })
})
