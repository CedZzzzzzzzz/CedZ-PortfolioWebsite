import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('initial HTML includes SEO metadata, a social image, and a text fallback', async ({
  request,
}) => {
  const response = await request.get('/')
  expect(response.ok()).toBe(true)

  const html = await response.text()
  expect(html).toContain('<title>Marcus Cedric S. Pedrosa')
  expect(html).toContain('property="og:title"')
  expect(html).toContain('property="og:description"')
  expect(html).toContain('property="og:image"')
  expect(html).toContain('name="twitter:card"')
  expect(html).toContain('https://marcuscedricpedrosa.dev/og-image.png')
  expect(html).toContain('<noscript>')
  expect(html).toContain('Quantis-F1')
})

test('plain view uses / and interactive view uses /terminal', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('.plain-page')).toBeVisible()
  await page.getByRole('button', { name: 'Terminal view' }).click()
  await expect(page).toHaveURL(/\/terminal$/)
  await expect(page.locator('.plain-page')).toHaveCount(0)
  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.locator('.plain-page')).toBeVisible()
})

test('landing renders and a terminal command opens a file', async ({
  page,
}) => {
  await page.goto('/terminal')
  await expect(page.getByText('booting cedz.portfolio ...')).toBeVisible()
  const command = page.getByRole('textbox', { name: 'Terminal command' })
  await command.fill('open about')
  await command.press('Enter')
  await expect(page.getByRole('tab', { name: /about\.md/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /who_am_i/i })).toBeVisible()
  await expect(
    page.getByText(/third-year computer engineering technology student/i),
  ).toBeVisible()
  await expect(page.getByText(/machine learning/i).first()).toBeVisible()
  await expect(
    page.getByText(/build scalable software that feels useful/i),
  ).toBeVisible()
})

test('opening resume displays the actual PDF in the editor', async ({
  page,
}) => {
  await page.goto('/terminal')
  const command = page.getByRole('textbox', { name: 'Terminal command' })
  await command.fill('open resume')
  await command.press('Enter')
  const preview = page.getByTitle('Marcus Cedric S. Pedrosa resume PDF')
  await expect(preview).toBeVisible()
  await expect(preview).toHaveAttribute('src', '/CV/CV_PedrosaMarcus.pdf')
  await expect(
    page.getByRole('link', { name: 'Open or download resume.pdf' }),
  ).toHaveCount(0)
})

test('certifications open PDFs and verification links inside the workspace', async ({
  page,
}) => {
  await page.goto('/terminal')
  await page.getByRole('button', { name: 'Expand certifications' }).click()
  await page.getByRole('button', { name: /css-nc-ii\.pdf/i }).click()
  const pdfPreview = page.getByTitle(
    'Computer Systems Servicing NC II certificate PDF',
  )
  await expect(pdfPreview).toHaveAttribute('src', '/Certificates/CSS.pdf')
  await page.getByRole('button', { name: /python-programming\.link/i }).click()
  await expect(
    page.getByRole('link', { name: 'Open verification page' }),
  ).toHaveAttribute(
    'href',
    'https://coursera.org/share/fabf0c3097397127b88852553d8f4e47',
  )
})

test('project preview stays contained and responsive', async ({ page }) => {
  await page.goto('/terminal')
  const command = page.getByRole('textbox', { name: 'Terminal command' })
  await command.fill('open ecobench')
  await command.press('Enter')
  const preview = page.locator('.project-hero')
  await expect(preview).toBeVisible()
  await expect(preview.locator('img')).toHaveCSS('object-fit', 'contain')
  const desktopBounds = await preview.boundingBox()
  const desktopDetails = await page.locator('.project-details').boundingBox()
  expect(desktopBounds).not.toBeNull()
  expect(desktopDetails).not.toBeNull()
  expect(
    Math.abs(desktopBounds!.height - desktopDetails!.height),
  ).toBeLessThanOrEqual(1)
  expect(desktopDetails!.x).toBeGreaterThan(desktopBounds!.x)
  await expect(
    page.getByRole('navigation', { name: 'Other projects' }),
  ).toHaveCount(0)
  await page.setViewportSize({ width: 360, height: 800 })
  const mobileBounds = await preview.boundingBox()
  const mobileDetails = await page.locator('.project-details').boundingBox()
  expect(mobileBounds).not.toBeNull()
  expect(mobileDetails).not.toBeNull()
  expect(mobileDetails!.y).toBeGreaterThan(mobileBounds!.y)
  await expect(preview).toHaveCSS('aspect-ratio', '16 / 9')
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      ),
    )
    .toBeLessThanOrEqual(0)
})

