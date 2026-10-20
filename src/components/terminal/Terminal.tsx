import { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
import { getVisitorInfo } from '../../lib/visitor'
import { banner, createLanding } from '../../lib/terminal/landing'
import { commandContent } from '../../lib/terminal/commandContent'
import { themes } from '../../theme/themes'
import type { Line } from '../../types/command'
import type { CommandRegistry } from '../../lib/commands/registry'
import { useTerminal } from '../../hooks/useTerminal'
import { useTerminalFocus } from '../../hooks/useTerminalFocus'
import { useTerminalScroll } from '../../hooks/useTerminalScroll'
import { useMotionEnabled } from '../motion/useMotionEnabled'
import { TerminalLine } from './TerminalLine'
import { TerminalPrompt } from './TerminalPrompt'
import { Icon } from '../ui/Icon'
import './terminal.css'

export function Terminal({ registry }: { registry?: CommandRegistry }) {
  const terminal = useTerminal(registry)
  const animate = useMotionEnabled()
  const { focusTerminal } = useTerminalFocus()
  const gathered = useRef(false)
  const seenEntries = useRef(new Set<number>())
  const [landing, setLanding] = useState<Line[]>([])
  const [hasRunCommand, setHasRunCommand] = useState(false)
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
  useEffect(() => {
    for (const entry of terminal.entries) seenEntries.current.add(entry.id)
  }, [terminal.entries])
  const { logRef, onScroll } = useTerminalScroll(terminal.entries)
  function run(input: string) {
    setHasRunCommand(true)
    terminal.run(input)
    focusTerminal()
  }
  return (
    <div className="terminal">
      <div
        className="terminal-output"
        role="log"
        aria-label="Terminal output"
        aria-live={hasRunCommand ? 'polite' : 'off'}
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
              <TerminalLine
                key={index}
                line={line}
                run={run}
                decrypt={index === 0}
              />
            ))}
          </>
        )}
        {terminal.entries.map((entry) => {
          const isNew = !seenEntries.current.has(entry.id)
          const content = (
            <>
              {entry.input && <div className="tone-muted"><Icon name="prompt" />{entry.input}</div>}
              {entry.result.lines.map((line, index) => (
                <TerminalLine key={index} line={line} run={run} />
              ))}
            </>
          )
          return animate ? (
            <m.div
              className="terminal-entry"
              key={entry.id}
              initial={isNew ? { opacity: 0, y: 3 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
            >
              {content}
            </m.div>
          ) : (
            <div className="terminal-entry" key={entry.id}>
              {content}
            </div>
          )
        })}
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
