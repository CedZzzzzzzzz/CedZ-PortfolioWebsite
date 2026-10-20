import { useCallback, useState } from 'react'
import type { Project } from '../../types/content'
import { resolveProjectImage } from '../../lib/projectImage'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { ImageViewer } from './ImageViewer'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function ProjectHero({ project }: { project: Project }) {
  const reducedMotion = useReducedMotion()
  const { projectImages } = useWorkspaceState()
  const src = resolveProjectImage(project, projectImages[project.id])
  const [expanded, setExpanded] = useState(false)
  const close = useCallback(() => setExpanded(false), [])
  return (
    <>
      <button
        type="button"
        className="project-hero"
        aria-label={'Expand ' + project.n + ' image'}
        onClick={(event) => {
          event.currentTarget.focus()
          setExpanded(true)
        }}
        onPointerMove={(event) => {
          if (event.pointerType === 'touch' || reducedMotion) return
          const box = event.currentTarget.getBoundingClientRect()
          const x = (event.clientX - box.left) / box.width
          const y = (event.clientY - box.top) / box.height
          event.currentTarget.style.setProperty(
            '--tilt-x',
            (0.5 - y) * 6 + 'deg',
          )
          event.currentTarget.style.setProperty(
            '--tilt-y',
            (x - 0.5) * 6 + 'deg',
          )
          event.currentTarget.style.setProperty('--glare-x', x * 100 + '%')
          event.currentTarget.style.setProperty('--glare-y', y * 100 + '%')
        }}
        onPointerLeave={(event) => {
          event.currentTarget.style.setProperty('--tilt-x', '0deg')
          event.currentTarget.style.setProperty('--tilt-y', '0deg')
        }}
      >
        <img
          src={src}
          alt={project.n}
          width={1000}
          height={650}
          loading="lazy"
        />
      </button>
      {expanded && <ImageViewer src={src} name={project.n} onClose={close} />}
    </>
  )
}
