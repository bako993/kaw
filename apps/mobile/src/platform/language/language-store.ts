import { Storage } from 'expo-sqlite/kv-store';

import { DEFAULT_LANGUAGE, isAppLanguage, type AppLanguage } from './languages';

const LANGUAGE_KEY = 'app.language';

/** The language chosen on this phone, or Kurdish when nothing (or something odd) is saved. */
export function loadLanguage(): AppLanguage {
  const saved = Storage.getItemSync(LANGUAGE_KEY);
  return isAppLanguage(saved) ? saved : DEFAULT_LANGUAGE;
}

export function saveLanguage(language: AppLanguage): void {
  Storage.setItemSync(LANGUAGE_KEY, language);
}
