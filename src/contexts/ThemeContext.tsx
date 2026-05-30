import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Light theme colors based on DESIGN.md
export const lightTheme = {
  primary: '#e31e24',
  onPrimary: '#ffffff',
  primaryContainer: '#ffdad6',
  onPrimaryContainer: '#410002',
  secondary: '#0f172a',
  onSecondary: '#ffffff',
  secondaryContainer: '#dae2fd',
  onSecondaryContainer: '#131b2e',
  tertiary: '#475569',
  onTertiary: '#ffffff',
  tertiaryContainer: '#d5e3fc',
  onTertiaryContainer: '#0d1c2e',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  background: '#f8fafc',
  onBackground: '#191c1e',
  surface: '#f7f9fb',
  onSurface: '#191c1e',
  surfaceVariant: '#e0e3e5',
  onSurfaceVariant: '#5d3f3c',
  outline: '#926f6b',
  outlineVariant: '#e7bdb8',
  inverseSurface: '#2d3133',
  inverseOnSurface: '#eff1f3',
  inversePrimary: '#ffb4ab',
  surfaceTint: '#c00014',
};

// Dark theme colors (current existing colors)
export const darkTheme = {
  primary: '#015EB0',
  onPrimary: '#ffffff',
  primaryContainer: '#002E5E',
  onPrimaryContainer: '#ffffff',
  secondary: '#3EA32A',
  onSecondary: '#ffffff',
  secondaryContainer: '#1a1a2e',
  onSecondaryContainer: '#ffffff',
  tertiary: '#475569',
  onTertiary: '#ffffff',
  tertiaryContainer: '#1a1a2e',
  onTertiaryContainer: '#ffffff',
  error: '#ef5350',
  onError: '#ffffff',
  errorContainer: '#1a1a2e',
  onErrorContainer: '#ef5350',
  background: '#0A0E27',
  onBackground: '#FFFFFF',
  surface: '#1a1a2e',
  onSurface: '#FFFFFF',
  surfaceVariant: '#121212',
  onSurfaceVariant: '#e0e0e0',
  outline: '#015EB0',
  outlineVariant: '#015EB0',
  inverseSurface: '#FFFFFF',
  inverseOnSurface: '#0A0E27',
  inversePrimary: '#3EA32A',
  surfaceTint: '#015EB0',
};

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  theme: typeof lightTheme | typeof darkTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    // Default to light mode
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
