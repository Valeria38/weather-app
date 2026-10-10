import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileHeader from './';
import type { Mock } from 'vitest';

vi.mock('../ThemeToggle', () => ({
    default: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

vi.mock('../../assets/burger.svg?react', () => ({
    default: (props: React.SVGProps<SVGSVGElement>) => (
        <svg data-testid="burger-icon" {...props} />
    ),
}));

describe('MobileHeader Component', () => {
    let setIsSidePanelOpen: Mock;

    beforeEach(() => {
        setIsSidePanelOpen = vi.fn();
        render(<MobileHeader setIsSidePanelOpen={setIsSidePanelOpen} />);
    });

    it('renders header that is visible only for mobile devices', () => {
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
        expect(header).toHaveClass('sm:hidden');

    })

    it('renders ThemeToggle and burger button correctly', () => {
        expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();

        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByTestId('burger-icon')).toBeInTheDocument();
    });

    it('calls setIsSidePanelOpen with true when burger button is clicked', async () => {
        const button = screen.getByRole('button');

        const user = userEvent.setup();
        await user.click(button);

        expect(setIsSidePanelOpen).toHaveBeenCalledTimes(1);
        expect(setIsSidePanelOpen).toHaveBeenCalledWith(true);
    });
});