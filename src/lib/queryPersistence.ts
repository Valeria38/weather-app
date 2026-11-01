import type { Query } from '@tanstack/react-query';
import type { Coords } from 'types';

export const PERSISTED_QUERY_MAX_AGE = 24 * 60 * 60 * 1000;

const LAST_LOCATION_STORAGE_KEY = 'weather-app:last-location';

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

export function shouldPersistWeatherQuery(query: Query): boolean {
  if (query.state.status !== 'success') return false;

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
