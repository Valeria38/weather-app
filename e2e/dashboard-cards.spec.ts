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
    await expect(temperatureValues).toHaveCount(24);
  });

  test('should display and scroll Hourly forecast horizontally', async ({
    page,
  }) => {
    const hourlySection = page.getByRole('region', {
      name: /hourly forecast/i,
    });
    await expect(hourlySection).toBeVisible();
    const hourlyScrollRegion = page.getByRole('region', {
      name: '48-hour forecast items',
    });
    await expect(hourlyScrollRegion).toHaveAttribute('tabindex', '0');
    await hourlyScrollRegion.focus();
    await expect(hourlyScrollRegion).toBeFocused();

    const hourlyTemps = hourlySection.locator('text=°C');

    await expect(hourlyTemps.first()).toBeVisible();

    const lastTemp = hourlyTemps.last();
    await lastTemp.scrollIntoViewIfNeeded();

    await expect(lastTemp).toBeVisible();
    await expect(hourlyTemps).toHaveCount(48);
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
    await expect(additionalInfoSection.getByText(/uv index/i)).toBeVisible();
    await expect(
      additionalInfoSection.getByText(/wind direction/i),
    ).toBeVisible();
    await expect(additionalInfoSection.getByText(/pressure/i)).toBeVisible();
    await expect(additionalInfoSection.getByText(/sunrise/i)).toBeVisible();
    await expect(additionalInfoSection.getByText(/sunset/i)).toBeVisible();
    await expect(icons).toHaveCount(7);
  });
});
