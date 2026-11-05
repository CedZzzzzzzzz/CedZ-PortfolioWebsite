import { useRef, useState } from 'react'
import { downscaleImage } from '../../lib/image'
import { useWorkspaceDispatch } from '../../state/useWorkspaceDispatch'

export function ProjectImageUpload({ projectId }: { projectId: string }) {
  const dispatch = useWorkspaceDispatch()
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)

  async function upload(file?: File) {
    if (!file || pending.current) return
    pending.current = true
    setBusy(true)
    setMessage('')
    try {
      const dataUrl = await downscaleImage(file)
      dispatch({ type: 'set-project-image', projectId, dataUrl })
      setMessage('Image updated.')
    } catch {
      setMessage('Could not load that image. Choose an image file.')
    } finally {
      pending.current = false
      setBusy(false)
    }
  }
  return (
    <div
      className="upload-area"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        void upload(event.dataTransfer.files[0])
      }}
    >
      <label>
        Replace image or drop one here
        <input
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(event) => {
            void upload(event.currentTarget.files?.[0])
            event.currentTarget.value = ''
          }}
        />
      </label>
      <button
        type="button"
        className="view-button"
        disabled={busy}
        onClick={() => dispatch({ type: 'remove-project-image', projectId })}
      >
        Remove uploaded image
      </button>
      <p role="status">{message}</p>
    </div>
  )
}
