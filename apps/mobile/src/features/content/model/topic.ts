import type { AgeGroup } from './word';

/** A topic points to words in the word bank: which ones each age group learns, in order. */
export interface Topic<WordId extends string> {
  readonly words: Readonly<Record<AgeGroup, readonly WordId[]>>;
}
