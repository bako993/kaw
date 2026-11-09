import { describe, expect, it } from 'vitest';

import { buildRoute } from './route';

describe('journey route', () => {
  it('lists the stops in order, with how far along the path each one is', () => {
    const route = buildRoute([
      { x: 0, y: 0, isStop: true },
      { x: 100, y: 0, isStop: false },
      { x: 200, y: 0, isStop: true },
    ]);

    expect(route.stops.map((stop) => Math.round(stop.distance))).toEqual([0, 200]);
    expect(route.length).toBeCloseTo(200, 0);
  });

  it('refuses a route with fewer than two points, with a clear message', () => {
    expect(() => buildRoute([{ x: 0, y: 0, isStop: true }])).toThrow('at least two points');
  });

  it('gives a zero-length route, not broken numbers, when two points are on the same spot', () => {
    const route = buildRoute([
      { x: 50, y: 50, isStop: true },
      { x: 50, y: 50, isStop: true },
    ]);

    expect(route.length).toBeCloseTo(0);
    expect(route.stops.every((stop) => Number.isFinite(stop.distance))).toBe(true);
    expect(route.path).not.toContain('NaN');
  });
});
