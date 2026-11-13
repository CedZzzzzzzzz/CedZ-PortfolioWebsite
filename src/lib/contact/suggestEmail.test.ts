import { describe, expect, it } from 'vitest'
import { suggestEmail } from './suggestEmail'

describe('suggestEmail', () => {
  it.each([
    ['juan@gail.com', 'juan@gmail.com'],
    ['juan@gmial.com', 'juan@gmail.com'],
    ['juan@gmail.con', 'juan@gmail.com'],
    ['Juan@YAHOO.CO', 'Juan@yahoo.com'],
    ['juan@outlok.com', 'juan@outlook.com'],
    ['juan@hotmial.com', 'juan@hotmail.com'],
  ])('corrects %s', (typed, suggestion) => {
    expect(suggestEmail(typed)).toBe(suggestion)
  })

  it.each([
    'juan@gmail.com',
    'juan@mail.com',
    'juan@company.com',
    'juan@ibm.com',
    'juan@abc.com',
    'juan@marcuscedricpedrosa.dev',
    'juan@',
    '@gmail.com',
    'juan',
  ])('leaves %s alone', (typed) => {
    expect(suggestEmail(typed)).toBeNull()
  })
})
