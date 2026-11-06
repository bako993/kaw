import { Image, Picture, type SkPicture } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';

import { useGroundSnapshot } from '../hooks/use-ground-snapshot';
import type { CameraLimits, CameraState, Viewport } from '../model/camera';
import type { GroundRect } from '../model/snapshot-plan';

interface CityGroundLayerProps {
  readonly picture: SkPicture;
  readonly groundBounds: GroundRect;
  readonly camera: SharedValue<CameraState>;
  readonly settled: SharedValue<number>;
  readonly limits: CameraLimits;
  readonly viewport: Viewport;
}

/**
 * The streets, shown as one picture that is redrawn whenever the fingers let go.
 * Drawing every street line live on each frame was about 10× too slow (M1d).
 */
export function CityGroundLayer(props: CityGroundLayerProps) {
  const snapshot = useGroundSnapshot(props);

  // Until the first picture is ready (a moment after the map opens), draw the lines once.
  if (snapshot === null) return <Picture picture={props.picture} />;

  const { image, rect } = snapshot;
  return (
    <Image image={image} x={rect.x} y={rect.y} width={rect.width} height={rect.height} fit="fill" />
  );
}
