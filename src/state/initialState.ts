import type { WorkspaceState } from './types'

export function createInitialState(): WorkspaceState {
  return {
    tabs: [],
    activeFileId: null,
    selectedSkill: null,
    projectImages: {},
    profileImage: null,
    theme: 'dark',
    plainView: false,
    byteOpen: false,
    resumeUrl: null,
  }
}
