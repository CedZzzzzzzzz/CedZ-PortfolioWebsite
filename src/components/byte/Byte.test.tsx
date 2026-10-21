// @vitest-environment jsdom
import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { WorkspaceProvider } from '../../state/WorkspaceProvider'
import { ByteProvider } from '../../state/ByteProvider'
import { useByte } from '../../hooks/useByte'
import { useTerminal } from '../../hooks/useTerminal'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { BytePanel } from './BytePanel'
import { ByteHandle } from './ByteHandle'
import type { ChatBackend, ChatReply } from '../../types/chat'

let root: Root, container: HTMLDivElement
let media: {
  matches: boolean
  addEventListener: ReturnType<typeof vi.fn>
  removeEventListener: ReturnType<typeof vi.fn>
}
function Probe() {
  const byte = useByte()
  const terminal = useTerminal()
  const workspace = useWorkspaceState()
  return (
    <>
      <output>
        {JSON.stringify({
          pet: byte.pet,
          byteOpen: workspace.byteOpen,
          activeFileId: workspace.activeFileId,
          plainView: workspace.plainView,
        })}
      </output>
      <button onClick={(event) => byte.open(event.currentTarget)}>
        profile opener
      </button>
      {['byte', 'feed', 'play'].map((command) => (
        <button
          key={command}
          onClick={(event) => {
            event.currentTarget.focus()
            terminal.run(command)
          }}
        >
          {command}
        </button>
      ))}
    </>
  )
}
async function mount(backend?: ChatBackend) {
  await act(async () =>
    root.render(
      <StrictMode>
        <WorkspaceProvider>
          <ByteProvider backend={backend}>
            <Probe />
            <ByteHandle />
            <BytePanel />
          </ByteProvider>
        </WorkspaceProvider>
      </StrictMode>,
    ),
  )
}
function button(label: string) {
  return [...container.querySelectorAll<HTMLButtonElement>('button')].find(
    (button) =>
      (button.getAttribute('aria-label') ?? button.textContent) === label,
  )!
}
function panel() {
  return container.querySelector<HTMLElement>('#byte-panel')!
}
async function click(label: string) {
  await act(async () => button(label).click())
}
async function advance(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms)
  })
}
async function visibility(hidden: boolean) {
  await act(async () => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: hidden,
    })
    document.dispatchEvent(new Event('visibilitychange'))
  })
}
beforeEach(() => {
  // Leave jsdom's setImmediate selection/focus tasks real; count Byte timers only.
  vi.useFakeTimers({
    toFake: [
      'setTimeout',
      'clearTimeout',
      'setInterval',
      'clearInterval',
      'Date',
    ],
  })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  media = {
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => media),
  )
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    value: false,
  })
  localStorage.clear()
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(async () => {
  await act(async () => root.unmount())
  expect(vi.getTimerCount()).toBe(0)
  container.remove()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  Reflect.deleteProperty(document, 'hidden')
  localStorage.clear()
})
it('opens from the handle and profile action, focuses input, and restores each opener on Escape or close', async () => {
  await mount()
  expect(panel().hidden).toBe(true)
  expect(vi.getTimerCount()).toBe(0)
  expect(button('Open Byte').getAttribute('aria-controls')).toBe('byte-panel')
  await click('Open Byte')
  expect(panel().hidden).toBe(false)
  expect(document.activeElement?.id).toBe('byte-input')
  expect(button('Open Byte').getAttribute('aria-expanded')).toBe('true')
  expect(button('Open Byte').parentElement!.hidden).toBe(true)
  await act(async () => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    )
  })
  expect(panel().hidden).toBe(true)
  expect(document.activeElement).toBe(button('Open Byte'))
  expect(vi.getTimerCount()).toBe(0)
  await click('profile opener')
  await click('Close Byte')
  expect(document.activeElement).toBe(button('profile opener'))
})
it('renders the icy popup header, pixel sprite room, suggestion chips, and chat input', async () => {
  await mount()
  await click('Open Byte')
  expect(container.querySelector('#byte-heading')?.textContent).toContain(
    '~/byte',
  )
  expect(container.querySelector('#byte-heading')?.textContent).toContain('pet')
  expect(container.querySelector('.byte-gem')).not.toBeNull()
  expect(container.querySelector('.byte-room')).not.toBeNull()
  expect(
    container.querySelectorAll('.byte-sprite rect').length,
  ).toBeGreaterThan(20)
  expect(
    [...container.querySelectorAll('.byte-chips button')].map((chip) =>
      chip.textContent?.trim(),
    ),
  ).toEqual(['about', 'projects', 'experience', 'resume', 'contact'])
  expect(
    container.querySelector('#byte-input')?.getAttribute('placeholder'),
  ).toBe('ask Byte…')
})
it('wires terminal byte/feed/play to the real pet and supports poke particles and timed cheer', async () => {
  await mount()
  await click('byte')
  expect(panel().hidden).toBe(false)
  await click('feed')
  expect(container.querySelector('output')!.textContent).toContain(
    '"mode":"eating"',
  )
  expect(
    container.querySelector('.byte-sprite')!.getAttribute('data-frame'),
  ).toBe('eating')
  await advance(1100)
  await click('play')
  expect(container.querySelector('.byte-flip')).not.toBeNull()
  await advance(1100)
  await click('Poke Byte')
  expect(container.querySelector('.byte-particles')).not.toBeNull()
  expect(container.querySelector('output')!.textContent).toContain(
    '"cheer":true',
  )
  await advance(600)
  expect(container.querySelector('.byte-particles')).toBeNull()
  await advance(1900)
  expect(container.querySelector('output')!.textContent).toContain(
    '"cheer":false',
  )
  await click('Close Byte')
  expect(document.activeElement).toBe(button('byte'))
})
it('pauses all timers while hidden or closed and resumes the remaining cheer time', async () => {
  await mount()
  await click('Open Byte')
  await click('Poke Byte')
  await advance(1000)
  await visibility(true)
  expect(vi.getTimerCount()).toBe(0)
  expect(panel().dataset.paused).toBe('true')
  await advance(10000)
  expect(container.querySelector('output')!.textContent).toContain(
    '"cheer":true',
  )
  await visibility(false)
  await advance(1500)
  expect(container.querySelector('output')!.textContent).toContain(
    '"cheer":false',
  )
  await click('Close Byte')
  expect(vi.getTimerCount()).toBe(0)
})
it('shows text at once with reduced motion, without blink, wandering or particles, and responds to preference changes', async () => {
  media.matches = true
  await mount()
  await click('Open Byte')
  expect(container.querySelector('.byte-response')!.textContent).toContain(
    'Hi, I’m Byte',
  )
  expect(vi.getTimerCount()).toBe(0)
  await click('Poke Byte')
  expect(container.querySelector('.byte-particles')).toBeNull()
  await advance(2500)
  expect(vi.getTimerCount()).toBe(0)
  await act(async () => {
    media.matches = false
    for (const [, callback] of media.addEventListener.mock.calls.slice(-1))
      callback()
  })
  expect(panel().dataset.reduced).toBe('false')
  expect(vi.getTimerCount()).toBeGreaterThan(0)
})
it('announces only completed text and keeps the input local with a 200-character cap', async () => {
  await mount()
  await click('Open Byte')
  const live = container.querySelector('[aria-live="polite"]')!
  expect(live.textContent).toBe('')
  await advance(24)
  expect(live.textContent).toBe('')
  await advance(2000)
  expect(live.textContent).toContain('Hi, I’m Byte')
  const input = container.querySelector<HTMLInputElement>('#byte-input')!
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )!.set!.call(input, '   ' + 'a'.repeat(250))
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
  expect(input.value.length).toBe(200)
  await act(async () => input.blur())
  expect(input.value).not.toMatch(/^\s/)
  expect(button('Send').disabled).toBe(false)
  await click('Toggle Byte history')
  expect(panel().textContent).toContain('No conversations yet.')
  expect(localStorage.length).toBe(0)
})

