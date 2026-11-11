import { desktopIconPaths, type DesktopIconName } from './desktopIconPaths'

interface DesktopIconProps {
  name: DesktopIconName
  size?: number
  strokeWidth?: number
}

export function DesktopIcon({
  name,
  size = 20,
  strokeWidth = 1.9,
}: DesktopIconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={desktopIconPaths[name]} />
      {name === 'palette' && (
        <>
          <circle cx="7.5" cy="11" r="1.1" fill="currentColor" />
          <circle cx="10.5" cy="7.2" r="1.1" fill="currentColor" />
          <circle cx="15" cy="7.6" r="1.1" fill="currentColor" />
        </>
      )}
    </svg>
  )
}
