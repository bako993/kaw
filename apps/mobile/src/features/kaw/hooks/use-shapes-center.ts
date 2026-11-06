import { Skia } from '@shopify/react-native-skia';
import { useMemo } from 'react';

import type { FillShape, Point } from '../model/rig';

export function useShapesCenter(shapes: readonly FillShape[]): Point {
  return useMemo(() => {
    const builder = Skia.PathBuilder.Make();
    for (const shape of shapes) {
      const path = Skia.Path.MakeFromSVGString(shape.d);
      if (path !== null) builder.addPath(path);
    }

    const { x, y, width, height } = builder.detach().getBounds();
    return [x + width / 2, y + height / 2];
  }, [shapes]);
}
