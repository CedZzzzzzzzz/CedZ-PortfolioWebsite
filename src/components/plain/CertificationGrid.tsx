import { certifications } from '../../content/certifications'
import './certifications.css'

function shortDate(date: string) {
  const [month, year] = date.split(' ')
  return year ? `${month.slice(0, 3)} ${year}` : date
}

export function CertificationGrid() {
  return (
    <ul className="cert-grid">
      {certifications.map((certification) => {
        const external = certification.url.startsWith('http')
        return (
          <li key={certification.id}>
            <a
              className="cert-badge"
              href={certification.url}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
            >
              <span className="cert-badge-top">
                <span className="cert-icon" aria-hidden="true">
                  <i className="fas fa-award" />
                </span>
                <i
                  className="fas fa-arrow-up-right-from-square"
                  aria-hidden="true"
                />
              </span>
              <span className="cert-badge-name">{certification.name}</span>
              <span className="cert-badge-meta">
                {certification.issuer} ·{' '}
                <time>{shortDate(certification.date)}</time>
              </span>
              {external && (
                <span className="visually-hidden"> (opens in a new tab)</span>
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
