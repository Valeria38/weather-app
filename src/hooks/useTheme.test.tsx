import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTheme } from './useTheme';
import ThemeProvider from '@/components/ThemeProvider';

describe('useTheme Hook', () => {
    it('throws an error when used outside of ThemeProvider', () => {
        const consoleError = console.error;
        console.error = () => { };

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