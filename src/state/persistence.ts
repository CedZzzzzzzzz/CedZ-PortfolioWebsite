import { projects } from '../content/projects'
import {
  readStoredJson,
  writeStoredJson,
  type JsonStorage,
} from '../lib/storage'
import { themes } from '../theme/themes'
import type { ThemeName } from '../types/navigation'
import { createInitialState } from './initialState'
import type { WorkspaceState } from './types'

const themeKey = 'cedz-theme'
const plainKey = 'cedz-plain'
const imagesKey = 'cedz-imgs'
const projectIds = new Set(projects.map(({ id }) => id))

interface StoredImages {
  version: 1
  projects: Record<string, string>
  profile: string | null
}

function isTheme(value: unknown): value is ThemeName {
  return typeof value === 'string' && themes.some((theme) => theme === value)
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

function isDataImage(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('data:image/')
}

function isStoredImages(value: unknown): value is StoredImages {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false
  const record = value as Record<string, unknown>
  return (
    record.version === 1 &&
    typeof record.projects === 'object' &&
    record.projects !== null &&
    !Array.isArray(record.projects) &&
    (record.profile === null || isDataImage(record.profile))
  )
}

export function loadInitialState(storage: JsonStorage | null): WorkspaceState {
  const state = createInitialState()
  if (!storage) return state

  state.theme = readStoredJson(storage, themeKey, state.theme, isTheme)
  state.plainView = readStoredJson(
    storage,
    plainKey,
    state.plainView,
    isBoolean,
  )
  const images = readStoredJson<StoredImages>(
    storage,
    imagesKey,
    { version: 1, projects: {}, profile: null },
    isStoredImages,
  )
  state.projectImages = Object.fromEntries(
    Object.entries(images.projects).filter(
      ([projectId, dataUrl]) =>
        projectIds.has(projectId) && isDataImage(dataUrl),
    ),
  )
  state.profileImage = images.profile
  return state
}

export function saveChangedState(
  storage: JsonStorage | null,
  previous: WorkspaceState,
  next: WorkspaceState,
): void {
  if (!storage) return
  if (previous.theme !== next.theme)
    writeStoredJson(storage, themeKey, next.theme)
  if (previous.plainView !== next.plainView) {
    writeStoredJson(storage, plainKey, next.plainView)
  }
  if (
    previous.projectImages !== next.projectImages ||
    previous.profileImage !== next.profileImage
  ) {
    writeStoredJson(storage, imagesKey, {
      version: 1,
      projects: next.projectImages,
      profile: next.profileImage,
    } satisfies StoredImages)
  }
}
