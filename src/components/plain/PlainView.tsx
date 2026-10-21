import { useEffect, useState, type MouseEvent } from 'react'
import { profile } from '../../content/profile'
import { about } from '../../content/about'
import { portfolioExperience } from '../../content/portfolioExperience'
import { projects } from '../../content/projects'
import { skills } from '../../content/skills'
import { socials } from '../../content/socials'
import { certifications } from '../../content/certifications'
import type { ProjectCategory } from '../../types/content'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { useWorkspaceDispatch } from '../../state/useWorkspaceDispatch'
import { useNavigation } from '../../hooks/useNavigation'
import { ThemeModal } from './ThemeModal'
import { Icon } from '../ui/Icon'
import { resolveProjectImage } from '../../lib/projectImage'
import { gmailComposeUrl } from '../../lib/gmail'
import deployedStyles from './deployed.css?raw'

const themeAliases = `
:root {
  --red: var(--ac);
  --red-deep: var(--ac2);
  --red-glow: rgba(var(--ac-rgb), 0.25);
  --bg-hero: var(--bg);
  --bg-section: var(--bg);
  --bg-section-alt: var(--card);
  --bg-card: var(--card);
  --bg-card-dark: var(--bg);
  --text-head: var(--fg);
  --text-body: var(--fg);
  --text-muted: var(--mut);
  --text-hero: var(--fg);
  --text-hero-dim: var(--mut);
  --white: var(--fg);
  --border-light: var(--bd);
  --border-red: var(--bd-strong);
  --shadow-card: 0 2px 16px rgba(0, 0, 0, 0.35);
  --shadow-red: 0 0 30px rgba(var(--ac-rgb), 0.15);
  --hero-card-bg: var(--card);
  --hero-card-border: var(--bd-strong);
  --hero-card-shadow: 0 28px 70px rgba(0, 0, 0, 0.6);
  --about-photo-bg: var(--bg);
  --project-card-bg: var(--card);
  --project-card-hover: var(--card);
  --sticky-nav-bg: var(--bg);
  --footer-bg: var(--bg);
}

.skills .skills-wrap .skills-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  align-items: stretch;
}

.skills .skills-wrap .skill-category {
  min-width: 0;
  padding: 18px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  background: color-mix(in srgb, var(--bg-card) 92%, var(--fg));
}

.skills .skills-wrap .skill-category:last-child {
  grid-column: 1 / -1;
}

.skills .skills-wrap .skill-category h3 {
  margin-bottom: 12px;
}

.skills .skills-wrap .skill-list {
  gap: 8px;
}

@media (max-width: 900px) {
  .skills .skills-wrap .skills-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .skills .skills-wrap .skills-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .skills .skills-wrap .skill-category:last-child {
    grid-column: auto;
  }
}

:root[data-theme='scar'] {
  --red: #E8002D;
  --red-deep: #B8001E;
  --red-glow: rgba(232, 0, 45, 0.25);
  --bg-section: #110609;
  --bg-section-alt: #140709;
  --bg-card: #1E0C0E;
  --bg-card-dark: #180A0C;
  --text-head: hsl(30, 17%, 93%);
  --text-body: #B0AAA5;
  --text-muted: #6A6460;
  --text-hero: #F5F2F0;
  --text-hero-dim: rgba(245, 242, 240, 0.6);
  --white: #F0EDEA;
  --border-light: rgba(255, 255, 255, 0.07);
  --border-red: rgba(var(--ac-rgb), 0.2);
  --shadow-card: 0 2px 16px rgba(0, 0, 0, 0.35);
  --shadow-red: 0 0 30px rgba(var(--ac-rgb), 0.15);
  --hero-card-bg: rgba(18, 5, 8, 0.78);
  --hero-card-border: rgba(var(--ac-rgb), 0.22);
  --hero-card-shadow: 0 28px 70px rgba(0, 0, 0, 0.6);
  --about-photo-bg: #0A0406;
  --project-card-bg: #2C2C2C;
  --project-card-hover: #333333;
  --sticky-nav-bg: rgba(13, 6, 8, 0.88);
  --footer-bg: #080305;
}

.exp-date {
  color: var(--fg);
}

.plain-page .plain-interactive-toggle {
  width: 44px;
  gap: 6px;
  padding: 0;
  overflow: hidden;
  justify-content: center;
  font: 600 0.8rem 'DM Sans', sans-serif;
  white-space: nowrap;
  transition: width 0.2s ease, padding 0.2s ease;
}

.plain-page .plain-interactive-toggle:hover,
.plain-page .plain-interactive-toggle:focus-visible {
  width: 118px;
  padding: 0 10px;
  justify-content: center;
}

.plain-control-label {
  max-width: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-width 0.2s ease, opacity 0.15s ease;
}

.plain-interactive-toggle:hover .plain-control-label,
.plain-interactive-toggle:focus-visible .plain-control-label {
  max-width: 110px;
  opacity: 1;
}

.plain-theme-dialog {
  position: fixed;
  inset: 0;
  margin: auto;
  width: min(380px, calc(100vw - 32px));
  max-width: none;
  max-height: calc(100vh - 32px);
  padding: 22px;
  border: 1px solid var(--border-red);
  border-radius: 16px;
  color: var(--text-body);
  background: var(--bg-card);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55);
}

.plain-theme-dialog::backdrop {
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(5px);
}

.plain-theme-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.plain-theme-dialog-header h2 {
  margin: 0;
  color: var(--text-head);
  font-family: Syne, sans-serif;
  font-size: 1.25rem;
}

.plain-theme-dialog-close {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-light);
  border-radius: 9px;
  color: var(--text-body);
  background: transparent;
  cursor: pointer;
}

.plain-theme-dialog .profile-themes > p {
  margin: 0 0 10px;
  color: var(--text-muted);
}

.plain-theme-dialog .theme-options {
  flex-wrap: wrap;
  gap: 8px;
}

.plain-theme-dialog .theme-options button {
  min-height: 36px;
  padding: 7px 11px;
  border: 1px solid var(--border-light);
  border-radius: 999px;
  color: var(--text-body);
  background: transparent;
  font: 600 0.8rem 'DM Sans', sans-serif;
  cursor: pointer;
}

.plain-theme-dialog .theme-options button[aria-checked='true'] {
  border-color: var(--red);
  color: var(--text-head);
  background: rgba(var(--ac-rgb), 0.12);
}

.cert-list[hidden] {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`

