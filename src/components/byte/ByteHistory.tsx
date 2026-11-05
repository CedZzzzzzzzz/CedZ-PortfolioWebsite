import { useByte } from '../../hooks/useByte'

export function ByteHistory() {
  const { chat } = useByte()
  return (
    <div className="byte-history" aria-label="Conversation history">
      {chat.history.length ? (
        <ol>
          {chat.history.map((entry) => (
            <li key={entry.id}>
              <p>
                <strong>You:</strong> {entry.question}
              </p>
              <p>
                <strong>Byte:</strong> {entry.answer}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p>No conversations yet.</p>
      )}
    </div>
  )
}
