import { describe, expect, it } from 'vitest';

import { cameraMatrix, type CameraLimits } from './camera';
import { planSnapshot, SNAPSHOT_LIMITS } from './snapshot-plan';

const limits: CameraLimits = {
  minZoom: 0.24,
  maxZoom: 1.35,
  minTiltDegrees: 10,
  maxTiltDegrees: 56,
  minFocusX: -200,
  maxFocusX: 2500,
  minFocusY: 300,
  maxFocusY: 1950,
};
const viewport = { width: 896, height: 414 };
const ground = { x: 0, y: 0, width: 2319, height: 2250 };
const sharpestPhoneScreen = 3;

describe('street snapshot', () => {
  it.each([limits.minZoom, 0.5, 0.9, limits.maxZoom])(
    'stays within what the graphics chip can hold at zoom %s',
    (zoom) => {
      const camera = { focusX: 1310, focusY: 1105, zoom };
      const matrix = cameraMatrix(camera, viewport, limits);
      const plan = planSnapshot(matrix, viewport, ground, zoom, sharpestPhoneScreen);

      expect(plan).not.toBeNull();
      expect(Math.max(plan?.widthPx ?? 0, plan?.heightPx ?? 0)).toBeLessThanOrEqual(
        SNAPSHOT_LIMITS.maxSidePx,
      );
      expect((plan?.widthPx ?? 0) * (plan?.heightPx ?? 0)).toBeLessThanOrEqual(
        SNAPSHOT_LIMITS.maxPixels,
      );
    },
  );

  it('only draws ground that exists', () => {
    const camera = { focusX: limits.minFocusX, focusY: limits.minFocusY, zoom: limits.minZoom };
    const matrix = cameraMatrix(camera, viewport, limits);
    const rect = planSnapshot(matrix, viewport, ground, camera.zoom, sharpestPhoneScreen)?.rect;

    expect(rect?.x).toBeGreaterThanOrEqual(ground.x);
    expect(rect?.y).toBeGreaterThanOrEqual(ground.y);
    expect((rect?.x ?? 0) + (rect?.width ?? 0)).toBeLessThanOrEqual(ground.x + ground.width);
    expect((rect?.y ?? 0) + (rect?.height ?? 0)).toBeLessThanOrEqual(ground.y + ground.height);
  });
});
