import { lazy, Suspense, useEffect } from 'react'
import { WorkspaceLayout } from './components/layout/WorkspaceLayout'
import { TerminalFocusProvider } from './state/TerminalFocusProvider'
import { ByteProvider } from './state/ByteProvider'
import { useWorkspaceState } from './state/useWorkspaceState'
import { LauncherProvider } from './state/LauncherProvider'
import { useLauncher } from './state/useLauncher'
import { useShortcuts } from './hooks/useShortcuts'
import { useSwipeNav } from './hooks/useSwipeNav'
import { useTerminalFocus } from './hooks/useTerminalFocus'
import { useByte } from './hooks/useByte'
import { useWorkspaceDispatch } from './state/useWorkspaceDispatch'
import { MotionProvider } from './components/motion/MotionProvider'

const BytePanel = lazy(() =>
  import('./components/byte/BytePanel').then((module) => ({
    default: module.BytePanel,
  })),
)
const Launcher = lazy(() =>
  import('./components/launcher/Launcher').then((module) => ({
    default: module.Launcher,
  })),
)
const PlainView = lazy(() =>
  import('./components/plain/PlainView').then((module) => ({
    default: module.PlainView,
  })),
)

function Application() {
  const { plainView, tabs, activeFileId } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  const launcher = useLauncher()
  const terminal = useTerminalFocus()
  const byte = useByte()
  useEffect(() => {
    const path = plainView ? '/' : '/terminal'
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }
  }, [plainView])
  useEffect(() => {
    function syncViewFromPath() {
      dispatch({
        type: 'set-plain-view',
        enabled: window.location.pathname !== '/terminal',
      })
    }
    window.addEventListener('popstate', syncViewFromPath)
    return () => window.removeEventListener('popstate', syncViewFromPath)
  }, [dispatch])
  useEffect(() => {
    const browser = window as Window & {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number },
      ) => number
      cancelIdleCallback?: (id: number) => void
    }
    const prefetch = () => {
      void import('./components/byte/BytePanel')
      void import('./components/plain/PlainView')
      void import('./components/launcher/Launcher')
      void import('./components/ui/ImageViewer')
    }
    if (browser.requestIdleCallback) {
      const id = browser.requestIdleCallback(prefetch, { timeout: 2000 })
      return () => browser.cancelIdleCallback?.(id)
    }
    const id = window.setTimeout(prefetch, 500)
    return () => window.clearTimeout(id)
  }, [])
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
      {plainView && (
        <Suspense fallback={null}>
          <PlainView />
        </Suspense>
      )}
      <Suspense fallback={null}>
        <BytePanel />
        <Launcher />
      </Suspense>
    </>
  )
}

function App() {
  return (
    <TerminalFocusProvider>
      <LauncherProvider>
        <ByteProvider>
          <MotionProvider>
            <Application />
          </MotionProvider>
        </ByteProvider>
      </LauncherProvider>
    </TerminalFocusProvider>
  )
}

export default App
