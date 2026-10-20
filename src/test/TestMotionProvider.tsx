import type { ReactNode } from 'react'
import { MotionProvider } from '../components/motion/MotionProvider'

export function TestMotionProvider({ children }: { children: ReactNode }) {
  return <MotionProvider animationsEnabled={false}>{children}</MotionProvider>
}
