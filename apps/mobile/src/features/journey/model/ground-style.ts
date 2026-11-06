import type { AreaKind, RoadKind } from '@kaw/shared';

export type GroundSource =
  | { readonly group: 'areas'; readonly kind: AreaKind }
  | { readonly group: 'roads'; readonly kind: RoadKind };

export type GroundPaint =
  | { readonly kind: 'fill'; readonly color: string; readonly opacity: number }
  | { readonly kind: 'stroke'; readonly color: string; readonly width: number };

export interface GroundLayer {
  readonly source: GroundSource;
  readonly paint: GroundPaint;
}

const fill = (color: string, opacity = 1): GroundPaint => ({ kind: 'fill', color, opacity });
const stroke = (color: string, width: number): GroundPaint => ({ kind: 'stroke', color, width });
const area = (kind: AreaKind, paint: GroundPaint): GroundLayer => ({
  source: { group: 'areas', kind },
  paint,
});
const road = (kind: RoadKind, paint: GroundPaint): GroundLayer => ({
  source: { group: 'roads', kind },
  paint,
});

/** How every city's streets look, drawn bottom to top. Same for all cities (D5). */
export const GROUND_LAYERS: readonly GroundLayer[] = [
  area('forest', fill('#C3CC9C', 0.85)),
  area('park', fill('#CCD5A6', 0.9)),
  area('cemetery', fill('#DCD4BE')),
  area('water', fill('#A9D2D8')),
  road('minor', stroke('#FBF6EB', 2.3)),
  road('mid', stroke('#D7C7A7', 6)),
  road('mid', stroke('#FFFCF5', 3.8)),
  road('major', stroke('#D2BE99', 10)),
  road('trunk', stroke('#D2BE99', 13.5)),
  road('major', stroke('#FFFDF7', 6.6)),
  road('trunk', stroke('#FFFDF7', 9.4)),
];

/** The warm paper under the streets: lighter in the middle of the city, darker outside. */
export const BACKDROP = {
  colors: ['#F0E6D1', '#EADFC8', '#E3D6BC'],
  positions: [0, 0.55, 1],
  /** Radius of the colour fade, as a share of the city width. */
  radiusPerWidth: 0.84,
  /** The streets fade out between these shares of the city's half-width. */
  streetsFadeFrom: 0.72,
  streetsFadeTo: 1,
} as const;

export const SCENE_BACKGROUND = '#E8DDC6';
