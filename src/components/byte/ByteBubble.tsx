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
    active && !thinking,
    reducedMotion,
    current ? `chat-${current.id}` : `message-${message.id}`,
  )
  const { openFile } = useNavigation()
  const done = !thinking && typed.complete
  useEffect(() => {
    if (active && done && current?.phase === 'typing') chat.complete(current.id)
  }, [active, done, current, chat])
  const file = files.find((file) => file.id === current?.reply?.openFile)
  return (
    <>
      <div className="byte-bubble" hidden={historyVisible}>
        <p aria-hidden="true">{thinking ? '...' : typed.text || '\u00a0'}</p>
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
            {file && <p className="byte-opened"><Icon name="return" /> opened {file.name}</p>}
          </div>
        )}
      </div>
      <p className="byte-sr-only" aria-live="polite" aria-atomic="true">
        {current ? chat.announcement : done ? message.text : ''}
      </p>
    </>
  )
}
