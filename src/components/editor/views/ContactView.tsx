import { useState } from 'react'
import { socials } from '../../../content/socials'

export function ContactView() {
  const [status, setStatus] = useState('')
  async function copyEmail(email: string) {
    setStatus('')
    try {
      await navigator.clipboard.writeText(email)
      setStatus('copied')
    } catch {
      setStatus('Could not copy. Select the email address to copy it manually.')
    }
  }
  return (
    <article className="content-view">
      <h3>contact.txt</h3>
      <ul className="social-list">
        {socials.map((social) => (
          <li key={social.label}>
            <strong>{social.label}</strong>
            <a
              href={social.url}
              target={social.url.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
            >
              {social.display}
              {!social.url.startsWith('mailto:') && (
                <span className="visually-hidden"> (opens in a new tab)</span>
              )}
            </a>
            {social.url.startsWith('mailto:') && (
              <button
                type="button"
                className="view-button"
                onClick={() =>
                  void copyEmail(social.url.slice(7).split('?')[0])
                }
              >
                Copy email
              </button>
            )}
          </li>
        ))}
      </ul>
      <p role="status" aria-live="polite">
        {status}
      </p>
    </article>
  )
}
