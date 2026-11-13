import type { DesktopIconName } from './desktopIconPaths'

export interface DesktopSection {
  id: string
  label: string
  file: string
  icon?: DesktopIconName
}

/** Every desktop section in page order; the ones with an icon appear in the top nav. */
export const desktopSections: readonly DesktopSection[] = [
  { id: 'plain-top', label: 'Home', file: '', icon: 'home' },
  { id: 'plain-about', label: 'About', file: 'about.md', icon: 'about' },
  {
    id: 'plain-experience',
    label: 'Experience',
    file: 'experience.md',
    icon: 'experience',
  },
  {
    id: 'plain-projects',
    label: 'Projects',
    file: 'projects/',
    icon: 'projects',
  },
  {
    id: 'plain-github',
    label: 'GitHub',
    file: 'github/',
    icon: 'GitHub',
  },
  { id: 'plain-skills', label: 'Skills', file: 'skills.json', icon: 'skills' },
  {
    id: 'plain-certifications',
    label: 'Certifications',
    file: 'certifications/',
    icon: 'award',
  },
  { id: 'plain-awards', label: 'Awards', file: 'awards.md', icon: 'trophy' },
  { id: 'plain-contact', label: 'Contact', file: 'contact.txt' },
]

export const desktopSectionIds = desktopSections.map((section) => section.id)
