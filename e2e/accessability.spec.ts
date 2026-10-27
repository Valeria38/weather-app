import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { setupApiMocks } from './helpers/mock-api';

async function expectDashboardToBeAccessible(page: Page) {
  await expect(
    page.getByRole('heading', { name: 'Air pollution' }),
  ).toBeVisible();
  await page.addStyleTag({
    content: `
        *,
        *::before,
        *::after {
          animation: none !important;
          transition: none !important;
        }
      `,
  });
  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .map((animation) => animation.finished.catch(() => undefined)),
    );
  });

  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(
    violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      elements: nodes.map(({ html, failureSummary, any }) => ({
        html,
        failureSummary,
        contrast: any.map(({ data }) => data),
      })),
    })),
  ).toEqual([]);
}

test('dark theme dashboard has no WCAG A/AA violations', async ({ page }) => {
  await setupApiMocks(page);
  await page.goto('/');
  await expect(page.locator('body')).toHaveClass(/dark/);

  await expectDashboardToBeAccessible(page);
});

test('light theme dashboard has no WCAG A/AA violations', async ({ page }) => {
  await setupApiMocks(page);
  await page.goto('/');

  await page.getByRole('switch', { name: 'Toggle theme' }).click();
  await expect(page.locator('body')).not.toHaveClass(/dark/);

  await expectDashboardToBeAccessible(page);
});
