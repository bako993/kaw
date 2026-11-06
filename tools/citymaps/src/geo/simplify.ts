import type { Point } from './project.ts';

/** Removes points that change the line by less than `tolerance` units (Douglas–Peucker). */
export function simplifyLine(points: readonly Point[], tolerance: number): Point[] {
  if (points.length < 3) return [...points];

  const keep = new Array<boolean>(points.length).fill(false);
  keep[0] = true;
  keep[points.length - 1] = true;
  markPoints(points, 0, points.length - 1, tolerance, keep);

  return points.filter((_, index) => keep[index]);
}

function markPoints(
  points: readonly Point[],
  first: number,
  last: number,
  tolerance: number,
  keep: boolean[],
): void {
  const start = points[first];
  const end = points[last];
  if (!start || !end) return;

  let farthest = -1;
  let farthestDistance = tolerance;
  for (let index = first + 1; index < last; index++) {
    const point = points[index];
    if (!point) continue;
    const distance = distanceToSegment(point, start, end);
    if (distance > farthestDistance) {
      farthest = index;
      farthestDistance = distance;
    }
  }

  if (farthest === -1) return;
  keep[farthest] = true;
  markPoints(points, first, farthest, tolerance, keep);
  markPoints(points, farthest, last, tolerance, keep);
}

function distanceToSegment(point: Point, start: Point, end: Point): number {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const lengthSquared = dx * dx + dy * dy;
  const along =
    lengthSquared === 0
      ? 0
      : Math.max(
          0,
          Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSquared),
        );
  return Math.hypot(point[0] - (start[0] + along * dx), point[1] - (start[1] + along * dy));
}

export function lineLength(points: readonly Point[]): number {
  let length = 0;
  for (let index = 1; index < points.length; index++) {
    const from = points[index - 1];
    const to = points[index];
    if (from && to) length += Math.hypot(to[0] - from[0], to[1] - from[1]);
  }
  return length;
}
