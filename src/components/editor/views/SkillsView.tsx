import { skills } from '../../../content/skills'
import { projects } from '../../../content/projects'
import { useWorkspaceState } from '../../../state/useWorkspaceState'
import { useWorkspaceDispatch } from '../../../state/useWorkspaceDispatch'
import { useNavigation } from '../../../hooks/useNavigation'

export function SkillsView() {
  const { selectedSkill } = useWorkspaceState()
  const dispatch = useWorkspaceDispatch()
  const { openFile } = useNavigation()
  const matches = projects.filter(
    (project) => selectedSkill && project.t.includes(selectedSkill),
  )
  return (
    <article className="content-view">
      <h3>skills</h3>
      {skills.map((group) => (
        <section key={group.name}>
          <h4>{group.name}</h4>
          <div className="tag-list">
            {group.tags.map((tag) => (
              <button
                type="button"
                key={tag}
                className="skill-tag"
                aria-pressed={selectedSkill === tag}
                onClick={() => dispatch({ type: 'select-skill', skill: tag })}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>
      ))}
      {selectedSkill && (
        <section aria-live="polite">
          <h4>Projects using {selectedSkill}</h4>
          {matches.length ? (
            <ul>
              {matches.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => openFile(project.id)}
                  >
                    {project.n}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No projects use this skill yet.</p>
          )}
        </section>
      )}
    </article>
  )
}
