import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitcher = ({ compact = false }) => {
  const { isDark, toggleTheme } = useTheme();

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
          !isDark
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Sun className="w-4 h-4" />
        Light
      </button>
      <button
        onClick={toggleTheme}
        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
          isDark
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Moon className="w-4 h-4" />
        Dark
      </button>
    </div>
  );
};

export default ThemeSwitcher;
