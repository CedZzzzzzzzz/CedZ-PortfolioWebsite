import type { Project } from '../../types/content'
import { resolveProjectImage } from '../../lib/projectImage'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { useNavigation } from '../../hooks/useNavigation'

export function ProjectCard({ project }: { project: Project }) {
  const { projectImages } = useWorkspaceState()
  const { openFile } = useNavigation()
  return (
    <button
      type="button"
      className="project-card"
      onClick={() => openFile(project.id)}
    >
      <img
        src={resolveProjectImage(project, projectImages[project.id])}
        alt={project.n}
        width={1000}
        height={650}
        loading="lazy"
      />
      <span className="card-body">
        <strong>{project.n}</strong>
        <span>{project.d}</span>
        <span className="tag-list">
          {project.t.slice(0, 3).map((tag) => (
            <span className="skill-tag" key={tag}>
              {tag}
            </span>
          ))}
        </span>
      </span>
    </button>
  )
}
