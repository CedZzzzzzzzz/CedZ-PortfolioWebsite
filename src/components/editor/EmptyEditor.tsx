import { useNavigation } from '../../hooks/useNavigation'

export function EmptyEditor() {
  const { openFile } = useNavigation()
  return (
    <div className="empty-editor">
      <h3>start here</h3>
      <p>Open a file to explore.</p>
      <div className="view-actions">
        {['projects', 'experience', 'about', 'resume', 'contact'].map(
          (id, index) => (
            <button
              type="button"
              className="view-button"
              id={index === 0 ? 'editor-start' : undefined}
              key={id}
              onClick={() => openFile(id)}
            >
              {id}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
