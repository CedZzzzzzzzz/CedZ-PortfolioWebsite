import { useWorkspaceDispatch } from '../state/useWorkspaceDispatch'
import { useWorkspaceState } from '../state/useWorkspaceState'
import { useReducedMotion } from './useReducedMotion'

export function useNavigation() {
  const dispatch = useWorkspaceDispatch()
  const { selectedSkill, plainView } = useWorkspaceState()
  const reducedMotion = useReducedMotion()

  function openFile(fileId: string) {
    if (!plainView) {
      dispatch({ type: 'open-file', fileId })
      return
    }
    const id = fileId.startsWith('plain-')
      ? fileId
      : fileId === 'projects'
        ? 'plain-projects'
        : `plain-${fileId}`
    requestAnimationFrame(() => {
      const section = document.getElementById(id)
      const heading = section?.querySelector('h2,h3') as HTMLElement | null
      section?.scrollIntoView({
        behavior: reducedMotion ? 'instant' : 'smooth',
        block: 'start',
      })
      heading?.focus({ preventScroll: true })
    })
  }

  function openSkill(skill: string) {
    if (selectedSkill !== skill) dispatch({ type: 'select-skill', skill })
    openFile('skills')
  }

  return { openFile, openSkill }
}
