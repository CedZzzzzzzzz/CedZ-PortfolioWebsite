## Role and goal
You are a senior front-end engineer. Rebuild the prototype at `reference/ide-portfolio.html` as a production **Vite + React 18 + TypeScript (strict)** site, matching the design below exactly. Use Tailwind with CSS-variable theme tokens, Framer Motion, and React Bits (`DecryptedText` for the boot heading). Dark themes only.

## Working agreements (non-negotiable)
1. Build **bottom-up**: dependencies before the things that consume them.
2. **One responsibility per file** (one component, hook, or command per file).
3. Output **full files** when a change is significant, not fragments.
4. **No hacks**: no hardcoded flags to force behavior, no `any` to silence the compiler, no dead code.
5. Keep my naming once I rename something.
6. Before each phase, give a short plan with the reasoning behind architectural decisions and the alternatives you rejected. Wait for my OK on structural choices.
7. After each phase: summarize, say how to verify, then **stop and wait**.
8. Verify for real: run type-check, lint, tests, and the dev server, and report actual results.

**Ask me before coding:** TypeScript or JS (default: TypeScript), hosting target (Netlify: `main` = root domain, `dev` branch = `dev.` subdomain), my real content (projects, links, bio, socials, experience), and whether the chatbot stays rule-based or calls an endpoint.

---

## 1. Layout ("sandwich", VS Code-like)
Full viewport, three columns, middle column split top/bottom:
```
┌ top bar (34px) ─────────────────────────────────────────────────┐
│ ◆  >_  ~/cedz-portfolio/<file>        12:34      ☰ plain view …  │
├──────────┬────────────────────────────┬────────────┤
│ EXPLORER │ EDITOR (tabs + view)       │  PROFILE   │
│  (a)     │  (b)                       │   (d)      │
│          ├────────────────────────────┤            │
│          │ TERMINAL (docked)  (c)     │            │
└──────────┴────────────────────────────┴────────────┘
```
- CSS grid: `columns: var(--lw) minmax(0,1fr) var(--rw)`; `rows: calc((100% - 10px) * var(--rn)) 1fr`; areas `"a b d" "a c d"`; gap 10px; padding 10px.
- Defaults `--lw: 210px; --rw: 250px; --rn: .5`.
- **Drag gutters** (8px, pointer-capture): left clamps 140–420px, right 190–420px, middle row ratio .2–.8. Hover/active tints with the accent. Persist sizes.
- Panes: 10px radius, 2px border. **Active pane** (follows mouse hover, like Hyprland `follow_mouse`) gets a 135° gradient border `--ac → --ac2` plus a soft glow.
- Font: JetBrains Mono 13px/1.5. Pane titles are 11px, uppercase-spaced, muted.
- **Mobile (<760px):** panes stack in one scrolling column in the order editor, terminal, explorer, profile; gutters hidden.
- **Top bar:** `◆` opens the launcher, `>_` focuses the terminal, current file path, clock (center), right side: plain-view toggle button, theme name, `ctrl+space` hint (hint and names hidden on mobile).

## 2. Themes (dark only, CSS variables on `:root[data-theme]`)
| token | dark (black) | blue (Night Blue) | tokyo (black + red) | fire |
|---|---|---|---|---|
| --bg | #000 | #070d1f | #09090d | #110500 |
| --fg | #e8e8e8 | #d4e4ff | #ece3e3 | #ffead2 |
| --mut | #707070 | #5b7099 | #80606a | #a0602f |
| --ac | #f2f2f2 | #4da3ff | #ff2e4d | #ff6a00 |
| --ac2 | #9a9a9a | #7ee0ff | #ff7a8a | #ffc400 |
| --bd | #2a2a2a | #1f2f55 | #3a1a22 | #4d2008 |
| --card | #0b0b0b | #0b1430 | #110a0d | #1b0902 |
| --ok | #8be28b | #5ee6a8 | #ff9f68 | #ffd23f |
| --warn | #f5c542 | #ffd479 | #ffd166 | #ff3d00 |
Default theme: **dark**. Switch from the Profile pane, the launcher, or `theme <dark|blue|tokyo|fire>`.

## 3. Content model (data only, in `content/`)
- `profile.ts`: name "Marcus Cedric Pedrosa", role "3rd-yr CET @ PUP Sta. Mesa", focus "software & AI engineering", github "MarcusCedric", `photo` (e.g. `/profile.jpg`), `resume` (`/resume.pdf`).
- `about.ts`: one paragraph (firmware to frontend; embedded, full-stack web, AI/ML; 3rd-year Computer Engineering Technology student at PUP Sta. Mesa aiming for software and AI engineering).
- `projects.ts`: `{ id, n, d, img, year, role, overview, highlights[], t[] (tags), links: [label, url][] }`. Start with ECOBENCH (ESP32 energy monitor), Bifrost Gateway (full-stack AI middleware), F1 2026 Predictor (ML + web). Empty link URLs hide their button.
- `skills.ts`: `embedded/` ESP32, C++, firmware · `web/` React, Framer Motion, React Bits, backend APIs · `ai-ml/` Python, ML models, AI middleware · `tools/` Git, ripgrep, Linux CLI. No percentages; tags only.
- `socials.ts`: GitHub, LinkedIn, Email (with copy), Facebook (placeholders until I send real ones).
- `experience.ts`: `{ k, t, o, w, d }`; first entry is education (BS Computer Engineering Technology, PUP Sta. Mesa, 3rd year), the rest are placeholders.
- `files.ts`: `about.md ¶`, `experience.md ⌛`, `skills.json {}`, `projects/ ▤` (index) with children `<id>.md ◆`, `resume.pdf ⎙`, `contact.txt @`.

