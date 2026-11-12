import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { durations, easings, springs } from '../tokens/motion';

/** idle = waiting · right = the chosen right answer · wrong = a wrong tap · dim = steps back */
export type TileState = 'idle' | 'right' | 'wrong' | 'dim';

const FADED = 0.4;
const SHAKE_STEPS = [-6, 6, -6, 6, -3, 0];
const SHAKE_STEP_MS = 70;

function shakeSequence() {
  return withSequence(...SHAKE_STEPS.map((x) => withTiming(x, { duration: SHAKE_STEP_MS })));
}

/** How an answer tile moves for each state, plus a small squeeze under the finger. */
export function useTileMotion(state: TileState) {
  const lift = useSharedValue(0);
  const shake = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const success = useSharedValue(0);

  useEffect(() => {
    const settle = { duration: durations.base, easing: easings.out };
    lift.set(withTiming(state === 'right' ? -6 : 0, settle));
    scale.set(withTiming(state === 'dim' ? 0.96 : 1, settle));
    const faded = state === 'dim' || state === 'wrong';
    const fadeDelay = state === 'wrong' ? SHAKE_STEPS.length * SHAKE_STEP_MS : 0;
    opacity.set(withDelay(fadeDelay, withTiming(faded ? FADED : 1, settle)));
    success.set(state === 'right' ? withDelay(120, withSpring(1, springs.bouncy)) : 0);
    if (state === 'wrong') shake.set(shakeSequence());
  }, [state, lift, shake, scale, opacity, success]);

  const squeeze = (pressed: boolean) => {
    scale.set(withTiming(pressed ? 0.97 : 1, { duration: durations.fast, easing: easings.press }));
  };

  const tileStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateX: shake.get() }, { translateY: lift.get() }, { scale: scale.get() }],
  }));

  const successRingStyle = useAnimatedStyle(() => ({ opacity: Math.min(1, success.get()) }));

  const badgeStyle = useAnimatedStyle(() => {
    const amount = success.get();
    return {
      opacity: Math.min(1, amount),
      transform: [{ scale: 0.4 + 0.6 * amount }, { rotate: `${String(-20 + 20 * amount)}deg` }],
    };
  });

  return { tileStyle, successRingStyle, badgeStyle, squeeze };
}
