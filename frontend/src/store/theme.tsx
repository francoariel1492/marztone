import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'marztone-theme';
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(
    () => (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'light',
  );
  const [isDark, setIsDark] = useState<boolean>(() => resolveIsDark(mode));

  const apply = useCallback((next: ThemeMode) => {
    const dark = resolveIsDark(next);
    document.documentElement.classList.toggle('dark', dark);
    setIsDark(dark);
  }, []);

  const setMode = useCallback(
    (next: ThemeMode) => {
      localStorage.setItem(STORAGE_KEY, next);
      setModeState(next);
      apply(next);
    },
    [apply],
  );

  useEffect(() => {
    apply(mode);
    if (mode !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => apply('system');
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [mode, apply]);

  const value = useMemo(() => ({ mode, isDark, setMode }), [mode, isDark, setMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
}
