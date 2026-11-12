import { useEffect } from 'react';
import {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { durations, easings, springs } from '@/ui';

import { KAW_POSES, type KawPose } from '../poses';

const HOP_HEIGHT = 26;

/**
 * Plays a pose's entrance (a happy hop for cheering) each time Kaw switches to it.
 * Returns his lift and a matching floor shadow that shrinks and fades as he rises.
 */
export function usePoseEntrance(pose: KawPose) {
  const lift = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || KAW_POSES[pose].entrance !== 'hop') return;
    lift.set(
      withSequence(
        withTiming(-HOP_HEIGHT, { duration: durations.fast * 1.6, easing: easings.out }),
        withSpring(0, springs.bouncy),
      ),
    );
  }, [pose, lift, reduceMotion]);

  const liftStyle = useAnimatedStyle(() => ({ transform: [{ translateY: lift.get() }] }));

  const shadowStyle = useAnimatedStyle(() => {
    const rise = Math.min(1, Math.abs(lift.get()) / HOP_HEIGHT);
    return {
      opacity: interpolate(rise, [0, 1], [1, 0.45]),
      transform: [{ scale: interpolate(rise, [0, 1], [1, 0.7]) }],
    };
  });

  return { liftStyle, shadowStyle };
}
