import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { getWeather } from '@/api';
import type { WeatherData } from '@/schemas/weatherSchema';

import AdditionalInfo from './';

vi.mock('@/api', () => ({
  getWeather: vi.fn(),
}));

describe('AdditionalInfo Component', () => {
  let queryClient: QueryClient;
  const mockWeatherData = {
    timezone_offset: 0,
    current: {
      clouds: 20,
      wind_deg: 180,
      pressure: 1013,
      sunrise: 1718000000,
      sunset: 1718050000,
    },
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  it('renders weather metrics and formats values correctly', async () => {
    vi.mocked(getWeather).mockResolvedValueOnce(
      mockWeatherData as unknown as WeatherData,
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <AdditionalInfo coords={{ lat: 50.45, lon: 30.52 }} />
        </Suspense>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText('Additional weather info'),
    ).toBeInTheDocument();

    expect(await screen.findByText('20')).toBeInTheDocument(); // Cloudiness
    expect(await screen.findByText('1013')).toBeInTheDocument(); // Pressure
    expect(screen.getByText('Sunrise')).toBeInTheDocument();
    expect(screen.getByText('Sunset')).toBeInTheDocument();
  });

  it('renders all weather icons and formats wind direction rotation', async () => {
    vi.mocked(getWeather).mockResolvedValueOnce(
      mockWeatherData as unknown as WeatherData,
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <AdditionalInfo coords={{ lat: 50.45, lon: 30.52 }} />
        </Suspense>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('1013')).toBeInTheDocument();
    const windArrow = screen.getByTestId('icon-wind-arrow');
    expect(windArrow).toHaveStyle({ transform: 'rotate(180deg)' });
  });
});
