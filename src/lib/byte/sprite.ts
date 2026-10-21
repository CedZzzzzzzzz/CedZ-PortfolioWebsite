export type SpriteFrameName =
  'idle' | 'blink' | 'happy' | 'thinking' | 'talk-a' | 'talk-b' | 'eating'

export type SpritePixel = 'W' | 'I' | 'B' | 'S' | 'V' | 'F' | 'N' | '.'

export const spritePalette: Record<Exclude<SpritePixel, '.'>, string> = {
  W: '#EAF2FA',
  I: '#A9E8FF',
  B: '#6DB8DD',
  S: '#3F7CA8',
  V: '#AFAED1',
  F: '#344357',
  N: '#101522',
}

const base = [
  '...........WW...........',
  '......W....WW....W......',
  '......WI..WIIW..IW......',
  '...W..WIIIIVVIIIIW..W...',
  '...WI.FBBBBBBBBBBF.IW...',
  '...FBBBBBBBBBBBBBBBBF...',
  '...FBBBBBBBBBBBBBBBBF...',
  '..VFBBWNNBBBBBBWNNBBFV..',
  '.VVFBBNNNBBBBBBNNNBBFVV.',
  '..VFBBNNNBBBBBBNNNBBFV..',
  '...FBVVBBIIIIIIBBVVBF...',
  '...FBBBBIIIIIIIIBBBBF...',
  '...FBBBBINIIIINIBBBBF...',
  '...FBBBBIINNNNIIBBBBF...',
  '....FSSSSSSSSSSSSSSF....',
  '.......FBBBBBBBBF...V...',
  '.......FBBWWWWBBF...B...',
  '.......FBBWWWWBBF...B...',
  '.......FBBWWWWBBFBBBB...',
  '.......FSSSSSSSSF.......',
  '......FBBBBF..FBBBBF....',
  '......FFFFFF..FFFFFF....',
].map((row) => row.replaceAll('B', 'W'))

const eyes = {
  open: ['WNN', 'NNN', 'NNN'],
  blink: ['BBB', 'NNN', 'BBB'],
  happy: ['BNB', 'NBN', 'BBB'],
  thinking: ['BWN', 'BNN', 'BBB'],
} as const

const mouths = {
  smile: ['INIIIINI', 'IINNNNII'],
  grin: ['NIIIIIIN', 'INNNNNNI'],
  open: ['INNNNNNI', 'IINVVNII'],
  small: ['IIIIIIII', 'IIINNIII'],
} as const

const frames: Record<
  SpriteFrameName,
  { eyes: keyof typeof eyes; mouth: keyof typeof mouths }
> = {
  idle: { eyes: 'open', mouth: 'smile' },
  blink: { eyes: 'blink', mouth: 'smile' },
  happy: { eyes: 'happy', mouth: 'grin' },
  thinking: { eyes: 'thinking', mouth: 'small' },
  'talk-a': { eyes: 'open', mouth: 'open' },
  'talk-b': { eyes: 'open', mouth: 'small' },
  eating: { eyes: 'happy', mouth: 'open' },
}

export function spriteFrame(name: SpriteFrameName): SpritePixel[][] {
  const pixels = base.map((row) => row.split('') as SpritePixel[])
  const frame = frames[name]

  // Match the preview sprite's silver armor and bright center crest.
  for (let row = 3; row <= 18; row++) {
    pixels[row][11] = 'I'
    pixels[row][12] = 'I'
  }
  for (let row = 11; row <= 14; row++) {
    pixels[row][2] = 'F'
    pixels[row][3] = 'W'
    pixels[row][4] = 'W'
    pixels[row][19] = 'W'
    pixels[row][20] = 'W'
    pixels[row][21] = 'F'
  }

  for (let row = 0; row < 3; row++) {
    for (const column of [6, 15]) {
      eyes[frame.eyes][row].split('').forEach((pixel, offset) => {
        pixels[row + 7][column + offset] = pixel as SpritePixel
      })
    }
  }

  for (let row = 0; row < 2; row++) {
    mouths[frame.mouth][row].split('').forEach((pixel, offset) => {
      pixels[row + 12][offset + 8] = pixel as SpritePixel
    })
  }

  return pixels
}
