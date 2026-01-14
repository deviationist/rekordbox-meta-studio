import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const isServer = typeof window === 'undefined';

const prefersDark = () =>
  !isServer && window.matchMedia('(prefers-color-scheme: dark)').matches;

const setCookie = (name: string, value: string, days = 365) => {
  if (isServer) return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = (appearance: Appearance) => {
  const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const getMediaQuery = () =>
  isServer ? null : window.matchMedia('(prefers-color-scheme: dark)');

const handleSystemThemeChange = () => {
  const appearance = (localStorage.getItem('appearance') as Appearance) || 'system';
  applyTheme(appearance);
};

export function initializeTheme() {
  const appearance = (localStorage.getItem('appearance') as Appearance) || 'system';
  applyTheme(appearance);
  getMediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
  const getInitialAppearance = () =>
    (localStorage.getItem('appearance') as Appearance) || 'system';

  const [appearance, setAppearance] = useState<Appearance>(getInitialAppearance);

  const updateAppearance = useCallback((mode: Appearance) => {
    setAppearance(mode);
    localStorage.setItem('appearance', mode);
    setCookie('appearance', mode);
    applyTheme(mode);
  }, []);

  useEffect(() => {
    // Apply theme on mount based on initial state
    applyTheme(appearance);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'appearance' && e.newValue) {
        const newAppearance = e.newValue as Appearance;
        setAppearance(newAppearance);
        applyTheme(newAppearance);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      getMediaQuery()?.removeEventListener('change', handleSystemThemeChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [appearance]);

  return { appearance, updateAppearance } as const;
}

export function AppearanceSync() {
  useAppearance();
  return null;
}
