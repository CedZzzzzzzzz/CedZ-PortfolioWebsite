import { WorkspaceLayout } from './components/layout/WorkspaceLayout'
import { TerminalFocusProvider } from './state/TerminalFocusProvider'
import { ByteProvider } from './state/ByteProvider'
import { ByteHandle } from './components/byte/ByteHandle'
import { BytePanel } from './components/byte/BytePanel'
import { useWorkspaceState } from './state/useWorkspaceState'
import { LauncherProvider } from './state/LauncherProvider'
import { useLauncher } from './state/useLauncher'
import { Launcher } from './components/launcher/Launcher'
import './components/launcher/launcher.css'
import { PlainView } from './components/plain/PlainView'
import { useShortcuts } from './hooks/useShortcuts'
import { useSwipeNav } from './hooks/useSwipeNav'
import { useTerminalFocus } from './hooks/useTerminalFocus'
import { useByte } from './hooks/useByte'
import { useWorkspaceDispatch } from './state/useWorkspaceDispatch'

function Application() {
  const { plainView, tabs, activeFileId } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  const launcher = useLauncher()
  const terminal = useTerminalFocus()
  const byte = useByte()
  useSwipeNav()
  function switchTab(direction: -1 | 1) {
    if (plainView) return true
    if (!activeFileId) return true
    const index = tabs.indexOf(activeFileId)
    const next = tabs[index + direction]
    if (next) dispatch({ type: 'set-active-tab', fileId: next })
    return true
  }
  useShortcuts({
    launcher: () => {
      launcher.show()
      return true
    },
    terminal: () => {
      if (plainView) {
        dispatch({ type: 'set-plain-view', enabled: false })
        requestAnimationFrame(() => terminal.focusTerminal())
      } else {
        terminal.focusTerminal()
      }
      return true
    },
    byte: () => {
      byte.open()
      return true
    },
    'prev-tab': () => switchTab(-1),
    'next-tab': () => switchTab(1),
  })
  return (
    <>
      <div
        className={plainView ? 'ide-shell ide-hidden' : 'ide-shell'}
        aria-hidden={plainView}
      >
        <WorkspaceLayout />
      </div>
      {plainView && <PlainView />}
      <ByteHandle />
      <BytePanel />
      <Launcher />
    </>
  )
}

function App() {
  return (
    <TerminalFocusProvider>
      <LauncherProvider>
        <ByteProvider>
          <Application />
        </ByteProvider>
      </LauncherProvider>
    </TerminalFocusProvider>
  )
}

export default App
