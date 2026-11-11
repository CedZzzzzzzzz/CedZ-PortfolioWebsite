interface SectionHeadProps {
  command: string
  title: string
  summary?: string
  ruled?: boolean
}

/** Terminal prompt, section title, and an optional mono summary on the right. */
export function SectionHead({
  command,
  title,
  summary,
  ruled,
}: SectionHeadProps) {
  return (
    <div className={`dp-head${ruled ? ' ruled' : ''}`}>
      <div>
        <p className="dp-prompt mono">
          <span className="dp-accent">❯</span> {command}
        </p>
        <h2 className="dp-title" tabIndex={-1}>
          {title}
        </h2>
      </div>
      {summary && <p className="dp-summary mono">{summary}</p>}
    </div>
  )
}
