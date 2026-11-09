import { useId, useState } from 'react'
import type { Experience } from '../../types/content'

interface ExperienceTimelineItemProps {
  entry: Experience
}

export function ExperienceTimelineItem({ entry }: ExperienceTimelineItemProps) {
  const [expanded, setExpanded] = useState(false)
  const descriptionId = useId()
  const current = entry.w.includes('Present')

  return (
    <li className={`xp${current ? ' current' : ''}`}>
      <span className="xp-dot" aria-hidden="true" />
      <div className="xp-meta">
        <span className="xp-date">{entry.w}</span>
        {current && <span className="xp-now">Now</span>}
      </div>
      <h3 className="xp-role">{entry.t}</h3>
      <p className="xp-org">{entry.o}</p>
      <p id={descriptionId} className={`xp-desc${expanded ? ' expanded' : ''}`}>
        {entry.d}
      </p>
      <button
        type="button"
        className="xp-more"
        aria-expanded={expanded}
        aria-controls={descriptionId}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? 'Show less' : 'Show more'}
        <i className="fas fa-chevron-down" aria-hidden="true" />
      </button>
    </li>
  )
}
