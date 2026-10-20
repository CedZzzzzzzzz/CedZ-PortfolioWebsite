import { about } from '../../../content/about'
import { useNavigation } from '../../../hooks/useNavigation'

export function AboutView() {
  const { openFile } = useNavigation()
  return (
    <article className="content-view">
      <h3># hi, i build things end to end.</h3>
      <p>{about}</p>
      <div className="view-actions">
        {['projects', 'experience', 'skills', 'resume', 'contact'].map((id) => (
          <button
            key={id}
            type="button"
            className="view-button"
            onClick={() => openFile(id)}
          >
            {id}
          </button>
        ))}
      </div>
    </article>
  )
}
