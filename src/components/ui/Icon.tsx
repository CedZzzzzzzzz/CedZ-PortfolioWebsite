export type IconName =
  | 'file'
  | 'folder'
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-left'
  | 'menu'
  | 'diamond'
  | 'prompt'
  | 'external'
  | 'return'

interface IconProps {
  name: IconName
  size?: number
  'aria-label'?: string
}

export function Icon({ name, size = 16, 'aria-label': label }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'portfolio-icon',
    'data-icon': name,
    focusable: false,
    'aria-hidden': label ? undefined : true,
    'aria-label': label,
    role: label ? 'img' : undefined,
  }

  if (name === 'file')
    return (
      <svg {...common}>
        <path d="M3.5 1.75h5l4 4v8.5h-9z" />
        <path d="M8.5 1.75v4h4M5.5 9h5M5.5 11.5h5" />
      </svg>
    )
  if (name === 'folder')
    return (
      <svg {...common}>
        <path d="M1.75 4h4l1.5 1.5h7v8.25h-12.5z" />
        <path d="M1.75 4V2.5h4.5l1.5 1.5" />
      </svg>
    )
  if (name === 'chevron-down')
    return (
      <svg {...common}>
        <path d="m3.5 6 4.5 4.5L12.5 6" />
      </svg>
    )
  if (name === 'chevron-left')
    return (
      <svg {...common}>
        <path d="m10 3.5-4.5 4.5 4.5 4.5" />
      </svg>
    )
  if (name === 'menu')
    return (
      <svg {...common}>
        <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />
      </svg>
    )
  if (name === 'diamond')
    return (
      <svg {...common}>
        <path d="M8 1.5 14.5 8 8 14.5 1.5 8 8 1.5Z" />
      </svg>
    )
  if (name === 'prompt')
    return (
      <svg {...common}>
        <path d="m3 3.5 4.5 4.5L3 12.5M9 12.5h4" />
      </svg>
    )
  if (name === 'external')
    return (
      <svg {...common}>
        <path d="M9 2.5h4.5V7M13.25 2.75 7 9M12.5 8.5v4.75h-10v-10h5" />
      </svg>
    )
  if (name === 'return')
    return (
      <svg {...common}>
        <path d="M5.5 4 1.75 8l3.75 4M2 8h8.5a3.5 3.5 0 0 1 0 7H8" />
      </svg>
    )
  return (
    <svg {...common}>
      <path d="m6 3.5 4.5 4.5L6 12.5" />
    </svg>
  )
}
