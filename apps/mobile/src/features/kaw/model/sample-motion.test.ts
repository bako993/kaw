import { describe, expect, it } from 'vitest';

import type { Frame, Keyframe, Motion } from './rig';
import { IDENTITY_FRAME, sampleMotion } from './sample-motion';

const hop: Frame = { ...IDENTITY_FRAME, translateY: -12, scaleY: 1.05 };

function motionWith(overrides: Partial<Motion>): Motion {
  return {
    keyframes: [
      { offset: 0, frame: IDENTITY_FRAME },
      { offset: 1, frame: hop },
    ],
    durationMs: 1000,
    delayMs: 0,
    alternate: true,
    easing: [0.42, 0, 0.58, 1],
    ...overrides,
  };
}

function isDrawable(frame: Frame): boolean {
  return Object.values(frame).every((value) => Number.isFinite(value));
}

const sameSpotKeyframes: Keyframe[] = [
  { offset: 0, frame: IDENTITY_FRAME },
  { offset: 0.5, frame: hop },
  { offset: 0.5, frame: IDENTITY_FRAME },
  { offset: 1, frame: hop },
];

const oddMotions: Record<string, Motion | null> = {
  'no motion at all': null,
  'no keyframes': motionWith({ keyframes: [] }),
  'a single keyframe': motionWith({ keyframes: [{ offset: 0, frame: hop }] }),
  'zero duration': motionWith({ durationMs: 0 }),
  'two keyframes at the same moment': motionWith({ keyframes: sameSpotKeyframes }),
  'an extreme easing curve': motionWith({ easing: [0, 0, 0, 0] }),
};

const moments = [0, 1, 250, 500, 999, 1000, 60_000, 12 * 60 * 60 * 1000];

describe('Kaw motion safety', () => {
  it.each(Object.entries(oddMotions))('always gives a drawable pose for %s', (_name, motion) => {
    for (const timeMs of moments) {
      expect(isDrawable(sampleMotion(motion, timeMs))).toBe(true);
    }
  });

  it('holds the first pose while waiting for a delayed move to start', () => {
    const delayed = motionWith({
      keyframes: [
        { offset: 0, frame: hop },
        { offset: 1, frame: IDENTITY_FRAME },
      ],
      delayMs: 500,
    });

    expect(sampleMotion(delayed, 200)).toEqual(hop);
  });
});
