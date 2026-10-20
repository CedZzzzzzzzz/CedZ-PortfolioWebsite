import type { Project } from '../../types/content'
import { m } from 'framer-motion'
import { useNavigation } from '../../hooks/useNavigation'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { useMotionEnabled } from '../motion/useMotionEnabled'
import { resolveProjectImage } from '../../lib/projectImage'

export function ProjectCard({
  project,
  order = 0,
}: {
  project: Project
  order?: number
}) {
  const { projectImages } = useWorkspaceState()
  const { openFile } = useNavigation()
  const animate = useMotionEnabled()
  const card = (
    <>
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
    </>
  )
  const props = {
    type: 'button' as const,
    className: 'project-card',
    onClick: () => openFile(project.id),
  }
  return animate ? (
    <m.button
      {...props}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: Math.min(order * 0.08, 0.3) }}
      whileHover={{ y: -2 }}
    >
      {card}
    </m.button>
  ) : (
    <button {...props}>{card}</button>
  )
}
