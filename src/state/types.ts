import type { ThemeName } from '../types/navigation'

export interface WorkspaceState {
  tabs: string[]
  activeFileId: string | null
  selectedSkill: string | null
  projectImages: Record<string, string>
  profileImage: string | null
  theme: ThemeName
  plainView: boolean
  byteOpen: boolean
  resumeUrl: string | null
}

export type WorkspaceAction =
  | { type: 'open-file'; fileId: string }
  | { type: 'close-tab'; fileId: string }
  | { type: 'set-active-tab'; fileId: string | null }
  | { type: 'select-skill'; skill: string | null }
  | { type: 'set-project-image'; projectId: string; dataUrl: string }
  | { type: 'remove-project-image'; projectId: string }
  | { type: 'set-profile-image'; dataUrl: string }
  | { type: 'remove-profile-image' }
  | { type: 'set-theme'; theme: string }
  | { type: 'set-plain-view'; enabled: boolean }
  | { type: 'set-byte-open'; open: boolean }
  | { type: 'set-resume-url'; url: string | null }
