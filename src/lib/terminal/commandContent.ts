import { about } from '../../content/about'
import { portfolioExperience } from '../../content/portfolioExperience'
import { files } from '../../content/files'
import { profile } from '../../content/profile'
import { projects } from '../../content/projects'
import { skills } from '../../content/skills'
import { socials } from '../../content/socials'
import type { CommandContent } from '../../types/command'

export const commandContent: CommandContent = {
  about,
  experience: portfolioExperience,
  files,
  profile,
  projects,
  skills,
  socials,
}
