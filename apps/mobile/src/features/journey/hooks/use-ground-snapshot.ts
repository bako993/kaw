import { Skia, type SkImage, type SkPicture } from '@shopify/react-native-skia';
import { useCallback, useEffect, useState } from 'react';
import { PixelRatio } from 'react-native';
import { useAnimatedReaction, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { cameraMatrix, type CameraLimits, type CameraState, type Viewport } from '../model/camera';
import { planSnapshot, type GroundRect } from '../model/snapshot-plan';

export interface GroundSnapshot {
  readonly image: SkImage;
  readonly rect: GroundRect;
}

export interface SnapshotInput {
  readonly picture: SkPicture;
  readonly groundBounds: GroundRect;
  readonly camera: SharedValue<CameraState>;
  readonly settled: SharedValue<number>;
  readonly limits: CameraLimits;
  readonly viewport: Viewport;
}

function drawSnapshot(
  picture: SkPicture,
  groundBounds: GroundRect,
  camera: CameraState,
  limits: CameraLimits,
  viewport: Viewport,
): GroundSnapshot | null {
  const matrix = cameraMatrix(camera, viewport, limits);
  const plan = planSnapshot(matrix, viewport, groundBounds, camera.zoom, PixelRatio.get());
  if (plan === null) return null;

  const surface = Skia.Surface.MakeOffscreen(plan.widthPx, plan.heightPx);
  if (surface === null) return null;

  const canvas = surface.getCanvas();
  canvas.scale(plan.pixelsPerUnit, plan.pixelsPerUnit);
  canvas.translate(-plan.rect.x, -plan.rect.y);
  canvas.drawPicture(picture);
  surface.flush();
  const image = surface.makeImageSnapshot().makeNonTextureImage();
  surface.dispose();
  return image === null ? null : { image, rect: plan.rect };
}

/** Draws the visible streets into one picture, and redraws it each time the fingers let go. */
export function useGroundSnapshot({
  picture,
  groundBounds,
  camera,
  settled,
  limits,
  viewport,
}: SnapshotInput): GroundSnapshot | null {
  const [snapshot, setSnapshot] = useState<GroundSnapshot | null>(null);

  const retake = useCallback(
    (state: CameraState) => {
      setSnapshot(drawSnapshot(picture, groundBounds, state, limits, viewport));
    },
    [picture, groundBounds, limits, viewport],
  );

  // First picture right after the map appears (the live lines show until then).
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      retake(camera.get());
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [retake, camera]);

  useAnimatedReaction(
    () => settled.get(),
    (current, previous) => {
      if (previous !== null && current !== previous) scheduleOnRN(retake, camera.get());
    },
  );

  useEffect(() => () => snapshot?.image.dispose(), [snapshot]);

  return snapshot;
}
