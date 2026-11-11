import type { IssuerLogo } from '../types/content'

/** Issuer marks: Coursera, DataCamp and Udacity from Simple Icons (CC0) and Udacity's 2024 mark; TESDA seal from Wikimedia Commons (public domain). */
export const issuerLogos: Record<string, IssuerLogo> = {
  Coursera: { src: '/Certificates/issuers/coursera.svg', tile: '#0056d2' },
  DataCamp: { src: '/Certificates/issuers/datacamp.svg' },
  TESDA: { src: '/Certificates/issuers/tesda.png' },
  Udacity: { src: '/Certificates/issuers/udacity.svg', tile: '#ffffff' },
}
