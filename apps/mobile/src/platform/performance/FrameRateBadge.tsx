import { StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { useFrameRate } from './use-frame-rate';

interface FrameRateBadgeProps {
  readonly style?: StyleProp<ViewStyle>;
}

/** A small "60 fps · slowest 17 ms" label for lab screens and speed checks (M1f). */
export function FrameRateBadge({ style }: FrameRateBadgeProps) {
  const { fps, slowestMs } = useFrameRate();

  return (
    <Text style={[styles.badge, style]} pointerEvents="none">
      {fps} fps · slowest {slowestMs} ms
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 12,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 250, 240, 0.95)',
    fontSize: 13,
    fontWeight: '700',
    color: '#4A3F35',
    fontVariant: ['tabular-nums'],
  },
});
