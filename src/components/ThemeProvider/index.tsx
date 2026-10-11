import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext } from '@/hooks/useTheme';
type Props = {
  children: ReactNode;
};
export type Theme = 'light' | 'dark';

function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>('dark');
  useEffect(() => {
    const root = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
}

export default ThemeProvider;
