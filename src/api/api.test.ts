import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { adaptWeatherResponses } from '../adapters/weatherAdapter';
import { getWeather, NetworkRequestError } from '../api';

const condition = {
  id: 800,
  main: 'Clear',
  description: 'clear sky',
  icon: '01d',
};

const currentWeather = {
  coord: { lat: 37.5, lon: 127 },
  weather: [condition],
  main: { temp: 14, feels_like: 13, pressure: 1013, humidity: 60 },
  visibility: 10_000,
  wind: { speed: 4, deg: 180 },
  clouds: { all: 20 },
  dt: Date.UTC(2024, 0, 2, 12) / 1000,
  sys: {
    sunrise: Date.UTC(2024, 0, 2, 0) / 1000,
    sunset: Date.UTC(2024, 0, 2, 10) / 1000,
  },
  timezone: 7_200,
};

function forecastItem(dt: number, temp: number) {
  return {
    dt,
    main: { temp, feels_like: temp, pressure: 1013, humidity: 60 },
    weather: [condition],
    clouds: { all: 20 },
    wind: { speed: 4, deg: 180 },
    visibility: 10_000,
    pop: 0,
    dt_txt: new Date(dt * 1000).toISOString().replace('T', ' ').slice(0, 19),
  };
}

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

describe('OpenWeather adapter', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('groups forecast intervals by local date and preserves only available fields', async () => {
    const forecast = {
      city: { timezone: 7_200 },
      list: [
        forecastItem(Date.UTC(2024, 0, 1, 22) / 1000, 10),
        forecastItem(Date.UTC(2024, 0, 2, 10) / 1000, 12),
        forecastItem(Date.UTC(2024, 0, 2, 22) / 1000, 8),
      ],
    };
    const data = adaptWeatherResponses(currentWeather, forecast);

    expect(data.timezone_offset).toBe(7_200);
    expect(data.daily).toHaveLength(2);
    expect(data.daily[0]).toEqual({
      date: '2024-01-02',
      temp: { day: 12, min: 10, max: 12 },
      weather: [condition],
    });
    expect(data.daily[0]).not.toHaveProperty('sunrise');
  });

  it('throws an HTTP error instead of parsing a failed response', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ message: 'Unauthorized' }, 401))
      .mockResolvedValueOnce(jsonResponse({ message: 'Unauthorized' }, 401));

    await expect(getWeather({ lat: 37.5, lon: 127 })).rejects.toThrow(
      'Current weather request failed (401)',
    );
  });

  it('reports an error from the forecast endpoint', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(currentWeather))
      .mockResolvedValueOnce(jsonResponse({ message: 'Unavailable' }, 500));

    await expect(getWeather({ lat: 37.5, lon: 127 })).rejects.toThrow(
      'Forecast request failed (500)',
    );
  });

  it('marks fetch failures as retryable network errors', async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(jsonResponse(currentWeather));

    await expect(getWeather({ lat: 37.5, lon: 127 })).rejects.toBeInstanceOf(
      NetworkRequestError,
    );
  });

  it('rejects malformed endpoint payloads before adapting them', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(currentWeather))
      .mockResolvedValueOnce(
        jsonResponse({ city: { timezone: 0 }, list: [{}] }),
      );

    await expect(getWeather({ lat: 37.5, lon: 127 })).rejects.toThrow();
  });
});
