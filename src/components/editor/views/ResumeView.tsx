import { profile } from '../../../content/profile'
import { portfolioExperience } from '../../../content/portfolioExperience'
import { skills } from '../../../content/skills'
import { projects } from '../../../content/projects'
import { useWorkspaceState } from '../../../state/useWorkspaceState'
import { demoUploadsEnabled } from '../../../config'
import { ResumeAttachment } from '../../ui/ResumeAttachment'

export function ResumeView() {
  const { resumeUrl } = useWorkspaceState()
  const url = resumeUrl || profile.resume
  return (
    <article className="content-view">
      <h3>resume.pdf</h3>
      <div className="resume-sheet">
        <h4>{profile.name}</h4>
        <p>
          {profile.role} · {profile.focus}
        </p>
        <h4>Education</h4>
        {portfolioExperience
          .filter((entry) => entry.k === 'education')
          .map((entry, i) => (
            <p key={i}>
              {entry.t} · {entry.o} · {entry.w}
            </p>
          ))}
        <h4>Skills</h4>
        {skills.map((group) => (
          <p key={group.name}>
            {group.name} {group.tags.join(', ')}
          </p>
        ))}
        <h4>Projects</h4>
        {projects.map((project) => (
          <p key={project.id}>
            <strong>{project.n}</strong> — {project.d}
          </p>
        ))}
      </div>
      {url ? (
        <a
          className="view-button primary"
          href={url}
          download="resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download resume.pdf
        </a>
      ) : (
        <p>no PDF attached yet</p>
      )}
      {demoUploadsEnabled && <ResumeAttachment />}
    </article>
  )
}
