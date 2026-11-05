import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ImageViewerProps {
  src: string
  name: string
  onClose: () => void
}

export function ImageViewer({ src, name, onClose }: ImageViewerProps) {
  const dialog = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const trigger = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (document.getElementById('launcher-dialog')) return
        event.preventDefault()
        onClose()
      }
      if (event.key === 'Tab') {
        // The close button is this viewer's only interactive control.
        event.preventDefault()
        closeButton.current?.focus()
      }
    }
    function containFocus(event: FocusEvent) {
      if (
        event.target instanceof Node &&
        !dialog.current?.contains(event.target)
      )
        closeButton.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('focusin', containFocus)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', containFocus)
      document.body.style.overflow = overflow
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    }
  }, [onClose])

  return createPortal(
    <div
      className="image-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="image-viewer"
        role="dialog"
        aria-modal="true"
        aria-label={name + ' image'}
        ref={dialog}
      >
        <button
          type="button"
          className="view-button"
          ref={closeButton}
          onClick={onClose}
          aria-label="Close image"
        >
          Close ×
        </button>
        <img src={src} alt={name} width={1000} height={650} loading="lazy" />
      </div>
    </div>,
    document.body,
  )
}
