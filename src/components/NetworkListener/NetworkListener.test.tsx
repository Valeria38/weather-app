import { render } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import NetworkListener from './';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('NetworkListener Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing (null)', () => {
    const { container } = render(<NetworkListener />);
    expect(container.firstChild).toBeNull();
  });

  it('should trigger toast.error when offline event fires', () => {
    render(<NetworkListener />);

    window.dispatchEvent(new Event('offline'));

    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(
      "You're offline",
      expect.objectContaining({
        description: 'A saved local version is being used.',
      }),
    );
  });

  it('should trigger toast.success when online event fires', () => {
    render(<NetworkListener />);

    window.dispatchEvent(new Event('online'));

    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(
      'Internet restored!',
      expect.objectContaining({
        description: 'Data automatically synchronized.',
      }),
    );
  });

  it('should remove event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<NetworkListener />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'online',
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'offline',
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });
});
