import type { Word } from '../model/word';
import { HELLO_AND_ME_WORDS } from './hello-and-me';

/** Every word bank, one per topic file. A new topic's words are added here AND to WORDS. */
export const WORD_BANKS: readonly Readonly<Record<string, Word>>[] = [HELLO_AND_ME_WORDS];

/** All words in the app, by ID. */
export const WORDS = {
  ...HELLO_AND_ME_WORDS,
} satisfies Record<string, Word>;

export type WordId = keyof typeof WORDS;
