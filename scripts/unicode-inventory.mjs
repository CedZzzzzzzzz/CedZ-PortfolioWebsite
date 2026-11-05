import { readdir, readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import console from 'node:console'
import process from 'node:process'
import subsets from './font-subsets.json' with { type: 'json' }

const root = fileURLToPath(new URL('../src/', import.meta.url))
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.html'])
const characters = new Map()

function contains(rangeString, codePoint) {
  return rangeString.split(',').some((range) => {
    const [start, end = start] = range.replace('U+', '').split('-')
    return (
      codePoint >= Number.parseInt(start, 16) &&
      codePoint <= Number.parseInt(end, 16)
    )
  })
}

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      await scan(path)
      continue
    }
    if (!extensions.has(extname(entry.name))) continue
    const source = await readFile(path, 'utf8')
    for (const character of source) {
      if (character.codePointAt(0) > 0x7f) {
        const files = characters.get(character) ?? new Set()
        files.add(
          path
            .replaceAll('\\', '/')
            .replace(process.cwd().replaceAll('\\', '/') + '/', ''),
        )
        characters.set(character, files)
      }
    }
  }
}

await scan(root)
for (const [character, files] of [...characters].sort(([left], [right]) =>
  left.localeCompare(right),
)) {
  const codePoint = `U+${character.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`
  const covered = Object.values(subsets).some((ranges) =>
    contains(ranges, character.codePointAt(0)),
  )
  console.log(
    `${covered ? 'FONT' : 'FALLBACK'}\t${codePoint}\t${JSON.stringify(character)}\t${[...files].sort().join(', ')}`,
  )
}
console.log(`Unique non-ASCII characters: ${characters.size}`)

const sprite = await readFile(join(root, 'lib/byte/sprite.ts'), 'utf8')
const spriteCharacters = [
  ...new Set(
    [...sprite].filter((character) => character.codePointAt(0) > 0x7f),
  ),
]
const unsupportedSpriteCharacters = spriteCharacters.filter(
  (character) => character.codePointAt(0) !== 0x2588,
)
if (unsupportedSpriteCharacters.length) {
  console.error(
    `Sprite contains unsupported non-ASCII characters: ${unsupportedSpriteCharacters.join(' ')}`,
  )
  process.exitCode = 1
}
console.log(
  `Sprite non-ASCII characters: ${spriteCharacters.length ? spriteCharacters.join(' ') : 'none (ASCII only)'}`,
)
