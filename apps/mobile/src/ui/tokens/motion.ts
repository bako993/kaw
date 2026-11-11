import { Easing } from 'react-native-reanimated';

/** How long movements take, in milliseconds. */
export const durations = {
  fast: 140,
  base: 380,
  slow: 600,
} as const;

export const easings = {
  /** Things arriving or settling. */
  out: Easing.bezier(0.2, 0.9, 0.25, 1),
  /** A button sinking under a finger. */
  press: Easing.bezier(0.3, 0.7, 0.4, 1),
} as const;

/** Spring settings for `withSpring`. */
export const springs = {
  bouncy: { damping: 9, stiffness: 240 },
  gentle: { damping: 16, stiffness: 180 },
} as const;
