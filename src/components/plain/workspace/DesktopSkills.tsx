import { useState } from 'react'
import { skills } from '../../../content/skills'
import { DesktopIcon } from './DesktopIcon'
import { SectionHead } from './SectionHead'

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z]+/g, '-')
}

export function DesktopSkills() {
  const [selected, setSelected] = useState(0)
  const group = skills[selected]
  if (!group) return null
  const file = `${slug(group.name)}.json`

  return (
    <section id="plain-skills" className="dp-section" tabIndex={-1}>
      <SectionHead command="open skills.json" title="What I work with" />
      <div className="dp-pane dp-skills">
        <div className="dp-explorer">
          <p className="dp-ptitle">Explorer</p>
          <p className="dp-explorer-root mono">▾ skills/</p>
          {skills.map((item, index) => {
            const on = index === selected
            return (
              <button
                key={item.name}
                type="button"
                className={`dp-folder${on ? ' on' : ''}`}
                aria-pressed={on}
                onClick={() => setSelected(index)}
              >
                <DesktopIcon name="folder" size={18} />
                <span className="mono">{slug(item.name)}/</span>
                <span className="dp-count mono">{item.tags.length}</span>
              </button>
            )
          })}
        </div>
        <div className="dp-skill-editor">
          <p className="dp-ptitle">Editor</p>
          <div className="dp-tabs">
            <span className="dp-tab mono active">
              <DesktopIcon name="file" size={14} strokeWidth={2} />
              {file}
            </span>
          </div>
          <div className="dp-skill-body" aria-live="polite">
            <p className="dp-crumb mono">skills › {file}</p>
            <div className="dp-skill-name">
              <h3>{group.name}</h3>
              <span className="mono">{group.tags.length} skills</span>
            </div>
            <p className="dp-crumb mono" aria-hidden="true">
              [
            </p>
            <ul className="dp-skill-tags">
              {group.tags.map((tag) => (
                <li key={tag} className="dp-chip dp-chip-lg">
                  {tag}
                </li>
              ))}
            </ul>
            <p className="dp-crumb mono" aria-hidden="true">
              ]
            </p>
          </div>
          <div className="dp-status mono">
            <span>{file}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
