import { useState } from 'react'
import { useWorkspaceDispatch } from '../../state/useWorkspaceDispatch'

export function ResumeAttachment() {
  const dispatch = useWorkspaceDispatch()
  const [error, setError] = useState('')
  return (
    <div className="upload-area">
      <label>
        Attach your PDF
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0]
            event.currentTarget.value = ''
            if (!file) return
            if (file.type !== 'application/pdf') {
              setError('Choose a PDF file.')
              return
            }
            setError('')
            dispatch({ type: 'set-resume-url', url: URL.createObjectURL(file) })
          }}
        />
      </label>
      <button
        type="button"
        className="view-button"
        onClick={() => dispatch({ type: 'set-resume-url', url: null })}
      >
        Remove attached PDF
      </button>
      <p role="status">{error}</p>
    </div>
  )
}
