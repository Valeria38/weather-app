import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MapLegend from './';

describe('MapLegend Component', () => {
  it('renders correct title, unit, and min/max values for temperature map type', () => {
    render(<MapLegend mapType="temp_new" />);

    expect(screen.getByText('Temperature (°C)')).toBeInTheDocument();

    expect(screen.getByText('-65 °C')).toBeInTheDocument();
    expect(screen.getByText('30 °C')).toBeInTheDocument();
  });

  it('renders correct title and scale bounds for clouds map type', () => {
    render(<MapLegend mapType="clouds_new" />);

    expect(screen.getByText('Clouds (%)')).toBeInTheDocument();

    expect(screen.getByText('0 %')).toBeInTheDocument();
    expect(screen.getByText('100 %')).toBeInTheDocument();
  });

  it('applies correct linear-gradient background for precipitation map type', () => {
    render(<MapLegend mapType="precipitation_new" />);

    const gradientBar = document.querySelector('.h-6');
    expect(gradientBar).toBeInTheDocument();
    expect(gradientBar?.getAttribute('style')).toContain(
      'linear-gradient(to right,',
    );
    expect(gradientBar?.getAttribute('style')).toContain(
      'rgba(225, 200, 100, 0)',
    );
    expect(gradientBar?.getAttribute('style')).toContain(
      'rgba(20, 20, 255, 0.9)',
    );
  });
});
