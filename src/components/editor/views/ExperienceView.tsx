import { portfolioExperience } from '../../../content/portfolioExperience'
import { m } from 'framer-motion'
import { useMotionEnabled } from '../../motion/useMotionEnabled'

export function ExperienceView() {
  const animate = useMotionEnabled()
  return (
    <article className="content-view">
      <header className="content-view-header">
        <h3>experience</h3>
        <span>~/cedz-portfolio/experience.md</span>
      </header>
      <ol className="timeline">
        {portfolioExperience.map((entry, index) => {
          const content = (
            <>
              <p className="view-muted">
                {entry.w} · {entry.k}
              </p>
              <h4>{entry.t}</h4>
              <p className="view-accent">{entry.o}</p>
              <p className="experience-description">{entry.d}</p>
            </>
          )
          return animate ? (
            <m.li
              key={index}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.18,
                delay: Math.min(index * 0.08, 0.3),
              }}
            >
              {content}
            </m.li>
          ) : (
            <li key={index}>{content}</li>
          )
        })}
      </ol>
    </article>
  )
}
