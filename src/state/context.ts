import { createContext, type Dispatch } from 'react'
import type { WorkspaceAction, WorkspaceState } from './types'

export const WorkspaceStateContext = createContext<WorkspaceState | null>(null)
export const WorkspaceDispatchContext =
  createContext<Dispatch<WorkspaceAction> | null>(null)
