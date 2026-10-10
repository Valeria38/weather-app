import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Map from './';

vi.mock('leaflet', () => ({
    default: {
        icon: vi.fn(),
        marker: vi.fn(),
        latLng: vi.fn((lat, lng) => [lat, lng]),
    },
}));

vi.mock('react-leaflet', () => ({
    MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
    TileLayer: ({ url, opacity }: { url: string; opacity?: number }) => (
        <div
            data-testid="tile-layer"
            data-url={url}
            {...(opacity !== undefined && { 'data-opacity': opacity })}
        />
    ),
    Marker: ({ position }: { position: [number, number] }) => (
        <div data-testid="marker" data-position={JSON.stringify(position)} />
    ),
    useMap: () => ({
        panTo: vi.fn(),
        on: vi.fn(),
    }),
}));

vi.mock('@/api', () => ({
    API_KEY: 'test-openweather-key',
    STADIA_API_KEY: 'test-stadia-key',
}));

describe('Map Component', () => {
    const mockCoords = { lat: 50.45, lon: 30.52 };
    const mockOnMapClick = vi.fn();

    it('renders map container, markers, and tile layers with correct URLs', () => {
        render(
            <Map
                mapType="temp_new"
                coords={mockCoords}
                onMapClick={mockOnMapClick}
            />
        );

        expect(screen.getByTestId('map-container')).toBeInTheDocument();

        const marker = screen.getByTestId('marker');
        expect(marker).toHaveAttribute('data-position', JSON.stringify([mockCoords.lat, mockCoords.lon]));

        const tileLayers = screen.getAllByTestId('tile-layer');
        expect(tileLayers).toHaveLength(2);
        expect(tileLayers[0]).toHaveAttribute('data-url', expect.stringContaining('tiles.stadiamaps.com'));
        expect(tileLayers[1]).toHaveAttribute('data-url', expect.stringContaining('tile.openweathermap.org/map/temp_new'));

        expect(tileLayers[0]).not.toHaveAttribute('data-opacity');
        expect(tileLayers[1]).toHaveAttribute('data-opacity', '0.5');
    });
});