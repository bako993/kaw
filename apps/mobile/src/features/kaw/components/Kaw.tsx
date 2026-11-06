import { Canvas, Group, Picture, useClock } from '@shopify/react-native-skia';
import { useDerivedValue, useReducedMotion } from 'react-native-reanimated';

import { useArtPicture } from '../hooks/use-art-picture';
import { useMovingArea } from '../hooks/use-clip-paths';
import { resolvePivot } from '../model/pivot';
import { poses, type PoseName } from '../poses';

import { MotionGroup } from './MotionGroup';
import { MovingPartLayer } from './MovingPartLayer';
import { OverlayShape } from './OverlayShape';
import { SparkleLayer } from './SparkleLayer';

export interface KawProps {
  readonly pose: PoseName;
  readonly size: number;
}

export function Kaw({ pose, size }: KawProps) {
  const rig = poses[pose];
  const clock = useClock();
  const reduceMotion = useReducedMotion();
  const time = useDerivedValue(() => (reduceMotion ? 0 : clock.value));
  const picture = useArtPicture(rig.artSvg, rig.size);
  const movingArea = useMovingArea(rig.parts);
  const bodyOrigin = resolvePivot(rig.body.pivot, [rig.size / 2, rig.size / 2]);

  if (picture === null) return null;

  return (
    <Canvas style={{ width: size, height: size }}>
      <Group transform={[{ scale: size / rig.size }]}>
        <MotionGroup motion={rig.body.motion} origin={bodyOrigin} time={time}>
          <Group clip={movingArea} invertClip>
            <Picture picture={picture} />
          </Group>
          {rig.overlay.map((shape, index) => (
            <OverlayShape key={index} shape={shape} />
          ))}
          {rig.parts.map((part, index) => (
            <MovingPartLayer key={index} part={part} picture={picture} time={time} />
          ))}
          {rig.sparkles.map((sparkle, index) => (
            <SparkleLayer key={index} sparkle={sparkle} time={time} />
          ))}
        </MotionGroup>
      </Group>
    </Canvas>
  );
}
