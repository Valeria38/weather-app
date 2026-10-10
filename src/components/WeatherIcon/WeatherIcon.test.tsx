import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WeatherIcon from './';

describe('WeatherIcon Component', () => {
    it('renders correctly with the expected src and default classes', () => {
        render(<WeatherIcon src="10d" />);

        const imgElement = screen.getByRole('img', { name: /weather icon/i });

        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute(
            'src',
            'https://openweathermap.org/img/wn/10d.png'
        );
        expect(imgElement).toHaveClass('size-8');
    });

    it('merges custom className with default classes', () => {
        render(<WeatherIcon src="01n" className="custom-class size-12" />);

        const imgElement = screen.getByRole('img', { name: /weather icon/i });

        expect(imgElement).toHaveAttribute(
            'src',
            'https://openweathermap.org/img/wn/01n.png'
        );
        expect(imgElement).toHaveClass('custom-class');
    });
});