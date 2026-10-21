import { profile } from '../../../content/profile'
import { useWorkspaceState } from '../../../state/useWorkspaceState'
import { demoUploadsEnabled } from '../../../config'
import { ResumeAttachment } from '../../ui/ResumeAttachment'

export function ResumeView() {
  const { resumeUrl } = useWorkspaceState()
  const url = resumeUrl || profile.resume

  return (
    <article className="content-view">
      <h3>resume.pdf</h3>
      {url ? (
        <>
          <iframe
            className="resume-preview"
            src={url}
            title={`${profile.name} resume PDF`}
          />
        </>
      ) : (
        <p>no PDF attached yet</p>
      )}
      {demoUploadsEnabled && <ResumeAttachment />}
    </article>
  )
}
