import { adaptWeatherResponses } from '@/adapters/weatherAdapter';
import { airPollutionSchema } from '@/schemas/airPollutionSchema';
import { geocodeSchema } from '@/schemas/geocodeSchema';
import {
  currentWeatherResponseSchema,
  forecastResponseSchema,
} from '@/schemas/weatherSchema';

export const API_KEY = import.meta.env.VITE_API_KEY;
export const STADIA_API_KEY = import.meta.env.VITE_STADIA_API_KEY;

export class ApiRequestError extends Error {
  readonly endpoint: string;
  readonly status: number;

  constructor(endpoint: string, status: number) {
    super(`${endpoint} request failed (${status})`);
    this.name = 'ApiRequestError';
    this.endpoint = endpoint;
    this.status = status;
  }
}

export class NetworkRequestError extends Error {
  constructor(endpoint: string) {
    super(`${endpoint} network request failed`);
    this.name = 'NetworkRequestError';
  }
}

function apiUrl(path: string, params: Record<string, string> = {}) {
  const url = new URL(`https://api.openweathermap.org${path}`);
  url.searchParams.set('appid', API_KEY);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value),
  );
  return url.toString();
}

async function fetchJson(url: string, endpoint: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new NetworkRequestError(endpoint);
    }
    throw error;
  }

  if (!response.ok) {
    throw new ApiRequestError(endpoint, response.status);
  }
  return response.json();
}

export async function getWeather({ lat, lon }: { lat: number; lon: number }) {
  const [weatherRaw, forecastRaw] = await Promise.all([
    fetchJson(
      apiUrl('/data/2.5/weather', {
        lat: String(lat),
        lon: String(lon),
        units: 'metric',
      }),
      'Current weather',
    ),
    fetchJson(
      apiUrl('/data/2.5/forecast', {
        lat: String(lat),
        lon: String(lon),
        units: 'metric',
      }),
      'Forecast',
    ),
  ]);
  const weatherData = currentWeatherResponseSchema.parse(weatherRaw);
  const forecastData = forecastResponseSchema.parse(forecastRaw);
  return adaptWeatherResponses(weatherData, forecastData);
}

export async function getGeocode(location: string) {
  const data = await fetchJson(
    apiUrl('/geo/1.0/direct', { q: location, limit: '1' }),
    'Geocoding',
  );
  return geocodeSchema.parse(data);
}

export async function getAirPollution({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  const data = await fetchJson(
    apiUrl('/data/2.5/air_pollution', {
      lat: String(lat),
      lon: String(lon),
    }),
    'Air pollution',
  );
  return airPollutionSchema.parse(data);
}
