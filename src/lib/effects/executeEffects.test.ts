import { expect, it, vi } from 'vitest'
import { executeEffects } from './executeEffects'

it('executes all mapped effects with the supplied handlers and rejects unsafe external URLs', () => {
  const handlers = {
    openFile: vi.fn(),
    dispatch: vi.fn(),
    byte: { open: vi.fn(), close: vi.fn(), interact: vi.fn() },
    openExternal: vi.fn(),
  }
  const lines = executeEffects(
    [
      { kind: 'open', fileId: 'projects' },
      { kind: 'theme', theme: 'blue' },
      { kind: 'plain', enabled: true },
      { kind: 'byte', open: true },
      { kind: 'byte', open: false },
      { kind: 'pet', action: 'feed' },
      { kind: 'pet', action: 'play' },
      { kind: 'external', href: 'https://example.com' },
      { kind: 'external', href: 'javascript:alert(1)' },
    ],
    handlers,
  )
  expect(handlers.openFile).toHaveBeenCalledExactlyOnceWith('projects')
  expect(handlers.dispatch.mock.calls).toEqual([
    [{ type: 'set-theme', theme: 'blue' }],
    [{ type: 'set-plain-view', enabled: true }],
  ])
  expect(handlers.byte.open).toHaveBeenCalledTimes(1)
  expect(handlers.byte.close).toHaveBeenCalledTimes(1)
  expect(handlers.byte.interact.mock.calls).toEqual([['feed'], ['play']])
  expect(handlers.openExternal).toHaveBeenCalledExactlyOnceWith(
    'https://example.com/',
  )
  expect(lines.at(-1)?.[0].tone).toBe('error')
})
