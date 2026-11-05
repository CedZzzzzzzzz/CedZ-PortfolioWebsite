import { useContext } from 'react'
import { WorkspaceStateContext } from './context'

export function useWorkspaceState() {
  const state = useContext(WorkspaceStateContext)
  if (!state) throw new Error('useWorkspaceState requires WorkspaceProvider')
  return state
}
