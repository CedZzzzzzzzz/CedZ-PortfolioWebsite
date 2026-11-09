import { portfolioExperience } from '../../content/portfolioExperience'
import { ExperienceTimelineItem } from './ExperienceTimelineItem'
import './experience.css'

export function ExperienceTimeline() {
  return (
    <section
      id="plain-experience"
      className="experience xp-section"
      tabIndex={-1}
    >
      <h2 className="section-title">Experience</h2>
      <ol className="xp-timeline">
        {portfolioExperience.map((entry) => (
          <ExperienceTimelineItem key={`${entry.t}-${entry.o}`} entry={entry} />
        ))}
      </ol>
    </section>
  )
}
