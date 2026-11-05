import { expect, it } from 'vitest'
import { spriteFrame, spritePalette, type SpriteFrameName } from './sprite'
import { initialPetState, petReducer } from './petReducer'

it('builds every pixel dragon frame on the same 24 by 22 grid', () => {
  const names: SpriteFrameName[] = [
    'idle',
    'blink',
    'happy',
    'thinking',
    'talk-a',
    'talk-b',
    'eating',
  ]

  for (const name of names) {
    const frame = spriteFrame(name)
    expect(frame).toHaveLength(22)
    expect(frame.every((row) => row.length === 24)).toBe(true)
    expect(frame.flat()).toContain('.')
    expect(frame.flat().some((pixel) => pixel !== '.')).toBe(true)
  }
})
it('uses the mockup icy palette and gives each expression its own frame', () => {
  expect(spritePalette).toMatchObject({
    W: '#EAF2FA',
    I: '#A9E8FF',
    V: '#AFAED1',
    F: '#344357',
    N: '#101522',
  })

  const names: SpriteFrameName[] = [
    'blink',
    'happy',
    'thinking',
    'talk-a',
    'talk-b',
    'eating',
  ]
  for (const name of names)
    expect(spriteFrame(name)).not.toEqual(spriteFrame('idle'))
  expect(spriteFrame('talk-a')).not.toEqual(spriteFrame('talk-b'))
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
