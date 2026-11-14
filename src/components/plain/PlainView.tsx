import { useHashSync } from '../../hooks/useHashSync'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { SkipLink } from '../ui/SkipLink'
import { DesktopPlainView } from './workspace/DesktopPlainView'
import { MobilePlainView } from './mobile/MobilePlainView'
import './print.css'

export function PlainView() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  useHashSync('plain')
  return (
    <>
      <SkipLink targetId="plain-main" />
      {isMobile ? <MobilePlainView /> : <DesktopPlainView />}
    </>
  )
}
