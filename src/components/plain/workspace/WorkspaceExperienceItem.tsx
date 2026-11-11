import { useId, useState } from 'react'
import type { Experience } from '../../../types/content'

interface WorkspaceExperienceItemProps {
  entry: Experience
}

/** One timeline entry. Phones clamp the description behind "Show more"; desktop shows it in full. */
export function WorkspaceExperienceItem({
  entry,
}: WorkspaceExperienceItemProps) {
  const [expanded, setExpanded] = useState(false)
  const descriptionId = useId()
  const current = entry.w.includes('Present')

  return (
    <li className={`dp-xp-item${current ? ' current' : ''}`}>
      <span className="dp-xp-dot" aria-hidden="true" />
      <div className="dp-xp-when">
        <span>{entry.w}</span>
        {current && <span className="dp-now">Now</span>}
      </div>
      <div className="dp-xp-body">
        <h3>{entry.t}</h3>
        <p className="dp-xp-org">{entry.o}</p>
        <p
          id={descriptionId}
          className={`dp-xp-desc${expanded ? ' expanded' : ''}`}
        >
          {entry.d}
        </p>
        <button
          type="button"
          className="dp-xp-more"
          aria-expanded={expanded}
          aria-controls={descriptionId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Show less' : 'Show more'}
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </li>
  )
}
