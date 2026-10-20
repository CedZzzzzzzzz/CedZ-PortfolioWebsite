import { useEffect, useRef, useState } from 'react'
import { getVisitorInfo } from '../../lib/visitor'
import { banner, createLanding } from '../../lib/terminal/landing'
import { commandContent } from '../../lib/terminal/commandContent'
import { themes } from '../../theme/themes'
import type { Line } from '../../types/command'
import type { CommandRegistry } from '../../lib/commands/registry'
import { useTerminal } from '../../hooks/useTerminal'
import { useTerminalFocus } from '../../hooks/useTerminalFocus'
import { useTerminalScroll } from '../../hooks/useTerminalScroll'
import { TerminalLine } from './TerminalLine'
import { TerminalPrompt } from './TerminalPrompt'
import './terminal.css'

export function Terminal({ registry }: { registry?: CommandRegistry }) {
  const terminal = useTerminal(registry)
  const { focusTerminal } = useTerminalFocus()
  const gathered = useRef(false)
  const [landing, setLanding] = useState<Line[]>([])
  useEffect(() => {
    if (gathered.current) return
    gathered.current = true
    const visitor = getVisitorInfo({
      userAgent: navigator.userAgent,
      screenWidth: screen.width,
      screenHeight: screen.height,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      date: new Date(),
    })
    setLanding(
      createLanding(visitor, {
        projects: commandContent.projects.length,
        skills: commandContent.skills.length,
        themes: themes.length,
      }),
    )
  }, [])
  const { logRef, onScroll } = useTerminalScroll(terminal.entries)
  function run(input: string) {
    terminal.run(input)
    focusTerminal()
  }
  return (
    <div className="terminal">
      <div
        className="terminal-output"
        role="log"
        aria-label="Terminal output"
        aria-live="polite"
        aria-relevant="additions text"
        tabIndex={0}
        ref={logRef}
        onScroll={onScroll}
      >
        {terminal.showLanding && (
          <>
            <pre className="terminal-banner" aria-label="CEDZ">
              {banner}
            </pre>
            {landing.map((line, index) => (
              <TerminalLine key={index} line={line} run={run} />
            ))}
          </>
        )}
        {terminal.entries.map((entry) => (
          <div className="terminal-entry" key={entry.id}>
            {entry.input && <div className="tone-muted">❯ {entry.input}</div>}
            {entry.result.lines.map((line, index) => (
              <TerminalLine key={index} line={line} run={run} />
            ))}
          </div>
        ))}
      </div>
      <TerminalPrompt {...terminal} run={run} />
      <div className="terminal-chips" aria-label="Quick commands">
        {['help', 'ls', 'projects', 'keys'].map((command) => (
          <button key={command} onClick={() => run(command)}>
            {command}
          </button>
        ))}
      </div>
    </div>
  )
}
