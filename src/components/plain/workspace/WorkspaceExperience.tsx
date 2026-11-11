import { portfolioExperience } from '../../../content/portfolioExperience'
import { SectionHead } from './SectionHead'
import { WorkspaceExperienceItem } from './WorkspaceExperienceItem'

export function WorkspaceExperience() {
  return (
    <section id="plain-experience" className="dp-section" tabIndex={-1}>
      <SectionHead
        command="open experience.md"
        title="Where I've worked"
        ruled
      />
      <ol className="dp-xp">
        {portfolioExperience.map((entry) => (
          <WorkspaceExperienceItem
            key={`${entry.t}-${entry.o}`}
            entry={entry}
          />
        ))}
      </ol>
    </section>
  )
}
