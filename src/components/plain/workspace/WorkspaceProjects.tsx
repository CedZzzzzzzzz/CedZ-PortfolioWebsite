import { useEffect, useId, useRef, useState } from 'react'
import { resolveProjectImage } from '../../../lib/projectImage'
import { useWorkspaceState } from '../../../state/useWorkspaceState'
import { orderedProjects } from '../orderedProjects'
import { DesktopIcon } from './DesktopIcon'
import { SectionHead } from './SectionHead'

const count = orderedProjects.length

function liveUrl(links: [string, string][]) {
  return links.find(([, url]) => url.trim())?.[1]
}

function hostOf(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

export function WorkspaceProjects() {
  const { projectImages } = useWorkspaceState()
  const [at, setAt] = useState(0)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const slides = useRef<Array<HTMLElement | null>>([])
  const baseId = useId()
  const current = orderedProjects[at]

  // Off-screen slides stay in the track for the slide animation but must not take focus.
  useEffect(() => {
    slides.current.forEach((slide, index) =>
      slide?.toggleAttribute('inert', index !== at),
    )
  }, [at])

  function go(index: number, focusTab = false) {
    const next = Math.max(0, Math.min(count - 1, index))
    setAt(next)
    if (focusTab) tabs.current[next]?.focus()
  }

  if (!current) return null

  return (
    <section id="plain-projects" className="dp-section" tabIndex={-1}>
      <SectionHead command="ls projects/" title="Things I've built" />
      <div className="dp-pane">
        <div className="dp-pane-top">
          <p className="dp-ptitle">Editor</p>
          <span className="dp-pane-path mono">~/cedz-portfolio/projects</span>
        </div>
        <div
          className="dp-tabs dp-tabs-dim"
          role="tablist"
          aria-label="Projects"
        >
          {orderedProjects.map((project, index) => (
            <button
              key={project.id}
              ref={(element) => {
                tabs.current[index] = element
              }}
              id={`${baseId}-tab-${index}`}
              type="button"
              role="tab"
              className={`dp-tab mono${index === at ? ' active' : ''}`}
              aria-selected={index === at}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={index === at ? 0 : -1}
              onClick={() => go(index)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') go((index + 1) % count, true)
                else if (event.key === 'ArrowLeft')
                  go((index + count - 1) % count, true)
                else if (event.key === 'Home') go(0, true)
                else if (event.key === 'End') go(count - 1, true)
                else return
                event.preventDefault()
              }}
            >
              <DesktopIcon name="file" size={14} strokeWidth={2} />
              {project.id}.md
            </button>
          ))}
        </div>
        <div className="dp-track-clip">
          <div
            className="dp-track"
            style={{ transform: `translateX(-${at * 100}%)` }}
          >
            {orderedProjects.map((project, index) => {
              const url = liveUrl(project.links)
              const image = resolveProjectImage(
                project,
                projectImages[project.id],
              )
              return (
                <article
                  key={project.id}
                  ref={(element) => {
                    slides.current[index] = element
                  }}
                  id={`${baseId}-panel-${index}`}
                  className="dp-slide"
                  role="tabpanel"
                  aria-labelledby={`${baseId}-tab-${index}`}
                  aria-hidden={index !== at}
                >
                  <div className="dp-card dp-browser">
                    <div className="dp-browser-bar">
                      <span className="dp-browser-dots" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>
                      <span className="dp-address mono">
                        <DesktopIcon name="lock" size={12} strokeWidth={2.2} />
                        <span>{url ? hostOf(url) : project.id}</span>
                      </span>
                      {url && (
                        <a
                          className="dp-visit mono"
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${project.n} in a new tab`}
                        >
                          open
                          <DesktopIcon
                            name="external"
                            size={12}
                            strokeWidth={2.4}
                          />
                        </a>
                      )}
                    </div>
                    <div className="dp-shot-frame">
                      <img
                        className="dp-shot-blur"
                        src={image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                      <img
                        className="dp-shot"
                        src={image}
                        alt={`${project.n} screenshot`}
                        width="1200"
                        height="600"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                  <div className="dp-slide-info">
                    <div className="dp-slide-meta">
                      {project.categories.map((category) => (
                        <span key={category} className="dp-badge mono">
                          {category}
                        </span>
                      ))}
                      <span className="dp-slide-role">{project.role}</span>
                    </div>
                    <h3 className="dp-slide-name">{project.n}</h3>
                    <p className="dp-slide-overview">{project.overview}</p>
                    <div className="dp-highlights">
                      <p>Highlights</p>
                      <ul>
                        {project.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                    <ul className="dp-chips" aria-label="Tech stack">
                      {project.t.map((tag) => (
                        <li key={tag} className="dp-chip mono">
                          {tag}
                        </li>
                      ))}
                    </ul>
                    {url && (
                      <a
                        className="dp-btn"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live project
                        <DesktopIcon
                          name="external"
                          size={18}
                          strokeWidth={2}
                        />
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
        </div>
        <div className="dp-slide-status">
          <span className="dp-slide-file mono">
            <span>{current.id}.md</span>
            <span>
              {at + 1} of {count}
            </span>
          </span>
          <div className="dp-dots">
            {orderedProjects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                aria-label={`Show ${project.n}`}
                aria-current={index === at ? 'true' : undefined}
                onClick={() => go(index)}
              >
                <span className={index === at ? 'on' : undefined} />
              </button>
            ))}
          </div>
          <span className="dp-arrows">
            <button
              type="button"
              className="dp-ghost"
              aria-label="Previous project"
              disabled={at === 0}
              onClick={() => go(at - 1)}
            >
              <DesktopIcon name="prev" size={18} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="dp-ghost"
              aria-label="Next project"
              disabled={at === count - 1}
              onClick={() => go(at + 1)}
            >
              <DesktopIcon name="next" size={18} strokeWidth={2} />
            </button>
          </span>
        </div>
      </div>
    </section>
  )
}
