import { useEffect } from 'react'
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

/** Injects the original deployed stylesheet and Font Awesome used by the mobile plain view. */
export function useDeployedStyles() {
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
