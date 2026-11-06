import type { Point } from '../rig-types.ts';

export function parsePoints(points: string): Point[] {
  return points
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x = 0, y = 0] = pair.split(',').map(Number);
      return [x, y] as const;
    });
}

export function polygonToPath(points: readonly Point[]): string {
  const [first, ...rest] = points;
  if (!first) {
    throw new Error('A polygon needs at least one point');
  }
  const lines = rest.map(([x, y]) => `L${String(x)} ${String(y)}`).join(' ');
  return `M${String(first[0])} ${String(first[1])} ${lines} Z`;
}
