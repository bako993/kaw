import { cubicBezier } from './easing';
import type { Frame, Motion } from './rig';

// Runs on the UI thread (worklets): helpers stay ABOVE the functions that use them.

export const IDENTITY_FRAME: Frame = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  opacity: 1,
};

function mix(from: number, to: number, amount: number): number {
  'worklet';
  return from + (to - from) * amount;
}

function mixFrames(from: Frame, to: Frame, amount: number): Frame {
  'worklet';
  return {
    translateX: mix(from.translateX, to.translateX, amount),
    translateY: mix(from.translateY, to.translateY, amount),
    rotate: mix(from.rotate, to.rotate, amount),
    scaleX: mix(from.scaleX, to.scaleX, amount),
    scaleY: mix(from.scaleY, to.scaleY, amount),
    opacity: mix(from.opacity, to.opacity, amount),
  };
}

export function sampleMotion(motion: Motion | null, timeMs: number): Frame {
  'worklet';
  if (motion === null) return IDENTITY_FRAME;

  const { keyframes } = motion;
  const first = keyframes[0];
  if (first === undefined) return IDENTITY_FRAME;

  const cycles = (timeMs - motion.delayMs) / motion.durationMs;
  if (cycles <= 0) return first.frame;

  const iteration = Math.floor(cycles);
  const forward = cycles - iteration;
  const progress = motion.alternate && iteration % 2 === 1 ? 1 - forward : forward;

  for (let index = 1; index < keyframes.length; index++) {
    const from = keyframes[index - 1];
    const to = keyframes[index];
    if (from !== undefined && to !== undefined && progress <= to.offset) {
      const span = to.offset - from.offset;
      const local = span > 0 ? (progress - from.offset) / span : 1;
      return mixFrames(from.frame, to.frame, cubicBezier(motion.easing, local));
    }
  }

  return keyframes[keyframes.length - 1]?.frame ?? IDENTITY_FRAME;
}
