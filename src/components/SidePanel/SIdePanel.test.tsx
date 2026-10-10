import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SidePanel from './';
import { getAirPollution } from '@/api';
import type { AirPollutionResponse } from '@/schemas/airPollutionSchema';
import { TooltipProvider } from '../ui/tooltip';

vi.mock('@/api', () => ({
    getAirPollution: vi.fn(),
}));

vi.mock('../../assets/information.svg?react', () => ({
    default: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="info-icon" {...props} />,
}));

vi.mock('../../assets/chevronRight.svg?react', () => ({
    default: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="chevron-icon" {...props} />,
}));

const mockAirPollutionData: AirPollutionResponse = {
    list: [
        {
            main: { aqi: 2 },
            components: {
                co: 139.93,
                nh3: 0.61,
                no: 0.18,
                no2: 1,
                o3: 94.59,
                pm10: 5.57,
                pm2_5: 5.01,
                so2: 4.26
            },
        },
    ],
} as AirPollutionResponse;

describe('SidePanel Component', () => {
    let queryClient: QueryClient;
    const mockSetIsSidePanelOpen = vi.fn();
    const mockCoords = { lat: 50.45, lon: 30.52 };

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

    const renderSidePanel = (overrides = {}) => {
        const defaultProps = {
            coords: mockCoords,
            isSidePanelOpen: true,
            setIsSidePanelOpen: mockSetIsSidePanelOpen,
            ...overrides,
        };

        return render(
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <SidePanel {...defaultProps} />
                </TooltipProvider>
            </QueryClientProvider>
        );
    };

    it('renders air pollution data successfully after suspense resolves', async () => {
        vi.mocked(getAirPollution).mockResolvedValueOnce(mockAirPollutionData);

        renderSidePanel();

        expect(await screen.findByText('Air pollution')).toBeInTheDocument();
        expect(await screen.findByText('2')).toBeInTheDocument();
        expect(await screen.findByText('pm2_5')).toBeInTheDocument();
        expect(await screen.findByText('5.01')).toBeInTheDocument();
    });

    it('calls setIsSidePanelOpen(false) when close button is clicked', async () => {
        vi.mocked(getAirPollution).mockResolvedValueOnce(mockAirPollutionData);

        const user = userEvent.setup();
        renderSidePanel();

        await screen.findByText('Air pollution');

        const closeButton = screen.getByRole('button');
        await user.click(closeButton);

        expect(mockSetIsSidePanelOpen).toHaveBeenCalledTimes(1);
        expect(mockSetIsSidePanelOpen).toHaveBeenCalledWith(false);
    });
});