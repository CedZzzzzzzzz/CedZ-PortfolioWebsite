import { projects } from '../../../content/projects'
import { ProjectCard } from '../../ui/ProjectCard'

export function ProjectsView() {
  return (
    <article className="content-view">
      <h3>projects/</h3>
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </article>
  )
}
