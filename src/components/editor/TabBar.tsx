import { useLayoutEffect, useRef } from 'react'
import { files } from '../../content/files'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { useWorkspaceDispatch } from '../../state/useWorkspaceDispatch'

export function TabBar() {
  const { tabs, activeFileId } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  const closed = useRef(false)

  useLayoutEffect(() => {
    if (!closed.current) return
    closed.current = false
    document
      .getElementById(activeFileId ? 'tab-' + activeFileId : 'editor-start')
      ?.focus()
  }, [tabs, activeFileId])

  function activate(fileId: string) {
    dispatch({ type: 'set-active-tab', fileId })
    document.getElementById('tab-' + fileId)?.focus()
  }
  function close(fileId: string) {
    closed.current = true
    dispatch({ type: 'close-tab', fileId })
  }

  return (
    <div className="editor-tabs" role="tablist" aria-label="Open files">
      {tabs.map((id, index) => {
        const file = files.find((item) => item.id === id)
        if (!file) return null
        return (
          <div
            key={id}
            className={'editor-tab' + (id === activeFileId ? ' selected' : '')}
            role="presentation"
          >
            <button
              type="button"
              role="tab"
              id={'tab-' + id}
              aria-selected={id === activeFileId}
              aria-controls={'view-' + id}
              tabIndex={id === activeFileId ? 0 : -1}
              onClick={() => activate(id)}
              onKeyDown={(event) => {
                let next: number | undefined
                if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
                if (event.key === 'ArrowLeft')
                  next = (index - 1 + tabs.length) % tabs.length
                if (event.key === 'Home') next = 0
                if (event.key === 'End') next = tabs.length - 1
                if (next !== undefined) {
                  event.preventDefault()
                  activate(tabs[next])
                }
                if (event.key === 'Delete') {
                  event.preventDefault()
                  close(id)
                }
              }}
            >
              <span aria-hidden="true">{file.icon}</span> {file.name}
            </button>
            <button
              type="button"
              className="close-tab"
              aria-label={'Close ' + file.name}
              onClick={() => close(id)}
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
