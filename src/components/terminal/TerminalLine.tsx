import type { Line } from '../../types/command'
import { safeHref } from '../../lib/terminal/safeHref'
import { useNavigation } from '../../hooks/useNavigation'
import { DecryptedText } from '../ui/DecryptedText'

export function TerminalLine({
  line,
  run,
  decrypt = false,
}: {
  line: Line
  run: (input: string) => void
  decrypt?: boolean
}) {
  const { openFile } = useNavigation()
  return (
    <div className="terminal-line">
      {line.map((segment, index) => {
        const className = `tone-${segment.tone ?? 'normal'}`
        if (segment.fileId)
          return (
            <button
              key={index}
              className={className}
              onClick={() => openFile(segment.fileId!)}
            >
              {segment.text}
            </button>
          )
        if (segment.command)
          return (
            <button
              key={index}
              className={className}
              onClick={() => run(segment.command!)}
            >
              {segment.text}
            </button>
          )
        const href = segment.href && safeHref(segment.href)
        if (href)
          return (
            <a
              key={index}
              className={className}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {segment.text}
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          )
        return (
          <span key={index} className={className}>
            {decrypt ? <DecryptedText text={segment.text} /> : segment.text}
          </span>
        )
      })}
    </div>
  )
}
