import { useTerminalFocus } from '../../hooks/useTerminalFocus'
import { Icon } from '../ui/Icon'

interface Props {
  input: string
  setInput: (value: string) => void
  run: (value: string) => void
  navigateHistory: (direction: -1 | 1) => void
  complete: () => void
}
export function TerminalPrompt({
  input,
  setInput,
  run,
  navigateHistory,
  complete,
}: Props) {
  const { inputRef } = useTerminalFocus()
  return (
    <form
      className="terminal-prompt"
      onSubmit={(event) => {
        event.preventDefault()
        run(input)
      }}
    >
      <label htmlFor="terminal-input">
        <Icon name="prompt" />
      </label>
      <input
        id="terminal-input"
        aria-label="Terminal command"
        ref={inputRef}
        value={input}
        onChange={(event) => setInput(event.target.value)}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing) return
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault()
            navigateHistory(event.key === 'ArrowUp' ? -1 : 1)
          }
          if (
            event.key === 'Tab' &&
            !event.shiftKey &&
            input &&
            !/\s/.test(input)
          ) {
            event.preventDefault()
            complete()
          }
        }}
      />
      <button type="submit">run</button>
    </form>
  )
}
