import type { Pivot, Point } from './rig';

export function resolvePivot(pivot: Pivot, center: Point): Point {
  return pivot.kind === 'point' ? pivot.point : center;
}

export function polygonCenter(points: readonly Point[]): Point {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
}
