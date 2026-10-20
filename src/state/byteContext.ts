import { createContext, type RefObject } from 'react'
import type { PetState } from '../lib/byte/petReducer'
import type { useByteChat } from '../hooks/useByteChat'

export interface ByteControls {
  pet: PetState
  chat: ReturnType<typeof useByteChat>
  message: { id: number; text: string }
  active: boolean
  reducedMotion: boolean
  inputRef: RefObject<HTMLInputElement>
  handleRef: RefObject<HTMLButtonElement>
  open: (trigger?: HTMLElement) => void
  close: () => void
  interact: (action: 'poke' | 'feed' | 'play') => void
}
export const ByteContext = createContext<ByteControls | null>(null)
