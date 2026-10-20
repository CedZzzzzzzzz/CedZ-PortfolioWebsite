import { writeFile } from 'node:fs/promises'
import { fileURLToPath, URL } from 'node:url'

const output = fileURLToPath(new URL('../dist/_headers', import.meta.url))
const headers = '/*\n  X-Robots-Tag: noindex, nofollow\n'

await writeFile(output, headers, 'utf8')
