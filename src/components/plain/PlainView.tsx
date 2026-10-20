import { profile } from '../../content/profile'
import { about } from '../../content/about'
import { experience } from '../../content/experience'
import { projects } from '../../content/projects'
import { skills } from '../../content/skills'
import { socials } from '../../content/socials'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { useWorkspaceDispatch } from '../../state/useWorkspaceDispatch'
import { useNavigation } from '../../hooks/useNavigation'
import { ProfileAvatar } from '../profile/ProfileAvatar'
import { Icon } from '../ui/Icon'
import { resolveProjectImage } from '../../lib/projectImage'
import './plain.css'

export function PlainView() {
  const { resumeUrl, profileImage, projectImages } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  const nav = useNavigation()
  return (
    <div className="plain-page">
      <a className="skip-link" href="#plain-main">
        Skip to content
      </a>
      <header className="plain-header">
        <ProfileAvatar
          src={profileImage || profile.photo}
          name={profile.name}
        />
        <h1>{profile.name}</h1>
        <p>{profile.role}</p>
        <p>{profile.focus}</p>
        <nav aria-label="Plain view navigation">
          {[
            'about',
            'experience',
            'projects',
            'skills',
            'resume',
            'contact',
          ].map((id) => (
            <a
              key={id}
              href={`#plain-${id}`}
              onClick={(e) => {
                e.preventDefault()
                nav.openFile(id)
              }}
            >
              {id}
            </a>
          ))}
        </nav>
      </header>
      <main id="plain-main">
        <section id="plain-about" tabIndex={-1}>
          <h2 tabIndex={-1}>About</h2>
          <p>{about}</p>
        </section>
        <section id="plain-experience" tabIndex={-1}>
          <h2 tabIndex={-1}>Experience</h2>
          <ol className="timeline">
            {experience.map((entry, i) => (
              <li key={i}>
                <p>
                  {entry.w} · {entry.k}
                </p>
                <h3 tabIndex={-1}>{entry.t}</h3>
                <p>{entry.o}</p>
                <p>{entry.d}</p>
              </li>
            ))}
          </ol>
        </section>
        <section id="plain-projects" tabIndex={-1}>
          <h2 tabIndex={-1}>Projects</h2>
          <div className="plain-project-grid">
            {projects.map((project) => (
              <article key={project.id} id={`plain-project-${project.id}`}>
                <img
                  src={resolveProjectImage(project, projectImages[project.id])}
                  alt={project.n}
                  width={1000}
                  height={650}
                  loading="lazy"
                />
                <h3 id={`plain-${project.id}`} tabIndex={-1}>
                  {project.n}
                </h3>
                <p>{project.overview}</p>
                <ul>
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <p>{project.t.join(' · ')}</p>
                <div>
                  {project.links
                    .filter(([, url]) => url.trim())
                    .map(([label, url]) => (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {label} <Icon name="external" /><span className="visually-hidden"> (opens in a new tab)</span>
                      </a>
                    ))}
                </div>
                <button onClick={() => nav.openFile(project.id)}>
                  Open project
                </button>
              </article>
            ))}
          </div>
        </section>
        <section id="plain-skills" tabIndex={-1}>
          <h2 tabIndex={-1}>Skills</h2>
          {skills.map((group) => (
            <div key={group.name}>
              <h3 tabIndex={-1}>{group.name}</h3>
              <p>{group.tags.join(' · ')}</p>
            </div>
          ))}
        </section>
        <section id="plain-resume" tabIndex={-1}>
          <h2 tabIndex={-1}>Resume</h2>
          {resumeUrl || profile.resume ? (
            <a
              href={resumeUrl || profile.resume}
              download="resume.pdf"
            >
              Download resume.pdf
            </a>
          ) : (
            <p>not attached yet</p>
          )}
        </section>
        <section id="plain-contact" tabIndex={-1}>
          <h2 tabIndex={-1}>Contact</h2>
          <ul>
            {socials
              .filter((s) => s.url.trim())
              .map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target={s.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                  >
                    {s.display}
                    {!s.url.startsWith('mailto:') && (
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    )}
                  </a>
                </li>
              ))}
          </ul>
        </section>
      </main>
      <footer>
        <button
          onClick={() => dispatch({ type: 'set-plain-view', enabled: false })}
        >
          back to the interactive view
        </button>
      </footer>
    </div>
  )
}
