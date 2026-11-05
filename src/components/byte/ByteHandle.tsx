import { useByte } from '../../hooks/useByte'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import { Icon } from '../ui/Icon'

export function ByteHandle() {
  const { byteOpen } = useWorkspaceState()
  const { open, handleRef } = useByte()
  return (
    <div className="byte-handle-row" hidden={byteOpen}>
      <button
        ref={handleRef}
        className="byte-handle"
        aria-label="Open Byte"
        aria-expanded={byteOpen}
        aria-controls="byte-panel"
        onClick={(event) => open(event.currentTarget)}
      >
        <Icon name="chevron-left" /> <span>Byte</span>
      </button>
    </div>
  )
}
