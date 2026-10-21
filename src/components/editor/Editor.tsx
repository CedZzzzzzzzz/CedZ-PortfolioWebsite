import { useActiveFile } from '../../state/useActiveFile'
import { projects } from '../../content/projects'
import { TabBar } from './TabBar'
import { EmptyEditor } from './EmptyEditor'
import { AboutView } from './views/AboutView'
import { ExperienceView } from './views/ExperienceView'
import { SkillsView } from './views/SkillsView'
import { ProjectsView } from './views/ProjectsView'
import { ProjectView } from './views/ProjectView'
import { ResumeView } from './views/ResumeView'
import { ContactView } from './views/ContactView'
import { CertificationsView } from './views/CertificationsView'
import { CertificationView } from './views/CertificationView'
import { certifications } from '../../content/certifications'
import './editor.css'
import { m } from 'framer-motion'
import { useMotionEnabled } from '../motion/useMotionEnabled'

export function Editor() {
  const file = useActiveFile()
  const animate = useMotionEnabled()
  const project = projects.find((item) => item.id === file?.id)
  const certification = certifications.find(
    (item) => `certification-${item.id}` === file?.id,
  )
  const view = file ? (
    <>
      {file.kind === 'about' && <AboutView />}
      {file.kind === 'experience' && <ExperienceView />}
      {file.kind === 'skills' && <SkillsView />}
      {file.kind === 'projects' && <ProjectsView />}
      {file.kind === 'certifications' && <CertificationsView />}
      {file.kind === 'project' && project && <ProjectView project={project} />}
      {file.kind === 'certification' && certification && (
        <CertificationView certification={certification} />
      )}
      {file.kind === 'resume' && <ResumeView />}
      {file.kind === 'contact' && <ContactView />}
    </>
  ) : (
    <EmptyEditor />
  )
  const panelProps = file
    ? {
        className: 'editor-view',
        role: 'tabpanel' as const,
        id: 'view-' + file.id,
        'aria-labelledby': 'tab-' + file.id,
        tabIndex: 0,
      }
    : null
  return (
    <div className="editor">
      <TabBar />
      {!file ? (
        <EmptyEditor />
      ) : animate ? (
        <m.div
          key={file.id}
          {...panelProps!}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {view}
        </m.div>
      ) : (
        <div key={file.id} {...panelProps!}>
          {view}
        </div>
      )}
    </div>
  )
}
