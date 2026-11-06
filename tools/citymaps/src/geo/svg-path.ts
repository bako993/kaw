import type { Point } from './project.ts';

function formatNumber(value: number): string {
  return String(Math.round(value * 10) / 10);
}

function formatPoints(points: readonly Point[]): string {
  return points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${formatNumber(x)} ${formatNumber(y)}`)
    .join('');
}

export function linesToPath(lines: readonly (readonly Point[])[]): string {
  return lines.map(formatPoints).join('');
}

export function polygonsToPath(rings: readonly (readonly Point[])[]): string {
  return rings.map((ring) => `${formatPoints(ring)}Z`).join('');
}
