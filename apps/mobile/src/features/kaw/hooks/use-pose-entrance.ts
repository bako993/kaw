import { useEffect } from 'react';
import {
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

/** Plays a pose's entrance (a happy hop for cheering) each time Kaw switches to it. */
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

  return useAnimatedStyle(() => ({ transform: [{ translateY: lift.get() }] }));
}
