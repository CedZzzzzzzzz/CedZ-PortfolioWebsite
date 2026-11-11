import { useMediaQuery } from '../../hooks/useMediaQuery'
import { DesktopPlainView } from './workspace/DesktopPlainView'
import { MobilePlainView } from './mobile/MobilePlainView'

export function PlainView() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return isMobile ? <MobilePlainView /> : <DesktopPlainView />
}
