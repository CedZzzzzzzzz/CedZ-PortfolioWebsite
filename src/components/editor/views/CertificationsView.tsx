import { certifications } from '../../../content/certifications'
import { useNavigation } from '../../../hooks/useNavigation'

export function CertificationsView() {
  const { openFile } = useNavigation()

  return (
    <article className="content-view certification-index">
      <p className="view-muted">~/cedz-portfolio/certifications/</p>
      <h3>certifications/</h3>
      <p>Professional training and credentials.</p>
      <ul className="certification-list">
        {certifications.map((certification) => (
          <li key={certification.id}>
            <button
              className="certification-file"
              type="button"
              onClick={() => openFile(`certification-${certification.id}`)}
            >
              <span className="certification-file-name">
                {certification.file}
              </span>
              <span className="certification-file-description">
                {certification.name} · {certification.issuer} ·{' '}
                {certification.date}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </article>
  )
}
