import { useRef } from 'react'
import { themes, themeNames } from '../../theme/themes'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { useWorkspaceDispatch } from '../../state/useWorkspaceDispatch'

export function ThemePicker() {
  const { theme } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  const buttons = useRef<Array<HTMLButtonElement | null>>([])

  return (
    <section className="profile-themes">
      <p id="profile-theme-label">Theme · {themeNames[theme]}</p>
      <div
        role="radiogroup"
        aria-labelledby="profile-theme-label"
        className="theme-options"
      >
        {themes.map((id, index) => (
          <button
            key={id}
            ref={(element) => {
              buttons.current[index] = element
            }}
            role="radio"
            aria-checked={theme === id}
            tabIndex={theme === id ? 0 : -1}
            onClick={() => dispatch({ type: 'set-theme', theme: id })}
            onKeyDown={(event) => {
              let next: number
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
                next = (index + 1) % themes.length
              else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
                next = (index + themes.length - 1) % themes.length
              else if (event.key === 'Home') next = 0
              else if (event.key === 'End') next = themes.length - 1
              else return
              event.preventDefault()
              dispatch({ type: 'set-theme', theme: themes[next] })
              buttons.current[next]?.focus()
            }}
          >
            {themeNames[id]}
          </button>
        ))}
      </div>
    </section>
  )
}
