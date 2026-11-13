import type { ReactNode } from 'react'
import type { GraphSpec } from '../../types/command'
import type { ContributionDay } from '../../types/github'
import { recentWeeks, sumWeeks } from '../../lib/github/contributionStats'
import { useContributions } from '../../hooks/useContributions'
import { useStepper } from '../../hooks/useStepper'
import { useMotionEnabled } from '../motion/useMotionEnabled'

const glyphs = ['·', '∙', '•', '●', '●']
const SCAN_MS = 28
const HUNT_MS = 22
const TRAIL = 3

/** Boustrophedon path: down even columns, up odd ones. */
function pathIndex(column: number, row: number) {
  return column * 7 + (column % 2 ? 6 - row : row)
}

function dayCell(day: ContributionDay | null, key: number): ReactNode {
  if (!day) return ' '
  return (
    <span key={key} className={`l${day.level}`}>
      {glyphs[day.level]}
    </span>
  )
}

/** Contribution graph drawn as text: scans in week by week, or gets eaten by Byte. */
export function TerminalGraph({
  spec,
  label,
}: {
  spec: GraphSpec
  label: string
}) {
  const calendar = useContributions()
  const animate = useMotionEnabled()
  const weeks = calendar ? recentWeeks(calendar, spec.weeks) : []
  const hunting = spec.variant === 'hunt'
  const total = hunting ? weeks.length * 7 : weeks.length
  const step = useStepper(total, hunting ? HUNT_MS : SCAN_MS, animate)
  const done = step >= total

  if (calendar === undefined)
    return spec.variant === 'boot' ? (
      <span className="tone-ok">
        {'[ .. ] github   fetching contributions…'}
      </span>
    ) : null
  if (calendar === null) return null

  const shown = hunting ? weeks : weeks.slice(0, step)
  const count = sumWeeks(shown)
  const eaten = hunting
    ? weeks.reduce(
        (sum, week, column) =>
          week.reduce(
            (inner, day, row) =>
              inner + (day && pathIndex(column, row) < step ? day.count : 0),
            sum,
          ),
        0,
      )
    : 0

  function cell(day: ContributionDay | null, column: number, row: number) {
    if (!hunting) return column < step ? dayCell(day, column) : ' '
    const behind = step - pathIndex(column, row)
    if (!done && behind === 0)
      return (
        <span key={column} className="tone-accent">
          ◆
        </span>
      )
    if (!done && behind > 0 && behind <= TRAIL)
      return (
        <span key={column} className={behind === 1 ? 'l2' : 'l1'}>
          ~
        </span>
      )
    return behind > 0 ? ' ' : dayCell(day, column)
  }

  const graph = (
    <div
      className="terminal-graph"
      role="img"
      aria-label={`${sumWeeks(weeks)} ${label}`}
    >
      {[0, 1, 2, 3, 4, 5, 6].map((row) => (
        <div key={row}>
          {weeks.map((week, column) => cell(week[row], column, row))}
        </div>
      ))}
    </div>
  )

  if (spec.variant === 'boot')
    return (
      <>
        <span className="tone-ok">{`${done ? '[ ok ]' : '[ .. ]'} github   `}</span>
        {count} <span className="tone-muted">{label}</span>
        {graph}
      </>
    )

  if (hunting)
    return (
      <>
        {graph}
        {done ? (
          <>
            <span className="tone-accent">nom nom 🍙</span> Byte ate {eaten}{' '}
            contributions. they grow back when you push again.
          </>
        ) : (
          <span className="tone-muted" aria-hidden="true">
            chomp… {eaten} eaten
          </span>
        )}
      </>
    )

  return (
    <>
      {count} <span className="tone-muted">{label}</span>
      {graph}
      <span className="tone-muted">
        less{' '}
        <span className="terminal-graph-legend">
          {glyphs.map((glyph, level) => (
            <span key={level} className={`l${level}`}>
              {glyph}
            </span>
          ))}
        </span>{' '}
        more
      </span>
    </>
  )
}
