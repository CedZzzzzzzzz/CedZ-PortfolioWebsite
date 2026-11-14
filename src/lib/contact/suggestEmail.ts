// Most common first: a typo equally close to two providers suggests the likelier one.
const providers = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'live.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'ymail.com',
  'mail.com',
  'email.com',
  'gmx.com',
  'msn.com',
  'me.com',
]

/** Short names like `aol.com` sit one or two letters from real company domains, so they get less slack. */
function allowedTypos(provider: string) {
  return provider.length >= 9 ? 2 : 1
}

/** Levenshtein distance: single-character inserts, deletes, and swaps. */
function distance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i++) {
    const row = [i]
    for (let j = 1; j <= b.length; j++)
      row[j] = Math.min(
        previous[j] + 1,
        row[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    previous = row
  }
  return previous[b.length]
}

/**
 * Returns the address with a likely-mistyped provider corrected (`x@gail.com` to
 * `x@gmail.com`), or null. A hint only: near-miss domains can be real ones.
 */
export function suggestEmail(email: string): string | null {
  const at = email.lastIndexOf('@')
  const domain = email
    .slice(at + 1)
    .trim()
    .toLowerCase()
  if (at < 1 || !domain || providers.includes(domain)) return null

  let best: string | null = null
  let bestDistance = Infinity
  for (const provider of providers) {
    const typos = distance(domain, provider)
    if (typos <= allowedTypos(provider) && typos < bestDistance) {
      best = provider
      bestDistance = typos
    }
  }
  return best && `${email.slice(0, at).trim()}@${best}`
}
