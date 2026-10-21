// @vitest-environment jsdom
import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { beforeEach, afterEach, expect, it, vi } from 'vitest'
import type { ChatBackend, ChatReply } from '../types/chat'
import { useByteChat } from './useByteChat'

let root: Root, container: HTMLDivElement
let chat: ReturnType<typeof useByteChat>
let backend: ChatBackend
let effects: ReturnType<typeof vi.fn>
let pending: Map<
  string,
  { resolve: (reply: ChatReply) => void; reject: () => void }
>
let settings: {
  open: boolean
  visible: boolean
  reducedMotion: boolean
  activeFileId: string | null
}
function Probe() {
  chat = useByteChat({ ...settings, backend, applyEffects: effects })
  return <output>{JSON.stringify(chat.current)}</output>
}
async function render() {
  await act(async () =>
    root.render(
      <StrictMode>
        <Probe />
      </StrictMode>,
    ),
  )
}
async function submit(question: string) {
  await act(async () => {
    chat.submit(question)
  })
}
async function reply(question: string, value: ChatReply) {
  await act(async () => pending.get(question)!.resolve(value))
}
async function advance(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms)
  })
}
beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  pending = new Map()
  effects = vi.fn()
  settings = {
    open: true,
    visible: true,
    reducedMotion: false,
    activeFileId: 'about',
  }
  backend = {
    reply: vi.fn(
      (question: string) =>
        new Promise<ChatReply>((resolve, reject) =>
          pending.set(question, {
            resolve,
            reject: () => reject(new Error('offline')),
          }),
        ),
    ),
  }
})
afterEach(async () => {
  await act(async () => root.unmount())
  expect(vi.getTimerCount()).toBe(0)
  container.remove()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
it('applies effects at arrival exactly once, then honors minimum thinking time under StrictMode', async () => {
  await render()
  await submit('projects')
  await advance(100)
  await reply('projects', {
    text: 'Here they are',
    openFile: 'projects',
    switchToPlain: true,
  })
  expect(effects).toHaveBeenCalledExactlyOnceWith([
    { kind: 'open', fileId: 'projects' },
    { kind: 'plain', enabled: true },
  ])
  expect(chat.current?.phase).toBe('thinking')
  await advance(549)
  expect(chat.current?.phase).toBe('thinking')
  await advance(1)
  expect(chat.current?.phase).toBe('typing')
  const id = chat.current!.id
  await act(async () => {
    chat.complete(id)
    chat.complete(id)
  })
  expect(chat.announcement).toBe('Here they are')
  expect(effects).toHaveBeenCalledTimes(1)
  expect(chat.history).toEqual([
    { id, question: 'projects', answer: 'Here they are' },
  ])
  expect(backend.reply).toHaveBeenCalledTimes(1)
})
it('shows streamed text as it arrives and waits for the final reply before effects', async () => {
  let sendText: ((text: string) => void) | undefined
  let finish: ((reply: ChatReply) => void) | undefined
  backend = {
    reply: (_question, _context, onText) => {
      sendText = onText
      return new Promise((resolve) => {
        finish = resolve
      })
    },
  }
  await render()
  await submit('Tell me about Marcus')
  await act(async () => sendText?.('Marcus is a computer engineering'))
  await advance(650)

  expect(chat.current).toMatchObject({
    phase: 'typing',
    streamed: true,
    receiving: true,
    reply: { text: 'Marcus is a computer engineering' },
  })
  expect(effects).not.toHaveBeenCalled()

  await act(async () =>
    finish?.({
      text: 'Marcus is a computer engineering student.',
      openFile: 'about',
    }),
  )
  expect(chat.current).toMatchObject({
    streamed: true,
    receiving: false,
    reply: { text: 'Marcus is a computer engineering student.' },
  })
  expect(effects).toHaveBeenCalledExactlyOnceWith([
    { kind: 'open', fileId: 'about' },
  ])
})
it('waits for a slow backend beyond the minimum and produces friendly timeout and error replies', async () => {
  await render()
  await submit('slow')
  await advance(700)
  expect(chat.current?.phase).toBe('thinking')
  await reply('slow', { text: 'ready' })
  expect(chat.current?.phase).toBe('typing')
  await submit('timeout')
  await advance(10000)
  expect(chat.current?.reply).toBeNull()
  await advance(15000)
  expect(chat.current?.reply?.text).toContain('too long')
  await reply('timeout', { text: 'late', openFile: 'contact' })
  expect(chat.current?.reply?.text).not.toBe('late')
  expect(effects.mock.calls.flat(2)).not.toContainEqual({
    kind: 'open',
    fileId: 'contact',
  })
  await submit('error')
  await act(async () => pending.get('error')!.reject())
  await advance(650)
  expect(chat.current?.reply?.text).toContain('Please try again')
  backend = {
    reply: () => {
      throw new Error('sync failure')
    },
  }
  await render()
  await submit('sync')
  await advance(650)
  expect(chat.current?.reply?.text).toContain('Please try again')
})
it('new questions replace pending requests and stale replies cannot change effects, history or announcements', async () => {
  await render()
  await submit('old')
  await submit('new')
  await reply('new', { text: 'new answer', openFile: 'about' })
  await advance(650)
  const id = chat.current!.id
  await reply('old', { text: 'old answer', openFile: 'resume' })
  await act(async () => chat.complete(id - 1))
  expect(chat.current?.reply?.text).toBe('new answer')
  expect(chat.announcement).toBe('')
  expect(effects).toHaveBeenCalledTimes(1)
  expect(chat.history.map((item) => item.question)).toEqual(['new'])
  await submit('third')
  await reply('third', { text: 'third answer' })
  await advance(650)
  expect(chat.history.map((item) => item.question)).toEqual(['new', 'third'])
})
it('closing cancels pending and typing work, and unmount ignores late results', async () => {
  await render()
  await submit('pending')
  settings.open = false
  await render()
  expect(vi.getTimerCount()).toBe(0)
  await reply('pending', { text: 'ignored', openFile: 'about' })
  expect(chat.current).toBeNull()
  expect(effects).not.toHaveBeenCalled()
  settings.open = true
  await render()
  await submit('typing')
  await reply('typing', { text: 'answer' })
  await advance(650)
  const id = chat.current!.id
  settings.open = false
  await render()
  await act(async () => chat.complete(id))
  expect(chat.current).toBeNull()
  expect(chat.announcement).toBe('')
  settings.open = true
  await render()
  await submit('unmount')
  await act(async () => root.unmount())
  await reply('unmount', { text: 'ignored', openFile: 'contact' })
  expect(effects).toHaveBeenCalledTimes(1)
  root = createRoot(container)
})
it('trims and caps input, ignores empties, and snapshots the active file', async () => {
  await render()
  await submit('   ')
  expect(backend.reply).not.toHaveBeenCalled()
  await submit('  this page  ')
  settings.activeFileId = 'projects'
  await render()
  expect(backend.reply).toHaveBeenCalledWith(
    'this page',
    {
      activeFileId: 'about',
      history: [],
    },
    expect.any(Function),
  )
  await submit('  ' + 'x'.repeat(220) + '  ')
  expect(backend.reply).toHaveBeenLastCalledWith(
    'x'.repeat(200),
    {
      activeFileId: 'projects',
      history: [],
    },
    expect.any(Function),
  )
})
it('keeps recent replies while Byte closes and resets them after unmount', async () => {
  await render()
  await submit('first question')
  await reply('first question', { text: 'first answer' })
  await advance(650)

  settings.open = false
  await render()
  settings.open = true
  await render()
  await submit('follow-up')

  expect(backend.reply).toHaveBeenLastCalledWith(
    'follow-up',
    {
      activeFileId: 'about',
      history: [{ question: 'first question', answer: 'first answer' }],
    },
    expect.any(Function),
  )

  await act(async () => root.unmount())
  root = createRoot(container)
  await render()
  await submit('new visit')
  expect(backend.reply).toHaveBeenLastCalledWith(
    'new visit',
    {
      activeFileId: 'about',
      history: [],
    },
    expect.any(Function),
  )
})
it('removes artificial delay under reduced motion and pauses timers while hidden', async () => {
  settings.reducedMotion = true
  await render()
  await submit('instant')
  expect(chat.current?.phase).toBe('thinking')
  await reply('instant', { text: 'instant answer' })
  expect(chat.current?.phase).toBe('typing')
  expect(vi.getTimerCount()).toBe(0)
  await submit('hidden')
  settings.visible = false
  await render()
  expect(vi.getTimerCount()).toBe(0)
  await advance(26000)
  settings.visible = true
  await render()
  expect(chat.current?.reply?.text).toContain('too long')
})
