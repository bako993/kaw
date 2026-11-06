import { Group, Picture, type SkPicture } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';

import { usePolygonPath } from '../hooks/use-clip-paths';
import { polygonCenter, resolvePivot } from '../model/pivot';
import type { MovingPart } from '../model/rig';

import { MotionGroup } from './MotionGroup';

interface MovingPartLayerProps {
  readonly part: MovingPart;
  readonly picture: SkPicture;
  readonly time: SharedValue<number>;
}

export function MovingPartLayer({ part, picture, time }: MovingPartLayerProps) {
  const clip = usePolygonPath(part.clip);
  const origin = resolvePivot(part.pivot, polygonCenter(part.clip));

  return (
    <MotionGroup motion={part.motion} origin={origin} time={time}>
      <Group clip={clip}>
        <Picture picture={picture} />
      </Group>
    </MotionGroup>
  );
}
