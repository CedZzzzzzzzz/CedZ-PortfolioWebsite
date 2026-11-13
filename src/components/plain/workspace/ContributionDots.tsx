import { useEffect, useRef, useState, type PointerEvent } from 'react'
import type {
  ContributionCalendar,
  ContributionWeek,
} from '../../../types/github'
import { formatDay } from '../../../lib/github/contributionStats'

const emptyYear: readonly ContributionWeek[] = Array(53).fill(
  Array(7).fill(null),
)

interface Hovered {
  date: string
  count: number
}

/** GitHub-style dot grid: dot size and brightness follow each day's quartile level. */
export function ContributionDots({
  calendar,
}: {
  calendar: ContributionCalendar | undefined
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<Hovered | null>(null)
  const weeks = calendar?.weeks ?? emptyYear

  // On narrow screens the grid scrolls; start at the latest weeks.
  useEffect(() => {
    const element = scroller.current
    if (calendar && element) element.scrollLeft = element.scrollWidth
  }, [calendar])

  function onPointerOver(event: PointerEvent<HTMLDivElement>) {
    const dot =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-date]')
        : null
    if (dot?.dataset.date)
      setHovered({ date: dot.dataset.date, count: Number(dot.dataset.count) })
  }

  return (
    <div className="dp-gh" aria-busy={!calendar}>
      <div
        className="dp-gh-scroll"
        ref={scroller}
        tabIndex={0}
        aria-label="Contribution graph"
      >
        <div
          className="dp-gh-grid"
          role="img"
          aria-label={
            calendar
              ? `${calendar.total} contributions in the last year`
              : 'Loading contributions'
          }
          onPointerOver={onPointerOver}
          onPointerLeave={() => setHovered(null)}
        >
          {weeks.flatMap((week, column) =>
            week.map((day, row) => (
              <span
                key={`${column}-${row}`}
                // Days outside the range keep their slot so weekdays stay aligned.
                className={`dp-gh-dot l${day?.level ?? 0}${calendar && !day ? ' is-void' : ''}`}
                data-date={day?.date}
                data-count={day?.count}
              />
            )),
          )}
        </div>
      </div>
      <div className="dp-gh-foot mono">
        <span>
          {calendar
            ? `${calendar.total.toLocaleString('en-US')} contributions in the last year`
            : 'Loading contributions…'}
        </span>
        <span className="dp-gh-tip" aria-hidden="true">
          {hovered &&
            `${hovered.count} contribution${hovered.count === 1 ? '' : 's'} on ${formatDay(hovered.date)}`}
        </span>
        <span className="dp-gh-legend" aria-hidden="true">
          less
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={`dp-gh-dot l${level}`} />
          ))}
          more
        </span>
      </div>
    </div>
  )
}
