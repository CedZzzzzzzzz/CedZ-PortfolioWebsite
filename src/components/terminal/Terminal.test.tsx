// @vitest-environment jsdom
import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { WorkspaceProvider } from '../../state/WorkspaceProvider'
import { ByteProvider } from '../../state/ByteProvider'
import { TerminalFocusProvider } from '../../state/TerminalFocusProvider'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { Terminal } from './Terminal'
import { TerminalLine } from './TerminalLine'
import { TopBar } from '../layout/TopBar'
import {
  createCommandRegistry,
  commandRegistry,
  type CommandRegistry,
} from '../../lib/commands/registry'
import { clearCommand } from '../../lib/commands/clear'
import type { CommandResult } from '../../types/command'
import * as visitor from '../../lib/visitor'

let container: HTMLDivElement
let root: Root
let unmounted: boolean
function State() {
  return <output data-state>{JSON.stringify(useWorkspaceState())}</output>
}
async function mount(registry: CommandRegistry = commandRegistry) {
  await act(async () =>
    root.render(
      <StrictMode>
        <WorkspaceProvider>
          <ByteProvider>
            <TerminalFocusProvider>
              <TopBar />
              <Terminal registry={registry} />
              <State />
            </TerminalFocusProvider>
          </ByteProvider>
        </WorkspaceProvider>
      </StrictMode>,
    ),
  )
}
function input() {
  return container.querySelector<HTMLInputElement>('#terminal-input')!
}
function log() {
  return container.querySelector<HTMLDivElement>('[role="log"]')!
}
async function type(value: string) {
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )!.set!.call(input(), value)
    input().dispatchEvent(new Event('input', { bubbles: true }))
  })
}
async function key(key: string) {
  await act(async () => {
    input().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  })
}
async function run(value: string) {
  await type(value)
  await act(async () => {
    container
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  })
}
function deferredRegistry() {
  let resolve!: (result: CommandResult) => void
  let reject!: (error: Error) => void
  const registry = createCommandRegistry([
    clearCommand,
    {
      name: 'ask',
      description: 'test',
      run: () =>
        new Promise<CommandResult>((yes, no) => {
          resolve = yes
          reject = no
        }),
    },
  ])
  return {
    registry,
    resolve: (result: CommandResult) => resolve(result),
    reject: () => reject(new Error('failed')),
  }
}
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  localStorage.clear()
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  unmounted = false
})
afterEach(async () => {
  if (!unmounted) await act(async () => root.unmount())
  container.remove()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

it('captures visitor information once even in Strict Mode, renders landing, and shares focus with TopBar', async () => {
  const gather = vi.spyOn(visitor, 'getVisitorInfo')
  await mount()
  expect(gather).toHaveBeenCalledTimes(1)
  expect(log().getAttribute('aria-live')).toBe('off')
  expect(log().textContent).toContain('booting cedz.portfolio ...')
  expect(log().querySelector('.terminal-banner')?.textContent).toContain(
    '██████',
  )
  expect(log().textContent).toContain('4 projects · 5 skill groups · 5 themes')
  await act(async () =>
    container
      .querySelector<HTMLButtonElement>('[aria-label="Focus terminal"]')!
      .click(),
  )
  expect(document.activeElement).toBe(input())
  await run('theme blue')
  expect(log().getAttribute('aria-live')).toBe('polite')
  expect(document.documentElement.dataset.theme).toBe('blue')
  expect(gather).toHaveBeenCalledTimes(1)
})
it('runs chips and clickable output, recalls commands, preserves the draft, and completes', async () => {
  await mount()
  await act(async () =>
    container
      .querySelector<HTMLButtonElement>('.terminal-chips button')!
      .click(),
  )
  expect(log().textContent).toContain('Open a file by name or id')
  await run('ls')
  const file = [...log().querySelectorAll('button')].find(
    (button) => button.textContent === 'ecobench.md',
  )!
  await act(async () => file.click())
  expect(container.querySelector('[data-state]')!.textContent).toContain(
    '"activeFileId":"ecobench"',
  )
  await type('unsent')
  await key('ArrowUp')
  expect(input().value).toBe('ls')
  await key('ArrowUp')
  expect(input().value).toBe('help')
  await key('ArrowDown')
  await key('ArrowDown')
  expect(input().value).toBe('unsent')
  await type('proj')
  await key('Tab')
  expect(input().value).toBe('projects ')
  await type('c')
  await key('Tab')
  expect(log().textContent).toContain('clear · cat · code · contact')
  await run('clear')
  expect(log().textContent).toBe('')
})
it('shows pending output and applies a resolved effect exactly once', async () => {
  const deferred = deferredRegistry()
  await mount(deferred.registry)
  await run('ask question')
  expect(log().textContent).toContain('thinking...')
  const open = vi.spyOn(window, 'open').mockReturnValue(null)
  await act(async () =>
    deferred.resolve({
      lines: [[{ text: 'answer' }]],
      effects: [{ kind: 'external', href: 'https://example.com' }],
    }),
  )
  expect(log().textContent).toContain('answer')
  expect(log().textContent).not.toContain('thinking...')
  expect(open).toHaveBeenCalledTimes(1)
  expect(open).toHaveBeenCalledWith(
    'https://example.com/',
    '_blank',
    'noopener,noreferrer',
  )
})
it('reports rejection and timeout, ignoring a late reply and its effects', async () => {
  vi.useFakeTimers()
  const deferred = deferredRegistry()
  await mount(deferred.registry)
  await run('ask fail')
  await act(async () => deferred.reject())
  expect(log().textContent).toContain('Command failed')
  await run('ask slow')
  await act(async () => vi.advanceTimersByTime(10000))
  expect(log().textContent).toContain('Command timed out')
  await act(async () =>
    deferred.resolve({
      lines: [[{ text: 'late answer' }]],
      effects: [{ kind: 'theme', theme: 'fire' }],
    }),
  )
  expect(log().textContent).not.toContain('late answer')
  expect(document.documentElement.dataset.theme).toBe('dark')
})
it('clearing or unmounting cancels pending work', async () => {
  const deferred = deferredRegistry()
  await mount(deferred.registry)
  const open = vi.spyOn(window, 'open').mockReturnValue(null)
  const result: CommandResult = {
    lines: [[{ text: 'stale' }]],
    effects: [{ kind: 'external', href: 'https://example.com' }],
  }
  await run('ask clear')
  await run('clear')
  await act(async () => deferred.resolve(result))
  expect(log().textContent).toBe('')
  expect(open).not.toHaveBeenCalled()
  await run('ask unmount')
  await act(async () => root.unmount())
  unmounted = true
  await act(async () => deferred.resolve(result))
  expect(open).not.toHaveBeenCalled()
})
it('caps output and recalled commands at 200', async () => {
  await mount()
  for (let index = 0; index < 202; index++) await run(`unknown-${index}`)
  expect(log().querySelectorAll('.terminal-entry')).toHaveLength(200)
  expect(log().textContent).not.toContain('❯ unknown-0')
  for (let index = 0; index < 202; index++) await key('ArrowUp')
  expect(input().value).toBe('unknown-2')
})
it('only follows output when the reader is already near the bottom', async () => {
  await mount()
  Object.defineProperties(log(), {
    scrollHeight: { configurable: true, value: 1000 },
    clientHeight: { configurable: true, value: 100 },
  })
  log().scrollTop = 100
  await act(async () => {
    log().dispatchEvent(new Event('scroll', { bubbles: true }))
  })
  await run('help')
  expect(log().scrollTop).toBe(100)
  log().scrollTop = 880
  await act(async () => {
    log().dispatchEvent(new Event('scroll', { bubbles: true }))
  })
  await run('ls')
  expect(log().scrollTop).toBe(1000)
})
it('renders safe links and text for rejected hrefs', async () => {
  await act(async () =>
    root.render(
      <WorkspaceProvider>
        <TerminalLine
          run={() => {}}
          line={[
            { text: 'web', href: 'https://example.com' },
            { text: 'bad', href: 'javascript:alert(1)' },
            { text: 'email', href: 'mailto:hi@example.com' },
          ]}
        />
      </WorkspaceProvider>,
    ),
  )
  expect(container.querySelectorAll('a')).toHaveLength(2)
  expect(container.querySelector('a')!.rel).toBe('noopener noreferrer')
  expect(container.textContent).toContain('bad')
})

it('runs the keyword backend and current Byte and plain-view seams', async () => {
  await mount()
  await run('ask projects')
  expect(log().textContent).toContain('Here are the projects')
  expect(container.querySelector('[data-state]')!.textContent).toContain(
    '"activeFileId":"projects"',
  )
  await run('feed')
  expect(log().textContent).toContain('nom nom')
  expect(container.querySelector('[data-state]')!.textContent).toContain(
    '"byteOpen":true',
  )
  await run('play')
  expect(log().textContent).toContain('hiyah!')
  await run('byte')
  expect(container.querySelector('[data-state]')!.textContent).toContain(
    '"byteOpen":true',
  )
  await run('plain')
  expect(container.querySelector('[data-state]')!.textContent).toContain(
    '"plainView":true',
  )
})

it('keeps concurrent replies in their original entries while synchronous commands run', async () => {
  const replies = new Map<string, (result: CommandResult) => void>()
  const registry = createCommandRegistry([
    {
      name: 'ask',
      description: 'test',
      run: (args) =>
        new Promise<CommandResult>((resolve) => replies.set(args[0], resolve)),
    },
    {
      name: 'now',
      description: 'test',
      run: () => ({ lines: [[{ text: 'immediate' }]] }),
    },
  ])
  await mount(registry)
  await run('ask first')
  await run('ask second')
  await run('now')
  expect(log().textContent).toContain('immediate')
  await act(async () =>
    replies.get('second')!({ lines: [[{ text: 'second answer' }]] }),
  )
  await act(async () =>
    replies.get('first')!({ lines: [[{ text: 'first answer' }]] }),
  )
  const entries = [...log().querySelectorAll('.terminal-entry')].map(
    (entry) => entry.textContent,
  )
  expect(entries).toEqual([
    'ask firstfirst answer',
    'ask secondsecond answer',
    'nowimmediate',
  ])
})
