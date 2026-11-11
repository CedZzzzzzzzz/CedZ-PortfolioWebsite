import type { MouseEvent } from 'react'
import { about } from '../../../content/about'
import { projects } from '../../../content/projects'
import { useNavigation } from '../../../hooks/useNavigation'
import { resolveProjectImage } from '../../../lib/projectImage'
import { useWorkspaceState } from '../../../state/useWorkspaceState'
import { DesktopIcon } from './DesktopIcon'
import { desktopSections } from './desktopSections'
import { SectionHead } from './SectionHead'

const fileTabs = desktopSections.filter(
  (section) => section.file && section.id !== 'plain-about',
)
const facts = [
  ['focus', about.focus],
  ['enjoy', about.enjoy],
  ['goal', about.goal],
] as const
const featured = projects.find(
  (project) => project.n === about.featuredProjectName,
)

export function WorkspaceAbout() {
  const { projectImages } = useWorkspaceState()
  const nav = useNavigation()

  function go(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault()
    nav.openFile(id)
  }

  return (
    <section id="plain-about" className="dp-section dp-about" tabIndex={-1}>
      <SectionHead command="open about.md" title="About me" />
      <div className="dp-pane">
        <p className="dp-ptitle">Editor</p>
        <nav className="dp-tabs" aria-label="Files">
          <span className="dp-tab mono active" aria-current="page">
            <DesktopIcon name="file" size={14} strokeWidth={2} />
            about.md
          </span>
          {fileTabs.map((section) => (
            <a
              key={section.id}
              className="dp-tab mono"
              href={`#${section.id}`}
              onClick={(event) => go(event, section.id)}
            >
              <DesktopIcon name="file" size={14} strokeWidth={2} />
              {section.file}
            </a>
          ))}
        </nav>
        <div className="dp-about-body">
          <div className="dp-about-main">
            <p className="dp-crumb mono">cedz-portfolio › about.md</p>
            <p className="dp-statement">{about.intro}</p>
            <dl className="dp-facts">
              {facts.map(([key, value]) => (
                <div key={key}>
                  <dt className="mono">{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <a
            className="dp-card dp-feature"
            href={about.featuredProjectUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {featured && (
              <img
                src={resolveProjectImage(featured, projectImages[featured.id])}
                alt=""
                width="1412"
                height="966"
                loading="lazy"
                decoding="async"
              />
            )}
            <span className="dp-feature-body">
              <span className="dp-feature-kicker mono">Featured project</span>
              <span className="dp-feature-name">
                {about.featuredProjectName}
                <DesktopIcon name="external" size={22} strokeWidth={1.8} />
              </span>
              <span className="dp-feature-text">{about.featuredProject}</span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </span>
          </a>
        </div>
        <div className="dp-status mono">
          <span>about.md</span>
          <span>Markdown</span>
        </div>
      </div>
    </section>
  )
}
