import type { ReactNode } from 'react'

interface PaneProps {
  id: string
  title: string
  active: boolean
  onActivate: () => void
  children: ReactNode
}

export function Pane({ id, title, active, onActivate, children }: PaneProps) {
  return (
    <section
      id={id}
      className={`pane pane-${id}${active ? ' pane-active' : ''}`}
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
      onPointerEnter={onActivate}
      onPointerDown={onActivate}
      onFocus={onActivate}
    >
      <h2 id={`${id}-title`} className="pane-title">
        {title}
      </h2>
      <div className="pane-content">{children}</div>
    </section>
  )
}
