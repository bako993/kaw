import { createPicture, Skia, type SkPicture } from '@shopify/react-native-skia';
import { useMemo } from 'react';

export function useArtPicture(artSvg: string, size: number): SkPicture | null {
  return useMemo(() => {
    const svg = Skia.SVG.MakeFromString(artSvg);
    if (svg === null) return null;

    return createPicture(
      (canvas) => {
        canvas.drawSvg(svg, size, size);
      },
      Skia.XYWHRect(0, 0, size, size),
    );
  }, [artSvg, size]);
}
