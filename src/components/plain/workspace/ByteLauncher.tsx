import { useByte } from '../../../hooks/useByte'
import { useWorkspaceState } from '../../../state/useWorkspaceState'
import { ByteSprite } from '../../byte/ByteSprite'

/** Bottom-right pill that opens the shared Byte panel from the plain view. */
export function ByteLauncher() {
  const { byteOpen } = useWorkspaceState()
  const { open } = useByte()

  // Hidden instead of unmounted so Byte can return focus here when it closes.
  return (
    <button
      type="button"
      className="dp-byte"
      hidden={byteOpen}
      aria-controls="byte-panel"
      aria-expanded={false}
      onClick={(event) => open(event.currentTarget)}
    >
      <span className="dp-byte-badge" aria-hidden="true">
        <ByteSprite />
      </span>
      Ask Byte
    </button>
  )
}
