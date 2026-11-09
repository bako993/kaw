import { describe, expect, it } from 'vitest';

import { stopStateFor } from './stop-style';

describe('journey stops', () => {
  it('shows earlier stops as done, the next one as current, and the rest as locked', () => {
    const states = [0, 1, 2, 3].map((index) => stopStateFor(index, 2));

    expect(states).toEqual(['done', 'done', 'current', 'locked']);
  });

  it('shows every stop as done once the whole city is finished', () => {
    const states = [0, 1, 2].map((index) => stopStateFor(index, 3));

    expect(states).toEqual(['done', 'done', 'done']);
  });
});
