import { useEffect, useState, type KeyboardEvent } from 'react'
import { profile } from '../../../content/profile'
import { themeNames, themes } from '../../../theme/themes'
import { useNavigation } from '../../../hooks/useNavigation'
import { useWorkspaceDispatch } from '../../../state/useWorkspaceDispatch'
import { useWorkspaceState } from '../../../state/useWorkspaceState'

export function MobileQuickBar() {
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState<{ id: number; text: string } | null>(
    null,
  )
  const { theme, resumeUrl } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  const nav = useNavigation()
  const resume = resumeUrl || profile.resume
  const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length]
  const tabIndex = open ? 0 : -1

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 1800)
    return () => window.clearTimeout(timer)
  }, [notice])

  function switchTheme() {
    dispatch({ type: 'set-theme', theme: nextTheme })
    setNotice({ id: Date.now(), text: `Theme set to ${themeNames[nextTheme]}` })
  }

  function closeOnEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') setOpen(false)
  }

  return (
    <div className="m-quickbar-slot">
      <nav
        className={`m-quickbar${open ? ' open' : ''}`}
        aria-label="Quick actions"
        onKeyDown={closeOnEscape}
      >
        <div className="m-quickbar-items" aria-hidden={!open}>
          <a
            className="m-quick"
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={tabIndex}
          >
            <i className="fas fa-file-alt" aria-hidden="true" />
            <span>CV</span>
          </a>
          <button
            className="m-quick"
            type="button"
            tabIndex={tabIndex}
            aria-label={`Theme ${themeNames[theme]}, switch to ${themeNames[nextTheme]}`}
            onClick={switchTheme}
          >
            <i className="fas fa-circle-half-stroke" aria-hidden="true" />
            <span>Theme</span>
          </button>
          <button
            className="m-quick"
            type="button"
            tabIndex={tabIndex}
            onClick={() => dispatch({ type: 'set-plain-view', enabled: false })}
          >
            <i className="fas fa-terminal" aria-hidden="true" />
            <span>Terminal</span>
          </button>
          <button
            className="m-quick"
            type="button"
            tabIndex={tabIndex}
            onClick={() => {
              setOpen(false)
              nav.openFile('contact')
            }}
          >
            <i className="fas fa-envelope" aria-hidden="true" />
            <span>Contact</span>
          </button>
        </div>
        <button
          className="m-quickbar-toggle"
          type="button"
          aria-label={open ? 'Close quick actions' : 'Open quick actions'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </nav>
      <div className="m-toast-region" role="status" aria-live="polite">
        {notice && (
          <span className="m-toast" key={notice.id}>
            {notice.text}
          </span>
        )}
      </div>
    </div>
  )
}
