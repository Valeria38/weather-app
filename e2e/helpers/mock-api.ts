import { Page } from '@playwright/test';

export async function setupApiMocks(page: Page) {
  await page.route('**/geo/1.0/direct**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          name: 'Canton',
          local_names: { ru: 'Кантон', uk: 'Кантон', en: 'Canton' },
          lat: 40.7985464,
          lon: -81.3749508,
          country: 'US',
          state: 'Ohio',
        },
      ]),
    });
  });

  await page.route(
    (url) => url.pathname.includes('/data/2.5/air_pollution'),
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          coord: { lon: -81.3749508, lat: 40.7985464 },
          list: [
            {
              dt: 1791811179,
              main: { aqi: 1 },
              components: {
                co: 116.22,
                no: 0,
                no2: 0.01,
                o3: 31.76,
                so2: 0.15,
                pm2_5: 2.06,
                pm10: 8.05,
                nh3: 0,
              },
            },
          ],
        }),
      });
    },
  );
}
