import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { getWeather } from '@/api';
import type { WeatherData } from '@/schemas/weatherSchema';

import HourlyForecast from './';

vi.mock('@/api', () => ({
  getWeather: vi.fn(),
}));

describe('HourlyForecast Component', () => {
  let queryClient: QueryClient;

  const mockWeatherData = {
    timezone_offset: 0,
    hourly: [
      {
        dt: 1718000000,
        temp: 21.4,
        weather: [
          {
            icon: '01d',
            description: 'clear sky',
          },
        ],
      },
    ],
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

  it('renders hourly forecast items and formats temperature correctly', async () => {
    vi.mocked(getWeather).mockResolvedValueOnce(
      mockWeatherData as unknown as WeatherData,
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <HourlyForecast coords={{ lat: 50.45, lon: 30.52 }} />
        </Suspense>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText('5-day forecast (3-hour intervals)'),
    ).toBeInTheDocument();
    expect(await screen.findByText('21 °C')).toBeInTheDocument();
  });
});
