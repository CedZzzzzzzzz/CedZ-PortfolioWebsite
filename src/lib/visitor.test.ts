import { describe, expect, it } from 'vitest'
import { getVisitorInfo } from './visitor'

describe('getVisitorInfo', () => {
  const date = new Date('2026-10-11T04:34:00Z')

  it('uses only supplied browser, screen, time zone, and date values', () => {
    expect(
      getVisitorInfo({
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0) AppleWebKit Chrome/120.0 Edg/120.0',
        screenWidth: 1440,
        screenHeight: 900,
        timeZone: 'Asia/Manila',
        date,
      }),
    ).toEqual({
      browser: 'Edge',
      os: 'Windows',
      screen: '1440×900',
      city: 'Manila',
      sessionTime: '12:34',
    })
  })

  it.each([
    ['Firefox/120.0 (Android)', 'Firefox', 'Android'],
    ['OPR/120.0 (Mac OS X)', 'Opera', 'macOS'],
    ['Chrome/120.0 (CrOS)', 'Chrome', 'ChromeOS'],
    ['Safari/120.0 (iPhone)', 'Safari', 'iOS'],
    ['Chrome/120.0 (Linux)', 'Chrome', 'Linux'],
  ])('recognizes %s', (userAgent, browser, os) => {
    expect(
      getVisitorInfo({
        userAgent,
        screenWidth: 1,
        screenHeight: 1,
        timeZone: '',
        date,
      }),
    ).toMatchObject({ browser, os, city: 'somewhere' })
  })

  it('turns a time zone suffix into a readable city', () => {
    expect(
      getVisitorInfo({
        userAgent: '',
        screenWidth: 1,
        screenHeight: 1,
        timeZone: 'America/New_York',
        date,
      }).city,
    ).toBe('New York')
  })

  it('uses a deterministic fallback for an invalid time zone', () => {
    expect(
      getVisitorInfo({
        userAgent: '',
        screenWidth: 1,
        screenHeight: 1,
        timeZone: 'invalid/zone',
        date,
      }),
    ).toMatchObject({ city: 'somewhere', sessionTime: '04:34' })
  })
})
