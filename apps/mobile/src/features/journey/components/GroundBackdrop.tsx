import type { CityGround } from '@kaw/shared';
import { Rect, RadialGradient, vec } from '@shopify/react-native-skia';

import { BACKDROP } from '../model/ground-style';

const EXTEND = 1800;

interface GroundBackdropProps {
  readonly ground: CityGround;
}

/** The warm paper under the city, far beyond its edges. */
export function GroundBackdrop({ ground }: GroundBackdropProps) {
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
        colors={[...BACKDROP.colors]}
        positions={[...BACKDROP.positions]}
      />
    </Rect>
  );
}
