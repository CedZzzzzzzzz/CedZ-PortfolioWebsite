import { LazyMotion, domAnimation } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { MotionContext } from './motionContext'

export function MotionProvider({
  children,
  animationsEnabled,
}: {
  children: ReactNode
  animationsEnabled?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const enabled = animationsEnabled ?? !reducedMotion
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionContext.Provider value={enabled}>{children}</MotionContext.Provider>
    </LazyMotion>
  )
}
