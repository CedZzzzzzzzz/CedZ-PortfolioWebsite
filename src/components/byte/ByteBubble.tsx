import { useEffect } from 'react'
import { useByte } from '../../hooks/useByte'
import { useTypewriter } from '../../hooks/useTypewriter'
import { useNavigation } from '../../hooks/useNavigation'
import { files } from '../../content/files'
import { Icon } from '../ui/Icon'

export function ByteBubble({
  historyVisible = false,
}: {
  historyVisible?: boolean
}) {
  const { message, active, reducedMotion, chat } = useByte()
  const current = chat.current
  const thinking = current?.phase === 'thinking'
  const text = current ? (current.reply?.text ?? '') : message.text
  const typed = useTypewriter(
    text,
    active && !thinking && !current?.streamed,
    reducedMotion,
    current ? `chat-${current.id}` : `message-${message.id}`,
  )
  const { openFile } = useNavigation()
  const done = current?.streamed
    ? !current.receiving && current.phase !== 'thinking'
    : !thinking && typed.complete
  useEffect(() => {
    if (active && done && current?.phase === 'typing') chat.complete(current.id)
  }, [active, done, current, chat])
  const file = files.find((file) => file.id === current?.reply?.openFile)
  return (
    <>
      <div className="byte-bubble" hidden={historyVisible}>
        {current && <p className="byte-question">you: {current.question}</p>}
        <p className="byte-response" aria-hidden="true">
          {thinking ? (
            <span className="byte-thinking" aria-label="Byte is thinking">
              <span />
              <span />
              <span />
            </span>
          ) : (
            (current?.streamed ? text : typed.text) || '\u00a0'
          )}
        </p>
        {done && current?.reply && (
          <div className="byte-reply-details">
            {current.reply.cards?.map((card) => (
              <button
                className="byte-chat-card"
                key={card.fileId}
                onClick={() => openFile(card.fileId)}
              >
                <strong>{card.title}</strong>
                <span>{card.description}</span>
              </button>
            ))}
            {file && (
              <p className="byte-opened">
                <Icon name="return" /> opened {file.name}
              </p>
            )}
          </div>
        )}
      </div>
      <p className="byte-sr-only" aria-live="polite" aria-atomic="true">
        {current ? chat.announcement : done ? message.text : ''}
      </p>
    </>
  )
}
