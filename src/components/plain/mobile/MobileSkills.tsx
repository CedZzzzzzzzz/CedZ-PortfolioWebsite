import { skills } from '../../../content/skills'

export function MobileSkills() {
  return (
    <section id="plain-skills" className="skills m-skills" tabIndex={-1}>
      <h2 className="section-title">What I work with</h2>
      <div className="m-accordion">
        {skills.map((group, index) => (
          <details key={group.name} open={index === 0}>
            <summary>
              <span>{group.name}</span>
              <span className="m-count">{group.tags.length}</span>
              <i className="fas fa-chevron-down" aria-hidden="true" />
            </summary>
            <ul>
              {group.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  )
}
