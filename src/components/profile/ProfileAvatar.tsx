import { useState } from 'react'

export function ProfileAvatar({ src, name }: { src: string; name: string }) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  return (
    <div className="profile-avatar">
      {src && failedSource !== src ? (
        <img
          src={src}
          alt={`${name}'s profile photo`}
          width={84}
          height={84}
          onError={() => setFailedSource(src)}
        />
      ) : (
        <span role="img" aria-label={`${name}, initials MP`}>
          MP
        </span>
      )}
    </div>
  )
}
