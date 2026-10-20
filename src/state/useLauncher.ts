import { useContext } from 'react'
import { Context } from './launcherContext'

const closedLauncher = {
  open: false,
  opener: null,
  show: () => {},
  close: () => {},
} as const

export function useLauncher() {
  return useContext(Context) ?? closedLauncher
}
