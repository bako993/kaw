import type { Bounds } from '../city-config.ts';

export type Point = readonly [number, number];

export interface Projection {
  readonly width: number;
  readonly height: number;
  readonly project: (longitude: number, latitude: number) => Point;
}

/**
 * Flat map for one city: good enough at city size. North is up, and one unit
 * is the same distance east–west as north–south.
 */
export function createProjection(bounds: Bounds, unitsPerDegree: number): Projection {
  const middleLatitude = (bounds.south + bounds.north) / 2;
  const eastWestScale = unitsPerDegree * Math.cos((middleLatitude * Math.PI) / 180);

  return {
    width: Math.round((bounds.east - bounds.west) * eastWestScale),
    height: Math.round((bounds.north - bounds.south) * unitsPerDegree),
    project: (longitude, latitude) => [
      (longitude - bounds.west) * eastWestScale,
      (bounds.north - latitude) * unitsPerDegree,
    ],
  };
}
