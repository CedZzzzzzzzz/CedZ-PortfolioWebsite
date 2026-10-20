import { useContext } from 'react'
import { WorkspaceDispatchContext } from './context'

export function useWorkspaceDispatch() {
  const dispatch = useContext(WorkspaceDispatchContext)
  if (!dispatch)
    throw new Error('useWorkspaceDispatch requires WorkspaceProvider')
  return dispatch
}
