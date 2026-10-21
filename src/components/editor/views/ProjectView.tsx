import type { Project } from '../../../types/content'
import { useNavigation } from '../../../hooks/useNavigation'
import { demoUploadsEnabled } from '../../../config'
import { ProjectHero } from '../../ui/ProjectHero'
import { ProjectImageUpload } from '../../ui/ProjectImageUpload'
import { Icon } from '../../ui/Icon'

export function ProjectView({ project }: { project: Project }) {
  const { openFile, openSkill } = useNavigation()
  const links = project.links.filter(([, url]) => url.trim())

  return (
    <article className="content-view project-view">
      <header className="project-heading">
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
      </header>

      <div className="project-layout">
        <div className="project-media-column">
          <ProjectHero project={project} />
          {demoUploadsEnabled && <ProjectImageUpload projectId={project.id} />}
        </div>
        <div className="project-details">
          <p>{project.overview}</p>
          <section>
            <h4>highlights</h4>
            <ul className="highlights">
              {project.highlights.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </section>
          <section>
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
          </section>
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
        </div>
      </div>
    </article>
  )
}
