import { useState } from 'react'
import { files } from '../../content/files'
import { useNavigation } from '../../hooks/useNavigation'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import './explorer.css'
import { Icon } from '../ui/Icon'

export function Explorer() {
  const [expanded, setExpanded] = useState(true)
  const { activeFileId } = useWorkspaceState()
  const { openFile } = useNavigation()
  return (
    <nav aria-label="Portfolio files" className="explorer">
      <p className="tree-root">
        <Icon name="chevron-down" /> cedz-portfolio
      </p>
      <ul className="file-tree">
        {files
          .filter((file) => !file.parentId)
          .map((file) => (
            <li key={file.id}>
              <div className="file-row">
                {file.kind === 'projects' && (
                  <button
                    type="button"
                    className="folder-arrow"
                    aria-expanded={expanded}
                    aria-controls="project-files"
                    aria-label={
                      expanded ? 'Collapse projects' : 'Expand projects'
                    }
                    onClick={() => setExpanded(!expanded)}
                  >
                    <Icon name={expanded ? 'chevron-down' : 'chevron-right'} />
                  </button>
                )}
                <button
                  type="button"
                  className="file-button"
                  aria-current={activeFileId === file.id ? 'page' : undefined}
                  onClick={() => openFile(file.id)}
                >
                  <Icon name={file.kind === 'projects' ? 'folder' : 'file'} />{' '}
                  {file.name}
                </button>
              </div>
              {file.kind === 'projects' && (
                <ul id="project-files" hidden={!expanded}>
                  {files
                    .filter((child) => child.parentId === file.id)
                    .map((child) => (
                      <li key={child.id}>
                        <button
                          type="button"
                          className="file-button"
                          aria-current={
                            activeFileId === child.id ? 'page' : undefined
                          }
                          onClick={() => openFile(child.id)}
                        >
                          <Icon name="file" /> {child.name}
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}
      </ul>
      <p className="explorer-hint">click a file to open it in a tab</p>
    </nav>
  )
}
