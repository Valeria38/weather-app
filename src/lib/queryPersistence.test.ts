import { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  readLastLocation,
  saveLastLocation,
  shouldPersistWeatherQuery,
} from './queryPersistence';

describe('query persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and reads the last selected location', () => {
    saveLastLocation('Tokyo', { lat: 35.6762, lon: 139.6503 });

    expect(readLastLocation()).toEqual({
      name: 'Tokyo',
      coords: { lat: 35.6762, lon: 139.6503 },
    });
  });

  it('persists weather and pollution only for the last location', () => {
    saveLastLocation('Tokyo', { lat: 35.6762, lon: 139.6503 });
    const queryClient = new QueryClient();
    const weatherKey = ['weather', 35.6762, 139.6503];
    const pollutionKey = ['pollution', { lat: 35.6762, lon: 139.6503 }];
    const oldWeatherKey = ['weather', 40.7989, -81.3784];
    const geocodeKey = ['geocode', 'Tokyo'];

    queryClient.setQueryData(weatherKey, { temp: 20 });
    queryClient.setQueryData(pollutionKey, { aqi: 1 });
    queryClient.setQueryData(oldWeatherKey, { temp: 18 });
    queryClient.setQueryData(geocodeKey, [{ lat: 35.6762, lon: 139.6503 }]);

    const cache = queryClient.getQueryCache();
    expect(
      shouldPersistWeatherQuery(cache.find({ queryKey: weatherKey })!),
    ).toBe(true);
    expect(
      shouldPersistWeatherQuery(cache.find({ queryKey: pollutionKey })!),
    ).toBe(true);
    expect(
      shouldPersistWeatherQuery(cache.find({ queryKey: oldWeatherKey })!),
    ).toBe(false);
    expect(
      shouldPersistWeatherQuery(cache.find({ queryKey: geocodeKey })!),
    ).toBe(false);
  });
});
