import { useEffect, useRef, useState } from 'react'
import type { CommandResult, Line } from '../types/command'
import { commandRegistry, type CommandRegistry } from '../lib/commands/registry'
import { commandContent } from '../lib/terminal/commandContent'
import { plainTextLine } from '../lib/commands/line'
import { completeInput, HISTORY_LIMIT, recall } from '../lib/terminal/history'
import { themes } from '../theme/themes'
import { useWorkspaceState } from '../state/useWorkspaceState'
import { useTerminalEffects } from './useTerminalEffects'
import { useDocumentVisible } from './useDocumentVisible'

interface Entry {
  id: number
  input: string
  result: CommandResult
}
interface PendingCommand {
  timer: ReturnType<typeof setTimeout> | null
  remaining: number
  started: number
  onTimeout: () => void
}
export function useTerminal(registry: CommandRegistry = commandRegistry) {
  const { activeFileId, plainView } = useWorkspaceState()
  const visible = useDocumentVisible()
  const timersActive = visible && !plainView
  const executeEffects = useTerminalEffects()
  const [entries, setEntries] = useState<Entry[]>([])
  const [input, setInput] = useState('')
  const [showLanding, setShowLanding] = useState(true)
  const history = useRef<string[]>([])
  const cursor = useRef(0)
  const draft = useRef('')
  const nextId = useRef(0)
  const pending = useRef(new Map<number, PendingCommand>())
  useEffect(() => {
    const timers = pending.current
    return () => {
      for (const pendingCommand of timers.values()) {
        if (pendingCommand.timer) clearTimeout(pendingCommand.timer)
      }
      timers.clear()
    }
  }, [])
  useEffect(() => {
    for (const pendingCommand of pending.current.values()) {
      if (!timersActive && pendingCommand.timer) {
        clearTimeout(pendingCommand.timer)
        pendingCommand.remaining = Math.max(
          0,
          pendingCommand.remaining - (Date.now() - pendingCommand.started),
        )
        pendingCommand.timer = null
      } else if (timersActive && !pendingCommand.timer) {
        pendingCommand.started = Date.now()
        pendingCommand.timer = setTimeout(
          pendingCommand.onTimeout,
          pendingCommand.remaining,
        )
      }
    }
  }, [timersActive])

  function append(entry: Entry) {
    // Entries older than the cap cannot apply delayed effects.
    for (const [id, pendingCommand] of pending.current)
      if (id <= entry.id - HISTORY_LIMIT) {
        if (pendingCommand.timer) clearTimeout(pendingCommand.timer)
        pending.current.delete(id)
      }
    setEntries((previous) => [...previous, entry].slice(-HISTORY_LIMIT))
  }
  function errorResult(message: string): CommandResult {
    return { lines: [plainTextLine(message, 'error')] }
  }
  function run(value: string) {
    if (!value.trim()) return
    history.current = [...history.current, value].slice(-HISTORY_LIMIT)
    cursor.current = history.current.length
    draft.current = ''
    setInput('')
    const id = nextId.current++
    let result: CommandResult | Promise<CommandResult>
    try {
      result = registry.execute(value, {
        content: commandContent,
        themes,
        activeFileId,
      })
    } catch {
      result = errorResult('Command failed. Please try again.')
    }
    if (result instanceof Promise) {
      append({
        id,
        input: value,
        result: { lines: [plainTextLine('thinking...', 'muted')] },
      })
      const finish = (resolved: CommandResult) => {
        const pendingCommand = pending.current.get(id)
        if (pendingCommand === undefined) return
        if (pendingCommand.timer) clearTimeout(pendingCommand.timer)
        pending.current.delete(id)
        const lines = [
          ...resolved.lines,
          ...executeEffects(resolved.effects ?? []),
        ]
        setEntries((previous) =>
          previous.map((entry) =>
            entry.id === id
              ? { ...entry, result: { ...resolved, lines } }
              : entry,
          ),
        )
      }
      const pendingCommand: PendingCommand = {
        timer: null,
        remaining: 10000,
        started: 0,
        onTimeout: () =>
          finish(errorResult('Command timed out. Please try again.')),
      }
      pending.current.set(id, pendingCommand)
      if (timersActive) {
        pendingCommand.started = Date.now()
        pendingCommand.timer = setTimeout(
          pendingCommand.onTimeout,
          pendingCommand.remaining,
        )
      }
      void result.then(finish, () =>
        finish(errorResult('Command failed. Please try again.')),
      )
    } else if (result.clear) {
      for (const pendingCommand of pending.current.values()) {
        if (pendingCommand.timer) clearTimeout(pendingCommand.timer)
      }
      pending.current.clear()
      setEntries([])
      setShowLanding(false)
    } else {
      append({
        id,
        input: value,
        result: {
          ...result,
          lines: [...result.lines, ...executeEffects(result.effects ?? [])],
        },
      })
    }
  }
  function navigateHistory(direction: -1 | 1) {
    const next = recall(
      history.current,
      cursor.current,
      draft.current,
      input,
      direction,
    )
    cursor.current = next.index
    draft.current = next.draft
    setInput(next.input)
  }
  function complete() {
    if (/\s/.test(input)) return
    const matches = registry.complete(input)
    const completed = completeInput(input, matches)
    setInput(completed)
    if (matches.length > 1 && completed === input) {
      const lines: Line[] = [
        matches.flatMap((command, index) => [
          ...(index ? [{ text: ' · ' }] : []),
          { text: command, command, tone: 'accent' as const },
        ]),
      ]
      append({ id: nextId.current++, input: '', result: { lines } })
    }
  }
  return {
    entries,
    input,
    setInput,
    showLanding,
    run,
    navigateHistory,
    complete,
  }
}
