import type { CityGround } from '@kaw/shared';
import {
  createPicture,
  PaintStyle,
  Skia,
  StrokeCap,
  StrokeJoin,
  type SkPaint,
  type SkPath,
  type SkPicture,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';

import { GROUND_LAYERS, type GroundPaint, type GroundSource } from '../model/ground-style';

const OVERDRAW = 600;

function sourcePath(ground: CityGround, source: GroundSource): string {
  return source.group === 'areas' ? ground.areas[source.kind] : ground.roads[source.kind];
}

function makePaint(paint: GroundPaint): SkPaint {
  const skPaint = Skia.Paint();
  skPaint.setAntiAlias(true);
  skPaint.setColor(Skia.Color(paint.color));
  if (paint.kind === 'fill') {
    skPaint.setAlphaf(paint.opacity);
  } else {
    skPaint.setStyle(PaintStyle.Stroke);
    skPaint.setStrokeWidth(paint.width);
    skPaint.setStrokeCap(StrokeCap.Round);
    skPaint.setStrokeJoin(StrokeJoin.Round);
  }
  return skPaint;
}

/** Records every street and park of a city once, so it can be replayed cheaply each frame. */
export function useGroundPicture(ground: CityGround): SkPicture {
  return useMemo(() => {
    const parsed = new Map<string, SkPath | null>();
    const pathFor = (source: GroundSource): SkPath | null => {
      const key = `${source.group}.${source.kind}`;
      if (!parsed.has(key)) {
        const svg = sourcePath(ground, source);
        parsed.set(key, svg === '' ? null : Skia.Path.MakeFromSVGString(svg));
      }
      return parsed.get(key) ?? null;
    };

    return createPicture(
      (canvas) => {
        for (const layer of GROUND_LAYERS) {
          const path = pathFor(layer.source);
          if (path !== null) canvas.drawPath(path, makePaint(layer.paint));
        }
      },
      Skia.XYWHRect(
        -OVERDRAW,
        -OVERDRAW,
        ground.width + OVERDRAW * 2,
        ground.height + OVERDRAW * 2,
      ),
    );
  }, [ground]);
}
