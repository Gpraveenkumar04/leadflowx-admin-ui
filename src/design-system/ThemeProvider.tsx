import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggle: () => void;
  density: 'comfortable' | 'compact';
  toggleDensity: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      // Prefer new key, fallback to legacy 'theme'
      const stored = (localStorage.getItem('lfx-theme') || localStorage.getItem('theme')) as 'light' | 'dark' | null;
      return stored || 'light';
    }
    return 'light';
  });
  const [density, setDensity] = useState<'comfortable' | 'compact'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lfx-density') as 'comfortable' | 'compact' | null;
      return stored || 'comfortable';
    }
    return 'comfortable';
  });

  useEffect(() => {
    const root = window.document.documentElement;
  // Normalize classes: ensure only correct theme class present
  root.classList.remove(theme === 'light' ? 'dark' : 'light');
  root.classList.add(theme);
  // Persist to both new and legacy keys so existing layout toggles remain in sync
  localStorage.setItem('lfx-theme', theme);
  localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (density === 'compact') root.setAttribute('data-density', 'compact'); else root.removeAttribute('data-density');
    localStorage.setItem('lfx-density', density);
  }, [density]);

  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  const toggleDensity = () => setDensity(d => (d === 'comfortable' ? 'compact' : 'comfortable'));

  return (
  <ThemeContext.Provider value={{ theme, toggle, density, toggleDensity }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
