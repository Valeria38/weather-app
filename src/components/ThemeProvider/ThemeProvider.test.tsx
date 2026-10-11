import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { useTheme } from '@/hooks/useTheme';

import ThemeProvider from './';

const TestConsumer = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeProvider Component', () => {
  beforeEach(() => {
    document.body.className = '';
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );
  });

  it('initializes with dark theme and adds "dark" class to document.body', () => {
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(document.body).toHaveClass('dark');
  });

  it('toggles theme from dark to light and updates document.body class', async () => {
    const user = userEvent.setup();

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(document.body).toHaveClass('dark');

    await user.click(screen.getByRole('button', { name: /toggle/i }));

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    expect(document.body).not.toHaveClass('dark');
  });
});
