import type {
  Experience,
  Profile,
  Project,
  SkillGroup,
  Social,
} from './content'
import type { PortfolioFile, ThemeName } from './navigation'

export type Tone = 'normal' | 'muted' | 'accent' | 'ok' | 'warn' | 'error'

export interface Segment {
  text: string
  tone?: Tone
  fileId?: string
  command?: string
  href?: string
}

export type Line = Segment[]

export type Effect =
  | { kind: 'open'; fileId: string }
  | { kind: 'theme'; theme: ThemeName }
  | { kind: 'plain'; enabled: boolean }
  | { kind: 'byte'; open: boolean }
  | { kind: 'pet'; action: 'feed' | 'play' }
  | { kind: 'external'; href: string }

export interface CommandResult {
  lines: Line[]
  effects?: Effect[]
  clear?: boolean
}

export interface CommandContent {
  profile: Profile
  about: string
  projects: readonly Project[]
  skills: readonly SkillGroup[]
  socials: readonly Social[]
  experience: readonly Experience[]
  files: readonly PortfolioFile[]
}

export interface CommandSummary {
  name: string
  description: string
  aliases?: readonly string[]
}

export interface CommandContext {
  content: CommandContent
  themes: readonly ThemeName[]
  activeFileId: string | null
  commands: readonly CommandSummary[]
}

export interface Command extends CommandSummary {
  run(
    args: readonly string[],
    ctx: CommandContext,
  ): CommandResult | Promise<CommandResult>
}
