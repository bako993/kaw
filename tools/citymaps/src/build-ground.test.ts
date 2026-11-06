import { describe, expect, it } from 'vitest';

import { buildGround } from './build-ground.ts';
import { createProjection } from './geo/project.ts';
import type { Feature } from './osm/geojson.ts';

const projection = createProjection({ west: 0, south: 0, east: 1, north: 1 }, 100);

describe('buildGround', () => {
  it('sorts roads and areas into their layers', () => {
    const features: Feature[] = [
      {
        properties: { highway: 'primary' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 1],
            [0.5, 1],
          ],
        },
      },
      {
        properties: { leisure: 'park' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [0.2, 0],
              [0.2, 0.2],
              [0, 0],
            ],
          ],
        },
      },
    ];

    const ground = buildGround(features, projection);

    expect(ground.roads.major).toBe('M0 0L50 0');
    expect(ground.areas.park).toBe('M0 100L20 100L20 80L0 100Z');
    expect(ground.roads.minor).toBe('');
  });

  it('skips roads shorter than 3 units', () => {
    const tiny: Feature = {
      properties: { highway: 'residential' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [0.01, 0],
        ],
      },
    };
    expect(buildGround([tiny], projection).roads.minor).toBe('');
  });
});
