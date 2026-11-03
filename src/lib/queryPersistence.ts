import type { Query } from '@tanstack/react-query';
import type { Coords } from 'types';

export const PERSISTED_QUERY_MAX_AGE = 24 * 60 * 60 * 1000;

const LAST_LOCATION_STORAGE_KEY = 'weather-app:last-location';
const LAST_MAP_TYPE_STORAGE_KEY = 'weather-app:last-map-type';
export const MAP_TYPES = [
  'clouds_new',
  'precipitation_new',
  'pressure_new',
  'wind_new',
  'temp_new',
] as const;
export type MapType = (typeof MAP_TYPES)[number];

export type LastLocation = {
  name: string;
  coords: Coords;
};

export function readLastLocation(): LastLocation | null {
  try {
    const storedValue = localStorage.getItem(LAST_LOCATION_STORAGE_KEY);
    if (!storedValue) return null;

    const value: unknown = JSON.parse(storedValue);
    return isLastLocation(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveLastLocation(name: string, coords: Coords) {
  try {
    localStorage.setItem(
      LAST_LOCATION_STORAGE_KEY,
      JSON.stringify({ name, coords }),
    );
  } catch {
    // Persistence is optional when storage is unavailable or full.
  }
}

export function readLastMapType(): MapType {
  try {
    const storedMapType = localStorage.getItem(LAST_MAP_TYPE_STORAGE_KEY);
    return (
      MAP_TYPES.find((mapType) => mapType === storedMapType) ?? MAP_TYPES[0]
    );
  } catch {
    return MAP_TYPES[0];
  }
}

export function saveLastMapType(mapType: string) {
  if (!MAP_TYPES.some((validMapType) => validMapType === mapType)) return;

  try {
    localStorage.setItem(LAST_MAP_TYPE_STORAGE_KEY, mapType);
  } catch {
    // Persistence is optional when storage is unavailable or full.
  }
}

export function shouldPersistWeatherQuery(query: Query): boolean {
  if (query.state.data === undefined) return false;

  const lastLocation = readLastLocation();
  if (!lastLocation) return false;

  const [resource, first, second] = query.queryKey;
  if (resource === 'weather') {
    return (
      first === lastLocation.coords.lat && second === lastLocation.coords.lon
    );
  }

  if (resource === 'pollution' && isCoords(first)) {
    return (
      first.lat === lastLocation.coords.lat &&
      first.lon === lastLocation.coords.lon
    );
  }

  return false;
}

function isLastLocation(value: unknown): value is LastLocation {
  if (typeof value !== 'object' || value === null || !('coords' in value)) {
    return false;
  }

  return (
    'name' in value && typeof value.name === 'string' && isCoords(value.coords)
  );
}

export function isCoords(value: unknown): value is Coords {
  if (typeof value !== 'object' || value === null) return false;
  if (!('lat' in value) || !('lon' in value)) return false;

  return (
    typeof value.lat === 'number' &&
    Number.isFinite(value.lat) &&
    typeof value.lon === 'number' &&
    Number.isFinite(value.lon)
  );
}
