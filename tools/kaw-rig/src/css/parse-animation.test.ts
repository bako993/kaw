import { describe, expect, it } from 'vitest';

import { parseAnimation } from './parse-animation.ts';

describe('parseAnimation', () => {
  it('reads name, duration, easing and direction', () => {
    expect(parseAnimation('flapL .4s ease-in-out infinite alternate')).toEqual({
      name: 'flapL',
      durationMs: 400,
      delayMs: 0,
      alternate: true,
      easing: [0.42, 0, 0.58, 1],
    });
  });

  it('reads a custom curve and a delay', () => {
    expect(parseAnimation('hop .8s cubic-bezier(.45,0,.55,1) 1.1s infinite')).toMatchObject({
      durationMs: 800,
      delayMs: 1100,
      easing: [0.45, 0, 0.55, 1],
    });
  });

  it('refuses an animation without a duration', () => {
    expect(() => parseAnimation('hop infinite')).toThrow('Cannot read animation');
  });
});
