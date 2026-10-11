import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import LocationDropdown from './';

describe('LocationDropdown Component', () => {
  const setLocation = vi.fn();
  const setup = (location: string) => {
    render(<LocationDropdown location={location} setLocation={setLocation} />);
  };

  it('renders current location value', () => {
    setup('Tokyo');

    expect(screen.getByText('Tokyo')).toBeInTheDocument();
  });

  it('calls setLocation when a new item is selected', async () => {
    const user = userEvent.setup();
    setup('London');

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    const option = await screen.findByRole('option', { name: /tokyo/i });
    await user.click(option);

    expect(setLocation).toHaveBeenCalledTimes(1);
    expect(setLocation).toHaveBeenCalledWith('Tokyo');
  });
});
