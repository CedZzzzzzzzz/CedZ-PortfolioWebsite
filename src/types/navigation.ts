export type ThemeName = 'dark' | 'blue' | 'tokyo' | 'fire' | 'scar'

export type FileKind =
  | 'about'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'project'
  | 'certification'
  | 'resume'
  | 'contact'

export interface PortfolioFile {
  id: string
  name: string
  kind: FileKind
  parentId?: string
}
