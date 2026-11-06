import type { SkRect } from '@shopify/react-native-skia';
import {
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
  type ComposedGesture,
} from 'react-native-gesture-handler';
import {
  useDerivedValue,
  useSharedValue,
  type DerivedValue,
  type SharedValue,
} from 'react-native-reanimated';

import {
  cameraMatrix,
  nearGroundEdge,
  panCamera,
  zoomCamera,
  type CameraLimits,
  type CameraMatrix,
  type CameraState,
  type GroundPoint,
  type Viewport,
} from '../model/camera';

const FAR_AWAY = 20_000;

export interface MapCamera {
  readonly camera: SharedValue<CameraState>;
  readonly matrix: DerivedValue<CameraMatrix>;
  /** The part of the ground in front of the camera; draw the tilted ground inside it. */
  readonly groundClip: DerivedValue<SkRect>;
  readonly gesture: ComposedGesture;
  /** Goes up by one every time the fingers leave the map. */
  readonly settled: SharedValue<number>;
}

export function useMapCamera(
  start: CameraState,
  limits: CameraLimits,
  viewport: Viewport,
): MapCamera {
  const camera = useSharedValue(start);
  const settled = useSharedValue(0);
  const pinching = useSharedValue(false);
  const lastFocal = useSharedValue<GroundPoint>({ x: 0, y: 0 });
  const lastPan = useSharedValue<GroundPoint>({ x: 0, y: 0 });
  const lastPointers = useSharedValue(0);

  const matrix = useDerivedValue(() => cameraMatrix(camera.get(), viewport, limits));
  const groundClip = useDerivedValue(() => ({
    x: -FAR_AWAY,
    y: -FAR_AWAY,
    width: FAR_AWAY * 2,
    height: FAR_AWAY + nearGroundEdge(camera.get(), viewport, limits),
  }));

  const pan = usePanGesture({
    onActivate: (event) => {
      'worklet';
      lastPan.set({ x: event.x, y: event.y });
      lastPointers.set(event.numberOfPointers);
    },
    onUpdate: (event) => {
      'worklet';
      const now = { x: event.x, y: event.y };
      const fingersChanged = event.numberOfPointers !== lastPointers.get();
      if (!pinching.get() && !fingersChanged) {
        camera.set(panCamera(camera.get(), viewport, limits, lastPan.get(), now));
      }
      lastPan.set(now);
      lastPointers.set(event.numberOfPointers);
    },
    onFinalize: () => {
      'worklet';
      settled.set(settled.get() + 1);
    },
  });

  const pinch = usePinchGesture({
    onActivate: (event) => {
      'worklet';
      pinching.set(true);
      lastFocal.set({ x: event.focalX, y: event.focalY });
    },
    onUpdate: (event) => {
      'worklet';
      const focal = { x: event.focalX, y: event.focalY };
      camera.set(
        zoomCamera(camera.get(), viewport, limits, event.scaleChange, lastFocal.get(), focal),
      );
      lastFocal.set(focal);
    },
    onFinalize: () => {
      'worklet';
      pinching.set(false);
      settled.set(settled.get() + 1);
    },
  });

  const gesture = useSimultaneousGestures(pan, pinch);

  return { camera, matrix, groundClip, gesture, settled };
}
