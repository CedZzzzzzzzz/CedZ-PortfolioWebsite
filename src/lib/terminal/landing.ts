import type { Line } from '../../types/command'
import type { VisitorInfo } from '../visitor'
import { plainTextLine } from '../commands/line'

export const banner = ` ██████ ███████ ██████  ███████
██      ██      ██   ██    ███
██      █████   ██   ██   ███
██      ██      ██   ██  ███
 ██████ ███████ ██████  ███████`

export function createLanding(
  visitor: VisitorInfo,
  counts: { projects: number; skills: number; themes: number },
): Line[] {
  return [
    plainTextLine('booting cedz.portfolio ...', 'accent'),
    ...[
      `${counts.projects} projects · ${counts.skills} skill groups · ${counts.themes} themes`,
      'Byte is awake (press b)',
      `visitor  guest · ${visitor.browser} on ${visitor.os} · ${visitor.screen}`,
      `session  started ${visitor.sessionTime} (your local time)`,
      `where    ${visitor.city} (guessed from your time zone; nothing is sent)`,
      'ip       127.0.0.1 (home sweet home, no tracking here)',
    ].map((text) => plainTextLine(`[ ok ] ${text}`, 'ok')),
    plainTextLine('welcome. click a command, or type help:'),
    [
      { text: 'explore: ' },
      ...[
        'projects',
        'experience',
        'skills',
        'resume',
        'contact',
        'help',
      ].flatMap((command, index) => [
        ...(index ? [{ text: ' · ' }] : []),
        { text: command, command, tone: 'accent' as const },
      ]),
    ],
  ]
}
