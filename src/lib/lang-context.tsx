'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations, type Lang } from './translations';

type AnyTranslation = typeof translations[Lang];

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: AnyTranslation;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  tr: translations.en as AnyTranslation,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = (localStorage.getItem('ega-lang') as Lang) || 'en';
    setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('ega-lang', l);
  }

  return (
    <LangContext.Provider value={{ lang, setLang, tr: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
