import { facts } from '../../netlify/data/facts'
import type { Experience } from '../types/content'

export const experience: Experience[] = facts.experience.map((entry) => ({
  k: 'experience',
  t: entry.role,
  o: entry.company,
  w: entry.period,
  d: entry.description,
}))
