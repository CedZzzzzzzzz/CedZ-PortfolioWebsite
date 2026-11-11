import { profile } from '../../../content/profile'
import { socials } from '../../../content/socials'
import { useWorkspaceState } from '../../../state/useWorkspaceState'
import { DesktopIcon } from './DesktopIcon'
import { hasSocialIcon } from './desktopIconPaths'

const nameWords = profile.name.split(' ')
const links = socials.filter(
  (social) => social.label !== 'Email' && social.url.trim(),
)

export function DesktopHero() {
  const { profileImage } = useWorkspaceState()

  return (
    <section className="dp-hero" id="plain-top" tabIndex={-1}>
      <picture>
        {!profileImage && (
          <>
            <source
              type="image/avif"
              srcSet="/Myself_Pics/marcus-pedrosa-portrait-480.avif 480w, /Myself_Pics/marcus-pedrosa-portrait-960.avif 960w"
              sizes="56vw"
            />
            <source
              type="image/webp"
              srcSet="/Myself_Pics/marcus-pedrosa-portrait-480.webp 480w, /Myself_Pics/marcus-pedrosa-portrait-960.webp 960w"
              sizes="56vw"
            />
          </>
        )}
        <img
          className="dp-hero-photo"
          src={profileImage || profile.photo}
          alt={profile.name}
          width="960"
          height="1080"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      <div className="dp-hero-fade" aria-hidden="true" />
      <div className="dp-hero-body">
        <p className="dp-eyebrow">Hi, I&apos;m</p>
        <h1 className="dp-hero-name">
          {nameWords.slice(0, 2).join(' ')} <br />
          {nameWords.slice(2).join(' ')}
        </h1>
        <p className="dp-hero-role">
          I am a <strong>{profile.role}</strong>
        </p>
        <div className="dp-hero-socials">
          <span>Find me on</span>
          <div>
            {links.map((social) => (
              <a
                key={social.label}
                className="dp-ico"
                href={social.url}
                aria-label={`${social.label} (opens in a new tab)`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {hasSocialIcon(social.label) && (
                  <DesktopIcon name={social.label} strokeWidth={1.8} />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
