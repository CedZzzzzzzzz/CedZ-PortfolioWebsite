import { profile } from '../../../content/profile'
import { useContributions } from '../../../hooks/useContributions'
import { ContributionDots } from './ContributionDots'
import { SectionHead } from './SectionHead'

export function WorkspaceGitHub() {
  const calendar = useContributions()
  const login = profile.github

  return (
    <section id="plain-github" className="dp-section" tabIndex={-1}>
      <SectionHead
        command="gh contributions"
        title="GitHub"
        summary={
          <a
            className="dp-gh-link"
            href={`https://github.com/${encodeURIComponent(login)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            @{login.toUpperCase()} ↗
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        }
      />
      {calendar === null ? (
        <p className="dp-gh-empty mono">
          The activity graph is unavailable right now.
        </p>
      ) : (
        <ContributionDots calendar={calendar} />
      )}
    </section>
  )
}
