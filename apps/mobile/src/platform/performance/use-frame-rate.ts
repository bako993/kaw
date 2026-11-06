import { useState } from 'react';
import { useFrameCallback, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

export interface FrameRate {
  /** Frames per second over the last half second. */
  readonly fps: number;
  /** The slowest single frame in that half second, in milliseconds. */
  readonly slowestMs: number;
}

const REPORT_EVERY_MS = 500;

/** Measures how smoothly the drawing thread runs. For lab screens and checks (M1f). */
export function useFrameRate(): FrameRate {
  const [rate, setRate] = useState<FrameRate>({ fps: 0, slowestMs: 0 });
  const frames = useSharedValue(0);
  const windowStart = useSharedValue(-1);
  const slowest = useSharedValue(0);

  useFrameCallback((frame) => {
    'worklet';
    if (windowStart.get() < 0) {
      windowStart.set(frame.timestamp);
      return;
    }
    frames.set(frames.get() + 1);
    slowest.set(Math.max(slowest.get(), frame.timeSincePreviousFrame ?? 0));

    const elapsed = frame.timestamp - windowStart.get();
    if (elapsed >= REPORT_EVERY_MS) {
      scheduleOnRN(setRate, {
        fps: Math.round((frames.get() * 1000) / elapsed),
        slowestMs: Math.round(slowest.get()),
      });
      frames.set(0);
      slowest.set(0);
      windowStart.set(frame.timestamp);
    }
  });

  return rate;
}
