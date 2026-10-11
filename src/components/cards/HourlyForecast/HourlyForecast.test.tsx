import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { describe, it, expect, vi } from 'vitest';
import HourlyForecast from './';
import { getWeather } from '@/api';
import type { WeatherData } from '@/schemas/weatherSchema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/api', () => ({
    getWeather: vi.fn(),
}));

describe('HourlyForecast Component', () => {
    let queryClient: QueryClient;

    const mockWeatherData = {
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
        vi.mocked(getWeather).mockResolvedValueOnce(mockWeatherData as WeatherData);

        render(
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<div>Loading...</div>}>
                    <HourlyForecast coords={{ lat: 50.45, lon: 30.52 }} />
                </Suspense>
            </QueryClientProvider>
        );

        expect(await screen.findByText('Hourly forecast(48 hours)')).toBeInTheDocument();
        expect(await screen.findByText('21 °C')).toBeInTheDocument();
    });
});