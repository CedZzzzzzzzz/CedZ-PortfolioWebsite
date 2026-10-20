import { files } from '../content/files'
import { useWorkspaceState } from './useWorkspaceState'

export function useActiveFile() {
  const { activeFileId } = useWorkspaceState()
  return files.find(({ id }) => id === activeFileId) ?? null
}
