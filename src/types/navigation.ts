export type ThemeName = 'dark' | 'blue' | 'tokyo' | 'fire'

export type FileKind =
  | 'about'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'project'
  | 'resume'
  | 'contact'

export interface PortfolioFile {
  id: string
  name: string
  kind: FileKind
  parentId?: string
}
