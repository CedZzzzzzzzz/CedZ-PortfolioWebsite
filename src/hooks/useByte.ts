import { useContext } from 'react'
import { ByteContext } from '../state/byteContext'

export function useByte() {
  const context = useContext(ByteContext)
  if (!context) throw new Error('ByteProvider is required')
  return context
}
