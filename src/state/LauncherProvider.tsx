import { useState, type ReactNode } from 'react'
import { Context } from './launcherContext'
export function LauncherProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [opener, setOpener] = useState<HTMLElement | null>(null)
  const show = (element?: HTMLElement) => {
    setOpener(
      element ??
        (document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null),
    )
    setOpen(true)
  }
  const close = () => {
    setOpen(false)
    requestAnimationFrame(() => {
      if (opener?.isConnected) opener.focus()
      setOpener(null)
    })
  }
  return (
    <Context.Provider value={{ open, opener, show, close }}>
      {children}
    </Context.Provider>
  )
}
