import type { Effect } from '../types/command'
import { executeEffects } from '../lib/effects/executeEffects'
import { useWorkspaceDispatch } from '../state/useWorkspaceDispatch'
import { useNavigation } from './useNavigation'
import { useByte } from './useByte'

export function useTerminalEffects() {
  const byte = useByte()
  const dispatch = useWorkspaceDispatch()
  const { openFile } = useNavigation()
  return (effects: readonly Effect[]) =>
    executeEffects(effects, {
      byte,
      dispatch,
      openFile,
      openExternal: (href) => {
        window.open(href, '_blank', 'noopener,noreferrer')
      },
    })
}
