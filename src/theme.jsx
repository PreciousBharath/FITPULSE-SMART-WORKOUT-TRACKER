import { createContext, useContext, useEffect, useState } from 'react';
import { load, save } from './storage.js';

export const THEMES = ['light', 'dark', 'midnight', 'sepia', 'system'];
export const ACCENTS = {
  violet: '#7c3aed',
  ocean: '#0ea5e9',
  emerald: '#10b981',
  sunset: '#f97316',
  rose: '#e11d48',
  gold: '#d4a017',
};

const ThemeCtx = createContext(null);
const DEFAULTS = { theme: 'system', accent: null, radius: 14, compact: false, reduceMotion: false };

export function ThemeProvider({ children, defaultAccent = 'violet' }) {
  const [prefs, setPrefs] = useState(() => ({ ...DEFAULTS, accent: defaultAccent, ...load('prefs', {}) }));

  useEffect(() => {
    save('prefs', prefs);
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const t = prefs.theme === 'system' ? (mq.matches ? 'dark' : 'light') : prefs.theme;
      root.dataset.theme = t;
    };
    apply();
    root.style.setProperty('--accent', ACCENTS[prefs.accent] || ACCENTS[defaultAccent]);
    root.style.setProperty('--radius', prefs.radius + 'px');
    root.classList.toggle('compact', prefs.compact);
    root.classList.toggle('reduce-motion', prefs.reduceMotion);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [prefs, defaultAccent]);

  const set = (patch) => setPrefs((p) => ({ ...p, ...patch }));
  const cycle = () => set({ theme: THEMES[(THEMES.indexOf(prefs.theme) + 1) % THEMES.length] });
  const reset = () => setPrefs({ ...DEFAULTS, accent: defaultAccent });

  return <ThemeCtx.Provider value={{ prefs, set, cycle, reset }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
