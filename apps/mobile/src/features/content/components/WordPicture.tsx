import { Image } from 'expo-image';

import { WORD_PICTURES } from '../pictures';
import { WORDS, type WordId } from '../words';

export interface WordPictureProps {
  readonly wordId: WordId;
  readonly size: number;
}

/** One word's 3D picture. Shown smaller than its file, so it always stays sharp. */
export function WordPicture({ wordId, size }: WordPictureProps) {
  // The screen-reader label uses the English meaning until the app languages arrive (M3d).
  return (
    <Image
      source={WORD_PICTURES[wordId]}
      style={{ width: size, height: size }}
      contentFit="contain"
      transition={180}
      accessible
      accessibilityRole="image"
      accessibilityLabel={WORDS[wordId].meaning.en}
    />
  );
}
