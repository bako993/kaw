import type { AppLanguage } from './languages';

export type TextValues = Readonly<Record<string, string | number>>;

const PLACEHOLDER = /\{(\w+)\}/g;
const KURDISH_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** A number written the way the language writes it: ٣ in Kurdish, 3 in Dutch and English. */
export function formatNumber(value: number, language: AppLanguage): string {
  const written = String(value);
  if (language !== 'ckb') return written;
  return written.replace(/\d/g, (digit) => KURDISH_DIGITS[Number(digit)] ?? digit);
}

/**
 * Fills `{name}` marks with values (numbers in the language's own digits).
 * A mark without a value stays visible instead of crashing.
 */
export function formatText(text: string, values: TextValues, language: AppLanguage): string {
  return text.replace(PLACEHOLDER, (mark, name: string) => {
    const value = values[name];
    if (value === undefined) return mark;
    return typeof value === 'number' ? formatNumber(value, language) : value;
  });
}

/** The `{name}` marks a text uses, e.g. `['current', 'total']`. */
export function placeholdersOf(text: string): string[] {
  return [...text.matchAll(PLACEHOLDER)].map((match) => match[1] ?? '');
}
