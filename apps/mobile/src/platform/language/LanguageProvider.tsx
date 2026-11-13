import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { LanguageContext, type LanguageState } from './language-context';
import { loadLanguage, saveLanguage } from './language-store';
import type { AppLanguage } from './languages';
import { TEXTS } from './texts';

/**
 * Gives every screen the chosen language. Switching swaps the texts instantly;
 * the layout never mirrors (decided 13 Nov: one fixed layout for every language).
 */
export function LanguageProvider({ children }: { readonly children: ReactNode }) {
  const [language, setLanguage] = useState(loadLanguage);

  const changeLanguage = useCallback((next: AppLanguage) => {
    saveLanguage(next);
    setLanguage(next);
  }, []);

  const state = useMemo<LanguageState>(
    () => ({ language, texts: TEXTS[language], changeLanguage }),
    [language, changeLanguage],
  );

  return <LanguageContext value={state}>{children}</LanguageContext>;
}
