import { useState } from 'react'
import { files } from '../../content/files'
import { useNavigation } from '../../hooks/useNavigation'
import { useWorkspaceState } from '../../state/useWorkspaceState'
import './explorer.css'
import { Icon } from '../ui/Icon'

export function Explorer() {
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({
    projects: true,
    certifications: false,
  })
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
          .map((file) => {
            const isFolder =
              file.kind === 'projects' || file.kind === 'certifications'
            const isExpanded = expandedFolders[file.id] ?? false
            const children = files.filter((child) => child.parentId === file.id)
            const childrenId =
              file.id === 'projects' ? 'project-files' : `${file.id}-files`

            return (
              <li key={file.id}>
                <div className="file-row">
                  {isFolder && (
                    <button
                      type="button"
                      className="folder-arrow"
                      aria-expanded={isExpanded}
                      aria-controls={childrenId}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${file.name.replace(/\/$/, '')}`}
                      onClick={() =>
                        setExpandedFolders((current) => ({
                          ...current,
                          [file.id]: !isExpanded,
                        }))
                      }
                    >
                      <Icon
                        name={isExpanded ? 'chevron-down' : 'chevron-right'}
                      />
                    </button>
                  )}
                  <button
                    type="button"
                    className="file-button"
                    aria-current={activeFileId === file.id ? 'page' : undefined}
                    onClick={() => openFile(file.id)}
                  >
                    <Icon name={isFolder ? 'folder' : 'file'} /> {file.name}
                  </button>
                </div>
                {isFolder && (
                  <ul id={childrenId} hidden={!isExpanded}>
                    {children.map((child) => (
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
            )
          })}
      </ul>
      <p className="explorer-hint">click a file to open it in a tab</p>
    </nav>
  )
}
