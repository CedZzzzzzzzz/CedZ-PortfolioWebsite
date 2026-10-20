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
import './editor.css'

export function Editor() {
  const file = useActiveFile()
  const project = projects.find((item) => item.id === file?.id)
  return (
    <div className="editor">
      <TabBar />
      {file ? (
        <div
          className="editor-view"
          key={file.id}
          role="tabpanel"
          id={'view-' + file.id}
          aria-labelledby={'tab-' + file.id}
          tabIndex={0}
        >
          {file.kind === 'about' && <AboutView />}
          {file.kind === 'experience' && <ExperienceView />}
          {file.kind === 'skills' && <SkillsView />}
          {file.kind === 'projects' && <ProjectsView />}
          {file.kind === 'project' && project && (
            <ProjectView project={project} />
          )}
          {file.kind === 'resume' && <ResumeView />}
          {file.kind === 'contact' && <ContactView />}
        </div>
      ) : (
        <EmptyEditor />
      )}
    </div>
  )
}