## 4. Panes
**Explorer (left):** tree rooted at `▾ cedz-portfolio`: about, experience, skills, `projects/` (arrow toggles; label opens the index), project files indented, resume, contact. Click opens a tab. Footer hint "click a file to open it in a tab".

**Editor (center top):** VS Code-style tab bar (icon + filename + ×, active tab has an accent underline); tabs can all be closed. **Empty state ("start here")** with buttons: projects, experience, about, resume, contact. Views:
- *about*: decrypting heading `# hi, i build things end to end.` (React Bits `DecryptedText`), paragraph, buttons to the other pages.
- *experience*: vertical timeline (dot + left border), date · type, title, organization, description; entries stagger in.
- *skills*: tags grouped by category; **clicking a tag highlights it and lists the projects that use it** (each opens that project).
- *projects (index)*: responsive card grid (thumbnail, name, description, three tags); hover lifts the card and tints the border.
- *project page*: breadcrumb `projects / <id>`, name, "year · role", **hero image** (170px, tilt-on-hover with glare, click to expand in an overlay), overview, highlights list, stack tags (click → skills with that tag selected), **links** (first is a filled primary button, external `↗`), prev/next project buttons.
- *resume*: preview "sheet" (name, role, education, skills, projects), **download button** for `resume.pdf`; if none is attached, show "no PDF attached yet".
- *contact*: socials list (label + link), email has a copy button ("copied ✓").
- **Images:** precedence `user upload > project.img (from /public/projects) > generated placeholder`. Placeholder is a gradient SVG showing the project name. Optional dev/demo feature behind a config flag (not hardcoded `true`): click or drop an image to replace; downscale to ≤1000px JPEG; store in `localStorage` under `cedz-imgs`, wrapped in try/catch.

**Terminal (center bottom, docked):**
- Landing page on load (the editor starts empty): ASCII banner
```
 ██████ ███████ ██████  ███████
██      ██      ██   ██    ███
██      █████   ██   ██   ███
██      ██      ██   ██  ███
 ██████ ███████ ██████  ███████
```
then a decrypting `booting cedz.portfolio …`, green status lines `[ ok ] 3 projects · 4 skill groups · 4 themes`, `[ ok ] Byte is awake (press b)`, `[ ok ] visitor  guest · <Browser> on <OS> · <w>×<h>`, `[ ok ] session  started <HH:MM> (your local time)`, `[ ok ] where    <City> (guessed from your time zone; nothing is sent)`, `[ ok ] ip       127.0.0.1 (home sweet home, no tracking here)`, then `welcome. click a command, or type help:` and a clickable `explore: projects · experience · skills · resume · contact · help`. **It must not repeat the Profile pane's details.**
- Visitor info comes only from the visitor's own browser (user agent, `screen`, `Intl` time zone). **No network lookup, no real IP, no storage.**
- Prompt `❯`, history (↑/↓), Tab completion, clickable file names in output, quick chips under the prompt: help, ls, projects, keys.
- **Commands** (registry; one file per command, `{ name, description, aliases?, run(args, ctx) → CommandResult | Promise<CommandResult> }`): `CommandResult` contains structured `Line[]` (segments with text, tone, fileId, command, or href), optional `Effect[]` (`open`, `theme`, `plain`, `byte`, `pet`, `external`), and an optional clear signal. Commands stay pure; the terminal renders lines and executes effects. The data-only context contains content, themes, activeFileId, and command summaries. The registry resolves names and aliases case-insensitively, rejects duplicates, completes prefixes, and returns an error-toned line for unknown commands. Commands: `help`, `ls`, `open <file>` (aliases `cat`, `code`), `about`, `experience`, `skills`, `projects`, `resume`, `contact`, `plain`, `fastfetch` (alias `neofetch`), `theme <name>`, `feed`, `play`, `byte`, `ask <question>`, `ip` (static `127.0.0.1`), `github`, `keys`, `sudo` (easter egg), `clear`. Commands that map to a page also open its tab.

**Profile (right):** avatar tile 84px (rounded 14px, accent border, initials "MP" fallback, click/drop to set photo, "remove photo" link), name, role, focus, social buttons, theme buttons (current one highlighted), buttons `🐉 ask Byte` and `☰ plain view`, shortcut hint line.

