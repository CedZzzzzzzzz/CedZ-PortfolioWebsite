import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { ChatBackend, ChatReply } from '../types/chat'
import type { Effect } from '../types/command'
import { replyEffects } from '../lib/chat/replyEffects'

export interface ByteConversation {
  id: number
  question: string
  reply: ChatReply | null
  phase: 'thinking' | 'typing' | 'complete'
}
export interface ByteHistoryEntry {
  id: number
  question: string
  answer: string
}
interface Options {
  backend: ChatBackend
  activeFileId: string | null
  open: boolean
  visible: boolean
  reducedMotion: boolean
  applyEffects: (effects: Effect[]) => void
}
interface Request {
  id: number
  question: string
  started: number
  reply?: ChatReply
  presented: boolean
  complete: boolean
  timer?: ReturnType<typeof setTimeout>
}
const errorReply = { text: 'Sorry, I couldn’t answer that. Please try again.' }
const timeoutReply = {
  text: 'That took a little too long. Please try asking again.',
}

function clearTimer(item: Request) {
  if (item.timer !== undefined) {
    clearTimeout(item.timer)
    item.timer = undefined
  }
}

export function useByteChat(options: Options) {
  const latest = useRef(options)
  useLayoutEffect(() => {
    latest.current = options
  })
  const request = useRef<Request | null>(null)
  const nextId = useRef(0)
  const mounted = useRef(false)
  const [current, setCurrent] = useState<ByteConversation | null>(null)
  const [history, setHistory] = useState<ByteHistoryEntry[]>([])
  const [announcement, setAnnouncement] = useState('')

  function valid(item: Request) {
    return mounted.current && latest.current.open && request.current === item
  }
  function present(item: Request) {
    clearTimer(item)
    if (!valid(item) || item.complete || !latest.current.visible) return
    const elapsed = Date.now() - item.started
    if (!item.reply) {
      if (elapsed >= 10000) {
        accept(item, timeoutReply)
        return
      }
      item.timer = setTimeout(() => present(item), 10000 - elapsed)
      return
    }
    const remaining = (latest.current.reducedMotion ? 0 : 650) - elapsed
    if (remaining > 0) {
      item.timer = setTimeout(() => present(item), remaining)
      return
    }
    if (!item.presented) {
      item.presented = true
      setCurrent({
        id: item.id,
        question: item.question,
        reply: item.reply,
        phase: 'typing',
      })
    }
  }
  function accept(item: Request, reply: ChatReply) {
    if (!valid(item) || item.reply) return
    clearTimer(item)
    item.reply = Date.now() - item.started >= 10000 ? timeoutReply : reply
    // Acceptance is recorded before effects so callbacks cannot apply them twice.
    latest.current.applyEffects(replyEffects(item.reply))
    if (!valid(item)) return
    setHistory((previous) => [
      ...previous,
      { id: item.id, question: item.question, answer: item.reply!.text },
    ])
    present(item)
  }
  function submit(value: string) {
    const question = value.trim().slice(0, 200)
    if (!question || !latest.current.open) return false
    if (request.current) clearTimer(request.current)
    const item: Request = {
      id: ++nextId.current,
      question,
      started: Date.now(),
      presented: false,
      complete: false,
    }
    request.current = item
    setAnnouncement('')
    setCurrent({ id: item.id, question, reply: null, phase: 'thinking' })
    present(item)
    try {
      const result = latest.current.backend.reply(question, {
        activeFileId: latest.current.activeFileId,
      })
      void result.then(
        (reply) => accept(item, reply),
        () => accept(item, errorReply),
      )
    } catch {
      accept(item, errorReply)
    }
    return true
  }
  function complete(id: number) {
    const item = request.current
    if (
      !item ||
      item.id !== id ||
      !valid(item) ||
      !item.presented ||
      item.complete ||
      !item.reply
    )
      return
    item.complete = true
    setCurrent({
      id: item.id,
      question: item.question,
      reply: item.reply,
      phase: 'complete',
    })
    setAnnouncement(item.reply.text)
  }
  const cancel = useCallback(() => {
    if (request.current) clearTimer(request.current)
    request.current = null
    setCurrent((previous) => (previous?.phase === 'complete' ? previous : null))
    setAnnouncement('')
  }, [])
  function dismiss() {
    cancel()
    setCurrent(null)
  }

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      if (request.current) clearTimer(request.current)
      request.current = null
    }
  }, [])
  useEffect(() => {
    if (!options.open) {
      cancel()
      return
    }
    const item = request.current
    if (item) present(item)
    return () => {
      if (item) clearTimer(item)
    }
    // Lifecycle changes reevaluate the current request; callbacks read latest options.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.open, options.visible, options.reducedMotion])
  function isResponding() {
    return request.current !== null && !request.current.complete
  }
  return {
    current,
    history,
    announcement,
    submit,
    complete,
    cancel,
    dismiss,
    isResponding,
  }
}
