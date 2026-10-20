import { projects } from '../../../content/projects'
import { ProjectCard } from '../../ui/ProjectCard'

export function ProjectsView() {
  return (
    <article className="content-view">
      <h3>projects/</h3>
      <div className="project-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} order={index} />
        ))}
      </div>
    </article>
  )
}
