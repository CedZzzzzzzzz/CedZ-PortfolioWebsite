import { projects } from '../../content/projects'

const projectOrder = [
  'hackathons-ph',
  'budget-tracker',
  'ecobench',
  'portfolio-website',
  'quantis-f1',
]

/** Projects in the order both plain views present them. */
export const orderedProjects = projectOrder
  .map((id) => projects.find((project) => project.id === id))
  .filter((project) => project !== undefined)
