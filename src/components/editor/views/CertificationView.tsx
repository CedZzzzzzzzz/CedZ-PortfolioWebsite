import type { certifications } from '../../../content/certifications'

type Certification = (typeof certifications)[number]

export function CertificationView({
  certification,
}: {
  certification: Certification
}) {
  const isPdf = certification.url.toLowerCase().endsWith('.pdf')

  return (
    <article className="content-view certification-view">
      <p className="view-muted">
        ~/cedz-portfolio/certifications/{certification.file}
      </p>
      <h3>{certification.name}</h3>
      <dl className="certification-meta">
        <div>
          <dt>issuer</dt>
          <dd>{certification.issuer}</dd>
        </div>
        <div>
          <dt>issued</dt>
          <dd>{certification.date}</dd>
        </div>
      </dl>
      {isPdf ? (
        <>
          <iframe
            className="certificate-pdf-preview"
            src={certification.url}
            title={`${certification.name} certificate PDF`}
          />
        </>
      ) : (
        <section className="certification-link-preview">
          <p className="view-muted">$ verify certificate</p>
          <p>
            This credential is hosted by {certification.issuer}. Open the
            verification page to view its details.
          </p>
          <a
            className="view-button primary"
            href={certification.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open verification page
          </a>
        </section>
      )}
    </article>
  )
}
