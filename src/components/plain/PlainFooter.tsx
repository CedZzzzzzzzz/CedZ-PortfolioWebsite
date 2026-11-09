import { profile } from '../../content/profile'
import { socials } from '../../content/socials'
import { gmailComposeUrl } from '../../lib/gmail'
import { socialIcons } from './socialIcons'
import './footer.css'

const emailUrl = socials.find((social) => social.label === 'Email')?.url
const links = socials.filter(
  (social) => social.label !== 'Email' && social.url.trim(),
)

export function PlainFooter() {
  return (
    <footer id="plain-contact" className="footer p-footer" tabIndex={-1}>
      <div className="p-footer-inner">
        <p className="p-footer-eyebrow">Contact</p>
        <h2 className="p-footer-title">Let&apos;s build something together.</h2>
        <p className="p-footer-text">
          Have a project or opportunity in mind? Send me a message.
        </p>
        {emailUrl && (
          <a
            className="p-footer-cta"
            href={gmailComposeUrl(emailUrl)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-envelope" aria-hidden="true" />
            Email me
            <span className="visually-hidden"> (opens Gmail in a new tab)</span>
          </a>
        )}
        <div className="p-footer-socials">
          {links.map((social) => (
            <a
              key={social.label}
              href={social.url}
              aria-label={`${social.label} (opens in a new tab)`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i
                className={socialIcons[social.label] || 'fas fa-link'}
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
        <p className="p-footer-copy">
          &copy; {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  )
}
