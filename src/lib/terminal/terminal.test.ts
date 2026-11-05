import { describe, expect, it } from 'vitest'
import { safeHref } from './safeHref'
import { mapEffect } from './mapEffect'
import { completeInput, isNearBottom, recall } from './history'
import { createLanding } from './landing'

describe('terminal pure helpers', () => {
  it('allows only explicit web and email links', () => {
    for (const href of [
      'https://example.com',
      'http://localhost:5173/',
      'mailto:hello@example.com',
    ])
      expect(safeHref(href)).not.toBeNull()
    for (const href of [
      'javascript:alert(1)',
      'data:text/html,hi',
      '/about',
      '//example.com',
      'ftp://example.com',
      'https://',
      'java\nscript:alert(1)',
      'https://exa mple.com',
    ])
      expect(safeHref(href)).toBeNull()
  })
  it('maps every effect without browser or state access', () => {
    expect(mapEffect({ kind: 'open', fileId: 'about' })).toEqual([
      { kind: 'navigate', fileId: 'about' },
    ])
    expect(mapEffect({ kind: 'theme', theme: 'blue' })).toEqual([
      { kind: 'dispatch', action: { type: 'set-theme', theme: 'blue' } },
    ])
    expect(mapEffect({ kind: 'plain', enabled: true })).toEqual([
      { kind: 'dispatch', action: { type: 'set-plain-view', enabled: true } },
    ])
    expect(mapEffect({ kind: 'byte', open: false })[0]).toEqual({
      kind: 'byte',
      open: false,
    })
    for (const action of ['feed', 'play'] as const)
      expect(mapEffect({ kind: 'pet', action })).toEqual([
        { kind: 'pet', action },
      ])
    expect(
      mapEffect({ kind: 'external', href: 'https://example.com' }),
    ).toEqual([{ kind: 'external', href: 'https://example.com/' }])
    expect(
      mapEffect({ kind: 'external', href: 'javascript:alert(1)' })[0],
    ).toMatchObject({ kind: 'feedback', error: true })
  })
  it('preserves the unsent draft through history and clamps its ends', () => {
    const history = ['help', 'ls']
    const first = recall(history, 2, '', 'unsent', -1)
    expect(first).toEqual({ index: 1, draft: 'unsent', input: 'ls' })
    const second = recall(history, first.index, first.draft, first.input, -1)
    expect(second.input).toBe('help')
    expect(recall(history, 0, second.draft, second.input, -1).index).toBe(0)
    expect(recall(history, 1, first.draft, 'ls', 1).input).toBe('unsent')
    expect(recall([], 0, '', 'draft', -1).input).toBe('draft')
  })
  it('completes unique and shared prefixes and follows only near the bottom', () => {
    expect(completeInput('pr', ['projects'])).toBe('projects ')
    expect(completeInput('f', ['feed', 'fetch'])).toBe('fe')
    expect(completeInput('x', [])).toBe('x')
    expect(isNearBottom(60, 100, 200)).toBe(true)
    expect(isNearBottom(59, 100, 200)).toBe(false)
  })
  it('builds landing lines entirely from supplied data', () => {
    const lines = createLanding(
      {
        browser: 'Firefox',
        os: 'Linux',
        screen: '800×600',
        city: 'Manila',
        sessionTime: '09:30',
      },
      { projects: 8, skills: 5, themes: 6 },
    )
    const text = lines
      .flat()
      .map((segment) => segment.text)
      .join('\n')
    expect(text).toContain('8 projects · 5 skill groups · 6 themes')
    expect(text).toContain('Firefox on Linux · 800×600')
    expect(text).toContain('09:30')
    expect(text).toContain('Manila')
    expect(text).toMatch(
      /ip\s+(?:10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+)/
    )
    expect(lines.at(-1)?.filter((segment) => segment.command)).toHaveLength(6)
    expect(text).not.toContain('Marcus')
  })
})
