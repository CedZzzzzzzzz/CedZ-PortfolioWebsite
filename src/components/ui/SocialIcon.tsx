import type { Social } from '../../types/content'

export function SocialIcon({ label }: { label: Social['label'] }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true as const,
    focusable: false as const,
  }

  if (label === 'GitHub')
    return (
      <svg {...common}>
        <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.51-1.3-1.24-1.65-1.24-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.16 1.71 1.16 1 1.71 2.62 1.22 3.26.93.1-.72.39-1.22.71-1.5-2.47-.28-5.07-1.24-5.07-5.5 0-1.22.44-2.22 1.16-3-.12-.29-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.67.11 2.96.72.78 1.16 1.78 1.16 3 0 4.27-2.61 5.21-5.1 5.49.4.35.76 1.03.76 2.08v3.07c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
      </svg>
    )

  if (label === 'LinkedIn')
    return (
      <svg {...common}>
        <path d="M5.2 3.4a2.05 2.05 0 1 1-.02 4.1 2.05 2.05 0 0 1 .02-4.1ZM3.45 9h3.5v11.5h-3.5V9Zm5.7 0h3.35v1.57h.05c.47-.9 1.61-1.85 3.32-1.85 3.55 0 4.2 2.34 4.2 5.39v6.39h-3.5v-5.66c0-1.35-.03-3.08-1.88-3.08-1.88 0-2.17 1.47-2.17 2.98v5.76h-3.5V9Z" />
      </svg>
    )

  if (label === 'Facebook')
    return (
      <svg {...common}>
        <path d="M13.6 21v-8.2h2.75l.41-3.2H13.6V7.56c0-.93.26-1.56 1.59-1.56h1.69V3.14c-.82-.09-1.64-.14-2.46-.14-2.44 0-4.11 1.49-4.11 4.23V9.6H7.55v3.2h2.76V21h3.29Z" />
      </svg>
    )

  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.7" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