async function ask(value: string) {
  const input = container.querySelector<HTMLInputElement>('#byte-input')!
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )!.set!.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await act(async () => {
    container
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  })
}

it('applies reply effects before typing, preserves an answer during pet gestures, and reveals cards and one announcement at completion', async () => {
  const answer =
    'This is a longer answer about the portfolio projects and how they were built.'
  const backend: ChatBackend = {
    reply: vi.fn(async () => ({
      text: answer,
      openFile: 'projects',
      cards: [
        {
          fileId: 'ecobench',
          title: 'ECOBENCH',
          description: 'energy monitor',
        },
      ],
    })),
  }
  await mount(backend)
  await click('Open Byte')
  await ask('  projects  ')
  expect(backend.reply).toHaveBeenCalledExactlyOnceWith(
    'projects',
    {
      activeFileId: null,
      history: [],
    },
    expect.any(Function),
  )
  expect(container.querySelector('output')!.textContent).toContain(
    '"activeFileId":"projects"',
  )
  expect(container.querySelector('.byte-thinking')).not.toBeNull()
  expect(button('Send').disabled).toBe(false)
  expect(button('projects').disabled).toBe(false)
  expect(container.querySelector('.byte-chat-card')).toBeNull()
  await advance(650)
  await advance(24)
  expect(container.querySelector('.byte-response')!.textContent).toBe(
    answer.slice(0, 2),
  )
  expect(container.querySelector('[aria-live="polite"]')!.textContent).toBe('')
  await click('Poke Byte')
  await click('feed')
  await click('play')
  expect(container.querySelector('output')!.textContent).toContain(
    '"mode":"talking"',
  )
  expect(container.querySelector('.byte-response')!.textContent).toBe(
    answer.slice(0, 2),
  )
  await advance(2000)
  expect(container.querySelector('.byte-response')!.textContent).toBe(answer)
  expect(container.querySelector('[aria-live="polite"]')!.textContent).toBe(
    answer,
  )
  expect(container.querySelector('.byte-opened')!.textContent).toContain(
    'opened projects/',
  )
  await act(async () =>
    container.querySelector<HTMLButtonElement>('.byte-chat-card')!.click(),
  )
  expect(container.querySelector('output')!.textContent).toContain(
    '"activeFileId":"ecobench"',
  )
  const live = container.querySelector('[aria-live="polite"]')
  await click('Toggle Byte history')
  expect(container.querySelector('.byte-history')!.textContent).toContain(
    'You: projects',
  )
  expect(container.querySelector('.byte-history')!.textContent).toContain(
    answer,
  )
  await click('Toggle Byte history')
  expect(container.querySelector('[aria-live="polite"]')).toBe(live)
  expect(backend.reply).toHaveBeenCalledTimes(1)
  expect(localStorage.length).toBe(0)
  await ask('same answer')
  await advance(650)
  expect(container.querySelector('.byte-response')!.textContent).toBe('\u00a0')
})

