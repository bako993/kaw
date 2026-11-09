import { useSound } from '@/platform/audio/use-sound';

import { WORD_SOUNDS } from '../sounds';
import type { WordId } from '../words';

/** Loads one word's sound ahead of time and returns a function that says the word. */
export function useWordSound(wordId: WordId): () => void {
  return useSound(WORD_SOUNDS[wordId]);
}
