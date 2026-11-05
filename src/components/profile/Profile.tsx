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
import { SocialIcon } from '../ui/SocialIcon'
import { Icon } from '../ui/Icon'

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
      <h3>{profile.name}</h3>
      <p>{profile.role}</p>
      <p className="profile-focus">{profile.focus}</p>
      <nav aria-label="Social links" className="profile-socials">
        {socials
          .filter((social) => social.label !== 'Email' && social.url.trim())
          .map((social) => (
            <a
              key={social.label}
              href={social.url}
              aria-label={`${social.label}${social.url.startsWith('mailto:') ? '' : ' (opens in a new tab)'}`}
              title={social.label}
              target={social.url.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
            >
              <SocialIcon label={social.label} />
              <span className="visually-hidden">
                {social.label}
                {!social.url.startsWith('mailto:') && ' (opens in a new tab)'}
              </span>
            </a>
          ))}
      </nav>
      <ThemePicker />
      <div className="profile-actions">
        <button
          type="button"
          aria-pressed={byteOpen}
          aria-label="ask Byte"
          title="ask Byte"
          onClick={(event) => byte.open(event.currentTarget)}
        >
          <Icon name="chat" />
          <span>ask Byte</span>
        </button>
        <button
          type="button"
          aria-pressed={plainView}
          aria-label="Portfolio view"
          title="Portfolio view"
          onClick={() =>
            dispatch({ type: 'set-plain-view', enabled: !plainView })
          }
        >
          <Icon name="menu" />
          <span>Portfolio view</span>
        </button>
      </div>
      <p className="profile-hint">
        Terminal: ↑/↓ history · Tab complete. Use &gt;_ to focus.
      </p>
    </div>
  )
}
