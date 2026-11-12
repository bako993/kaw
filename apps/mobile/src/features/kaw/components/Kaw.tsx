import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useIdleBreathing } from '../hooks/use-idle-breathing';
import { usePoseEntrance } from '../hooks/use-pose-entrance';
import { KAW_ART_ASPECT, KAW_FEET_LINE, KAW_POSES, type KawPose } from '../poses';

export interface KawProps {
  readonly pose: KawPose;
  /** Height of Kaw's frame in points; the width follows from the art. */
  readonly size: number;
}

const POSE_CROSSFADE = { duration: 220, effect: 'cross-dissolve' } as const;

/** Kaw in 3D. Breathes while idle, cross-fades between poses, hops when cheering. */
export function Kaw({ pose, size }: KawProps) {
  const breathing = useIdleBreathing();
  const { liftStyle, shadowStyle } = usePoseEntrance(pose);
  const frame = { width: size * KAW_ART_ASPECT, height: size };
  const shadowSize = { width: size * 0.42, height: size * 0.05 };
  const shadowPlace = {
    left: (frame.width - shadowSize.width) / 2,
    top: size * KAW_FEET_LINE - shadowSize.height / 2,
  };

  return (
    <Animated.View style={frame}>
      <Animated.View style={[styles.floorShadow, shadowSize, shadowPlace, shadowStyle]} />
      <Animated.View style={[frame, liftStyle]}>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  floorShadow: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(90, 55, 20, 0.16)',
    boxShadow: '0px 0px 14px 6px rgba(90, 55, 20, 0.16)',
  },
  standOnFeet: { transformOrigin: 'bottom' },
});
