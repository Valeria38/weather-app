import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import MapTypeDropdown from './';

describe('MapTypeDropdown Component', () => {
  const setMapType = vi.fn();
  let user: UserEvent;
  beforeEach(() => {
    user = userEvent.setup();
    render(<MapTypeDropdown mapType={'clouds_new'} setMapType={setMapType} />);
  });

  it('renders current map type value (with capitalization and replaced suffix)', async () => {
    expect(screen.getByText('clouds')).toBeInTheDocument();

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    const option = await screen.findByRole('option', { name: /clouds/i });
    expect(option).toHaveClass('capitalize');
  });

  it('calls setMapType when a new item is selected', async () => {
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    const option = await screen.findByRole('option', { name: /wind/i });
    await user.click(option);

    expect(setMapType).toHaveBeenCalledTimes(1);
    expect(setMapType).toHaveBeenCalledWith('wind_new');
  });
});
