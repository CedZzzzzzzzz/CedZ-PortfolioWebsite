export type SpriteTone = 'accent' | 'foreground' | 'outline'
export interface SpriteSegment {
  text: string
  tone: SpriteTone
  scarf?: boolean
}
export interface SpriteState {
  eyes: 'open' | 'blink' | 'happy'
  mouth: 'neutral' | 'happy' | 'talk-open' | 'talk-closed' | 'eating'
}

export function spriteFrame(state: SpriteState): SpriteSegment[][] {
  const eye = { open: 'O', blink: '-', happy: '^' }[state.eyes]
  const mouth = {
    neutral: '\\_v_/',
    happy: '\\_____/',
    'talk-open': '(O)',
    'talk-closed': '(o)',
    eating: '(@)',
  }[state.mouth]
  const centered = mouth
    .padStart(Math.floor((13 + mouth.length) / 2))
    .padEnd(13)
  const segment = (
    text: string,
    tone: SpriteTone,
    scarf?: boolean,
  ): SpriteSegment => ({ text, tone, ...(scarf ? { scarf } : {}) })
  const lines = [
    [segment('  ^    ^    ^  ', 'accent')],
    [segment(' /\\         /\\ ', 'foreground')],
    [segment('/  \\_______/  \\', 'outline')],
    [segment('[=====[X]=====]', 'accent'), segment('~~', 'accent', true)],
    [
      segment('|   ', 'outline'),
      segment(eye, 'foreground'),
      segment('     ', 'outline'),
      segment(eye, 'foreground'),
      segment('   |', 'outline'),
    ],
    [segment('|' + centered + '|', 'outline')],
    [segment(' \\___________/ ', 'outline')],
    [segment('  (_)_______(_)', 'outline'), segment('~', 'accent', true)],
  ]
  return lines.map((line) => [
    ...line,
    segment(
      ' '.repeat(
        17 - line.reduce((width, part) => width + part.text.length, 0),
      ),
      'outline',
    ),
  ])
}
