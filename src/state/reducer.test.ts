import { describe, expect, it } from 'vitest'
import { createInitialState } from './initialState'
import { workspaceReducer } from './reducer'
import type { WorkspaceAction } from './types'

describe('workspaceReducer', () => {
  it('opens known files once and ignores unknown files', () => {
    const empty = createInitialState()
    expect(
      workspaceReducer(empty, { type: 'open-file', fileId: 'missing' }),
    ).toBe(empty)
    const about = workspaceReducer(empty, {
      type: 'open-file',
      fileId: 'about',
    })
    const projects = workspaceReducer(about, {
      type: 'open-file',
      fileId: 'projects',
    })
    const reopened = workspaceReducer(projects, {
      type: 'open-file',
      fileId: 'about',
    })
    expect(reopened.tabs).toEqual(['about', 'projects'])
    expect(reopened.activeFileId).toBe('about')
    expect(about.tabs).toEqual(['about'])
  })

  it('activates only an open tab', () => {
    const state = workspaceReducer(createInitialState(), {
      type: 'open-file',
      fileId: 'about',
    })
    expect(
      workspaceReducer(state, { type: 'set-active-tab', fileId: 'projects' }),
    ).toBe(state)
    expect(
      workspaceReducer(state, { type: 'set-active-tab', fileId: null })
        .activeFileId,
    ).toBeNull()
  })

  it('chooses the previous tab, then the next, then none when closing', () => {
    let state = createInitialState()
    for (const fileId of ['about', 'projects', 'skills']) {
      state = workspaceReducer(state, { type: 'open-file', fileId })
    }
    state = workspaceReducer(state, { type: 'close-tab', fileId: 'skills' })
    expect(state.activeFileId).toBe('projects')
    state = workspaceReducer(state, { type: 'set-active-tab', fileId: 'about' })
    state = workspaceReducer(state, { type: 'close-tab', fileId: 'about' })
    expect(state.activeFileId).toBe('projects')
    state = workspaceReducer(state, { type: 'close-tab', fileId: 'projects' })
    expect(state).toMatchObject({ tabs: [], activeFileId: null })
    expect(
      workspaceReducer(state, { type: 'close-tab', fileId: 'missing' }),
    ).toBe(state)
  })

  it('leaves the active tab alone when another tab closes', () => {
    let state = workspaceReducer(createInitialState(), {
      type: 'open-file',
      fileId: 'about',
    })
    state = workspaceReducer(state, { type: 'open-file', fileId: 'projects' })
    expect(
      workspaceReducer(state, { type: 'close-tab', fileId: 'about' })
        .activeFileId,
    ).toBe('projects')
  })

  it('toggles known skills and ignores unknown ones', () => {
    const empty = createInitialState()
    expect(
      workspaceReducer(empty, { type: 'select-skill', skill: 'unknown' }),
    ).toBe(empty)
    const selected = workspaceReducer(empty, {
      type: 'select-skill',
      skill: 'React',
    })
    expect(selected.selectedSkill).toBe('React')
    expect(
      workspaceReducer(selected, { type: 'select-skill', skill: 'React' })
        .selectedSkill,
    ).toBeNull()
  })

  it('accepts only defined themes', () => {
    const empty = createInitialState()
    expect(workspaceReducer(empty, { type: 'set-theme', theme: 'light' })).toBe(
      empty,
    )
    expect(
      workspaceReducer(empty, { type: 'set-theme', theme: 'fire' }).theme,
    ).toBe('fire')
  })

  it('sets and removes project and profile images', () => {
    const empty = createInitialState()
    expect(
      workspaceReducer(empty, {
        type: 'set-project-image',
        projectId: 'missing',
        dataUrl: 'data:image/png;base64,x',
      }),
    ).toBe(empty)
    let state = workspaceReducer(empty, {
      type: 'set-project-image',
      projectId: 'ecobench',
      dataUrl: 'data:image/png;base64,x',
    })
    state = workspaceReducer(state, {
      type: 'set-profile-image',
      dataUrl: 'data:image/jpeg;base64,y',
    })
    expect(state.projectImages.ecobench).toBe('data:image/png;base64,x')
    expect(state.profileImage).toBe('data:image/jpeg;base64,y')
    state = workspaceReducer(state, {
      type: 'remove-project-image',
      projectId: 'ecobench',
    })
    state = workspaceReducer(state, { type: 'remove-profile-image' })
    expect(state.projectImages).toEqual({})
    expect(state.profileImage).toBeNull()
    expect(empty.projectImages).toEqual({})
  })

  it('updates plain view, Byte, and the attached resume URL', () => {
    let state = createInitialState()
    state = workspaceReducer(state, { type: 'set-plain-view', enabled: true })
    state = workspaceReducer(state, { type: 'set-byte-open', open: true })
    state = workspaceReducer(state, {
      type: 'set-resume-url',
      url: 'blob:resume',
    })
    expect(state).toMatchObject({
      plainView: true,
      byteOpen: true,
      resumeUrl: 'blob:resume',
    })
  })

  it('keeps active tabs valid and tabs unique after every action', () => {
    const actions: WorkspaceAction[] = [
      { type: 'open-file', fileId: 'about' },
      { type: 'open-file', fileId: 'projects' },
      { type: 'open-file', fileId: 'skills' },
      { type: 'open-file', fileId: 'about' },
      { type: 'open-file', fileId: 'missing' },
      { type: 'set-active-tab', fileId: 'projects' },
      { type: 'set-active-tab', fileId: 'missing' },
      { type: 'close-tab', fileId: 'about' },
      { type: 'close-tab', fileId: 'projects' },
      { type: 'close-tab', fileId: 'skills' },
      { type: 'close-tab', fileId: 'missing' },
      { type: 'set-active-tab', fileId: null },
    ]
    let state = createInitialState()
    for (let index = 0; index < 10; index += 1) {
      for (const action of actions) {
        state = workspaceReducer(state, action)
        expect(new Set(state.tabs).size).toBe(state.tabs.length)
        expect(
          state.activeFileId === null ||
            state.tabs.includes(state.activeFileId),
        ).toBe(true)
      }
    }
  })
})
