import { describe, expect, it } from 'vitest';

import { parseTransform } from './parse-transform.ts';

describe('parseTransform', () => {
  it('reads move, turn and stretch functions', () => {
    expect(parseTransform('translate(11px,-5px) rotate(1.2deg) scale(1.01,1.02)')).toEqual({
      translateX: 11,
      translateY: -5,
      rotate: 1.2,
      scaleX: 1.01,
      scaleY: 1.02,
    });
  });

  it('uses one value for both directions of scale()', () => {
    expect(parseTransform('scale(.6)')).toEqual({ scaleX: 0.6, scaleY: 0.6 });
  });

  it('refuses functions it does not know', () => {
    expect(() => parseTransform('skew(10deg)')).toThrow('Unsupported transform function');
  });
});
