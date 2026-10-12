import { expect, test } from '@playwright/test';

test.describe('Weather Dashboard - Map & Layers', () => {
  test.beforeEach(async ({ page }) => {
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
    // Находим селект локации по роли combobox и имени
    const locationSelect = page.getByRole('combobox', { name: 'Location' });
    // const tempCard = page.locator('text=Current Weather').locator('..');
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
