import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors } from '../tokens/colors';
import { elevation } from '../tokens/elevation';
import { minTapSize, pressDepth, radius, space } from '../tokens/layout';
import { durations, easings } from '../tokens/motion';

/** icon = round, small · sound = round, big, white ring · pill = text (and icon) */
export type ChunkyButtonKind = 'icon' | 'sound' | 'pill';

export interface ChunkyButtonProps {
  readonly kind: ChunkyButtonKind;
  readonly accessibilityLabel: string;
  readonly onPress: () => void;
  readonly children: ReactNode;
}

const FACE: Record<ChunkyButtonKind, ViewStyle> = {
  icon: { width: minTapSize, height: minTapSize, borderRadius: radius.pill },
  sound: {
    width: 66,
    height: 66,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.paper,
  },
  pill: {
    height: 58,
    flexDirection: 'row',
    gap: space[2],
    paddingHorizontal: space[5],
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.paper,
  },
};

/** The saffron 3D button: it sinks onto its darker edge under the finger. */
export function ChunkyButton({ kind, accessibilityLabel, onPress, children }: ChunkyButtonProps) {
  const sink = useSharedValue(0);
  const faceStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sink.get() }] }));
  const moveTo = (depth: number) => {
    sink.set(withTiming(depth, { duration: durations.fast / 2, easing: easings.press }));
  };
  const sinkDown = () => {
    moveTo(pressDepth);
  };
  const riseUp = () => {
    moveTo(0);
  };
  const shape = { borderRadius: FACE[kind].borderRadius };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={sinkDown}
      onPressOut={riseUp}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={styles.frame}
    >
      <View style={[styles.edge, shape]} />
      <Animated.View style={[styles.face, FACE[kind], faceStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  frame: { alignSelf: 'flex-start', paddingBottom: pressDepth },
  edge: {
    ...StyleSheet.absoluteFill,
    top: pressDepth,
    backgroundColor: colors.actionEdge,
    boxShadow: elevation.soft,
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(180deg, ${colors.actionLight} 0%, ${colors.action} 100%)`,
    boxShadow: 'inset 0px 2px 0px rgba(255, 255, 255, 0.65)',
  },
});
