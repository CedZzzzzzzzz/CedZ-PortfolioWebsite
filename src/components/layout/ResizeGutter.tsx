import type { PointerEventHandler } from 'react'
import { paneLimits, type ResizeAxis } from '../../lib/layout'

interface ResizeGutterProps {
  axis: ResizeAxis
  value: number
  dragging: boolean
  onResize: (value: number) => void
  onPointerDown: PointerEventHandler<HTMLDivElement>
  onPointerMove: PointerEventHandler<HTMLDivElement>
  onPointerUp: PointerEventHandler<HTMLDivElement>
}

export function ResizeGutter({
  axis,
  value,
  dragging,
  onResize,
  ...pointerHandlers
}: ResizeGutterProps) {
  const horizontal = axis === 'rowRatio'
  const label = horizontal
    ? 'Editor and terminal'
    : axis === 'left'
      ? 'Explorer width'
      : 'Profile width'
  const limits = paneLimits[axis]
  return (
    <div
      {...pointerHandlers}
      className={`resize-gutter gutter-${axis}${dragging ? ' dragging' : ''}`}
      role="separator"
      tabIndex={0}
      aria-label={label}
      aria-orientation={horizontal ? 'horizontal' : 'vertical'}
      aria-controls={
        horizontal
          ? 'editor terminal'
          : axis === 'left'
            ? 'explorer'
            : 'profile'
      }
      aria-valuenow={horizontal ? Math.round(value * 100) : Math.round(value)}
      aria-valuemin={horizontal ? limits.min * 100 : limits.min}
      aria-valuemax={horizontal ? limits.max * 100 : limits.max}
      aria-valuetext={
        horizontal
          ? `${Math.round(value * 100)} percent editor height`
          : `${Math.round(value)} pixels`
      }
      onPointerCancel={pointerHandlers.onPointerUp}
      onLostPointerCapture={pointerHandlers.onPointerUp}
      onKeyDown={(event) => {
        const positive = horizontal ? 'ArrowDown' : 'ArrowRight'
        const negative = horizontal ? 'ArrowUp' : 'ArrowLeft'
        if (![positive, negative, 'Home', 'End'].includes(event.key)) return
        event.preventDefault()
        if (event.key === 'Home') return onResize(limits.min)
        if (event.key === 'End') return onResize(limits.max)
        const direction =
          (event.key === positive ? 1 : -1) * (axis === 'right' ? -1 : 1)
        onResize(value + direction * (horizontal ? 0.02 : 10))
      }}
    />
  )
}
