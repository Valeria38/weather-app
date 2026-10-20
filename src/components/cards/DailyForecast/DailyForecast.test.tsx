import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { getWeather } from '@/api';
import type { WeatherData } from '@/schemas/weatherSchema';

import DailyForecast from './';

vi.mock('@/api', () => ({
  getWeather: vi.fn(),
}));

describe('DailyForecast Component', () => {
  let queryClient: QueryClient;

  const mockWeatherData = {
    daily: [
      {
        date: '2024-06-10',
        temp: {
          day: 24.5,
          min: 16.2,
          max: 27.8,
        },
        weather: [
          {
            icon: '02d',
            description: 'few clouds',
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

  it('renders daily forecast list and formats temperatures correctly', async () => {
    vi.mocked(getWeather).mockResolvedValueOnce(
      mockWeatherData as unknown as WeatherData,
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <DailyForecast coords={{ lat: 50.45, lon: 30.52 }} />
        </Suspense>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Daily forecast')).toBeInTheDocument();
    expect(await screen.findByText('25 °C')).toBeInTheDocument();
    expect(screen.getByText('16 °C')).toBeInTheDocument();
    expect(screen.getByText('28 °C')).toBeInTheDocument();
  });
});
