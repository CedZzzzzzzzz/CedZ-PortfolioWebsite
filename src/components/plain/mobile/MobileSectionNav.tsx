import { useEffect, useState, type CSSProperties } from 'react'
import { useActiveSection } from '../../../hooks/useActiveSection'
import { useNavigation } from '../../../hooks/useNavigation'

const sections = [
  { id: 'plain-top', label: 'Home', icon: 'fa-house' },
  { id: 'plain-about', label: 'About', icon: 'fa-user' },
  { id: 'plain-experience', label: 'Experience', icon: 'fa-briefcase' },
  { id: 'plain-projects', label: 'Projects', icon: 'fa-layer-group' },
  { id: 'plain-github', label: 'GitHub', icon: 'fa-code-branch' },
  { id: 'plain-skills', label: 'Skills', icon: 'fa-code' },
  { id: 'plain-certifications', label: 'Certifications', icon: 'fa-award' },
  { id: 'plain-awards', label: 'Awards', icon: 'fa-trophy' },
] as const

const sectionIds = sections.map((section) => section.id)

interface MobileSectionNavProps {
  id: string
  open: boolean
}

/** Section icons that slide out of the logo in the top bar. */
export function MobileSectionNav({ id, open }: MobileSectionNavProps) {
  const active = useActiveSection(sectionIds)
  const nav = useNavigation()
  // While a tapped section is scrolling into view, hold the indicator on it
  // instead of letting it stop at every section the page passes.
  const [target, setTarget] = useState<string | null>(null)

  useEffect(() => {
    if (target === null) return
    const release = () => setTarget(null)
    window.addEventListener('scrollend', release)
    window.addEventListener('touchstart', release, { passive: true })
    window.addEventListener('wheel', release, { passive: true })
    return () => {
      window.removeEventListener('scrollend', release)
      window.removeEventListener('touchstart', release)
      window.removeEventListener('wheel', release)
    }
  }, [target])

  const shown = target ?? active
  const index = Math.max(
    0,
    sections.findIndex((section) => section.id === shown),
  )

  return (
    <nav id={id} className="m-section-nav" aria-label="Sections" hidden={!open}>
      <span
        className="m-section-indicator"
        aria-hidden="true"
        style={{ '--i': index } as CSSProperties}
      />
      {sections.map((section, i) => (
        <button
          key={section.id}
          type="button"
          className={`m-section-btn${i === index ? ' active' : ''}`}
          aria-label={section.label}
          aria-current={i === index ? 'location' : undefined}
          onClick={() => {
            setTarget(section.id)
            nav.openFile(section.id)
          }}
        >
          <i className={`fas ${section.icon}`} aria-hidden="true" />
        </button>
      ))}
    </nav>
  )
}
