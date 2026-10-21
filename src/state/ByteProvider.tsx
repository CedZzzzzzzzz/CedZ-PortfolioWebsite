import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ByteContext } from './byteContext'
import { useWorkspaceState } from './useWorkspaceState'
import { useWorkspaceDispatch } from './useWorkspaceDispatch'
import { initialPetState, petReducer } from '../lib/byte/petReducer'
import { useDocumentVisible } from '../hooks/useDocumentVisible'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { usePausableTimeout } from '../hooks/usePausableTimeout'
import { useByteChat } from '../hooks/useByteChat'
import { useNavigation } from '../hooks/useNavigation'
import { executeEffects } from '../lib/effects/executeEffects'
import { byteBackend } from '../lib/chat/byteBackend'
import type { ChatBackend } from '../types/chat'

const quips = [
  'the frost sparkles!',
  'a tiny ice dragon says hello',
  '*puff of icy mist*',
  'ask me something!',
]

export function ByteProvider({
  children,
  backend = byteBackend,
}: {
  children: ReactNode
  backend?: ChatBackend
}) {
  const { byteOpen, activeFileId } = useWorkspaceState()
  const { openFile } = useNavigation()
  const dispatch = useWorkspaceDispatch()
  const [pet, send] = useReducer(petReducer, initialPetState)
  const [message, setMessage] = useState({
    id: 0,
    text: 'Hi, I’m Byte. Click me, or try feed and play in the terminal.',
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const handleRef = useRef<HTMLButtonElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const wasOpen = useRef(false)
  const visible = useDocumentVisible()
  const reducedMotion = useReducedMotion()
  const active = byteOpen && visible
  const chat = useByteChat({
    backend,
    activeFileId,
    open: byteOpen,
    visible,
    reducedMotion,
    applyEffects: (effects) => {
      executeEffects(effects, {
        dispatch,
        openFile,
        byte: { open, close, interact },
        openExternal: (href) => {
          window.open(href, '_blank', 'noopener,noreferrer')
        },
      })
    },
  })
  const phase = chat.current?.phase
  const cancelChat = chat.cancel
  useEffect(() => {
    send({
      type:
        phase === 'thinking' ? 'think' : phase === 'typing' ? 'talk' : 'settle',
    })
  }, [phase])

  usePausableTimeout(
    () => send({ type: 'cheer-ended' }),
    2500,
    active && pet.cheer,
    pet.eventId,
  )
  usePausableTimeout(
    () => send({ type: 'gesture-ended' }),
    1100,
    active && pet.gesture !== null,
    pet.eventId,
  )

  function open(trigger?: HTMLElement) {
    if (!byteOpen)
      opener.current =
        trigger ??
        (document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null)
    dispatch({ type: 'set-byte-open', open: true })
  }
  function close() {
    chat.cancel()
    dispatch({ type: 'set-byte-open', open: false })
  }
  useLayoutEffect(() => {
    if (byteOpen && !wasOpen.current) {
      if (!opener.current)
        opener.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null
      inputRef.current?.focus()
    } else if (!byteOpen && wasOpen.current) {
      const trigger = opener.current
      if (trigger?.isConnected && trigger !== document.body) trigger.focus()
      else handleRef.current?.focus()
      opener.current = null
    }
    wasOpen.current = byteOpen
  }, [byteOpen])
  useEffect(() => {
    if (!byteOpen) return
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      if (document.getElementById('launcher-dialog')) return
      event.preventDefault()
      cancelChat()
      dispatch({ type: 'set-byte-open', open: false })
    }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [byteOpen, dispatch, cancelChat])

  function interact(action: 'poke' | 'feed' | 'play') {
    if (!byteOpen) open()
    // Keep an in-progress answer intact; gesture and cheer are independent.
    if (
      !chat.isResponding() &&
      (action === 'poke'
        ? pet.mode === 'idle'
        : pet.mode !== 'thinking' && pet.mode !== 'talking')
    ) {
      chat.dismiss()
      const text =
        action === 'poke'
          ? quips[Math.floor(Math.random() * quips.length)]
          : action === 'feed'
            ? 'nom nom 🍙'
            : 'Whoosh!'
      setMessage((previous) => ({ id: previous.id + 1, text }))
    }
    send({ type: action })
  }
  return (
    <ByteContext.Provider
      value={{
        pet,
        message,
        active,
        reducedMotion,
        inputRef,
        handleRef,
        open,
        close,
        interact,
        chat,
      }}
    >
      {children}
    </ByteContext.Provider>
  )
}
