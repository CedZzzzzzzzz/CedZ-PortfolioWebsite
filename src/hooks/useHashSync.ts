import { useEffect, useLayoutEffect, useRef } from 'react'
import { files } from '../content/files'
import { useWorkspaceState } from '../state/useWorkspaceState'
import { useNavigation } from './useNavigation'

/**
 * Deep links through the URL hash: `/terminal#ecobench` opens that tab and
 * `/#projects` scrolls the portfolio view to that section.
 *
 * Each view mounts its own instance, so the portfolio instance only runs once
 * its lazy-loaded sections exist. An instance is idle while the other view shows.
 */
export function useHashSync(view: 'ide' | 'plain') {
  const { activeFileId, plainView } = useWorkspaceState()
  const { openFile } = useNavigation()
  const enabled = plainView === (view === 'plain')
  const latestOpenFile = useRef(openFile)
  useLayoutEffect(() => {
    latestOpenFile.current = openFile
  })

  useEffect(() => {
    if (!enabled) return
    function openFromHash() {
      let id: string
      try {
        id = decodeURIComponent(window.location.hash.slice(1))
      } catch {
        return
      }
      const file = files.find((candidate) => candidate.id === id)
      if (!file) return
      // The portfolio view has one section per folder, not one per file.
      latestOpenFile.current(
        view === 'plain' ? (file.parentId ?? file.id) : file.id,
      )
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [enabled, view])

  useEffect(() => {
    if (!enabled || view !== 'ide') return
    const hash = activeFileId ? `#${activeFileId}` : ''
    if (window.location.hash === hash) return
    // replaceState: switching tabs must not add back-button entries.
    window.history.replaceState(
      window.history.state,
      '',
      window.location.pathname + window.location.search + hash,
    )
  }, [enabled, view, activeFileId])
}
