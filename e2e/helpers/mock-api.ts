import { Page } from '@playwright/test';

import type { WeatherData } from '../../src/schemas/weatherSchema';

const weatherCondition = {
  id: 800,
  main: 'Clear',
  description: 'clear sky',
  icon: '01d',
};
const defaultCoordinates = { lat: 40.7989, lon: -81.3784 };

function createWeatherData(lat: number, lon: number): WeatherData {
  const timestamp = Date.UTC(2024, 0, 1, 12) / 1000;
  const temperature = lon < 0 ? 18 : 11;

  return {
    lat,
    lon,
    timezone: lon < 0 ? 'America/New_York' : 'Asia/Seoul',
    timezone_offset: lon < 0 ? -18_000 : 32_400,
    current: {
      dt: timestamp,
      sunrise: timestamp - 21_600,
      sunset: timestamp + 21_600,
      temp: temperature,
      feels_like: temperature - 1,
      pressure: 1013,
      humidity: 60,
      dew_point: 10,
      uvi: 2,
      clouds: 20,
      visibility: 10_000,
      wind_speed: 4,
      wind_deg: 180,
      weather: [weatherCondition],
    },
    hourly: Array.from({ length: 48 }, (_, index) => ({
      dt: timestamp + index * 3600,
      temp: temperature + (index % 5) - 2,
      feels_like: temperature - 1,
      pressure: 1013,
      humidity: 60,
      dew_point: 10,
      uvi: 2,
      clouds: 20,
      visibility: 10_000,
      wind_speed: 4,
      wind_deg: 180,
      wind_gust: 6,
      weather: [weatherCondition],
      pop: 0,
    })),
    daily: Array.from({ length: 8 }, (_, index) => ({
      dt: timestamp + index * 86_400,
      sunrise: timestamp - 21_600,
      sunset: timestamp + 21_600,
      moonrise: timestamp,
      moonset: timestamp + 43_200,
      moon_phase: 0.5,
      summary: 'Clear sky',
      temp: {
        day: temperature + index,
        min: temperature - 3 + index,
        max: temperature + 3 + index,
        night: temperature - 2 + index,
        eve: temperature + index,
        morn: temperature - 1 + index,
      },
      feels_like: {
        day: temperature - 1,
        night: temperature - 3,
        eve: temperature,
        morn: temperature - 2,
      },
      pressure: 1013,
      humidity: 60,
      dew_point: 10,
      wind_speed: 4,
      wind_deg: 180,
      wind_gust: 6,
      weather: [weatherCondition],
      clouds: 20,
      pop: 0,
      uvi: 2,
    })),
  };
}

export async function setupApiMocks(page: Page) {
  await page.route('**/geo/1.0/direct**', async (route) => {
    const requestedLocation =
      new URL(route.request().url()).searchParams.get('q')?.toLowerCase() ?? '';
    const isSeoul = requestedLocation.includes('seoul');

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          name: isSeoul ? 'Seoul' : 'Canton',
          local_names: isSeoul
            ? { en: 'Seoul', ko: '서울' }
            : { ru: 'Кантон', uk: 'Кантон', en: 'Canton' },
          lat: isSeoul ? 37.5665 : 40.7985464,
          lon: isSeoul ? 126.978 : -81.3749508,
          country: isSeoul ? 'KR' : 'US',
          ...(isSeoul ? {} : { state: 'Ohio' }),
        },
      ]),
    });
  });

  await page.route(
    (url) => url.pathname.includes('/data/3.0/onecall'),
    async (route) => {
      const url = new URL(route.request().url());
      const latParam = url.searchParams.get('lat');
      const lonParam = url.searchParams.get('lon');
      const parsedLat = Number(latParam);
      const parsedLon = Number(lonParam);
      const lat =
        latParam && Number.isFinite(parsedLat)
          ? parsedLat
          : defaultCoordinates.lat;
      const lon =
        lonParam && Number.isFinite(parsedLon)
          ? parsedLon
          : defaultCoordinates.lon;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(createWeatherData(lat, lon)),
      });
    },
  );

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
