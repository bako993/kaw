/**
 * The app's languages (buttons, labels, parent area). Lessons are always Sorani.
 * Adding a language: add it here, then add its file in `texts/` (typecheck shows what's missing).
 */
export const APP_LANGUAGES = ['ckb', 'nl', 'en'] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: AppLanguage = 'ckb';

/** Each language's name, written in that language (so everyone finds their own). */
export const LANGUAGE_NAMES: Readonly<Record<AppLanguage, string>> = {
  ckb: 'کوردی',
  nl: 'Nederlands',
  en: 'English',
};

const RIGHT_TO_LEFT: ReadonlySet<AppLanguage> = new Set<AppLanguage>(['ckb']);

/** True when the language's TEXT reads right to left. (The screen layout never mirrors.) */
export function isRightToLeft(language: AppLanguage): boolean {
  return RIGHT_TO_LEFT.has(language);
}

export function isAppLanguage(value: unknown): value is AppLanguage {
  return typeof value === 'string' && (APP_LANGUAGES as readonly string[]).includes(value);
}
