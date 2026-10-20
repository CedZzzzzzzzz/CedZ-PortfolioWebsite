import type { Project } from '../../../types/content'
import { projects } from '../../../content/projects'
import { useNavigation } from '../../../hooks/useNavigation'
import { demoUploadsEnabled } from '../../../config'
import { ProjectHero } from '../../ui/ProjectHero'
import { ProjectImageUpload } from '../../ui/ProjectImageUpload'
import { Icon } from '../../ui/Icon'

export function ProjectView({ project }: { project: Project }) {
  const { openFile, openSkill } = useNavigation()
  const index = projects.findIndex((item) => item.id === project.id)
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const links = project.links.filter(([, url]) => url.trim())
  return (
    <article className="content-view">
      <p className="view-muted">
        <button
          type="button"
          className="text-link"
          onClick={() => openFile('projects')}
        >
          projects
        </button>{' '}
        / {project.id}
      </p>
      <h3>{project.n}</h3>
      <p className="view-muted">
        {project.year ? `${project.year} · ` : ''}
        {project.role}
      </p>
      <ProjectHero project={project} />
      {demoUploadsEnabled && <ProjectImageUpload projectId={project.id} />}
      <p>{project.overview}</p>
      <h4>highlights</h4>
      <ul className="highlights">
        {project.highlights.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
      <h4>stack</h4>
      <div className="tag-list">
        {project.t.map((tag) => (
          <button
            className="skill-tag"
            type="button"
            key={tag}
            onClick={() => openSkill(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="view-actions">
        {links.map(([label, url], i) => (
          <a
            key={label}
            className={'view-button' + (i === 0 ? ' primary' : '')}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {label} <Icon name="external" />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        ))}
      </div>
      <nav className="project-pagination" aria-label="Other projects">
        <button
          type="button"
          className="view-button"
          onClick={() => openFile(previous.id)}
        >
          <Icon name="chevron-left" /> {previous.n}
        </button>
        <button
          type="button"
          className="view-button"
          onClick={() => openFile(next.id)}
        >
          {next.n} <Icon name="chevron-right" />
        </button>
      </nav>
    </article>
  )
}
