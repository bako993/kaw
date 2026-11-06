import { describe, expect, it } from 'vitest';

import { linesToPath, polygonsToPath } from './svg-path.ts';

describe('svg paths', () => {
  it('writes lines with one decimal at most', () => {
    expect(
      linesToPath([
        [
          [1.04, 2],
          [3.26, 4.5],
        ],
      ]),
    ).toBe('M1 2L3.3 4.5');
  });

  it('closes every polygon', () => {
    expect(
      polygonsToPath([
        [
          [0, 0],
          [1, 0],
          [1, 1],
        ],
      ]),
    ).toBe('M0 0L1 0L1 1Z');
  });
});
