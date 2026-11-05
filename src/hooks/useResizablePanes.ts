import { useEffect, useRef, useState, type PointerEvent } from 'react'
import {
  clampPaneSize,
  loadPaneSizes,
  savePaneSizes,
  sizeFromPointer,
  type ResizeAxis,
} from '../lib/layout'

export function useResizablePanes() {
  const [storage] = useState(() => {
    try {
      return window.localStorage
    } catch {
      return null
    }
  })
  const [sizes, setSizes] = useState(() => loadPaneSizes(storage))
  const previous = useRef(sizes)
  const gridRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{
    axis: ResizeAxis
    value: number
    pointer: number
    pointerId: number
  } | null>(null)
  const [dragging, setDragging] = useState<ResizeAxis | null>(null)

  useEffect(() => {
    if (previous.current !== sizes) savePaneSizes(storage, sizes)
    previous.current = sizes
  }, [sizes, storage])

  function resize(axis: ResizeAxis, value: number) {
    const clamped = clampPaneSize(axis, value)
    setSizes((current) =>
      current[axis] === clamped ? current : { ...current, [axis]: clamped },
    )
  }

  function startResize(axis: ResizeAxis, event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || drag.current) return
    event.preventDefault()
    event.currentTarget.focus()
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      axis,
      value: sizes[axis],
      pointer: axis === 'rowRatio' ? event.clientY : event.clientX,
      pointerId: event.pointerId,
    }
    setDragging(axis)
  }

  function moveResize(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current
    if (!start || start.pointerId !== event.pointerId) return
    resize(
      start.axis,
      sizeFromPointer(
        start.axis,
        start.value,
        start.pointer,
        start.axis === 'rowRatio' ? event.clientY : event.clientX,
        gridRef.current?.getBoundingClientRect().height ?? 0,
      ),
    )
  }

  function endResize(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.pointerId !== event.pointerId) return
    drag.current = null
    setDragging(null)
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return {
    sizes,
    gridRef,
    dragging,
    resize,
    startResize,
    moveResize,
    endResize,
  }
}
