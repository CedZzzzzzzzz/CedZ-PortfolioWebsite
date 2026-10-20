import type { Line } from '../../types/command'
import { safeHref } from '../../lib/terminal/safeHref'
import { useNavigation } from '../../hooks/useNavigation'

export function TerminalLine({
  line,
  run,
}: {
  line: Line
  run: (input: string) => void
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
            </a>
          )
        return (
          <span key={index} className={className}>
            {segment.text}
          </span>
        )
      })}
    </div>
  )
}
