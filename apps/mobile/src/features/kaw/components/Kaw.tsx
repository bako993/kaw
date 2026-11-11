import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useIdleBreathing } from '../hooks/use-idle-breathing';
import { usePoseEntrance } from '../hooks/use-pose-entrance';
import { KAW_ART_ASPECT, KAW_POSES, type KawPose } from '../poses';

export interface KawProps {
  readonly pose: KawPose;
  /** Height of Kaw's frame in points; the width follows from the art. */
  readonly size: number;
}

const POSE_CROSSFADE = { duration: 220, effect: 'cross-dissolve' } as const;

/** Kaw in 3D. Breathes while idle, cross-fades between poses, hops when cheering. */
export function Kaw({ pose, size }: KawProps) {
  const breathing = useIdleBreathing();
  const entrance = usePoseEntrance(pose);
  const frame = { width: size * KAW_ART_ASPECT, height: size };

  return (
    <Animated.View style={[frame, entrance]}>
      <Animated.View style={[frame, styles.standOnFeet, breathing]}>
        <Image
          source={KAW_POSES[pose].file}
          style={frame}
          contentFit="contain"
          transition={POSE_CROSSFADE}
          accessible
          accessibilityRole="image"
          accessibilityLabel="Kaw"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  standOnFeet: { transformOrigin: 'bottom' },
});
