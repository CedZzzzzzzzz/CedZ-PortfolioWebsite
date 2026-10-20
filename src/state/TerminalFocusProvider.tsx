import { useMemo, useRef, type ReactNode } from 'react'
import { TerminalFocusContext } from './terminalFocusContext'

export function TerminalFocusProvider({ children }: { children: ReactNode }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const value = useMemo(
    () => ({ inputRef, focusTerminal: () => inputRef.current?.focus() }),
    [],
  )
  return (
    <TerminalFocusContext.Provider value={value}>
      {children}
    </TerminalFocusContext.Provider>
  )
}
