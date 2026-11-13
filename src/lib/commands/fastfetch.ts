import type { Command, Line, Segment } from '../../types/command'
import { recentWeeks, sparkline, sumWeeks } from '../github/contributionStats'

const KEY_WIDTH = 10
const SHOWN_PROJECTS = 3
const SHOWN_TAGS = 6

function row(key: string, value: Segment[]): Line {
  return [{ text: key.padEnd(KEY_WIDTH), tone: 'accent' }, ...value]
}

function joined(segments: Segment[]): Segment[] {
  return segments.flatMap((segment, index) =>
    index ? [{ text: ' · ', tone: 'muted' as const }, segment] : [segment],
  )
}

/** A recruiter-sized summary in fastfetch's key/value layout. */
export const fastfetchCommand: Command = {
  name: 'fastfetch',
  aliases: ['neofetch'],
  description: 'Who I am at a glance',
  run: (_, { content, github }) => {
    const { profile, projects, skills, socials, experience } = content
    const header = `guest@${profile.github.toLowerCase()}`
    const current = experience.find((entry) => entry.k === 'experience')
    const email = socials.find((social) => social.label === 'Email')
    const weekly = github
      ? recentWeeks(github, 12).map((week) => sumWeeks([week]))
      : []
    const extraProjects = projects.length - SHOWN_PROJECTS

    const lines: Line[] = [
      [{ text: header, tone: 'accent' }],
      [{ text: '─'.repeat(header.length), tone: 'muted' }],
      row('name', [{ text: profile.name }]),
      row('role', [{ text: profile.role }]),
      row('focus', [{ text: profile.focus }]),
      ...(current
        ? [
            row('now', [
              { text: `${current.t} @ ${current.o}` },
              { text: ` (${current.w})`, tone: 'muted' },
            ]),
          ]
        : []),
      row(
        'stack',
        joined(
          (skills[0]?.tags ?? [])
            .slice(0, SHOWN_TAGS)
            .map((tag) => ({ text: tag })),
        ),
      ),
      row(
        'projects',
        joined([
          ...projects
            .slice(0, SHOWN_PROJECTS)
            .map((project) => ({ text: project.n, fileId: project.id })),
          ...(extraProjects > 0
            ? [{ text: `+${extraProjects} more`, fileId: 'projects' }]
            : []),
        ]),
      ),
      row(
        'github',
        weekly.length
          ? [
              { text: sparkline(weekly), tone: 'accent' },
              {
                text: ` ${weekly[weekly.length - 1]} this week · 12w`,
                tone: 'muted',
              },
            ]
          : [
              {
                text: `github.com/${profile.github}`,
                href: `https://github.com/${encodeURIComponent(profile.github)}`,
              },
            ],
      ),
      ...(email
        ? [row('email', [{ text: email.display, href: email.url }])]
        : []),
      row('resume', [{ text: 'resume.pdf', fileId: 'resume' }]),
    ]
    return { lines }
  },
}
