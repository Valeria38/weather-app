import { expect, test } from '@playwright/test';

import { setupApiMocks } from './helpers/mock-api';

test.describe('Weather Dashboard - Cards', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await page.goto('/');
  });

  test('should render Current Weather card with essential metrics', async ({
    page,
  }) => {
    const currentWeatherSection = page.getByRole('region', {
      name: /current weather/i,
    });
    const timeValue = currentWeatherSection.locator('text=/\\d{2}:\\d{2}/');
    const weatherIcon = currentWeatherSection.getByRole('img', {
      name: /weather icon/i,
    });
    await expect(weatherIcon).toBeVisible();

    await expect(currentWeatherSection).toBeVisible();
    await expect(currentWeatherSection.getByText(/local time/i)).toBeVisible();
    await expect(timeValue).toBeVisible();
    await expect(currentWeatherSection.getByText(/feels like/i)).toBeVisible();
    await expect(currentWeatherSection.getByText(/humidity/i)).toBeVisible();
    await expect(currentWeatherSection.getByText(/wind speed/i)).toBeVisible();
  });

  test('should display Daily forecast card and its elements', async ({
    page,
  }) => {
    const dailySection = page.getByRole('region', { name: /daily forecast/i });

    await expect(dailySection).toBeVisible();
    await expect(dailySection.getByText('Mon').first()).toBeVisible();
    await expect(dailySection.getByText('Tue').first()).toBeVisible();
    await expect(dailySection.getByText('Wed').first()).toBeVisible();

    const temperatureValues = dailySection.locator('text=°C');
    await expect(temperatureValues.first()).toBeVisible();
    await expect(temperatureValues).toHaveCount(18);
  });

  test('should display and scroll forecast intervals horizontally', async ({
    page,
  }) => {
    const forecastSection = page.getByRole('region', {
      name: '5-day forecast (3-hour intervals)',
      exact: true,
    });
    await expect(forecastSection).toBeVisible();
    const forecastScrollRegion = page.getByRole('region', {
      name: '5-day forecast intervals',
    });
    await expect(forecastScrollRegion).toHaveAttribute('tabindex', '0');
    await forecastScrollRegion.focus();
    await expect(forecastScrollRegion).toBeFocused();

    const forecastTemps = forecastSection.locator('text=°C');

    await expect(forecastTemps.first()).toBeVisible();

    const lastTemp = forecastTemps.last();
    await lastTemp.scrollIntoViewIfNeeded();

    await expect(lastTemp).toBeVisible();
    await expect(forecastTemps).toHaveCount(40);
  });

  test('should render Additional Weather Info card with parameters', async ({
    page,
  }) => {
    const additionalInfoSection = page.getByRole('region', {
      name: /additional weather info/i,
    });
    await expect(additionalInfoSection).toBeVisible();
    const icons = additionalInfoSection.locator('svg');

    await expect(icons.first()).toBeVisible();
    await expect(additionalInfoSection.getByText(/cloudiness/i)).toBeVisible();
    await expect(
      additionalInfoSection.getByText(/wind direction/i),
    ).toBeVisible();
    await expect(additionalInfoSection.getByText(/pressure/i)).toBeVisible();
    await expect(additionalInfoSection.getByText(/sunrise/i)).toBeVisible();
    await expect(additionalInfoSection.getByText(/sunset/i)).toBeVisible();
    await expect(icons).toHaveCount(6);
  });
});

test.describe('Weather request failures', () => {
  test('shows a retry action after a server error and recovers', async ({
    page,
  }) => {
    await setupApiMocks(page);

    let weatherAttempts = 0;
    await page.route(
      (url) => url.pathname.includes('/data/2.5/weather'),
      async (route) => {
        weatherAttempts += 1;
        if (weatherAttempts <= 3) {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Weather service unavailable' }),
          });
          return;
        }
        await route.fallback();
      },
    );

    await page.goto('/');

    await expect(page.getByRole('alert')).toContainText(
      'Could not load weather data',
    );
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible();
    expect(weatherAttempts).toBe(3);

    await page.getByRole('button', { name: 'Retry' }).click();

    await expect(
      page.getByRole('region', { name: /current weather/i }),
    ).toBeVisible();
    expect(weatherAttempts).toBe(4);
  });
});
