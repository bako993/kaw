import { BACKDROP } from './ground-style';

export interface GradientStops {
  readonly colors: readonly string[];
  readonly positions: readonly number[];
}

function channel(hex: string, index: number): number {
  return Number.parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16);
}

function toHex(value: number): string {
  return Math.round(value).toString(16).padStart(2, '0');
}

export function mixColors(from: string, to: string, amount: number): string {
  const mixed = [0, 1, 2].map((index) => {
    const start = channel(from, index);
    return toHex(start + (channel(to, index) - start) * amount);
  });
  return `#${mixed.join('')}`;
}

/** The backdrop colour at a share (0–1) of its fade radius. */
export function backdropColorAt(position: number): string {
  const { colors, positions } = BACKDROP;
  for (let index = 1; index < positions.length; index++) {
    const end = positions[index] ?? 1;
    if (position <= end) {
      const start = positions[index - 1] ?? 0;
      const amount = (position - start) / (end - start);
      return mixColors(colors[index - 1] ?? '#000000', colors[index] ?? '#000000', amount);
    }
  }
  return colors[colors.length - 1] ?? '#000000';
}

/**
 * A cover laid over the streets that is clear in the middle and turns into the exact
 * backdrop colour toward the edges, so the streets fade into the paper with no seam.
 */
export function streetFadeStops(): GradientStops {
  const halfWidthShare = 0.5 / BACKDROP.radiusPerWidth;
  const fadeStart = BACKDROP.streetsFadeFrom * halfWidthShare;
  const fadeEnd = BACKDROP.streetsFadeTo * halfWidthShare;
  const edgeColor = backdropColorAt(fadeEnd);

  return {
    colors: [`${edgeColor}00`, `${edgeColor}00`, edgeColor, backdropColorAt(1)],
    positions: [0, fadeStart, fadeEnd, 1],
  };
}
