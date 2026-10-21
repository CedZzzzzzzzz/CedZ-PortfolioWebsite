import { useRef, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { ThemePicker } from '../profile/ThemePicker'
import { Icon } from '../ui/Icon'

export function ThemeModal() {
  const dialog = useRef<HTMLDialogElement>(null)

  function closeFromBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) dialog.current?.close()
  }

  return (
    <>
      <button
        className="btn-resume plain-theme-trigger"
        type="button"
        aria-label="Choose theme"
        title="Choose theme"
        onClick={() => dialog.current?.showModal()}
      >
        <Icon name="theme" size={18} />
      </button>
      {createPortal(
        <dialog
          ref={dialog}
          className="plain-theme-dialog"
          aria-labelledby="plain-theme-dialog-title"
          onClick={closeFromBackdrop}
        >
          <div className="plain-theme-dialog-header">
            <h2 id="plain-theme-dialog-title">Choose a theme</h2>
            <button
              className="plain-theme-dialog-close"
              type="button"
              aria-label="Close theme picker"
              onClick={() => dialog.current?.close()}
            >
              <i className="fas fa-xmark" aria-hidden="true" />
            </button>
          </div>
          <ThemePicker />
        </dialog>,
        document.body,
      )}
    </>
  )
}
