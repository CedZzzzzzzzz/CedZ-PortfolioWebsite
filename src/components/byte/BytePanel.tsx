import { useState } from 'react'
import { useByte } from '../../hooks/useByte'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { ByteBubble } from './ByteBubble'
import { ByteRoom } from './ByteRoom'
import { ByteHistory } from './ByteHistory'
import './byte.css'
import { Icon } from '../ui/Icon'

export function BytePanel() {
  const { byteOpen } = useWorkspaceState()
  const { active, reducedMotion, inputRef, close, chat } = useByte()
  const [history, setHistory] = useState(false)
  const [input, setInput] = useState('')
  function submit(value: string) {
    if (chat.submit(value)) {
      setInput('')
      setHistory(false)
      inputRef.current?.focus()
    }
  }
  return (
    <section
      id="byte-panel"
      aria-labelledby="byte-heading"
      className="byte-panel"
      hidden={!byteOpen}
      data-paused={!active}
      data-reduced={reducedMotion}
    >
      <header>
        <h2 id="byte-heading">~/byte · mascot</h2>
        <button
          aria-label="Toggle Byte history"
          aria-pressed={history}
          onClick={() => setHistory((previous) => !previous)}
        >
          <Icon name="menu" />
        </button>
        <button aria-label="Close Byte" onClick={close}>
          <Icon name="chevron-right" />
        </button>
      </header>
      <div className="byte-panel-body">
        <ByteBubble historyVisible={history} />
        {history && <ByteHistory />}
        <ByteRoom />
        <div className="byte-chips" aria-label="Ask Byte about">
          {['projects', 'experience', 'resume', 'contact', 'this page'].map(
            (chip) => (
              <button key={chip} onClick={() => submit(chip)}>
                {chip}
              </button>
            ),
          )}
        </div>
        <form
          className="byte-input"
          onSubmit={(event) => {
            event.preventDefault()
            submit(input)
          }}
        >
          <label className="byte-sr-only" htmlFor="byte-input">
            Ask Byte
          </label>
          <input
            id="byte-input"
            ref={inputRef}
            value={input}
            maxLength={200}
            onChange={(event) => setInput(event.target.value.slice(0, 200))}
            onBlur={() => setInput((previous) => previous.trim())}
            placeholder="ask Byte…"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </section>
  )
}
