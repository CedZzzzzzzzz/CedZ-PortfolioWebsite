import { useRef, useState } from 'react'
import type { Project, ProjectCategory } from '../../../types/content'
import { resolveProjectImage } from '../../../lib/projectImage'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { useWorkspaceState } from '../../../state/useWorkspaceState'
import { Icon } from '../../ui/Icon'

interface MobileProjectsProps {
  projects: Project[]
  filters: Array<ProjectCategory | 'All'>
}

const visibleTags = 4

export function MobileProjects({ projects, filters }: MobileProjectsProps) {
  const { projectImages } = useWorkspaceState()
  const reducedMotion = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<ProjectCategory | 'All'>('All')
  const [current, setCurrent] = useState(0)
  const shown = projects.filter(
    (project) => filter === 'All' || project.categories.includes(filter),
  )

  function cardAt(index: number) {
    return track.current?.children[index] as HTMLElement | undefined
  }

  function updateCurrent() {
    const scroller = track.current
    const first = cardAt(0)
    if (!scroller || !first) return
    const step =
      first.offsetWidth + parseFloat(getComputedStyle(scroller).columnGap)
    setCurrent(Math.round(scroller.scrollLeft / step))
  }

  function goTo(index: number) {
    const card = cardAt(index)
    track.current?.scrollTo({
      left: card ? card.offsetLeft - track.current.offsetLeft : 0,
      behavior: reducedMotion ? 'instant' : 'smooth',
    })
  }

  function pickFilter(value: ProjectCategory | 'All') {
    setFilter(value)
    setCurrent(0)
    track.current?.scrollTo({ left: 0 })
  }

  return (
    <section id="plain-projects" className="projects m-projects" tabIndex={-1}>
      <h2 className="section-title">Featured Projects</h2>
      <div className="m-chip-row" role="group" aria-label="Filter projects">
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            className="m-chip"
            aria-pressed={filter === value}
            onClick={() => pickFilter(value)}
          >
            {value}
          </button>
        ))}
      </div>

      <div
        className="m-carousel"
        ref={track}
        onScroll={updateCurrent}
        aria-label="Projects"
        aria-roledescription="carousel"
      >
        {shown.map((project, index) => {
          const link = project.links.find(([, url]) => url.trim())
          const extraTags = project.t.length - visibleTags
          return (
            <article
              className="m-card"
              key={project.id}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${shown.length}: ${project.n}`}
            >
              <picture>
                <source
                  type="image/avif"
                  srcSet={`/projects/${project.id}.avif`}
                />
                <img
                  src={resolveProjectImage(project, projectImages[project.id])}
                  alt={`${project.n} project preview`}
                  width="1200"
                  height="600"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <div className="m-card-body">
                {project.categories[0] && (
                  <span className="m-card-badge">{project.categories[0]}</span>
                )}
                <h3>{project.n}</h3>
                <p>{project.d}</p>
                <ul className="m-card-tags" aria-label="Tech stack">
                  {project.t.slice(0, visibleTags).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                  {extraTags > 0 && (
                    <li aria-label={`${extraTags} more`}>+{extraTags}</li>
                  )}
                </ul>
                {link && (
                  <a
                    className="m-card-link"
                    href={link[1]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link[0]} <Icon name="external" />
                    <span className="visually-hidden">
                      {' '}
                      (opens in a new tab)
                    </span>
                  </a>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {shown.length > 1 && (
        <div className="m-dots">
          {shown.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className="m-dot"
              aria-label={`Show ${project.n}`}
              aria-current={index === current ? 'true' : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
