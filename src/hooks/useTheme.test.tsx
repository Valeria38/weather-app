import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ThemeProvider from '@/components/ThemeProvider';

import { useTheme } from './useTheme';

describe('useTheme Hook', () => {
  it('throws an error when used outside of ThemeProvider', () => {
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = consoleError;
  });

  it('returns theme and toggleTheme when used within ThemeProvider', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe('dark');
    expect(typeof result.current.toggleTheme).toBe('function');
  });
});
