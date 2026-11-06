import { Group, LinearGradient, RadialGradient, Rect, vec } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { tiltForZoom, type CameraLimits, type CameraState, type Viewport } from '../model/camera';
import { SCENE_BACKGROUND } from '../model/ground-style';

const HAZE_HEIGHT_PER_HEIGHT = 200 / 390;
const HAZE_FULL_AT_TILT = 50;

interface MapAtmosphereProps {
  readonly viewport: Viewport;
  readonly camera: SharedValue<CameraState>;
  readonly limits: CameraLimits;
}

/** Soft haze at the far edge when tilted, and a gentle darkening at the corners. */
export function MapAtmosphere({ viewport, camera, limits }: MapAtmosphereProps) {
  const { width, height } = viewport;
  const hazeOpacity = useDerivedValue(() =>
    Math.min(1, tiltForZoom(camera.get().zoom, limits) / HAZE_FULL_AT_TILT),
  );
  const vignetteRadius = width * 0.75;

  return (
    <Group>
      <Rect
        x={0}
        y={0}
        width={width}
        height={height * HAZE_HEIGHT_PER_HEIGHT}
        opacity={hazeOpacity}
      >
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, height * HAZE_HEIGHT_PER_HEIGHT)}
          colors={[SCENE_BACKGROUND, `${SCENE_BACKGROUND}EB`, `${SCENE_BACKGROUND}00`]}
          positions={[0, 0.2, 1]}
        />
      </Rect>
      <Group
        transform={[
          { translateX: width / 2 },
          { translateY: height / 2 },
          { scaleY: (height * 0.85) / vignetteRadius },
        ]}
      >
        <Rect x={-width} y={-width} width={width * 2} height={width * 2}>
          <RadialGradient
            c={vec(0, 0)}
            r={vignetteRadius}
            colors={['rgba(80, 60, 30, 0)', 'rgba(80, 60, 30, 0.16)']}
            positions={[0.6, 1]}
          />
        </Rect>
      </Group>
    </Group>
  );
}
