import type { ReactNode } from 'react'
import { m } from 'framer-motion'
import { useMotionEnabled } from '../motion/useMotionEnabled'

interface PaneProps {
  id: string
  title: string
  active: boolean
  onActivate: () => void
  children: ReactNode
  entranceIndex: number
}

export function Pane({
  id,
  title,
  active,
  onActivate,
  children,
  entranceIndex,
}: PaneProps) {
  const animate = useMotionEnabled()
  const paneProps = {
    id,
    className: `pane pane-${id}${active ? ' pane-active' : ''}`,
    'aria-labelledby': `${id}-title`,
    tabIndex: -1 as const,
    onPointerEnter: onActivate,
    onPointerDown: onActivate,
    onFocus: onActivate,
  }
  const content = (
    <>
      <h2 id={`${id}-title`} className="pane-title">
        {title}
      </h2>
      <div className="pane-content">{children}</div>
    </>
  )
  return animate ? (
    <m.section
      {...paneProps}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 24,
        delay: Math.min(entranceIndex * 0.1, 0.3),
      }}
    >
      {content}
    </m.section>
  ) : (
    <section {...paneProps}>{content}</section>
  )
}
