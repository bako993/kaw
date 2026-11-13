import { createContext, useContext } from 'react';

import type { AppLanguage } from './languages';
import type { Texts } from './texts';

export interface LanguageState {
  readonly language: AppLanguage;
  readonly texts: Texts;
  /** Saves the choice and swaps every text on screen. */
  readonly changeLanguage: (language: AppLanguage) => void;
}

export const LanguageContext = createContext<LanguageState | null>(null);

export function useLanguage(): LanguageState {
  const state = useContext(LanguageContext);
  if (!state) throw new Error('useLanguage must be used inside <LanguageProvider>.');
  return state;
}

/** The app's texts in the chosen language. */
export function useTexts(): Texts {
  return useLanguage().texts;
}
