import type { PortfolioFile } from '../types/navigation'
import { projects } from './projects'

export const files: PortfolioFile[] = [
  { id: 'about', name: 'about.md', kind: 'about' },
  { id: 'experience', name: 'experience.md', kind: 'experience' },
  { id: 'skills', name: 'skills.json', kind: 'skills' },
  { id: 'projects', name: 'projects/', kind: 'projects' },
  ...projects.map((project): PortfolioFile => ({
    id: project.id,
    name: `${project.id}.md`,
    kind: 'project',
    parentId: 'projects',
  })),
  { id: 'resume', name: 'resume.pdf', kind: 'resume' },
  { id: 'contact', name: 'contact.txt', kind: 'contact' },
]