it('lets chips replace questions and ignores a stale response, including after closing', async () => {
  const replies = new Map<string, (reply: ChatReply) => void>()
  await mount({
    reply: (question) =>
      new Promise((resolve) => replies.set(question, resolve)),
  })
  await click('Open Byte')
  await ask('old')
  await click('projects')
  await act(async () =>
    replies.get('old')!({ text: 'stale', openFile: 'resume' }),
  )
  expect(container.querySelector('output')!.textContent).toContain(
    '"activeFileId":null',
  )
  await act(async () =>
    replies.get('projects')!({ text: 'new', openFile: 'projects' }),
  )
  await advance(650)
  await advance(48)
  expect(container.querySelector('.byte-response')!.textContent).toBe('new')
  await ask('close')
  await act(async () => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    )
    replies.get('close')!({ text: 'ignored', openFile: 'contact' })
  })
  await click('Open Byte')
  await click('Toggle Byte history')
  expect(container.querySelector('.byte-history')!.textContent).toContain(
    'You: projects',
  )
  expect(container.querySelector('.byte-history')!.textContent).not.toContain(
    'stale',
  )
  expect(container.querySelector('.byte-history')!.textContent).not.toContain(
    'ignored',
  )
})

it('uses a static pending indicator and shows a reduced-motion reply immediately without typing', async () => {
  media.matches = true
  let resolve!: (reply: ChatReply) => void
  await mount({
    reply: () =>
      new Promise((done) => {
        resolve = done
      }),
  })
  await click('Open Byte')
  await ask('simple')
  expect(container.querySelector('.byte-thinking')).not.toBeNull()
  await act(async () =>
    resolve({ text: 'Here is the answer', switchToPlain: true }),
  )
  expect(container.querySelector('.byte-response')!.textContent).toBe(
    'Here is the answer',
  )
  expect(container.querySelector('[aria-live="polite"]')!.textContent).toBe(
    'Here is the answer',
  )
  expect(container.querySelector('output')!.textContent).toContain(
    '"plainView":true',
  )
  expect(container.querySelector('output')!.textContent).toContain(
    '"mode":"idle"',
  )
  expect(vi.getTimerCount()).toBe(0)
})
