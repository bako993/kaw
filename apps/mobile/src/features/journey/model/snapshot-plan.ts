import { unprojectPoint, type CameraMatrix, type Viewport } from './camera';

export interface GroundRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface SnapshotPlan {
  readonly rect: GroundRect;
  readonly pixelsPerUnit: number;
  readonly widthPx: number;
  readonly heightPx: number;
}

export interface SnapshotLimits {
  /** Extra ground around the visible part, so a short drag stays covered. */
  readonly margin: number;
  readonly maxSidePx: number;
  readonly maxPixels: number;
  /** Extra sharpness for the near (bottom) part of a tilted view. */
  readonly nearDetail: number;
}

export const SNAPSHOT_LIMITS: SnapshotLimits = {
  margin: 0.35,
  maxSidePx: 4096,
  maxPixels: 8_000_000,
  nearDetail: 1.25,
};

/** Which part of the ground to draw into a picture, and how sharp, for the current view. */
export function planSnapshot(
  matrix: CameraMatrix,
  viewport: Viewport,
  groundBounds: GroundRect,
  zoom: number,
  pixelRatio: number,
  limits: SnapshotLimits = SNAPSHOT_LIMITS,
): SnapshotPlan | null {
  const corners = [
    unprojectPoint(matrix, 0, 0),
    unprojectPoint(matrix, viewport.width, 0),
    unprojectPoint(matrix, 0, viewport.height),
    unprojectPoint(matrix, viewport.width, viewport.height),
  ];
  if (corners.some((corner) => corner === null)) return null;

  const xs = corners.map((corner) => corner?.x ?? 0);
  const ys = corners.map((corner) => corner?.y ?? 0);
  const visibleWidth = Math.max(...xs) - Math.min(...xs);
  const visibleHeight = Math.max(...ys) - Math.min(...ys);

  const left = Math.max(groundBounds.x, Math.min(...xs) - visibleWidth * limits.margin);
  const top = Math.max(groundBounds.y, Math.min(...ys) - visibleHeight * limits.margin);
  const right = Math.min(
    groundBounds.x + groundBounds.width,
    Math.max(...xs) + visibleWidth * limits.margin,
  );
  const bottom = Math.min(
    groundBounds.y + groundBounds.height,
    Math.max(...ys) + visibleHeight * limits.margin,
  );
  const width = right - left;
  const height = bottom - top;
  if (width <= 0 || height <= 0) return null;

  const pixelsPerUnit = Math.min(
    zoom * pixelRatio * limits.nearDetail,
    limits.maxSidePx / Math.max(width, height),
    Math.sqrt(limits.maxPixels / (width * height)),
  );

  return {
    rect: { x: left, y: top, width, height },
    pixelsPerUnit,
    widthPx: Math.max(1, Math.floor(width * pixelsPerUnit)),
    heightPx: Math.max(1, Math.floor(height * pixelsPerUnit)),
  };
}
