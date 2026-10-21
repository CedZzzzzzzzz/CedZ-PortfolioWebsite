import { about } from '../../src/content/about'
import { certifications } from '../../src/content/certifications'
import { experience } from '../../src/content/experience'
import { files } from '../../src/content/files'
import { profile } from '../../src/content/profile'
import { projects } from '../../src/content/projects'
import { skills } from '../../src/content/skills'
import { socials } from '../../src/content/socials'
import { cvText } from './cvText'

export const facts = {
  instructions:
    'Current site content is authoritative when it conflicts with the separately labeled resume text.',
  site: {
    profile,
    about,
    experience,
    skills,
    projects,
    certifications,
    socials,
    navigation: files.map(({ id, name }) => ({ id, name })),
  },
  resumeText: cvText,
} as const
