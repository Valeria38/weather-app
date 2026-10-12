import Moon from '@/assets/moon.svg?react';
import Sun from '@/assets/sun.svg?react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex items-center gap-2">
      <Sun className="size-5 " />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Moon className="size-5 " />
    </div>
  );
}

export default ThemeToggle;
