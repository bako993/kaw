import { Canvas, ImageSVG, useSVG } from '@shopify/react-native-skia';
import { View } from 'react-native';

import { WORD_PICTURES } from '../pictures';
import { WORDS, type WordId } from '../words';

export interface WordPictureProps {
  readonly wordId: WordId;
  readonly size: number;
}

/** One word's picture, drawn by Skia straight from its SVG, so it stays sharp at any size. */
export function WordPicture({ wordId, size }: WordPictureProps) {
  const svg = useSVG(WORD_PICTURES[wordId]);
  const box = { width: size, height: size };

  // The screen-reader label uses the English meaning until the app languages arrive (M3).
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={WORDS[wordId].meaning.en}
      style={box}
    >
      <Canvas style={box}>
        <ImageSVG svg={svg} x={0} y={0} width={size} height={size} />
      </Canvas>
    </View>
  );
}
