import { bundledAsset, type BundledAsset } from '@/platform/assets/bundled-asset';

import type { WordId } from '../words';

/** A soft "boop" for words not recorded yet, so you can hear which ones still need recording. */
const NOT_RECORDED_YET = bundledAsset(require('@/assets/audio/placeholder.m4a'));

/**
 * Every word's sound: word ID → file in assets/audio/word/.
 * Typecheck fails if a word has no sound, or if a sound points to a word that doesn't exist.
 * After recording a word, change its line from NOT_RECORDED_YET to its file.
 */
export const WORD_SOUNDS = {
  hello: bundledAsset(require('@/assets/audio/word/hello.m4a')),
  welcome: NOT_RECORDED_YET,
  'thank-you': NOT_RECORDED_YET,
  yes: NOT_RECORDED_YET,
  no: NOT_RECORDED_YET,
  'how-are-you': NOT_RECORDED_YET,
  'im-fine': NOT_RECORDED_YET,
  'whats-your-name': NOT_RECORDED_YET,
  'my-name-is': NOT_RECORDED_YET,
  goodbye: NOT_RECORDED_YET,
} satisfies Record<WordId, BundledAsset>;
