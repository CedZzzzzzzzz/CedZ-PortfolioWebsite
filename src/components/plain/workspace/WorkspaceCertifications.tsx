import { certifications } from '../../../content/certifications'
import { issuerLogos } from '../../../content/issuerLogos'
import { SectionHead } from './SectionHead'

export function WorkspaceCertifications() {
  return (
    <section id="plain-certifications" className="dp-section" tabIndex={-1}>
      <SectionHead command="ls certifications/" title="Certifications" />
      <ul className="dp-certs">
        {certifications.map((certification) => {
          const logo = issuerLogos[certification.issuer]
          const external = certification.url.startsWith('http')
          return (
            <li key={certification.id}>
              <a
                className="dp-cert"
                href={certification.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  className="dp-cert-logo"
                  aria-hidden="true"
                  style={logo?.tile ? { background: logo.tile } : undefined}
                >
                  {logo && <img src={logo.src} alt="" width="26" height="26" />}
                </span>
                <span className="dp-cert-name">{certification.name}</span>
                <span className="dp-cert-meta mono">
                  {certification.issuer} · {certification.date.split(' ')[1]}
                </span>
                <span className="dp-cert-verify mono" aria-hidden="true">
                  <span>‹</span>VERIFY<span>›</span>
                </span>
                <span className="visually-hidden">
                  {external
                    ? ' Verify (opens in a new tab)'
                    : ' Open the certificate PDF'}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
