import { about } from '../../../content/about'
import { useNavigation } from '../../../hooks/useNavigation'
import { DecryptedText } from '../../ui/DecryptedText'

const highlights = [
  ['01', 'current focus', about.focus],
  ['02', 'what I enjoy', about.enjoy],
  ['03', 'goal', about.goal],
] as const

export function AboutView() {
  const { openFile } = useNavigation()

  return (
    <article className="content-view about-terminal">
      <header className="about-terminal-header">
        <h3>
          <DecryptedText text="# who_am_i" />
        </h3>
        <span>~/cedz-portfolio/about.md</span>
      </header>

      <section className="about-terminal-intro-block">
        <p className="about-terminal-label">profile</p>
        <p className="about-terminal-intro">{about.intro}</p>
      </section>

      <div className="about-terminal-facts" aria-label="About highlights">
        {highlights.map(([number, label, value]) => (
          <section className="about-terminal-fact" key={number}>
            <p className="about-terminal-label">
              <span>{number}</span> {label}
            </p>
            <p>{value}</p>
          </section>
        ))}
      </div>

      <section className="about-terminal-project">
        <div>
          <p className="about-terminal-label">featured project</p>
          <a
            className="about-terminal-project-name"
            href={about.featuredProjectUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {about.featuredProjectName}
          </a>
        </div>
        <p>{about.featuredProject}</p>
      </section>

      <nav className="about-terminal-shortcuts" aria-label="Explore portfolio">
        <span className="about-terminal-command">$ open</span>
        {['projects', 'experience', 'skills', 'resume', 'contact'].map((id) => (
          <button
            key={id}
            type="button"
            className="about-terminal-link"
            onClick={() => openFile(id)}
          >
            {id}
          </button>
        ))}
      </nav>
    </article>
  )
}
