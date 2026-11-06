import type { AreaKind, CityGround, RoadKind } from '@kaw/shared';

import type { Point, Projection } from './geo/project.ts';
import { lineLength, simplifyLine } from './geo/simplify.ts';
import { linesToPath, polygonsToPath } from './geo/svg-path.ts';
import { classifyArea, classifyRoad } from './osm/classify.ts';
import type { Feature, Geometry, Position } from './osm/geojson.ts';

const SHORTEST_ROAD = 3;
const SMALLEST_RING_POINTS = 4;

export function buildGround(features: readonly Feature[], projection: Projection): CityGround {
  const roads: Record<RoadKind, Point[][]> = { minor: [], mid: [], major: [], trunk: [] };
  const areas: Record<AreaKind, Point[][]> = { forest: [], park: [], cemetery: [], water: [] };
  const toPoints = (positions: readonly Position[]): Point[] =>
    positions.map(([longitude = 0, latitude = 0]) => projection.project(longitude, latitude));

  for (const { properties, geometry } of features) {
    if (!geometry) continue;
    const tags = properties ?? {};

    const road = classifyRoad(tags);
    if (road) {
      for (const line of linesOf(geometry)) {
        const points = simplifyLine(toPoints(line), road.tolerance);
        if (lineLength(points) >= SHORTEST_ROAD) roads[road.kind].push(points);
      }
    }

    const area = classifyArea(tags);
    if (area) {
      for (const ring of outerRingsOf(geometry)) {
        const points = simplifyLine(toPoints(ring), area.tolerance);
        if (points.length >= SMALLEST_RING_POINTS) areas[area.kind].push(points);
      }
    }
  }

  return {
    width: projection.width,
    height: projection.height,
    areas: {
      forest: polygonsToPath(areas.forest),
      park: polygonsToPath(areas.park),
      cemetery: polygonsToPath(areas.cemetery),
      water: polygonsToPath(areas.water),
    },
    roads: {
      minor: linesToPath(roads.minor),
      mid: linesToPath(roads.mid),
      major: linesToPath(roads.major),
      trunk: linesToPath(roads.trunk),
    },
  };
}

function linesOf(geometry: Geometry): readonly (readonly Position[])[] {
  if (geometry.type === 'LineString') return [geometry.coordinates];
  if (geometry.type === 'MultiLineString') return geometry.coordinates;
  return [];
}

function outerRingsOf(geometry: Geometry): readonly (readonly Position[])[] {
  if (geometry.type === 'Polygon') return geometry.coordinates.slice(0, 1);
  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.flatMap((polygon) => polygon.slice(0, 1));
  }
  return [];
}
