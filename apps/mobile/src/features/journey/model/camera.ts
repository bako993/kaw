// Runs on the UI thread (worklets): helpers stay ABOVE the functions that use them,
// and no array destructuring or object spread (both need helpers that thread lacks).

export interface CameraState {
  readonly focusX: number;
  readonly focusY: number;
  readonly zoom: number;
}

export interface Viewport {
  readonly width: number;
  readonly height: number;
}

export interface CameraLimits {
  readonly minZoom: number;
  readonly maxZoom: number;
  readonly minTiltDegrees: number;
  readonly maxTiltDegrees: number;
  readonly minFocusX: number;
  readonly maxFocusX: number;
  readonly minFocusY: number;
  readonly maxFocusY: number;
}

export interface GroundPoint {
  readonly x: number;
  readonly y: number;
}

export interface ScreenPoint {
  readonly x: number;
  readonly y: number;
  /** How many screen points one ground unit covers at this spot. */
  readonly scale: number;
}

/** A 3×3 matrix (row by row) that maps a ground point to the screen, with perspective. */
export type CameraMatrix = number[];

const PERSPECTIVE_PER_HEIGHT = 1150 / 390;
const HORIZON_ORIGIN_PER_HEIGHT = 228 / 390;
const NEAREST_DEPTH = 0.05;
const SAFE_DEPTH = 0.1;

function clamp(value: number, min: number, max: number): number {
  'worklet';
  return Math.min(max, Math.max(min, value));
}

/** Zoomed out = almost flat; zoomed in = tilted toward the horizon. */
export function tiltForZoom(zoom: number, limits: CameraLimits): number {
  'worklet';
  const range = Math.log(limits.maxZoom) - Math.log(limits.minZoom);
  const progress = clamp((Math.log(zoom) - Math.log(limits.minZoom)) / range, 0, 1);
  return limits.minTiltDegrees + (limits.maxTiltDegrees - limits.minTiltDegrees) * progress;
}

export function clampCamera(camera: CameraState, limits: CameraLimits): CameraState {
  'worklet';
  return {
    focusX: clamp(camera.focusX, limits.minFocusX, limits.maxFocusX),
    focusY: clamp(camera.focusY, limits.minFocusY, limits.maxFocusY),
    zoom: clamp(camera.zoom, limits.minZoom, limits.maxZoom),
  };
}

export function cameraMatrix(
  camera: CameraState,
  viewport: Viewport,
  limits: CameraLimits,
): CameraMatrix {
  'worklet';
  const tilt = (tiltForZoom(camera.zoom, limits) * Math.PI) / 180;
  const sin = Math.sin(tilt);
  const cos = Math.cos(tilt);
  const depth = sin / (PERSPECTIVE_PER_HEIGHT * viewport.height);
  const originX = viewport.width / 2;
  const originY = viewport.height * HORIZON_ORIGIN_PER_HEIGHT;
  const zoom = camera.zoom;
  const base = 1 + depth * camera.focusY;

  return [
    zoom,
    -originX * depth,
    originX * base - zoom * camera.focusX,
    0,
    zoom * cos - originY * depth,
    originY * base - zoom * cos * camera.focusY,
    0,
    -depth,
    base,
  ];
}

/**
 * The ground behind the camera can't be drawn. This is how far down the ground (in
 * ground units) is still safely in front of it; everything below gets cut off.
 */
export function nearGroundEdge(
  camera: CameraState,
  viewport: Viewport,
  limits: CameraLimits,
): number {
  'worklet';
  const tilt = (tiltForZoom(camera.zoom, limits) * Math.PI) / 180;
  const sin = Math.sin(tilt);
  const reach = (PERSPECTIVE_PER_HEIGHT * viewport.height) / Math.max(sin, 1e-3);
  return camera.focusY + reach * (1 - SAFE_DEPTH);
}

export function projectPoint(matrix: CameraMatrix, x: number, y: number): ScreenPoint | null {
  'worklet';
  const w = (matrix[6] ?? 0) * x + (matrix[7] ?? 0) * y + (matrix[8] ?? 1);
  if (w < NEAREST_DEPTH) return null;
  return {
    x: ((matrix[0] ?? 0) * x + (matrix[1] ?? 0) * y + (matrix[2] ?? 0)) / w,
    y: ((matrix[3] ?? 0) * x + (matrix[4] ?? 0) * y + (matrix[5] ?? 0)) / w,
    scale: (matrix[0] ?? 0) / w,
  };
}

export function unprojectPoint(matrix: CameraMatrix, x: number, y: number): GroundPoint | null {
  'worklet';
  const a = matrix[0] ?? 0;
  const b = matrix[1] ?? 0;
  const c = matrix[2] ?? 0;
  const d = matrix[3] ?? 0;
  const e = matrix[4] ?? 0;
  const f = matrix[5] ?? 0;
  const g = matrix[6] ?? 0;
  const h = matrix[7] ?? 0;
  const i = matrix[8] ?? 1;

  const groundX = (e * i - f * h) * x + (c * h - b * i) * y + (b * f - c * e);
  const groundY = (f * g - d * i) * x + (a * i - c * g) * y + (c * d - a * f);
  const groundW = (d * h - e * g) * x + (b * g - a * h) * y + (a * e - b * d);
  if (Math.abs(groundW) < 1e-9) return null;
  return { x: groundX / groundW, y: groundY / groundW };
}

/** Moves the camera so the ground under `from` ends up under `to` (one finger drag). */
export function panCamera(
  camera: CameraState,
  viewport: Viewport,
  limits: CameraLimits,
  from: GroundPoint,
  to: GroundPoint,
): CameraState {
  'worklet';
  const matrix = cameraMatrix(camera, viewport, limits);
  const before = unprojectPoint(matrix, from.x, from.y);
  const after = unprojectPoint(matrix, to.x, to.y);
  if (before === null || after === null) return camera;

  return clampCamera(
    {
      focusX: camera.focusX + before.x - after.x,
      focusY: camera.focusY + before.y - after.y,
      zoom: camera.zoom,
    },
    limits,
  );
}

/** Zooms by `factor`, keeping the ground under the fingers under the fingers (pinch). */
export function zoomCamera(
  camera: CameraState,
  viewport: Viewport,
  limits: CameraLimits,
  factor: number,
  focalFrom: GroundPoint,
  focalTo: GroundPoint,
): CameraState {
  'worklet';
  const anchor = unprojectPoint(cameraMatrix(camera, viewport, limits), focalFrom.x, focalFrom.y);
  const zoomed = clampCamera(
    { focusX: camera.focusX, focusY: camera.focusY, zoom: camera.zoom * factor },
    limits,
  );
  const landed = unprojectPoint(cameraMatrix(zoomed, viewport, limits), focalTo.x, focalTo.y);
  if (anchor === null || landed === null) return zoomed;

  return clampCamera(
    {
      focusX: zoomed.focusX + anchor.x - landed.x,
      focusY: zoomed.focusY + anchor.y - landed.y,
      zoom: zoomed.zoom,
    },
    limits,
  );
}
