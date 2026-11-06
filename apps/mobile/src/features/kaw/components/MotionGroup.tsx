import { Group, vec, type Transforms3d } from '@shopify/react-native-skia';
import type { ReactNode } from 'react';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import type { Motion, Point } from '../model/rig';
import { sampleMotion } from '../model/sample-motion';

interface MotionGroupProps {
  readonly motion: Motion | null;
  readonly origin: Point;
  readonly time: SharedValue<number>;
  readonly children: ReactNode;
}

const DEGREES_TO_RADIANS = Math.PI / 180;

export function MotionGroup({ motion, origin, time, children }: MotionGroupProps) {
  const frame = useDerivedValue(() => sampleMotion(motion, time.value));

  const transform = useDerivedValue<Transforms3d>(() => [
    { translateX: frame.value.translateX },
    { translateY: frame.value.translateY },
    { rotate: frame.value.rotate * DEGREES_TO_RADIANS },
    { scaleX: frame.value.scaleX },
    { scaleY: frame.value.scaleY },
  ]);

  const opacity = useDerivedValue(() => frame.value.opacity);

  return (
    <Group origin={vec(origin[0], origin[1])} transform={transform} opacity={opacity}>
      {children}
    </Group>
  );
}
