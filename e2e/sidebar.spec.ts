import { expect, test } from '@playwright/test';

import { setupApiMocks } from './helpers/mock-api';

test.describe('Weather Dashboard - Sidepanel', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await page.goto('/');
  });

  test('should open sidepanel via burger menu and close it via back arrow on mobile screens', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const burgerButton = page.getByRole('button', { name: /open sidepanel/i });
    await expect(burgerButton).toBeVisible();
    await burgerButton.click();

    const sidepanel = page.getByRole('complementary', {
      name: /air pollution/i,
    });
    await expect(sidepanel).toHaveClass(/translate-x-0/);

    const closeButton = sidepanel.getByRole('button', {
      name: /close sidepanel/i,
    });
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await expect(sidepanel).toHaveClass(/translate-x-full/);
  });

  test('should display the air pollution sidepanel by default on desktop screens', async ({
    page,
  }) => {
    const sidepanel = page.getByRole('complementary', {
      name: 'Air pollution',
    });

    await expect(sidepanel).toBeVisible();
    await expect(sidepanel).toHaveClass(/translate-x-full/);
  });

  test('should render overall AQI score and pollutant cards based on server response', async ({
    page,
  }) => {
    const sidepanel = page.getByRole('complementary', {
      name: 'Air pollution',
    });
    await expect(sidepanel).toBeVisible();

    const aqiScore = sidepanel.getByRole('heading', { level: 1, name: /1/i });
    await expect(aqiScore).toHaveText('1');

    const coCard = sidepanel.locator('section', { hasText: /^co/i });
    await expect(coCard).toBeVisible();

    await expect(sidepanel.getByText('co', { exact: true })).toBeVisible();
    await expect(sidepanel.getByText('no2', { exact: true })).toBeVisible();
    await expect(sidepanel.getByText('pm10', { exact: true })).toBeVisible();
  });

  test('should display tooltip information when hovering over pollutant info icons', async ({
    page,
  }) => {
    const sidepanel = page.getByRole('complementary', {
      name: 'Air pollution',
    });
    await expect(sidepanel).toBeVisible();
    const coCard = sidepanel.locator('section', { hasText: /^co/i });
    const infoIcon = coCard
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first();
    await infoIcon.hover();

    const tooltipContent = page.locator('text=Concentration of');
    await expect(tooltipContent).toBeVisible();
  });

  test('should display air pollution metrics and allow scrolling', async ({
    page,
  }) => {
    const sidepanel = page.getByRole('complementary', {
      name: 'Air pollution',
    });
    await expect(sidepanel).toBeVisible();

    await expect(sidepanel.getByText('Co')).toBeVisible();

    const lastParam = sidepanel.getByText('Nh3');
    await lastParam.scrollIntoViewIfNeeded();
    await expect(lastParam).toBeVisible();
  });
});
