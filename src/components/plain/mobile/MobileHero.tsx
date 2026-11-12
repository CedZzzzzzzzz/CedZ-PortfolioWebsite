import { useState } from 'react'
import { profile } from '../../../content/profile'
import { socials } from '../../../content/socials'
import { useWorkspaceState } from '../../../state/useWorkspaceState'
import { socialIcons } from '../socialIcons'
import { MobileQuickBar } from './MobileQuickBar'
import { MobileSectionNav } from './MobileSectionNav'
import './mobile.css'

const nameWords = profile.name.split(' ')
const nameFirstLine = nameWords.slice(0, 2).join(' ')
const nameSecondLine = nameWords.slice(2).join(' ')

export function MobileHero() {
  const { profileImage } = useWorkspaceState()
  // The section nav and the quick actions share the bar, so one closes the other.
  const [menu, setMenu] = useState<'sections' | 'actions' | null>(null)

  return (
    <section className="m-hero" id="plain-top" tabIndex={-1}>
      <div className="m-hero-photo">
        <picture>
          {!profileImage && (
            <source
              type="image/webp"
              srcSet="/Myself_Pics/marcus-pedrosa-portrait-480.webp 480w, /Myself_Pics/marcus-pedrosa-portrait-960.webp 960w"
              sizes="100vw"
            />
          )}
          <img
            src={profileImage || profile.photo}
            alt={profile.name}
            width="960"
            height="1080"
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      </div>

      <header className="m-hero-bar">
        <button
          type="button"
          className="m-logo"
          aria-label={menu === 'sections' ? 'Hide sections' : 'Show sections'}
          aria-expanded={menu === 'sections'}
          aria-controls="m-sections"
          onClick={() => setMenu(menu === 'sections' ? null : 'sections')}
        >
          <img src="/Logo/Logo.png" alt="" width="64" height="64" />
        </button>
        <MobileSectionNav id="m-sections" open={menu === 'sections'} />
        <MobileQuickBar
          open={menu === 'actions'}
          onOpenChange={(open) => setMenu(open ? 'actions' : null)}
        />
      </header>

      <div className="m-hero-body">
        <p className="m-eyebrow">Hi, I&apos;m</p>
        <h1 className="m-name">
          {nameFirstLine}
          <br />
          {nameSecondLine}
        </h1>
        <p className="m-role">
          I am a <strong>{profile.role}</strong>
        </p>

        <div className="m-socials">
          <span>Find me on</span>
          <div>
            {socials
              .filter((social) => social.label !== 'Email' && social.url.trim())
              .map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i
                    className={socialIcons[social.label] || 'fas fa-link'}
                    aria-hidden="true"
                  />
                </a>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
