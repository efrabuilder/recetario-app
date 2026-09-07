'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { interpolate, TRANSLATIONS, type Language } from './translations';

const STORAGE_KEY = 'recetario-language';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'es' || stored === 'en') {
      setLanguageState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(next: Language): void {
    setLanguageState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  function t(key: string, vars?: Record<string, string | number>): string {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return interpolate(entry[language], vars);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe usarse dentro de <LanguageProvider>');
  }
  return context;
}