## 5. Byte (mascot + chatbot, popup)
- Popup card, bottom-right (330px wide), slides in from the right; opened by the **◀ tab** on the right edge (vertically centered), the `b` key, the `byte` command, or the launcher; `Esc` or ▶ closes. Header `~/byte · mascot` with a ☰ history toggle. **No meters, no needs, no decay.**
- Layout inside: speech bubble with a tail, then a 150px room with a dotted floor line (`╌`), chips (projects, experience, resume, contact, this page), input "ask Byte…" + send.
- **Terminal-style ASCII dragon ninja** (monospace 11px, line-height 1.05), colors from the theme: spikes/headband/scarf `--ac`, horns/eyes `--fg`, outline `--ac2`:
```
  ^    ^    ^  
 /\         /\ 
/  \_______/  \
[=====[X]=====]~~
|   O     O   |
|    \_v_/    |
 \___________/ 
  (_)_______(_)~
```
Frames: eyes `O` (blink to `-` for 140ms every 2.5–5s; `^` happy; mouth neutral `\_v_/`, happy `\_____/`); talking alternates `(O)` / `(o)` every 140ms; eating `(@)`.
- Behavior: dashes to a random spot every ~4.2s (1.1s ease), flips direction, bobs and scarf sways (respect `prefers-reduced-motion`). Click → shuriken `✦` particles and a quip ("you cannot catch me 🥷", "shh… stealth mode", "*tiny puff of smoke* 💨", "ask me something!") and a 2.5s happy mood. `play` = backflip + "hiyah! ⚔️"; `feed` = "nom nom 🍙" (hidden easter eggs).
- **Chat flow:** you send → bubble shows typing dots and he tilts his head (650ms) → reply types out at ~2 chars/24ms while his mouth moves → cards/"↳ opened <file>" appear when done.
- **Brain behind an interface** `ChatBackend.reply(query, ctx) → Promise<{ text, cards?, openFile?, switchToPlain? }>`; ship the keyword backend; an HTTP backend (my Bifrost gateway) must be a drop-in with a rate limit and a keyword fallback. Keyword intents in this order: feed/play; plain/simple; "this page" (describes the open file); omarchy/layout; experience/education; resume/cv; projects (clickable cards, opens `projects/`); skills (opens skills); about/who (opens about); contact/socials (opens contact); greeting; fallback "I'm just a tiny dragon ninja 🐉 Try: projects, experience, resume, contact."
- Replies can **open pages** (tabs) and **switch to plain view**. History view lists past Q&A.

## 6. Plain view
A top-bar button, the `plain` command, a launcher action, and Byte can switch to a simple scrolling page with a header (photo, name, role, nav chips), then semantic sections `About, Experience, Projects (cards with image, overview, highlights, tags, links), Skills, Resume (download), Contact (socials)`, and a "back to the interactive view" button. System sans-serif, max-width 760px, same theme. In this mode, "open <page>" scrolls to its section. Persist the choice (`cedz-plain`).

## 7. Navigation and shortcuts (redundancy is intentional)
Explorer, tabs, terminal, launcher, Byte all open pages. Launcher (`Ctrl+Space` or `/`) = fuzzy search over files, themes, plain-view toggle, Ask Byte, Focus terminal, GitHub. `` Ctrl+` `` focuses the terminal, `b` toggles Byte, `Ctrl+←/→` and trackpad horizontal swipe switch tabs, **2-finger horizontal swipe** on touch (ignore pinch and vertical scroll), `Esc` closes Byte.

## 8. Architecture (follow, or challenge with reasons)
```
src/ types/ · content/ · lib/{commands,chat,storage,image,visitor}.ts
state/ (useReducer + context: tabs, active, selectedSkill, images, theme, plain, resume)
hooks/ (useResizablePanes, useShortcuts, useSwipeNav, useTypewriter, useBlink)
theme/ (tokens.css, themes.ts) · components/{layout,explorer,editor/views,terminal,profile,byte,plain,launcher,ui}
public/{profile.jpg,resume.pdf,projects/<id>.png}
```
Terminal history stores structured command lines and effects. No Redux/Zustand. Tokens as CSS variables.

## 9. Build order (bottom-up, stop after each)
0 setup (Vite, TS strict, ESLint, Prettier, Tailwind, Vitest, tokens, types) → 1 content data → 2 pure logic with tests (command parser/registry, chat backend, visitor info, storage/image helpers) → 3 state reducer with tests → 4 layout primitives (Pane, gutters, responsive) → 5 explorer + editor views → 6 terminal (landing, commands) → 7 profile pane + themes → 8 Byte (sprite, bubble, state machine, handle, history) → 9 launcher, shortcuts, swipe, plain view → 10 polish (Framer Motion, `DecryptedText`, reduced motion) → 11 a11y + mobile + perf pass → 12 deploy.

## 10. Acceptance criteria
Loads to an empty editor and the terminal landing; four themes persist; panes resize and persist, mobile stacks with no horizontal scroll; everything keyboard-reachable with visible focus; Byte's think → talk sequence, page opening, plain-view switching, and history all work; project links open correctly; plain view mirrors all content; no console errors; `tsc --noEmit`, lint, and tests pass; Lighthouse mobile performance ≥ 90; reduced-motion users get no looping animation. **No real IP lookup or geolocation anywhere.**

## First message I expect from you
Restate the goal in two sentences, ask the questions above, propose the Phase 0 plan with reasoning, and wait for my go-ahead.
