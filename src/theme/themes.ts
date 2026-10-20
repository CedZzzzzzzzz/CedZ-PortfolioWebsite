import type { ThemeName } from '../types/navigation'

export const themes: readonly ThemeName[] = ['dark', 'blue', 'tokyo', 'fire', 'scar']

export const themeNames: Record<ThemeName, string> = {
  dark: 'Dark',
  blue: 'Night Blue',
  tokyo: 'Tokyo Night',
  fire: 'Fire',
  scar: 'Scar',
}
