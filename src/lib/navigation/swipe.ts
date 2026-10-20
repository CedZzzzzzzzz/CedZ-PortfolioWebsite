export function classifyWheel(
  deltaX: number,
  deltaY: number,
  now: number,
  previous: number,
  threshold = 70,
): -1 | 0 | 1 {
  if (
    now - previous < 700 ||
    Math.abs(deltaX) < Math.abs(deltaY) * 1.2 ||
    Math.abs(deltaX) < threshold
  )
    return 0
  return deltaX > 0 ? 1 : -1
}
export function classifyTouch(
  start: readonly [number, number][],
  current: readonly [number, number][],
  threshold = 45,
): -1 | 0 | 1 {
  if (start.length !== 2 || current.length !== 2) return 0
  const distance = (points: readonly [number, number][]) =>
    Math.hypot(points[0][0] - points[1][0], points[0][1] - points[1][1])
  if (Math.abs(distance(current) - distance(start)) > 24) return 0
  const dx = (current[0][0] + current[1][0] - (start[0][0] + start[1][0])) / 2
  const dy = (current[0][1] + current[1][1] - (start[0][1] + start[1][1])) / 2
  if (Math.abs(dx) <= Math.abs(dy) || Math.abs(dx) < threshold) return 0
  return dx > 0 ? 1 : -1
}
