import { useEffect, useRef, useState } from 'react'
import type { Award } from '../../../types/content'
import { AwardPhotoFrame } from './AwardPhotoFrame'

interface AwardModalProps {
  award: Award | null
  onClose: () => void
}

export function AwardModal({ award, onClose }: AwardModalProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [photo, setPhoto] = useState(0)
  const [shownId, setShownId] = useState(award?.id)

  // Each award opens on its first photo.
  if (award && award.id !== shownId) {
    setShownId(award.id)
    setPhoto(0)
  }

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (award && !element.open) element.showModal()
    else if (!award && element.open) element.close()
  }, [award])

  const facts = award
    ? [
        ['Type', `${award.kind} · ${award.category}`],
        ['Role', award.role],
        ['Date', award.w ?? 'TBA'],
      ]
    : []

  return (
    <dialog
      ref={dialog}
      className="dp-modal"
      aria-labelledby="dp-modal-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {award && (
        <div className="dp-modal-card">
          <div className="dp-modal-media">
            <div className="dp-modal-frame">
              <div
                className="dp-modal-track"
                style={{ transform: `translateX(-${photo * 100}%)` }}
              >
                {award.photos.map((item, index) => (
                  <div
                    key={item.label}
                    className="dp-modal-slide"
                    aria-hidden={index !== photo}
                  >
                    <AwardPhotoFrame photo={item} variant={index} caption />
                  </div>
                ))}
              </div>
              <span className="dp-glass dp-modal-count mono">
                {photo + 1} / {award.photos.length}
              </span>
            </div>
            <div className="dp-modal-thumbs">
              {award.photos.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  aria-label={`Show ${item.label}`}
                  aria-pressed={index === photo}
                  onClick={() => setPhoto(index)}
                >
                  <AwardPhotoFrame photo={item} variant={index} />
                </button>
              ))}
            </div>
          </div>
          <div className="dp-modal-info">
            <button
              type="button"
              className="dp-modal-close"
              aria-label="Close"
              onClick={onClose}
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <span className="dp-modal-badge">{award.badge}</span>
            <span className="dp-modal-kind">
              {award.kind} · {award.category}
            </span>
            <h3 id="dp-modal-title" className="dp-modal-title">
              {award.t}
            </h3>
            {award.d && <p className="dp-modal-desc">{award.d}</p>}
            <dl className="dp-modal-facts">
              {facts.map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </dialog>
  )
}
