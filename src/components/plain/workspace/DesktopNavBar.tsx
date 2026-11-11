import { useState, type MouseEvent } from 'react'
import { profile } from '../../../content/profile'
import { useNavigation } from '../../../hooks/useNavigation'
import { useWorkspaceDispatch } from '../../../state/useWorkspaceDispatch'
import { useWorkspaceState } from '../../../state/useWorkspaceState'
import { DesktopIcon } from './DesktopIcon'
import { desktopSections } from './desktopSections'
import { ThemeMenu } from './ThemeMenu'

const navSections = desktopSections.filter((section) => section.icon)

interface DesktopNavBarProps {
  active: string
}

export function DesktopNavBar({ active }: DesktopNavBarProps) {
  const [expanded, setExpanded] = useState(true)
  const { resumeUrl } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  const nav = useNavigation()
  const file =
    desktopSections.find((section) => section.id === active)?.file ?? ''

  function go(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault()
    nav.openFile(id)
  }

  return (
    <div className="dp-bar-slot">
      <header className="dp-bar-wrap">
        <div className={`dp-bar${expanded ? '' : ' collapsed'}`}>
          <div className="dp-bar-start">
            <button
              type="button"
              className="dp-logo"
              aria-label={expanded ? 'Collapse navigation' : 'Open navigation'}
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              <img src="/Logo/Logo.png" alt="" width="54" height="54" />
            </button>
            {!expanded && (
              <span className="dp-path mono dp-pop">
                <span className="dp-accent">❯</span> ~/cedz-portfolio/{file}
              </span>
            )}
          </div>
          {expanded && (
            <>
              <nav className="dp-nav dp-pop" aria-label="Sections">
                {navSections.map((section) => {
                  const current = section.id === active
                  return (
                    <a
                      key={section.id}
                      className="dp-nav-a"
                      href={`#${section.id}`}
                      aria-label={section.label}
                      aria-current={current ? 'location' : undefined}
                      onClick={(event) => go(event, section.id)}
                    >
                      {section.icon && <DesktopIcon name={section.icon} />}
                      <span className="dp-lbl" aria-hidden="true">
                        {section.label}
                      </span>
                    </a>
                  )
                })}
              </nav>
              <div className="dp-bar-end dp-pop dp-pop2">
                <a
                  className="dp-cv"
                  href={resumeUrl || profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CV (opens in a new tab)"
                >
                  <DesktopIcon name="cv" size={18} />
                  CV
                </a>
                <ThemeMenu />
                <button
                  type="button"
                  className="dp-term mono"
                  aria-label="Terminal view"
                  onClick={() =>
                    dispatch({ type: 'set-plain-view', enabled: false })
                  }
                >
                  <span className="dp-term-glyph" aria-hidden="true">
                    &gt;_
                  </span>
                  <span className="dp-lbl" aria-hidden="true">
                    Terminal view
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </header>
    </div>
  )
}
