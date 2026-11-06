import { Path } from '@shopify/react-native-skia';

import type { Shape } from '../model/rig';

interface OverlayShapeProps {
  readonly shape: Shape;
}

export function OverlayShape({ shape }: OverlayShapeProps) {
  if (shape.kind === 'fill') {
    return <Path path={shape.d} color={shape.color} />;
  }

  return (
    <Path
      path={shape.d}
      color={shape.color}
      style="stroke"
      strokeWidth={shape.width}
      strokeCap="round"
      strokeJoin="round"
    />
  );
}
