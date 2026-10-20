import { createContext, type RefObject } from 'react'

export const TerminalFocusContext = createContext<{
  inputRef: RefObject<HTMLInputElement>
  focusTerminal: () => void
} | null>(null)
