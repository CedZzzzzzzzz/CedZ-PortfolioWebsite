import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { fuzzySearch } from '../../lib/launcher/fuzzySearch'
import { buildLauncherItems } from '../../lib/launcher/items'
import { useLauncher } from '../../state/useLauncher'
import { useWorkspaceDispatch } from '../../state/useWorkspaceDispatch'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { useNavigation } from '../../hooks/useNavigation'
import { useTerminalFocus } from '../../hooks/useTerminalFocus'
import { useByte } from '../../hooks/useByte'
import './launcher.css'

export function Launcher() {
  const launcher = useLauncher()
  const { plainView } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  const nav = useNavigation()
  const terminal = useTerminalFocus()
  const byte = useByte()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const items = useMemo(
    () =>
      buildLauncherItems({
        openFile: nav.openFile,
        setTheme: (t) => dispatch({ type: 'set-theme', theme: t }),
        togglePlain: () =>
          dispatch({ type: 'set-plain-view', enabled: !plainView }),
        askByte: () => byte.open(),
        focusTerminal: () => terminal.focusTerminal(),
        openGithub: () =>
          window.open(
            'https://github.com/MarcusCedric',
            '_blank',
            'noopener,noreferrer',
          ),
      }),
    [byte, dispatch, nav.openFile, plainView, terminal],
  )
  const results = fuzzySearch(query, items)
  useEffect(() => {
    if (launcher.open) {
      input.current?.focus()
      setActive(0)
      setQuery('')
    }
  }, [launcher.open])
  useEffect(() => {
    if (!launcher.open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        launcher.close()
      }
      if (e.key === 'Tab') {
        const buttons = [
          input.current,
          ...Array.from(
            document.querySelectorAll<HTMLButtonElement>(
              '#launcher-dialog button',
            ),
          ),
        ]
        if (e.shiftKey && document.activeElement === input.current) {
          e.preventDefault()
          buttons.at(-1)?.focus()
        } else if (!e.shiftKey && document.activeElement === buttons.at(-1)) {
          e.preventDefault()
          input.current?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [launcher])
  if (!launcher.open) return null
  const choose = () => {
    results[active]?.item.run()
    launcher.close()
  }
  return createPortal(
    <div className="launcher-backdrop">
      <div
        id="launcher-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="launcher-title"
      >
        <h2 id="launcher-title">Launcher</h2>
        <input
          ref={input}
          role="combobox"
          aria-label="Search launcher"
          aria-controls="launcher-list"
          aria-expanded="true"
          aria-activedescendant={
            results[active] ? `launcher-${results[active].item.id}` : undefined
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((i) => Math.min(i + 1, results.length - 1))
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((i) => Math.max(i - 1, 0))
            }
            if (e.key === 'Enter') {
              e.preventDefault()
              choose()
            }
          }}
        />
        <div id="launcher-list" role="listbox">
          {results.map((result, index) => (
            <button
              id={`launcher-${result.item.id}`}
              role="option"
              aria-selected={index === active}
              key={result.item.id}
              onMouseEnter={() => setActive(index)}
              onClick={choose}
            >
              {result.item.label}
              <small>{result.item.hint}</small>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
