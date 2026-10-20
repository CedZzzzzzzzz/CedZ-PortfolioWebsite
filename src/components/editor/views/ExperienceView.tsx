import { experience } from '../../../content/experience'

export function ExperienceView() {
  return (
    <article className="content-view">
      <h3>experience</h3>
      <ol className="timeline">
        {experience.map((entry, index) => (
          <li key={index}>
            <p className="view-muted">
              {entry.w} · {entry.k}
            </p>
            <h4>{entry.t}</h4>
            <p className="view-accent">{entry.o}</p>
            <p>{entry.d}</p>
          </li>
        ))}
      </ol>
    </article>
  )
}
