import { useActiveSection } from '../../../hooks/useActiveSection'
import { ByteLauncher } from './ByteLauncher'
import { WorkspaceAbout } from './WorkspaceAbout'
import { WorkspaceAwards } from './WorkspaceAwards'
import { WorkspaceCertifications } from './WorkspaceCertifications'
import { WorkspaceContact } from './WorkspaceContact'
import { WorkspaceExperience } from './WorkspaceExperience'
import { WorkspaceGitHub } from './WorkspaceGitHub'
import { DesktopHero } from './DesktopHero'
import { DesktopNavBar } from './DesktopNavBar'
import { WorkspaceProjects } from './WorkspaceProjects'
import { DesktopSkills } from './DesktopSkills'
import { desktopSectionIds } from './desktopSections'
import './workspace.css'

export function DesktopPlainView() {
  const active = useActiveSection(desktopSectionIds)

  return (
    <div className="plain-page dp" id="plain-home">
      <DesktopNavBar active={active} />
      <DesktopHero />
      <main id="plain-main">
        <WorkspaceAbout />
        <WorkspaceExperience />
        <WorkspaceProjects />
        <WorkspaceGitHub />
        <DesktopSkills />
        <WorkspaceCertifications />
        <WorkspaceAwards />
      </main>
      <WorkspaceContact />
      <ByteLauncher />
    </div>
  )
}
