/** The two age groups; each has its own map and learns its own share of a topic's words. */
export type AgeGroup = '3-5' | '6-10';

/** The app languages a word's meaning is shown in (Kurdish needs none: it is the word itself). */
export type MeaningLanguage = 'en' | 'nl';

/**
 * One word, written once. Its ID is its key in the word bank; its picture and its
 * sound slot (`word.<id>`) find it by that same ID.
 */
export interface Word {
  readonly kurdish: string;
  /** How it sounds, in Latin letters, for parents (e.g. "supas"). */
  readonly soundsLike: string;
  readonly meaning: Readonly<Record<MeaningLanguage, string>>;
}
