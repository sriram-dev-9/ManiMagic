"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Theme definitions
export const themes = {
  dark: {
    background: '#212129',
    border: '#4c5265',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    active: '#60a5fa',
    activeBg: 'rgba(96, 165, 250, 0.1)',
    activeBorder: 'rgba(96, 165, 250, 0.3)',
    hoverBg: 'rgba(255, 255, 255, 0.05)',
    mobileBg: '#323949',
    logoText: 'white',
    cardBg: '#2a2d3a',
    inputBg: '#1a1d2a',
    buttonBg: '#3a3f55',
    buttonHover: '#4a4f65',
  },
  light: {
    background: '#ece6e2',
    border: '#dee2e6',
    text: '#343434',
    textSecondary: '#6c757d',
    textMuted: '#6c757d',
    active: '#454866',
    activeBg: 'rgba(69, 72, 102, 0.1)',
    activeBorder: 'rgba(69, 72, 102, 0.3)',
    hoverBg: 'rgba(0, 0, 0, 0.05)',
    mobileBg: '#ffffff',
    logoText: '#343434',
    cardBg: '#ffffff',
    inputBg: '#f8f9fa',
    buttonBg: '#e9ecef',
    buttonHover: '#dee2e6',
  },
};

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  currentTheme: typeof themes.dark;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('manimagic-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('manimagic-theme', newTheme);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
  };

  const currentTheme = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}