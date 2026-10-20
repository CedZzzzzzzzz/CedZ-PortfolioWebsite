import { createContext } from 'react'

export interface LauncherState {
  open: boolean
  opener: HTMLElement | null
  show: (opener?: HTMLElement) => void
  close: () => void
}

export const Context = createContext<LauncherState | null>(null)
