import { useState, type CSSProperties } from 'react'
import { useResizablePanes } from '../../hooks/useResizablePanes'
import type { ResizeAxis } from '../../lib/layout'
import { Pane } from './Pane'
import { ResizeGutter } from './ResizeGutter'
import { TopBar } from './TopBar'
import { Explorer } from '../explorer/Explorer'
import { Editor } from '../editor/Editor'
import { Terminal } from '../terminal/Terminal'
import { Profile } from '../profile/Profile'
import './layout.css'

export function WorkspaceLayout() {
  const [activePane, setActivePane] = useState<string | null>(null)
  const {
    sizes,
    gridRef,
    dragging,
    resize,
    startResize,
    moveResize,
    endResize,
  } = useResizablePanes()
  const style = {
    '--lw': `${sizes.left}px`,
    '--rw': `${sizes.right}px`,
    '--rn': sizes.rowRatio,
  } as CSSProperties
  return (
    <div className="workspace-shell">
      <TopBar />
      <main className="workspace-area" aria-label="Portfolio workspace">
        <h1 className="visually-hidden">Marcus Cedric Pedrosa portfolio</h1>
        <div className="workspace-grid" ref={gridRef} style={style}>
          {['explorer', 'editor', 'terminal', 'profile'].map((id, index) => (
            <Pane
              key={id}
              id={id}
              title={id}
              active={activePane === id}
              onActivate={() => setActivePane(id)}
              entranceIndex={index}
            >
              {id === 'explorer' ? (
                <Explorer />
              ) : id === 'editor' ? (
                <Editor />
              ) : id === 'terminal' ? (
                <Terminal />
              ) : (
                <Profile />
              )}
            </Pane>
          ))}
          {(['left', 'right', 'rowRatio'] as ResizeAxis[]).map((axis) => (
            <ResizeGutter
              key={axis}
              axis={axis}
              value={sizes[axis]}
              dragging={dragging === axis}
              onResize={(value) => resize(axis, value)}
              onPointerDown={(event) => startResize(axis, event)}
              onPointerMove={moveResize}
              onPointerUp={endResize}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
