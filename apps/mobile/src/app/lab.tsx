import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useWordSound } from '@/features/content';
import { Kaw, type KawPose } from '@/features/kaw';
import { FrameRateBadge } from '@/platform/performance/FrameRateBadge';
import { colors, textStyles } from '@/ui';

const POSES: readonly KawPose[] = [
  'happy',
  'curious',
  'proud',
  'gentle',
  'surprised',
  'sleepy',
  'waving',
  'listening',
  'speaking',
  'pointing',
  'cheering',
  'thinking',
];

export default function LabScreen() {
  const sayHello = useWordSound('hello');
  const [poseIndex, setPoseIndex] = useState(0);
  const pose = POSES[poseIndex % POSES.length] ?? 'happy';

  const showNextPose = () => {
    sayHello();
    setPoseIndex((index) => index + 1);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={showNextPose} accessibilityRole="button" accessibilityLabel="Kaw">
        <Kaw pose={pose} size={300} />
      </Pressable>
      <Text style={styles.poseName}>{pose}</Text>
      <FrameRateBadge />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundTop,
  },
  poseName: textStyles.latinLabel,
});
