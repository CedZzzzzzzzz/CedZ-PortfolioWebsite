import { files } from '../content/files'
import { projects } from '../content/projects'
import { skills } from '../content/skills'
import { themes } from '../theme/themes'
import type { WorkspaceAction, WorkspaceState } from './types'

const fileIds = new Set(files.map(({ id }) => id))
const projectIds = new Set(projects.map(({ id }) => id))
const skillTags = new Set(skills.flatMap(({ tags }) => tags))

export function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  switch (action.type) {
    case 'open-file':
      if (!fileIds.has(action.fileId)) return state
      return {
        ...state,
        tabs: state.tabs.includes(action.fileId)
          ? state.tabs
          : [...state.tabs, action.fileId],
        activeFileId: action.fileId,
      }

    case 'close-tab': {
      const index = state.tabs.indexOf(action.fileId)
      if (index === -1) return state
      const tabs = state.tabs.filter((fileId) => fileId !== action.fileId)
      const activeFileId =
        state.activeFileId === action.fileId
          ? (tabs[index - 1] ?? tabs[index] ?? null)
          : state.activeFileId
      return { ...state, tabs, activeFileId }
    }

    case 'set-active-tab':
      if (action.fileId !== null && !state.tabs.includes(action.fileId))
        return state
      if (state.activeFileId === action.fileId) return state
      return { ...state, activeFileId: action.fileId }

    case 'select-skill':
      if (action.skill !== null && !skillTags.has(action.skill)) return state
      if (action.skill === null && state.selectedSkill === null) return state
      return {
        ...state,
        selectedSkill:
          state.selectedSkill === action.skill ? null : action.skill,
      }

    case 'set-project-image':
      if (
        !projectIds.has(action.projectId) ||
        !action.dataUrl.startsWith('data:image/')
      ) {
        return state
      }
      if (state.projectImages[action.projectId] === action.dataUrl) return state
      return {
        ...state,
        projectImages: {
          ...state.projectImages,
          [action.projectId]: action.dataUrl,
        },
      }

    case 'remove-project-image': {
      if (!(action.projectId in state.projectImages)) return state
      const projectImages = { ...state.projectImages }
      delete projectImages[action.projectId]
      return { ...state, projectImages }
    }

    case 'set-profile-image':
      if (!action.dataUrl.startsWith('data:image/')) return state
      if (state.profileImage === action.dataUrl) return state
      return { ...state, profileImage: action.dataUrl }

    case 'remove-profile-image':
      if (state.profileImage === null) return state
      return { ...state, profileImage: null }

    case 'set-theme': {
      const theme = themes.find((name) => name === action.theme)
      if (!theme || state.theme === theme) return state
      return { ...state, theme }
    }

    case 'set-plain-view':
      if (state.plainView === action.enabled) return state
      return { ...state, plainView: action.enabled }

    case 'set-byte-open':
      if (state.byteOpen === action.open) return state
      return { ...state, byteOpen: action.open }

    case 'set-resume-url':
      if (state.resumeUrl === action.url) return state
      return { ...state, resumeUrl: action.url }
  }
}
