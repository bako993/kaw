import { describe, expect, it } from 'vitest';

import { createProjection } from './project.ts';

describe('createProjection', () => {
  const projection = createProjection({ west: 45, south: 35, east: 45.1, north: 35.1 }, 1000);

  it('puts the north-west corner at 0,0', () => {
    expect(projection.project(45, 35.1)).toEqual([0, 0]);
  });

  it('shrinks east–west distances by the city latitude', () => {
    expect(projection.width).toBe(82);
    expect(projection.height).toBe(100);
  });
});
