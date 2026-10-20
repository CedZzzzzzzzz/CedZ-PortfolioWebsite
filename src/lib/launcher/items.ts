import { files } from '../../content/files'
import { themes, themeNames } from '../../theme/themes'
import type { ThemeName } from '../../types/navigation'
export type LauncherItem = {
  id: string
  label: string
  hint?: string
  run: () => void
}
export function buildLauncherItems(args: {
  openFile: (id: string) => void
  setTheme: (theme: ThemeName) => void
  togglePlain: () => void
  askByte: () => void
  focusTerminal: () => void
  openGithub: () => void
}) {
  const items: LauncherItem[] = [
    ...files.map((file) => ({
      id: `file-${file.id}`,
      label: `Open ${file.name}`,
      hint: file.kind,
      run: () => args.openFile(file.id),
    })),
    ...themes.map((theme) => ({
      id: `theme-${theme}`,
      label: `Theme: ${themeNames[theme]}`,
      hint: 'theme',
      run: () => args.setTheme(theme),
    })),
    { id: 'plain', label: 'Toggle plain view', run: args.togglePlain },
    { id: 'byte', label: 'Ask Byte', run: args.askByte },
    { id: 'terminal', label: 'Focus terminal', run: args.focusTerminal },
    { id: 'github', label: 'Open GitHub', run: args.openGithub },
  ]
  return items
}
