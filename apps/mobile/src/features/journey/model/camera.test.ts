import { describe, expect, it } from 'vitest';

import {
  cameraMatrix,
  nearGroundEdge,
  panCamera,
  projectPoint,
  unprojectPoint,
  zoomCamera,
  type CameraLimits,
} from './camera';

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
const camera = { focusX: 1310, focusY: 1105, zoom: 0.9 };

describe('map camera', () => {
  it('finds the right ground spot under a tap', () => {
    const matrix = cameraMatrix(camera, viewport, limits);
    const onScreen = projectPoint(matrix, 900, 700);
    const tapped = onScreen && unprojectPoint(matrix, onScreen.x, onScreen.y);

    expect(tapped?.x).toBeCloseTo(900);
    expect(tapped?.y).toBeCloseTo(700);
  });

  it('keeps the ground under the finger while dragging', () => {
    const under = unprojectPoint(cameraMatrix(camera, viewport, limits), 300, 300);
    const moved = panCamera(camera, viewport, limits, { x: 300, y: 300 }, { x: 360, y: 250 });
    const after = under && projectPoint(cameraMatrix(moved, viewport, limits), under.x, under.y);

    expect(after?.x).toBeCloseTo(360);
    expect(after?.y).toBeCloseTo(250);
  });

  it('keeps the ground under the fingers while pinching', () => {
    const under = unprojectPoint(cameraMatrix(camera, viewport, limits), 500, 260);
    const zoomed = zoomCamera(
      camera,
      viewport,
      limits,
      1.2,
      { x: 500, y: 260 },
      { x: 510, y: 250 },
    );
    const after = under && projectPoint(cameraMatrix(zoomed, viewport, limits), under.x, under.y);

    expect(zoomed.zoom).toBeCloseTo(camera.zoom * 1.2);
    expect(after?.x).toBeCloseTo(510);
    expect(after?.y).toBeCloseTo(250);
  });

  it('never zooms past the limits, even with odd pinch values', () => {
    const origin = { x: 0, y: 0 };

    expect(zoomCamera(camera, viewport, limits, 10, origin, origin).zoom).toBe(limits.maxZoom);
    expect(zoomCamera(camera, viewport, limits, 0, origin, origin).zoom).toBe(limits.minZoom);
  });

  it('never drags past the edges of the city', () => {
    const farAway = panCamera(camera, viewport, limits, { x: 0, y: 0 }, { x: 90000, y: 90000 });

    expect(farAway.focusX).toBeGreaterThanOrEqual(limits.minFocusX);
    expect(farAway.focusX).toBeLessThanOrEqual(limits.maxFocusX);
    expect(farAway.focusY).toBeGreaterThanOrEqual(limits.minFocusY);
    expect(farAway.focusY).toBeLessThanOrEqual(limits.maxFocusY);
  });

  it('cuts the ground off before it reaches the camera', () => {
    const closeUp = { focusX: 0, focusY: 1000, zoom: limits.maxZoom };
    const edge = nearGroundEdge(closeUp, viewport, limits);
    const matrix = cameraMatrix(closeUp, viewport, limits);
    const edgeOnScreen = projectPoint(matrix, 0, edge);
    const screenBottom = unprojectPoint(matrix, viewport.width / 2, viewport.height);

    expect(edgeOnScreen).not.toBeNull();
    expect(Number.isFinite(edgeOnScreen?.y)).toBe(true);
    expect(screenBottom?.y ?? Infinity).toBeLessThan(edge);
  });
});
