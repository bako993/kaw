import { Path } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';

import { useShapesCenter } from '../hooks/use-shapes-center';
import { resolvePivot } from '../model/pivot';
import type { Sparkle } from '../model/rig';

import { MotionGroup } from './MotionGroup';

interface SparkleLayerProps {
  readonly sparkle: Sparkle;
  readonly time: SharedValue<number>;
}

export function SparkleLayer({ sparkle, time }: SparkleLayerProps) {
  const center = useShapesCenter(sparkle.shapes);

  return (
    <MotionGroup motion={sparkle.motion} origin={resolvePivot(sparkle.pivot, center)} time={time}>
      {sparkle.shapes.map((shape, index) => (
        <Path key={index} path={shape.d} color={shape.color} />
      ))}
    </MotionGroup>
  );
}
