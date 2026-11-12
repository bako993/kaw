import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors } from '../tokens/colors';
import { radius } from '../tokens/layout';
import { durations, easings } from '../tokens/motion';

export interface MeterProps {
  /** How full the meter is, from 0 to 1. Values outside are clamped. */
  readonly progress: number;
  readonly width?: number;
}

/** A small progress bar that fills smoothly. */
export function Meter({ progress, width = 72 }: MeterProps) {
  const fill = useSharedValue(0);

  useEffect(() => {
    const clamped = Math.min(1, Math.max(0, progress));
    fill.set(withTiming(clamped, { duration: durations.slow, easing: easings.out }));
  }, [fill, progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${String(fill.get() * 100)}%` }));

  return (
    <View style={[styles.track, { width }]}>
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.paperShade,
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundImage: `linear-gradient(180deg, ${colors.actionLight} 0%, ${colors.action} 100%)`,
  },
});
