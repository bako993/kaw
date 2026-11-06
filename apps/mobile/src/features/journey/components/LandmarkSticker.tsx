import {
  Group,
  Image,
  LinearGradient,
  Rect,
  rect,
  useImage,
  vec,
} from '@shopify/react-native-skia';
import { useDerivedValue, type DerivedValue } from 'react-native-reanimated';

import { projectPoint, type CameraMatrix } from '../model/camera';
import type { Landmark } from '../model/city';

/** The bottom 8% of the sticker fades out, so it sits softly on its courtyard. */
const BASE_FADE = 0.08;

interface LandmarkStickerProps {
  readonly landmark: Landmark;
  readonly matrix: DerivedValue<CameraMatrix>;
}

/** The painted landmark, standing upright on its spot while the ground tilts. */
export function LandmarkSticker({ landmark, matrix }: LandmarkStickerProps) {
  const image = useImage(landmark.image);
  const { x, y, width } = landmark;

  const transform = useDerivedValue(() => {
    const point = projectPoint(matrix.get(), x, y);
    if (point === null) return [{ scale: 0 }];
    return [{ translateX: point.x }, { translateY: point.y }, { scale: point.scale }];
  });

  if (image === null) return null;

  const height = (width * image.height()) / image.width();
  // The clip keeps the fade's offscreen layer as small as the sticker itself.
  return (
    <Group transform={transform} clip={rect(-width / 2, -height, width, height)} layer>
      <Image image={image} x={-width / 2} y={-height} width={width} height={height} fit="fill" />
      <Rect x={-width / 2} y={-height} width={width} height={height} blendMode="dstIn">
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, -height * BASE_FADE)}
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
        />
      </Rect>
    </Group>
  );
}
