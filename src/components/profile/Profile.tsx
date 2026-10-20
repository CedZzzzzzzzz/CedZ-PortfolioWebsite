import { profile } from '../../content/profile'
import { socials } from '../../content/socials'
import { demoUploadsEnabled } from '../../config'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { useWorkspaceDispatch } from '../../state/useWorkspaceDispatch'
import { ProfileAvatar } from './ProfileAvatar'
import { ProfilePhotoUpload } from './ProfilePhotoUpload'
import { ThemePicker } from './ThemePicker'
import './profile.css'
import { useByte } from '../../hooks/useByte'

export function Profile() {
  const byte = useByte()
  const { profileImage, plainView, byteOpen } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  const src = profileImage || profile.photo
  const avatar = <ProfileAvatar key={src} src={src} name={profile.name} />
  return (
    <div className="profile-content">
      {demoUploadsEnabled ? (
        <ProfilePhotoUpload>{avatar}</ProfilePhotoUpload>
      ) : (
        avatar
      )}
      <h1>{profile.name}</h1>
      <p>{profile.role}</p>
      <p className="profile-focus">{profile.focus}</p>
      <nav aria-label="Social links" className="profile-socials">
        {socials
          .filter((social) => social.url.trim())
          .map((social) => (
            <a
              key={social.label}
              href={social.url}
              target={social.url.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
            >
              {social.label}
            </a>
          ))}
      </nav>
      <ThemePicker />
      <div className="profile-actions">
        <button
          aria-pressed={byteOpen}
          onClick={(event) => byte.open(event.currentTarget)}
        >
          ask Byte
        </button>
        <button
          aria-pressed={plainView}
          onClick={() =>
            dispatch({ type: 'set-plain-view', enabled: !plainView })
          }
        >
          plain view
        </button>
      </div>
      <p className="profile-hint">
        Terminal: ↑/↓ history · Tab complete. Use &gt;_ to focus.
      </p>
    </div>
  )
}
