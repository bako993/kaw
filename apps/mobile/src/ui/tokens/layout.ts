/** Spacing on an 8-point grid. */
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
} as const;

export const radius = {
  small: 14,
  medium: 20,
  large: 32,
  pill: 999,
} as const;

/** How far a chunky button sinks when pressed. */
export const pressDepth = 4;

/** The smallest tap target for children, in points. */
export const minTapSize = 56;
