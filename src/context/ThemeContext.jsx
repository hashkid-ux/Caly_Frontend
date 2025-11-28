import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme-preference');
    if (saved) return saved === 'dark';

    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save preference
    localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');

    // Update HTML class
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const theme = {
    isDark,
    toggleTheme,
    colors: {
      bg: {
        primary: isDark ? '#111827' : '#ffffff',
        secondary: isDark ? '#1F2937' : '#F9FAFB',
        tertiary: isDark ? '#374151' : '#F3F4F6',
      },
      text: {
        primary: isDark ? '#F3F4F6' : '#111827',
        secondary: isDark ? '#D1D5DB' : '#6B7280',
        tertiary: isDark ? '#9CA3AF' : '#9CA3AF',
      },
      border: isDark ? '#374151' : '#E5E7EB',
      hover: isDark ? '#1F2937' : '#F3F4F6',
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
