import { expect, it } from 'vitest'
import { spriteFrame, type SpriteState } from './sprite'
import { initialPetState, petReducer } from './petReducer'

it('preserves the exact neutral ASCII art with consistent padded widths', () => {
  const lines = spriteFrame({ eyes: 'open', mouth: 'neutral' }).map((line) =>
    line.map((part) => part.text).join(''),
  )
  expect(lines.map((line) => line.length)).toEqual(Array(8).fill(17))
  expect(lines.map((line) => line.trimEnd())).toEqual([
    '  ^    ^    ^',
    ' /\\         /\\',
    '/  \\_______/  \\',
    '[=====[X]=====]~~',
    '|   O     O   |',
    '|    \\_v_/    |',
    ' \\___________/',
    '  (_)_______(_)~',
  ])
})
it('renders each eye and mouth without changing widths or theme tone assignments', () => {
  const eyes = { open: 'O', blink: '-', happy: '^' } as const
  const mouths = {
    neutral: '\\_v_/',
    happy: '\\_____/',
    'talk-open': '(O)',
    'talk-closed': '(o)',
    eating: '(@)',
  } as const
  for (const eye of Object.keys(eyes) as SpriteState['eyes'][])
    for (const mouth of Object.keys(mouths) as SpriteState['mouth'][]) {
      const frame = spriteFrame({ eyes: eye, mouth })
      const lines = frame.map((line) => line.map((part) => part.text).join(''))
      expect(lines.every((line) => line.length === 17)).toBe(true)
      expect(lines[4]).toContain(`|   ${eyes[eye]}     ${eyes[eye]}   |`)
      expect(lines[5]).toContain(mouths[mouth])
      expect(frame[4][1].tone).toBe('foreground')
      expect(frame[3][1]).toMatchObject({ tone: 'accent', scarf: true })
      expect(frame[6][0].tone).toBe('outline')
    }
})
it('transitions through pet modes and ends cheer and gestures independently', () => {
  const initial = Object.freeze({ ...initialPetState })
  const poked = petReducer(initial, { type: 'poke' })
  expect(poked).toMatchObject({ mode: 'idle', cheer: true, eventId: 1 })
  const fed = petReducer(poked, { type: 'feed' })
  expect(fed).toMatchObject({ mode: 'eating', gesture: 'feed' })
  expect(petReducer(fed, { type: 'cheer-ended' })).toMatchObject({
    mode: 'eating',
    cheer: false,
  })
  expect(petReducer(fed, { type: 'gesture-ended' })).toMatchObject({
    mode: 'idle',
    gesture: null,
    cheer: true,
  })
  const playing = petReducer(initial, { type: 'play' })
  expect(playing.mode).toBe('playing')
  const thinking = petReducer(playing, { type: 'think' })
  expect(thinking.mode).toBe('thinking')
  const talking = petReducer(thinking, { type: 'talk' })
  expect(talking.mode).toBe('talking')
  for (const type of ['poke', 'feed', 'play'] as const)
    expect(petReducer(talking, { type }).mode).toBe('talking')
  const finishedGesture = petReducer(talking, { type: 'gesture-ended' })
  expect(finishedGesture.mode).toBe('talking')
  expect(petReducer(finishedGesture, { type: 'settle' }).mode).toBe('idle')
  expect(initial).toEqual(initialPetState)
})
