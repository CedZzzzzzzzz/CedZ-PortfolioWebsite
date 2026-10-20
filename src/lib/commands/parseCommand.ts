export interface ParsedCommand {
  name: string
  args: string[]
}

export function parseCommand(input: string): ParsedCommand {
  const [name = '', ...args] = input.trim().split(/\s+/)
  return { name: name.toLowerCase(), args }
}
