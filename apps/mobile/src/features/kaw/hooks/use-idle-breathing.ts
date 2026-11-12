import { useEffect } from 'react';
import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const BREATH_MS = 1800;

/** A slow, soft breath while Kaw stands still. Stays still when "reduce motion" is on. */
export function useIdleBreathing() {
  const breath = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    breath.set(
      withRepeat(
        withTiming(1, { duration: BREATH_MS, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
    return () => {
      cancelAnimation(breath);
    };
  }, [breath, reduceMotion]);

  return useAnimatedStyle(() => {
    const amount = breath.get();
    return {
      transform: [
        { translateY: -6 * amount },
        { scaleX: 1 + 0.024 * amount },
        { scaleY: 1 - 0.016 * amount },
      ],
    };
  });
}
