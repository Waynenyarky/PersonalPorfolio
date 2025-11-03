import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../theme/useTheme';

type Props = {
  className?: string;
  size?: number;
};

export default function ThemeToggle({ className, size = 20 }: Props) {
  const { isDark, toggleTheme } = useTheme();
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  const base = 'w-10 h-10 p-2.5 flex items-center justify-center rounded-lg transition-colors duration-300 group';
  const hoverBg = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200';
  const buttonClass = className ? `${className} ${hoverBg} group` : `${base} ${hoverBg}`;
  return (
    <button
      onClick={toggleTheme}
      className={buttonClass}
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <Sun size={size} className="transition-colors duration-200 text-orange-500 group-hover:text-orange-400" />
      ) : (
        <Moon size={size} className="transition-colors duration-200 text-black group-hover:text-white" />
      )}
    </button>
  );
}


