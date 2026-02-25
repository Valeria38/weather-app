import { Switch } from './ui/switch';
import Sun from '../assets/sun.svg?react';
import Moon from '../assets/moon.svg?react';
import { useTheme } from '@/hooks/useTheme';

type Props = {};

function ThemeToggle({}: Props) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex items-center gap-2">
      <Sun className="size-5 " />
      <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
      <Moon className="size-5 " />
    </div>
  );
}

export default ThemeToggle;
