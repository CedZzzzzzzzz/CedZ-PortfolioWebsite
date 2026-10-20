import type { PortfolioFile } from '../types/navigation'
import { projects } from './projects'

export const files: PortfolioFile[] = [
  { id: 'about', name: 'about.md', kind: 'about', icon: '¶' },
  { id: 'experience', name: 'experience.md', kind: 'experience', icon: '⌛' },
  { id: 'skills', name: 'skills.json', kind: 'skills', icon: '{}' },
  { id: 'projects', name: 'projects/', kind: 'projects', icon: '▤' },
  ...projects.map((project): PortfolioFile => ({
    id: project.id,
    name: `${project.id}.md`,
    kind: 'project',
    icon: '◆',
    parentId: 'projects',
  })),
  { id: 'resume', name: 'resume.pdf', kind: 'resume', icon: '⎙' },
  { id: 'contact', name: 'contact.txt', kind: 'contact', icon: '@' },
]
