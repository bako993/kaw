import { describe, expect, it } from 'vitest';

import { lineLength, simplifyLine } from './simplify.ts';

describe('simplifyLine', () => {
  it('drops points that barely bend the line', () => {
    expect(
      simplifyLine(
        [
          [0, 0],
          [5, 0.2],
          [10, 0],
        ],
        0.5,
      ),
    ).toEqual([
      [0, 0],
      [10, 0],
    ]);
  });

  it('keeps corners', () => {
    const corner = [
      [0, 0],
      [10, 0],
      [10, 10],
    ] as const;
    expect(simplifyLine(corner, 0.5)).toEqual(corner);
  });
});

describe('lineLength', () => {
  it('adds up every piece of the line', () => {
    expect(
      lineLength([
        [0, 0],
        [3, 4],
        [3, 10],
      ]),
    ).toBe(11);
  });
});
