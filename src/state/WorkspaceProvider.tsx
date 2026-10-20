import { useEffect, useReducer, useRef, useState, type ReactNode } from 'react'
import type { JsonStorage } from '../lib/storage'
import { WorkspaceDispatchContext, WorkspaceStateContext } from './context'
import { loadInitialState, saveChangedState } from './persistence'
import { workspaceReducer } from './reducer'

function browserStorage(): JsonStorage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

export function WorkspaceProvider({
  children,
  routeAware = false,
}: {
  children: ReactNode
  routeAware?: boolean
}) {
  const [storage] = useState(browserStorage)
  const [state, dispatch] = useReducer(
    workspaceReducer,
    storage,
    (currentStorage) =>
      loadInitialState(
        currentStorage,
        !routeAware || typeof window === 'undefined'
          ? undefined
          : window.location.pathname,
      ),
  )
  const previous = useRef(state)

  useEffect(() => {
    saveChangedState(storage, previous.current, state)
    previous.current = state
  }, [state, storage])

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
    document.documentElement.style.colorScheme = 'dark'
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--bg')
      .trim()
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    )
    if (meta && color) meta.content = color
  }, [state.theme])

  useEffect(() => {
    return () => {
      if (state.resumeUrl?.startsWith('blob:'))
        URL.revokeObjectURL(state.resumeUrl)
    }
  }, [state.resumeUrl])

  return (
    <WorkspaceDispatchContext.Provider value={dispatch}>
      <WorkspaceStateContext.Provider value={state}>
        {children}
      </WorkspaceStateContext.Provider>
    </WorkspaceDispatchContext.Provider>
  )
}
