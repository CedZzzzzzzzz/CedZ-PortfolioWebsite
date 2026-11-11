import { useState } from 'react'
import { awards } from '../../../content/awards'
import { AwardModal } from './AwardModal'
import { AwardPhotoFrame } from './AwardPhotoFrame'
import { SectionHead } from './SectionHead'

export function WorkspaceAwards() {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = awards.find((award) => award.id === openId) ?? null

  return (
    <section id="plain-awards" className="dp-section" tabIndex={-1}>
      <SectionHead command="cat awards.md" title="Awards & leadership" />
      <ul className="dp-awards">
        {awards.map((award, index) => {
          const cover = award.photos[0]
          return (
            <li key={award.id}>
              <button
                type="button"
                className="dp-award"
                aria-haspopup="dialog"
                onClick={() => setOpenId(award.id)}
              >
                <span className="dp-award-cover">
                  {cover && <AwardPhotoFrame photo={cover} variant={index} />}
                  <span className="dp-glass dp-award-badge">{award.badge}</span>
                  <span className="dp-glass dp-award-count mono">
                    {award.photos.length} photos
                  </span>
                </span>
                <span className="dp-award-text">
                  <span className="dp-award-kind">
                    {award.kind} · {award.category}
                  </span>
                  <span className="dp-award-title">{award.t}</span>
                </span>
                <span className="dp-award-foot">
                  <span className="mono">{award.w ?? 'Year TBA'}</span>
                  <span className="dp-award-view">
                    View
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <AwardModal award={open} onClose={() => setOpenId(null)} />
    </section>
  )
}
