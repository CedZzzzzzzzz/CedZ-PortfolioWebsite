import { useRef, useState, type ReactNode } from 'react'
import { downscaleImage } from '../../lib/image'
import { useWorkspaceDispatch } from '../../state/useWorkspaceDispatch'
import { useWorkspaceState } from '../../state/useWorkspaceState'

export function ProfilePhotoUpload({ children }: { children: ReactNode }) {
  const dispatch = useWorkspaceDispatch()
  const { profileImage } = useWorkspaceState()
  const input = useRef<HTMLInputElement>(null)
  const pending = useRef(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  async function upload(file?: File) {
    if (!file || pending.current) return
    pending.current = true
    setBusy(true)
    setMessage('')
    try {
      const dataUrl = await downscaleImage(file)
      dispatch({ type: 'set-profile-image', dataUrl })
      setMessage('Photo updated.')
    } catch {
      setMessage('Could not load that image. Choose an image file.')
    } finally {
      pending.current = false
      setBusy(false)
    }
  }
  return (
    <div
      className="profile-photo-upload"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        void upload(event.dataTransfer.files[0])
      }}
    >
      <button
        className="profile-photo-button"
        aria-label="Upload profile photo"
        disabled={busy}
        onClick={() => input.current?.click()}
      >
        {children}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        aria-label="Choose profile photo"
        hidden
        disabled={busy}
        onChange={(event) => {
          void upload(event.currentTarget.files?.[0])
          event.currentTarget.value = ''
        }}
      />
      <p className="profile-hint">Click or drop a photo</p>
      {profileImage && (
        <button
          disabled={busy}
          onClick={() => {
            dispatch({ type: 'remove-profile-image' })
            setMessage('Uploaded photo removed.')
          }}
        >
          remove photo
        </button>
      )}
      <p role="status">{message}</p>
    </div>
  )
}
