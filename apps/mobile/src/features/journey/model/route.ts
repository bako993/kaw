export interface RoutePoint {
  readonly x: number;
  readonly y: number;
  readonly isStop: boolean;
}

export interface RouteStop {
  readonly x: number;
  readonly y: number;
  /** Distance along the route from its start, in ground units. */
  readonly distance: number;
}

export interface Route {
  readonly path: string;
  readonly stops: readonly RouteStop[];
  readonly length: number;
}

const SAMPLES_PER_SEGMENT = 24;

interface Vector {
  readonly x: number;
  readonly y: number;
}

function pointAt(points: readonly RoutePoint[], index: number): RoutePoint {
  const clamped = Math.max(0, Math.min(points.length - 1, index));
  const point = points[clamped];
  if (!point) throw new Error('A route needs at least two points');
  return point;
}

function cubic(p0: Vector, c1: Vector, c2: Vector, p1: Vector, t: number): Vector {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * c1.x + c * c2.x + d * p1.x,
    y: a * p0.y + b * c1.y + c * c2.y + d * p1.y,
  };
}

function round(value: number): string {
  return String(Math.round(value * 10) / 10);
}

/** A smooth curve through every point (Catmull–Rom), plus where each stop sits along it. */
export function buildRoute(points: readonly RoutePoint[]): Route {
  if (points.length < 2) throw new Error('A route needs at least two points');

  const first = pointAt(points, 0);
  const stops: RouteStop[] = first.isStop ? [{ x: first.x, y: first.y, distance: 0 }] : [];
  let path = `M${round(first.x)} ${round(first.y)}`;
  let length = 0;

  for (let index = 0; index < points.length - 1; index++) {
    const before = pointAt(points, index - 1);
    const start = pointAt(points, index);
    const end = pointAt(points, index + 1);
    const after = pointAt(points, index + 2);
    const control1 = { x: start.x + (end.x - before.x) / 6, y: start.y + (end.y - before.y) / 6 };
    const control2 = { x: end.x - (after.x - start.x) / 6, y: end.y - (after.y - start.y) / 6 };

    path += `C${round(control1.x)} ${round(control1.y)} ${round(control2.x)} ${round(control2.y)} ${round(end.x)} ${round(end.y)}`;

    let previous: Vector = start;
    for (let sample = 1; sample <= SAMPLES_PER_SEGMENT; sample++) {
      const next = cubic(start, control1, control2, end, sample / SAMPLES_PER_SEGMENT);
      length += Math.hypot(next.x - previous.x, next.y - previous.y);
      previous = next;
    }

    const endPoint = points[index + 1];
    if (endPoint?.isStop) stops.push({ x: end.x, y: end.y, distance: length });
  }

  return { path, stops, length };
}
