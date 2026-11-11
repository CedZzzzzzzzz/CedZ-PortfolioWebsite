import { useEffect, useId, useRef, useState } from 'react'
import { themes, themeNames } from '../../../theme/themes'
import type { ThemeName } from '../../../types/navigation'
import { useWorkspaceState } from '../../../state/useWorkspaceState'
import { useWorkspaceDispatch } from '../../../state/useWorkspaceDispatch'
import { DesktopIcon } from './DesktopIcon'

/** Preview chip colors: background, text line, accent dot. */
const previews: Record<ThemeName, [string, string, string]> = {
  light: ['#f5f6f8', '#1f2937', '#111827'],
  dark: ['#000000', '#e8e8e8', '#f2f2f2'],
  blue: ['#070d1f', '#d4e4ff', '#4da3ff'],
  tokyo: ['#09090d', '#ece3e3', '#ff2e4d'],
  fire: ['#110500', '#ffead2', '#ff6a00'],
  scar: ['#0d0608', '#f5f2f0', '#ff3158'],
}

export function ThemeMenu() {
  const { theme } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const options = useRef<Array<HTMLButtonElement | null>>([])
  const menuId = useId()
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    options.current
      .find((option) => option?.getAttribute('aria-checked') === 'true')
      ?.focus()
    function closeOutside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [open])

  function close() {
    setOpen(false)
    trigger.current?.focus()
  }

  function pick(index: number) {
    dispatch({ type: 'set-theme', theme: themes[index] })
    options.current[index]?.focus()
  }

  return (
    <div
      ref={root}
      className="dp-theme"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation()
          close()
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="dp-theme-btn"
        aria-label={`Theme: ${themeNames[theme]}`}
        title={`Theme: ${themeNames[theme]}`}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <DesktopIcon name="palette" size={19} strokeWidth={1.8} />
        <span className="dp-theme-dot" aria-hidden="true" />
      </button>
      {open && (
        <div
          id={menuId}
          className="dp-theme-menu"
          role="dialog"
          aria-labelledby={titleId}
        >
          <div className="dp-theme-input mono" aria-hidden="true">
            <span className="dp-accent">❯</span>
            <span className="dp-theme-cmd">
              theme <span>{theme}</span>
            </span>
            <span className="dp-kbd">esc</span>
          </div>
          <p className="dp-ptitle" id={titleId}>
            Color theme
          </p>
          <div
            className="dp-theme-list"
            role="radiogroup"
            aria-labelledby={titleId}
          >
            {themes.map((id, index) => {
              const [bg, fg, dot] = previews[id]
              const checked = id === theme
              return (
                <button
                  key={id}
                  ref={(element) => {
                    options.current[index] = element
                  }}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  tabIndex={checked ? 0 : -1}
                  className="dp-theme-opt"
                  onClick={() => pick(index)}
                  onKeyDown={(event) => {
                    let next: number
                    if (event.key === 'ArrowDown' || event.key === 'ArrowRight')
                      next = (index + 1) % themes.length
                    else if (
                      event.key === 'ArrowUp' ||
                      event.key === 'ArrowLeft'
                    )
                      next = (index + themes.length - 1) % themes.length
                    else if (event.key === 'Home') next = 0
                    else if (event.key === 'End') next = themes.length - 1
                    else return
                    event.preventDefault()
                    pick(next)
                  }}
                >
                  <span
                    className="dp-theme-chip"
                    aria-hidden="true"
                    style={{ background: bg }}
                  >
                    <span style={{ background: fg }} />
                    <span
                      className="dp-theme-chip-dot"
                      style={{ background: dot, boxShadow: `0 0 6px ${dot}` }}
                    />
                  </span>
                  <span className="dp-theme-name">{themeNames[id]}</span>
                  {checked && (
                    <DesktopIcon name="check" size={16} strokeWidth={2.6} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
