import { profile } from '../../../content/profile'
import { socials } from '../../../content/socials'
import { gmailComposeUrl } from '../../../lib/gmail'
import { DesktopIcon } from './DesktopIcon'

const email = socials.find((social) => social.label === 'Email')

export function WorkspaceContact() {
  return (
    <footer id="plain-contact" className="dp-section dp-contact" tabIndex={-1}>
      <div className="dp-pane dp-contact-pane">
        <p className="dp-ptitle">Terminal</p>
        <div className="dp-contact-body">
          <p className="dp-crumb mono">
            <span className="dp-accent">❯</span> contact
          </p>
          <div className="dp-contact-main">
            <h2 className="dp-contact-title" tabIndex={-1}>
              Let&apos;s build something together.
            </h2>
            <p>Have a project or opportunity in mind? Send me a message.</p>
            {email && (
              <a
                className="dp-cream"
                href={gmailComposeUrl(email.url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DesktopIcon name="mail" size={18} strokeWidth={2} />
                Email me
                <span className="visually-hidden">
                  {' '}
                  (opens Gmail in a new tab)
                </span>
              </a>
            )}
          </div>
          {email && (
            <p className="dp-crumb mono">
              <span className="dp-accent">❯</span> mail {email.display}
              <span className="dp-cursor" aria-hidden="true" />
            </p>
          )}
        </div>
      </div>
      <p className="dp-copy">
        &copy; {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  )
}
