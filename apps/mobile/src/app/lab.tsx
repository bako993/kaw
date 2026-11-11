import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useWordSound } from '@/features/content';
import { Kaw } from '@/features/kaw';
import { FrameRateBadge } from '@/platform/performance/FrameRateBadge';

export default function LabScreen() {
  const sayHello = useWordSound('hello');
  const bounce = useSharedValue(1);
  const bounceStyle = useAnimatedStyle(() => ({ transform: [{ scale: bounce.get() }] }));

  const onPressIn = () => {
    sayHello();
    bounce.set(
      withSequence(
        withTiming(1.08, { duration: 110 }),
        withSpring(1, { damping: 8, stiffness: 220 }),
      ),
    );
  };

  return (
    <View style={styles.container}>
      <Pressable onPressIn={onPressIn} accessibilityRole="button" accessibilityLabel="Kaw">
        <Animated.View style={bounceStyle}>
          <Kaw pose="cheering" size={320} />
        </Animated.View>
      </Pressable>
      <FrameRateBadge />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF6E6',
  },
});
