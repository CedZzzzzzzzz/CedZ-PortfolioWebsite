/** First focusable element of a view: moves keyboard focus past the navigation. */
export function SkipLink({ targetId }: { targetId: string }) {
  return (
    <a
      className="skip-link"
      href={`#${targetId}`}
      onClick={(event) => {
        // Focus by script: the URL hash is reserved for deep links.
        event.preventDefault()
        document.getElementById(targetId)?.focus()
      }}
    >
      Skip to content
    </a>
  )
}
