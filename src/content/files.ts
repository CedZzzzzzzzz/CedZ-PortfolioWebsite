import type { PortfolioFile } from '../types/navigation'
import { projects } from './projects'
import { certifications } from './certifications'

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
  { id: 'certifications', name: 'certifications/', kind: 'certifications' },
  ...certifications.map((certification): PortfolioFile => ({
    id: `certification-${certification.id}`,
    name: certification.file,
    kind: 'certification',
    parentId: 'certifications',
  })),
  { id: 'resume', name: 'resume.pdf', kind: 'resume' },
  { id: 'contact', name: 'contact.txt', kind: 'contact' },
]
