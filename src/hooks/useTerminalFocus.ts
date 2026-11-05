import { useContext } from 'react'
import { TerminalFocusContext } from '../state/terminalFocusContext'

export function useTerminalFocus() {
  const context = useContext(TerminalFocusContext)
  if (!context) throw new Error('TerminalFocusProvider is required')
  return context
}
