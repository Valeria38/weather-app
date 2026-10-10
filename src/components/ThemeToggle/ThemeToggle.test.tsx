import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeToggle from '../ThemeToggle';
import { useTheme } from '@/hooks/useTheme';

vi.mock('@/hooks/useTheme', () => ({
    useTheme: vi.fn(),
}));

vi.mock('../../assets/sun.svg?react', () => ({
    default: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="sun-icon" {...props} />,
}));

vi.mock('../../assets/moon.svg?react', () => ({
    default: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="moon-icon" {...props} />,
}));

describe('ThemeToggle Component', () => {
    const mockToggleTheme = vi.fn();
    let user: UserEvent;

    beforeEach(() => {
        vi.clearAllMocks();
        user = userEvent.setup();
    });

    const setup = (theme: 'light' | 'dark') => {
        vi.mocked(useTheme).mockReturnValue({
            theme,
            toggleTheme: mockToggleTheme,
        });
        return render(<ThemeToggle />);
    };

    it('renders sun, moon icons and switch correctly in light mode', () => {
        setup('light');

        expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
        expect(screen.getByTestId('moon-icon')).toBeInTheDocument();

        const switchElement = screen.getByRole('switch');
        expect(switchElement).toBeInTheDocument();
        expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });

    it('renders switch with checked=true when theme is dark', () => {
        setup('dark');

        const switchElement = screen.getByRole('switch');
        expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('calls toggleTheme when switch is clicked', async () => {
        setup('light');

        const switchElement = screen.getByRole('switch');
        expect(switchElement).toBeInTheDocument();
        expect(switchElement).toHaveAttribute('aria-checked', 'false');

        await user.click(switchElement);
        expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });
});