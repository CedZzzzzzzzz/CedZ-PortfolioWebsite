import { useContext } from 'react'
import { MotionContext } from './motionContext'

export function useMotionEnabled() {
  return useContext(MotionContext)
}
