import { describe, expect, it } from 'vitest';

import { parseCityConfig } from './city-config.ts';

const valid = {
  exportName: 'silemaniGround',
  source: 'in.geojson',
  output: 'out.ts',
  bounds: { west: 45, south: 35, east: 46, north: 36 },
  unitsPerDegree: 30000,
};

describe('parseCityConfig', () => {
  it('reads a valid city', () => {
    expect(parseCityConfig(JSON.stringify(valid))).toEqual(valid);
  });

  it('refuses bounds the wrong way round', () => {
    const swapped = { ...valid, bounds: { ...valid.bounds, west: 47 } };
    expect(() => parseCityConfig(JSON.stringify(swapped))).toThrow('west < east');
  });

  it('refuses a missing setting', () => {
    expect(() => parseCityConfig(JSON.stringify({ ...valid, source: '' }))).toThrow('"source"');
  });
});
