import { orderedProjects } from '../orderedProjects'
import { useDeployedStyles } from '../useDeployedStyles'
import { WorkspaceAbout } from '../workspace/WorkspaceAbout'
import { WorkspaceAwards } from '../workspace/WorkspaceAwards'
import { WorkspaceCertifications } from '../workspace/WorkspaceCertifications'
import { WorkspaceContact } from '../workspace/WorkspaceContact'
import { WorkspaceExperience } from '../workspace/WorkspaceExperience'
import '../workspace/workspace.css'
import { MobileHero } from './MobileHero'
import { MobileProjects } from './MobileProjects'
import { MobileSkills } from './MobileSkills'

export function MobilePlainView() {
  useDeployedStyles()

  // The hero, projects carousel, and skills keep the mobile design; the other
  // sections share the workspace design with desktop, inside `.dp` for its tokens.
  return (
    <div className="plain-page is-mobile" id="plain-home">
      <MobileHero />

      <main id="plain-main">
        <div className="dp dp-embed">
          <WorkspaceAbout />
          <WorkspaceExperience />
        </div>
        <MobileProjects projects={orderedProjects} />
        <MobileSkills />
        <div className="dp dp-embed">
          <WorkspaceCertifications />
          <WorkspaceAwards />
        </div>
      </main>

      <div className="dp dp-embed">
        <WorkspaceContact />
      </div>
    </div>
  )
}
