import { expect, test } from '@playwright/test';

import { setupApiMocks } from './helpers/mock-api';

test.describe('Weather Dashboard - Map & Layers', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await page.goto('/');
  });

  test('should allow switching map layer types', async ({ page }) => {
    const mapTypeSelect = page.getByRole('combobox', { name: 'Map type' });
    await mapTypeSelect.click();

    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();

    const windOption = page.getByRole('option', { name: /wind/i });
    await windOption.click();

    await expect(mapTypeSelect).toHaveText(/wind/i);
  });

  test('should allow selecting a new location', async ({ page }) => {
    const locationSelect = page.getByRole('combobox', { name: 'Location' });
    const weatherCard = page.getByRole('region', { name: /current weather/i });
    const initialWeatherParams = await weatherCard.textContent();

    await expect(locationSelect).toBeVisible();
    await locationSelect.click();

    const cityOption = page.getByRole('option', { name: /seoul/i });
    await expect(cityOption).toBeVisible();
    await cityOption.click();

    await expect(weatherCard).not.toHaveText(initialWeatherParams!);
  });

  test('should toggle dark/light theme', async ({ page }) => {
    const themeToggleButton = page.getByRole('switch', {
      name: 'Toggle theme',
    });
    await expect(themeToggleButton).toBeVisible();

    await themeToggleButton.click();
    await expect(themeToggleButton).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('body')).not.toHaveClass(/dark/);
  });
});

test.describe('Location lookup failures', () => {
  test('shows a retry action without requesting weather for zero coordinates', async ({
    page,
  }) => {
    await setupApiMocks(page);
    await page.route('**/geo/1.0/direct**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Geocoding unavailable' }),
      });
    });

    await page.goto('/');
    await expect(
      page.getByRole('region', { name: /current weather/i }),
    ).toBeVisible();

    const weatherRequests: string[] = [];
    page.on('request', (request) => {
      if (
        request.url().includes('/data/3.0/onecall') ||
        request.url().includes('/data/2.5/air_pollution')
      ) {
        weatherRequests.push(request.url());
      }
    });

    await page.getByRole('combobox', { name: 'Location' }).click();
    await page.getByRole('option', { name: /seoul/i }).click();

    await expect(page.getByRole('alert')).toContainText(
      'Could not load this location',
      { timeout: 15000 },
    );
    await expect(
      page.getByRole('button', { name: 'Retry location lookup' }),
    ).toBeVisible();
    expect(weatherRequests).toHaveLength(0);
  });
});

test.describe('Default location startup', () => {
  test('uses Canton coordinates without an initial geocode request', async ({
    page,
  }) => {
    await setupApiMocks(page);

    const geocodeRequests: string[] = [];
    const weatherRequests: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('/geo/1.0/direct')) geocodeRequests.push(url);
      if (url.includes('/data/3.0/onecall')) weatherRequests.push(url);
    });

    await page.goto('/');
    await expect(
      page.getByRole('region', { name: /current weather/i }),
    ).toBeVisible();

    expect(geocodeRequests).toHaveLength(0);
    expect(weatherRequests).toHaveLength(1);
    const weatherUrl = new URL(weatherRequests[0]);
    expect(weatherUrl.searchParams.get('lat')).toBe('40.7989');
    expect(weatherUrl.searchParams.get('lon')).toBe('-81.3784');
  });
});