const sectionLinks = [
  ['about', 'About'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['contact', 'Contact'],
] as const

const projectOrder = [
  'budget-tracker',
  'ecobench',
  'portfolio-website',
  'quantis-f1',
]

const socialIcons: Record<string, string> = {
  GitHub: 'fab fa-github',
  LinkedIn: 'fab fa-linkedin-in',
  Facebook: 'fab fa-facebook-f',
  Instagram: 'fab fa-instagram',
}

function useDeployedStyles() {
  useEffect(() => {
    const style = document.createElement('style')
    const icons = document.createElement('link')
    style.dataset.plainDesign = 'deployed'
    icons.rel = 'stylesheet'
    icons.href =
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
    style.textContent = deployedStyles
      .replaceAll('rgba(232,0,45,', 'rgba(var(--ac-rgb),')
      .replaceAll('rgba(232, 0, 45,', 'rgba(var(--ac-rgb),')
      .replaceAll('rgba(184,0,30,', 'rgba(var(--ac2-rgb),')
      .replaceAll('rgba(180,0,30,', 'rgba(var(--ac2-rgb),')
      .replaceAll('rgba(182,0,45,', 'rgba(var(--ac-rgb),')
      .replaceAll('rgba(91,184,232,', 'rgba(var(--ac-rgb),')
      .replaceAll('rgba(18,5,8,0.78)', 'var(--card)')
      .replaceAll('rgba(13,6,8,0.88)', 'var(--bg)')
      .replaceAll('#E8002D', 'var(--ac)')
      .replaceAll('#B8001E', 'var(--ac2)')
      .replaceAll('#8C0016', 'var(--ac2)')
      .replaceAll('#3a9fcc', 'var(--ac)')
      .replaceAll('#1A0000', 'var(--bg)')
      .replaceAll('#5C0A0A', 'var(--ac)')
      .replaceAll('#8B0000', 'var(--ac2)')
      .replaceAll('rgba(13,6,8,0.82)', 'var(--card)')
      .concat(themeAliases)
    document.head.append(style)
    document.head.append(icons)
    return () => {
      style.remove()
      icons.remove()
    }
  }, [])
}

export function PlainView() {
  const { resumeUrl, profileImage, projectImages } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  const nav = useNavigation()
  const [showStickyNav, setShowStickyNav] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [failedPhoto, setFailedPhoto] = useState('')
  const [certificatesOpen, setCertificatesOpen] = useState(false)
  const emailUrl = socials.find((social) => social.label === 'Email')?.url
  const [projectFilter, setProjectFilter] = useState<ProjectCategory | 'All'>(
    'All',
  )
  useDeployedStyles()

  const photoSrc = profileImage || profile.photo

  useEffect(() => {
    function updateStickyNav() {
      setShowStickyNav(window.scrollY > 280)
    }
    updateStickyNav()
    window.addEventListener('scroll', updateStickyNav, { passive: true })
    return () => window.removeEventListener('scroll', updateStickyNav)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', mobileMenuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [mobileMenuOpen])

  function openSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    setMobileMenuOpen(false)
    if (id === 'home') return
    event.preventDefault()
    if (id === 'contact') {
      document.getElementById('plain-contact')?.scrollIntoView({
        behavior: 'smooth',
      })
      return
    }
    nav.openFile(id)
  }

  const orderedProjects = projectOrder
    .map((id) => projects.find((project) => project.id === id))
    .filter((project) => project !== undefined)
  const projectFilters: Array<ProjectCategory | 'All'> = [
    'All',
    'Academic',
    'Ongoing',
    'Personal',
    'Completed',
  ]
  const filteredProjects = orderedProjects.filter(
    (project) =>
      projectFilter === 'All' || project.categories.includes(projectFilter),
  )

  return (
    <div className="plain-page" id="plain-home">
      <nav
        className={`sticky-nav${showStickyNav ? ' visible' : ''}`}
        aria-label="Section navigation"
      >
        {[
          ['home', 'Home'],
          ...sectionLinks.filter(([id]) => id !== 'contact'),
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id === 'home' ? 'plain-home' : `plain-${id}`}`}
            className="sticky-nav-link"
            onClick={(event) => openSection(event, id)}
          >
            {label}
          </a>
        ))}
      </nav>

      <section className="hero">
        <div className="hero-card">
          <nav className="nav-bar" aria-label="Primary">
            <button
              className="hamburger"
              type="button"
              aria-label="Toggle menu"
              aria-controls="plain-nav-menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
            <ul
              className={`nav-menu${mobileMenuOpen ? ' active' : ''}`}
              id="plain-nav-menu"
            >
              {[
                ['home', 'Home'],
                ...sectionLinks.filter(([id]) => id !== 'contact'),
              ].map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id === 'home' ? 'plain-home' : `plain-${id}`}`}
                    className="nav-link"
                    onClick={(event) => openSection(event, id)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="contact">
              <a
                href={emailUrl ? gmailComposeUrl(emailUrl) : undefined}
                className="btn-resume"
                aria-label="Email (opens Gmail in a new tab)"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-envelope" aria-hidden="true" />
              </a>
              <a
                href={resumeUrl || profile.resume}
                target={resumeUrl || profile.resume ? '_blank' : undefined}
                rel={
                  resumeUrl || profile.resume
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="btn-resume"
                aria-label="View CV PDF"
              >
                <i className="fas fa-file-alt" aria-hidden="true" />
              </a>
              <ThemeModal />
              <button
                className="btn-resume plain-interactive-toggle"
                type="button"
                aria-label="Back to terminal view"
                title="Back to terminal view"
                onClick={() =>
                  dispatch({ type: 'set-plain-view', enabled: false })
                }
              >
                <i className="fas fa-terminal" aria-hidden="true" />
                <span className="plain-control-label">Terminal</span>
              </button>
            </div>
          </nav>

          <div className="hero-inner">
            <div className="hero-copy">
              <p className="hero-eyebrow">Hi, I&apos;m</p>
              <h1 className="hero-title">
                <span className="hero-name">{profile.name}</span>
              </h1>
              <p className="hero-subtitle">
                I am a <span className="hero-highlight">{profile.role}</span>
              </p>
              <div className="social-row" aria-label="Social links">
                {socials
                  .filter(
                    (social) => social.label !== 'Email' && social.url.trim(),
                  )
                  .map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      className="social-btn"
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i
                        className={socialIcons[social.label] || 'fas fa-link'}
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">{social.label}</span>
                    </a>
                  ))}
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-photo-wrap">
                <div className="hero-photo-inner">
                  <picture>
                    {!profileImage && (
                      <>
                        <source
                          type="image/avif"
                          srcSet="/Myself_Pics/marcus-pedrosa-portrait-480.avif 480w, /Myself_Pics/marcus-pedrosa-portrait-960.avif 960w"
                          sizes="(max-width: 480px) 240px, (max-width: 1024px) 280px, 300px"
                        />
                        <source
                          type="image/webp"
                          srcSet="/Myself_Pics/marcus-pedrosa-portrait-480.webp 480w, /Myself_Pics/marcus-pedrosa-portrait-960.webp 960w"
                          sizes="(max-width: 480px) 240px, (max-width: 1024px) 280px, 300px"
                        />
                      </>
                    )}
                    <img
                      src={photoSrc}
                      alt={profile.name}
                      className="hero-photo"
                      width="960"
                      height="1080"
                      decoding="async"
                      fetchPriority="high"
                      style={{
                        display: failedPhoto === photoSrc ? 'none' : undefined,
                      }}
                      onError={() => setFailedPhoto(photoSrc)}
                    />
                  </picture>
                  <div
                    className="hero-photo-placeholder"
                    aria-hidden="true"
                    style={{
                      display: failedPhoto === photoSrc ? 'flex' : 'none',
                    }}
                  >
                    MP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="plain-main">
        <section id="plain-about" className="about" tabIndex={-1}>
          <div className="about-content">
            <div className="about-text">
              <h2>
                Aspiring <em>Software</em> &amp; <em>AI</em>
                <br />
                Engineer
              </h2>
              <p>{about.intro}</p>
              <div className="about-cards" aria-label="About highlights">
                <div className="about-card">
                  <span>Current focus</span>
                  <strong>{about.focus}</strong>
                </div>
                <div className="about-card">
                  <span>What I enjoy</span>
                  <strong>{about.enjoy}</strong>
                </div>
                <div className="about-card">
                  <span>Goal</span>
                  <strong>{about.goal}</strong>
                </div>
              </div>
              <p>
                One project I&apos;m proud of is{' '}
                <a
                  href={about.featuredProjectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {about.featuredProjectName}
                </a>{' '}
                project. {about.featuredProject}
              </p>
              <div className="about-certs">
                <button
                  className={`about-certs-toggle${certificatesOpen ? ' open' : ''}`}
                  type="button"
                  aria-expanded={certificatesOpen}
                  aria-controls="plain-certifications"
                  onClick={() => setCertificatesOpen((open) => !open)}
                >
                  <span>Certifications</span>
                  <i
                    className="fas fa-chevron-down certs-chevron"
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={`cert-list${certificatesOpen ? ' open' : ''}`}
                  id="plain-certifications"
                  hidden={!certificatesOpen}
                >
                  <div className="cert-list-scroll">
                    {certifications.map((certification) => (
                      <article className="cert-item" key={certification.name}>
                        <p className="cert-name">
                          <a
                            href={certification.url}
                            target={
                              certification.url.startsWith('http')
                                ? '_blank'
                                : undefined
                            }
                            rel={
                              certification.url.startsWith('http')
                                ? 'noopener noreferrer'
                                : undefined
                            }
                          >
                            {certification.name}
                          </a>
                        </p>
                        <p className="cert-issuer">
                          {certification.issuer} · {certification.date}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="about-bottom-lines" />
        </section>

        <section id="plain-experience" className="experience" tabIndex={-1}>
          <div className="container">
            <h2 className="section-title">Experience</h2>
            <div className="exp-timeline">
              {portfolioExperience.map((entry, index) => (
                <div className="exp-item" key={`${entry.t}-${entry.o}`}>
                  <div className="exp-marker" aria-hidden="true">
                    <div className="exp-dot" />
                    {index < portfolioExperience.length - 1 && (
                      <div className="exp-line" />
                    )}
                  </div>
                  <article className="exp-card">
                    <div className="exp-header">
                      <div>
                        <h3 className="exp-role">
                          <em>{entry.t}</em>
                        </h3>
                        <p className="exp-company">{entry.o}</p>
                      </div>
                      <span className="exp-date" style={{ color: 'var(--fg)' }}>
                        {entry.w}
                      </span>
                    </div>
                    <p className="exp-desc">{entry.d}</p>
                    <div className="exp-tags">
                      <span className="exp-tag">{entry.k}</span>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="plain-projects" className="projects" tabIndex={-1}>
          <div className="container">
            <h2 className="section-title">Featured Projects</h2>
            <div className="projects-filter" aria-label="Filter projects">
              {projectFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`filter-btn${projectFilter === filter ? ' active' : ''}`}
                  aria-pressed={projectFilter === filter}
                  onClick={() => setProjectFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="masonry-grid">
              {filteredProjects.map((project) => (
                <article className="project-card" key={project.id}>
                  <figure className="project-media">
                    <picture>
                      <source
                        type="image/avif"
                        srcSet={`/projects/${project.id}.avif`}
                      />
                      <img
                        src={resolveProjectImage(
                          project,
                          projectImages[project.id],
                        )}
                        alt={`${project.n} project preview`}
                        className="project-screenshot"
                        width="1200"
                        height="600"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  </figure>
                  <div className="project-categories" aria-label="Project categories">
                    {project.categories[0] && (
                      <span className="project-badge">
                        {project.categories[0]}
                      </span>
                    )}
                  </div>
                  <h3>{project.n}</h3>
                  <p>{project.overview}</p>
                  <div className="project-tags">
                    {project.t.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.links
                    .filter(([, url]) => url.trim())
                    .map(([label, url]) => (
                      <a
                        key={label}
                        href={url}
                        className="project-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {label} <Icon name="external" />
                        <span className="visually-hidden">
                          {' '}
                          (opens in a new tab)
                        </span>
                      </a>
                    ))}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="plain-skills" className="skills" tabIndex={-1}>
          <div className="container">
            <h2 className="section-title">Skills</h2>
            <div className="skills-wrap">
              <p className="skills-wrap-title">Tech Stack</p>
              <div className="skills-grid">
                {skills.map((group) => (
                  <div className="skill-category" key={group.name}>
                    <h3>{group.name}</h3>
                    <div className="skill-list">
                      {group.tags.map((tag) => (
                        <span className="skill-badge" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="plain-contact" className="footer" tabIndex={-1}>
        <div className="container">
          <h2 className="visually-hidden">Contact</h2>
          <div className="footer-socials">
            {socials
              .filter((social) => social.url.trim())
              .map((social) => (
                <a
                  key={social.label}
                  href={
                    social.url.startsWith('mailto:')
                      ? gmailComposeUrl(social.url)
                      : social.url
                  }
                  className="social-btn"
                  aria-label={`${social.label} (opens in a new tab)`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i
                    className={socialIcons[social.label] || 'fas fa-envelope'}
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">{social.label}</span>
                </a>
              ))}
          </div>
          <p>&copy; {profile.name}</p>
        </div>
      </footer>
    </div>
  )
}