test('launcher opens a page and restores focus to its opener', async ({
  page,
}) => {
  await page.goto('/terminal')
  const launcherButton = page.getByRole('button', { name: 'Launcher' })
  await launcherButton.focus()
  await page.keyboard.press('Control+Space')
  const dialog = page.getByRole('dialog', { name: 'Launcher' })
  await expect(dialog).toBeVisible()
  const search = page.getByRole('combobox', { name: 'Search launcher' })
  await search.fill('about')
  await search.press('Enter')
  await expect(page.getByRole('heading', { name: /who_am_i/i })).toBeVisible()
  await expect(launcherButton).toBeFocused()
})

test('theme switching and plain view toggle work', async ({ page }) => {
  await page.goto('/terminal')
  await page.getByRole('radio', { name: 'Night Blue' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'blue')
  await page
    .getByRole('banner')
    .getByRole('button', { name: /plain view/i })
    .click()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Marcus Cedric S. Pedrosa' }),
  ).toBeVisible()
  const portrait = page.locator('.dp-hero-photo')
  await expect(portrait).toBeVisible()
  await expect
    .poll(() =>
      portrait.evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0)
  const themeTrigger = page.getByRole('button', { name: 'Theme: Night Blue' })
  await themeTrigger.click()
  const themeMenu = page.getByRole('dialog', { name: 'Color theme' })
  await expect(themeMenu).toBeVisible()
  await themeMenu.getByRole('radio', { name: 'Fire' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'fire')
  await page.keyboard.press('Escape')
  await expect(themeMenu).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Theme: Fire' })).toBeFocused()
  await expect(
    page.getByRole('heading', { name: "Things I've built" }),
  ).toBeVisible()
  await page.getByRole('tab', { name: 'ecobench.md' }).click()
  await expect(page.getByRole('heading', { name: 'EcoBench' })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'What I work with' }),
  ).toBeVisible()
  await page.getByRole('button', { name: /frameworks-libraries/ }).click()
  await expect(
    page.getByRole('heading', { name: 'Frameworks & Libraries' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Certifications' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Awards & leadership' }),
  ).toBeVisible()
  const award = page.getByRole('button', { name: /Bobathon/ })
  await award.click()
  const awardDialog = page.getByRole('dialog', { name: 'ICS x IBM Bobathon' })
  await expect(awardDialog).toBeVisible()
  await awardDialog
    .getByRole('button', { name: 'Show Holding the trophy' })
    .click()
  await expect(awardDialog.getByText('2 / 3')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(awardDialog).toBeHidden()
  await expect(award).toBeFocused()
  await page.getByRole('button', { name: 'Collapse navigation' }).click()
  await expect(page.getByRole('navigation', { name: 'Sections' })).toHaveCount(
    0,
  )
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('button', { name: 'Ask Byte' }).click()
  await expect(page.locator('#byte-panel')).toBeVisible()
  await page.getByRole('button', { name: 'Close Byte' }).click()
  const interactiveToggle = page.getByRole('button', { name: 'Terminal view' })
  await expect(interactiveToggle).toBeVisible()
  await interactiveToggle.hover()
  await expect(interactiveToggle.getByText('Terminal view')).toBeVisible()
  await interactiveToggle.click()
  await expect(page.locator('.plain-page')).toHaveCount(0)
  await expect(page.getByRole('banner')).toBeVisible()
})

