'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface ThemeContextType {
  darkMode: boolean | null;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export default function ThemeProvider({ children }: PropsWithChildren) {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    if (darkMode === null) {
      return;
    }
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  useEffect(() => {
    const loadTheme = localStorage.getItem('theme');
    if (loadTheme === 'dark') {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  const value = useMemo(
    () => ({ darkMode, toggleDarkMode }),
    [darkMode, toggleDarkMode]
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme을 범위 밖에서 사용했습니다.');
  }
  return context;
};
