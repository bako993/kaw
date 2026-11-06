import { Skia, vec, type SkPath, type SkPathBuilder } from '@shopify/react-native-skia';
import { useMemo } from 'react';

import type { MovingPart, Point } from '../model/rig';

function addPolygon(builder: SkPathBuilder, points: readonly Point[]): void {
  builder.addPoly(
    points.map(([x, y]) => vec(x, y)),
    true,
  );
}

export function usePolygonPath(points: readonly Point[]): SkPath {
  return useMemo(() => {
    const builder = Skia.PathBuilder.Make();
    addPolygon(builder, points);
    return builder.detach();
  }, [points]);
}

export function useMovingArea(parts: readonly MovingPart[]): SkPath {
  return useMemo(() => {
    const builder = Skia.PathBuilder.Make();
    for (const part of parts) addPolygon(builder, part.clip);
    return builder.detach();
  }, [parts]);
}
