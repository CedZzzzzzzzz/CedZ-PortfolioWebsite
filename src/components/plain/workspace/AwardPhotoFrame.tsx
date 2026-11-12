import type { AwardPhoto } from '../../../types/content'

interface AwardPhotoFrameProps {
  photo: AwardPhoto
  /** Placeholder glow position, so neighboring frames do not look identical. */
  variant: number
  caption?: boolean
}

/** A photo, or a soft placeholder until the photo exists. */
export function AwardPhotoFrame({
  photo,
  variant,
  caption = false,
}: AwardPhotoFrameProps) {
  if (photo.src)
    return (
      <img
        className="dp-award-photo"
        src={photo.src}
        alt={photo.label}
        loading="lazy"
        decoding="async"
      />
    )

  return (
    <span className={`dp-award-photo dp-award-ph v${variant % 3}`}>
      <svg
        aria-hidden="true"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <circle cx="9" cy="10" r="2" />
        <path d="M21 16l-5-5-9 9" />
      </svg>
      {caption && <span>{photo.label} · photo coming soon</span>}
    </span>
  )
}
