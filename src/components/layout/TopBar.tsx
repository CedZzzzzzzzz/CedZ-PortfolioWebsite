import { useEffect, useState } from 'react'
import { useActiveFile } from '../../state/useActiveFile'
import { useWorkspaceDispatch } from '../../state/useWorkspaceDispatch'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { useTerminalFocus } from '../../hooks/useTerminalFocus'
import { themeNames } from '../../theme/themes'
import { useLauncher } from '../../state/useLauncher'
import { shortcuts, shortcutText } from '../../lib/shortcuts/registry'
import { Icon } from '../ui/Icon'

export function TopBar() {
  const { focusTerminal } = useTerminalFocus()
  const launcher = useLauncher()
  const file = useActiveFile()
  const { plainView, theme } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return (
    <header className="top-bar">
      <div className="bar-start">
        <button
          type="button"
          aria-label="Launcher"
          onClick={(event) => launcher.show(event.currentTarget)}
        >
          <Icon name="diamond" />
        </button>
        <button type="button" aria-label="Focus terminal" onClick={focusTerminal}>
          &gt;_
        </button>
        <span
          className="file-path"
          title={`~/cedz-portfolio/${file?.name ?? ''}`}
        >
          ~/cedz-portfolio/{file?.name ?? ''}
        </span>
      </div>
      <time dateTime={now.toISOString()}>
        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </time>
      <div className="bar-end">
        <button
          type="button"
          aria-pressed={plainView}
          onClick={() =>
            dispatch({ type: 'set-plain-view', enabled: !plainView })
          }
        >
          <Icon name={plainView ? 'diamond' : 'menu'} />{' '}
          {plainView ? 'interactive view' : 'plain view'}
        </button>
        <span className="desktop-label">{themeNames[theme]}</span>
        <span className="desktop-label shortcut-hint">
          {shortcutText(shortcuts[0].bindings[0])}
        </span>
      </div>
    </header>
  )
}
