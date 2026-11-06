import { Circle, Group, Path } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { HALO_COLOR, STOP_COLORS, starPath, type StopState } from '../model/stop-style';

const STAR = starPath(21, 15);
const HALO_MS = 1900;

interface RouteStopMarkProps {
  readonly x: number;
  readonly y: number;
  readonly state: StopState;
}

function Halo() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withRepeat(withTiming(1, { duration: HALO_MS, easing: Easing.out(Easing.ease) }), -1),
    );
  }, [progress]);

  const radius = useDerivedValue(() => 40 * (0.85 + 0.7 * progress.get()));
  const opacity = useDerivedValue(() => 0.95 * (1 - progress.get()));

  return <Circle r={radius} color={HALO_COLOR} style="stroke" strokeWidth={4} opacity={opacity} />;
}

/** A round stone plaza with a Kurdish 8-point star; gold when done (D5). */
export function RouteStopMark({ x, y, state }: RouteStopMarkProps) {
  const colors = STOP_COLORS[state];

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      {state === 'current' && <Halo />}
      <Circle cy={4} r={39} color={colors.base} />
      <Circle r={39} color={colors.rim} />
      <Circle r={32} color={colors.inner} />
      <Path path={STAR} color={colors.star} />
      <Circle r={7} color={colors.core} />
    </Group>
  );
}
