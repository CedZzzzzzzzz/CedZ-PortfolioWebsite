export interface Profile {
  name: string
  role: string
  focus: string
  github: string
  photo: string
  resume: string
}

export interface Project {
  id: string
  n: string
  d: string
  img: string
  year?: string
  categories: ProjectCategory[]
  role: string
  overview: string
  highlights: string[]
  t: string[]
  links: [label: string, url: string][]
}

export type ProjectCategory = 'Academic' | 'Ongoing' | 'Personal' | 'Completed'

export interface Experience {
  k: string
  t: string
  o: string
  w: string
  d: string
}

export interface SkillGroup {
  name: string
  tags: string[]
}

export interface Social {
  label: string
  url: string
  display: string
}