test('mobile layout stacks panes and opens a page without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/terminal')

  await expect(page.getByRole('heading', { name: 'EDITOR' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'TERMINAL' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'EXPLORER' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'PROFILE' })).toBeVisible()

  const paneOrder = await page.locator('.pane').evaluateAll((panes) =>
    panes
      .map((pane) => ({
        name: pane.querySelector('.pane-title')?.textContent?.trim(),
        top: pane.getBoundingClientRect().top,
      }))
      .sort((first, second) => first.top - second.top)
      .map((pane) => pane.name),
  )
  expect(paneOrder).toEqual(['editor', 'terminal', 'explorer', 'profile'])

  const command = page.getByRole('textbox', { name: 'Terminal command' })
  await command.fill('open about')
  await command.press('Enter')
  await expect(page.getByRole('tab', { name: /about\.md/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /who_am_i/i })).toBeVisible()

  const widths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }))
  expect(widths.document).toBeLessThanOrEqual(widths.viewport)

  await page
    .getByRole('banner')
    .getByRole('button', { name: /plain view/i })
    .click()
  const themeTrigger = page.getByRole('button', { name: 'Choose theme' })
  await expect(themeTrigger).toBeVisible()
  const interactiveToggle = page.getByRole('button', {
    name: 'Back to interactive view',
  })
  await expect(interactiveToggle).toBeVisible()
  await themeTrigger.click()
  const themeDialog = page.getByRole('dialog', { name: 'Choose a theme' })
  await themeDialog.getByRole('radio', { name: 'Scar' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'scar')
  await themeDialog.getByRole('button', { name: 'Close theme picker' }).click()
  const controls = await page.locator('.hero-card .contact').boundingBox()
  expect(controls).not.toBeNull()
  expect(controls!.x + controls!.width).toBeLessThanOrEqual(320)
})

test('Byte opens and answers one question', async ({ page }) => {
  await page.goto('/terminal')
  await page.getByRole('button', { name: 'Open Byte' }).click()
  const input = page.getByRole('textbox', { name: 'Ask Byte' })
  await expect(input).toBeFocused()
  await input.fill('projects')
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.locator('.byte-bubble p[aria-hidden="true"]')).toHaveText(
    'Here are the projects. Pick one to explore.',
    { timeout: 5000 },
  )
  await expect(
    page
      .locator('[aria-live="polite"]')
      .filter({ hasText: 'Here are the projects.' }),
  ).toBeVisible()
})

test('axe finds no serious or critical violations on each theme and plain view', async ({
  page,
}) => {
  await page.goto('/terminal')
  for (const [name, theme] of [
    ['dark', 'dark'],
    ['Night Blue', 'blue'],
    ['Tokyo Night', 'tokyo'],
    ['Fire', 'fire'],
    ['Scar', 'scar'],
  ]) {
    await page.getByRole('radio', { name }).click()
    await page.waitForTimeout(450)
    const results = await new AxeBuilder({ page }).analyze()
    expect(
      results.violations.filter((violation) =>
        ['serious', 'critical'].includes(violation.impact ?? ''),
      ),
      `${theme} theme`,
    ).toEqual([])
  }
  await page
    .getByRole('banner')
    .getByRole('button', { name: /plain view/i })
    .click()
  await expect(page.locator('.dp-hero-body')).toBeVisible()
  const plainResults = await new AxeBuilder({ page }).analyze()
  expect(
    plainResults.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? ''),
    ),
  ).toEqual([])
})

test('workspace remains readable when modern CSS declarations are ignored', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.route('**/*.css', async (route) => {
    const response = await route.fetch()
    const css = await response.text()
    const fallbackCss = css
      .replace(/(?:^|[;{])[^{};]+:\s*[^{};]*color-mix\([^;]*;?/g, '')
      .replace(/(?:^|[;{])[^{};]+:\s*[^{};]*\d+dvh[^;]*;?/g, '')
    await route.fulfill({ response, body: fallbackCss })
  })
  await page.goto('/terminal')
  await expect(page.getByText('booting cedz.portfolio ...')).toBeVisible()
  await expect(
    page.getByRole('textbox', { name: 'Terminal command' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'EXPLORER' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'PROFILE' })).toBeVisible()

  const widths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }))
  expect(widths.document).toBeLessThanOrEqual(widths.viewport)
})
