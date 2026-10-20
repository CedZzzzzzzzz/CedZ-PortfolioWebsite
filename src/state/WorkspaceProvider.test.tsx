// @vitest-environment jsdom
import { act, type Dispatch } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { WorkspaceProvider } from './WorkspaceProvider'
import type { WorkspaceAction } from './types'
import { useActiveFile } from './useActiveFile'
import { useWorkspaceDispatch } from './useWorkspaceDispatch'

describe('WorkspaceProvider', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    window.localStorage.clear()
  })

  it('exposes dispatch and active file, applies theme, and revokes resume URLs', async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const revoke = vi.fn()
    const originalRevoke = URL.revokeObjectURL
    URL.revokeObjectURL = revoke
    let dispatch!: Dispatch<WorkspaceAction>

    function Probe() {
      dispatch = useWorkspaceDispatch()
      const activeFile = useActiveFile()
      return <span>{activeFile?.name ?? 'none'}</span>
    }

    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)

    try {
      await act(async () =>
        root.render(
          <WorkspaceProvider>
            <Probe />
          </WorkspaceProvider>,
        ),
      )
      expect(container.textContent).toBe('none')
      expect(document.documentElement.dataset.theme).toBe('dark')

      await act(async () => dispatch({ type: 'open-file', fileId: 'about' }))
      expect(container.textContent).toBe('about.md')
      await act(async () => dispatch({ type: 'set-theme', theme: 'blue' }))
      expect(document.documentElement.dataset.theme).toBe('blue')

      await act(async () =>
        dispatch({ type: 'set-resume-url', url: 'blob:first' }),
      )
      await act(async () =>
        dispatch({ type: 'set-resume-url', url: 'blob:second' }),
      )
      expect(revoke).toHaveBeenCalledWith('blob:first')
      await act(async () => root.unmount())
      expect(revoke).toHaveBeenCalledWith('blob:second')
    } finally {
      URL.revokeObjectURL = originalRevoke
      container.remove()
    }
  })
})
