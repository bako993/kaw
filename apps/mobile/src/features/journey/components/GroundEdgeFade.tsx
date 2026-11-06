import type { CityGround } from '@kaw/shared';
import { RadialGradient, Rect, vec } from '@shopify/react-native-skia';

import { streetFadeStops } from '../model/backdrop';
import { BACKDROP } from '../model/ground-style';

const EXTEND = 1800;
const FADE = streetFadeStops();

interface GroundEdgeFadeProps {
  readonly ground: CityGround;
}

/** Lets the streets melt softly into the paper at the city's edge. */
export function GroundEdgeFade({ ground }: GroundEdgeFadeProps) {
  return (
    <Rect
      x={-EXTEND}
      y={-EXTEND}
      width={ground.width + EXTEND * 2}
      height={ground.height + EXTEND * 2}
    >
      <RadialGradient
        c={vec(ground.width / 2, ground.height / 2)}
        r={ground.width * BACKDROP.radiusPerWidth}
        colors={[...FADE.colors]}
        positions={[...FADE.positions]}
      />
    </Rect>
  );
}
