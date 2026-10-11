import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { describe, it, expect, vi } from 'vitest';
import CurrentWeather from './';
import { getWeather } from '../../../api';
import type { WeatherData } from '@/schemas/weatherSchema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../../../api', () => ({
    getWeather: vi.fn(),
}));

describe('CurrentWeather Component', () => {
    let queryClient: QueryClient;

    const mockWeatherData = {
        timezone: 'UTC',
        current: {
            temp: 22.6,
            feels_like: 21,
            humidity: 45,
            wind_speed: 5.5,
            dt: 1718000000,
            weather: [
                {
                    icon: '01d',
                    description: 'clear sky',
                },
            ],
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

    it('renders current weather details and formats temperature correctly', async () => {
        vi.mocked(getWeather).mockResolvedValueOnce(mockWeatherData as WeatherData);

        render(
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<div>Loading...</div>}>
                    <CurrentWeather coords={{ lat: 50.45, lon: 30.52 }} />
                </Suspense>
            </QueryClientProvider>
        );

        expect(await screen.findByText('Current Weather')).toBeInTheDocument();
        expect(await screen.findByText('23 °C')).toBeInTheDocument();
        expect(screen.getByText('clear sky')).toBeInTheDocument();
        expect(screen.getByText('21 °C')).toBeInTheDocument();
        expect(screen.getByText('45 %')).toBeInTheDocument();
        expect(screen.getByText('5.5 mph')).toBeInTheDocument();
    });
});