import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('landing renders and a terminal command opens a file', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByText('booting cedz.portfolio ...')).toBeVisible()
  const command = page.getByRole('textbox', { name: 'Terminal command' })
  await command.fill('open about')
  await command.press('Enter')
  await expect(page.getByRole('tab', { name: /about\.md/i })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: /hi, i build things end to end/i }),
  ).toBeVisible()
})

test('launcher opens a page and restores focus to its opener', async ({
  page,
}) => {
  await page.goto('/')
  const launcherButton = page.getByRole('button', { name: 'Launcher' })
  await launcherButton.focus()
  await page.keyboard.press('Control+Space')
  const dialog = page.getByRole('dialog', { name: 'Launcher' })
  await expect(dialog).toBeVisible()
  const search = page.getByRole('combobox', { name: 'Search launcher' })
  await search.fill('about')
  await search.press('Enter')
  await expect(
    page.getByRole('heading', { name: /hi, i build things end to end/i }),
  ).toBeVisible()
  await expect(launcherButton).toBeFocused()
})

test('theme switching and plain view toggle work', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('radio', { name: 'Night Blue' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'blue')
  await page
    .getByRole('banner')
    .getByRole('button', { name: /plain view/i })
    .click()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Marcus Cedric Pedrosa' }),
  ).toBeVisible()
})

test('mobile layout stacks panes and opens a page without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/')

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
  await expect(
    page.getByRole('heading', { name: /hi, i build things end to end/i }),
  ).toBeVisible()

  const widths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }))
  expect(widths.document).toBeLessThanOrEqual(widths.viewport)
})

test('Byte opens and answers one question', async ({ page }) => {
  await page.goto('/')
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
  await page.goto('/')
  for (const [name, theme] of [
    ['dark', 'dark'],
    ['Night Blue', 'blue'],
    ['Tokyo Night', 'tokyo'],
    ['Fire', 'fire'],
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
  await page.goto('/')
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
