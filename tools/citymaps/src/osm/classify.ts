import type { AreaKind, RoadKind } from '@kaw/shared';

export interface RoadClass {
  readonly kind: RoadKind;
  readonly tolerance: number;
}

export interface AreaClass {
  readonly kind: AreaKind;
  readonly tolerance: number;
}

type Tags = Readonly<Record<string, unknown>>;

const ROADS: Readonly<Record<string, RoadKind>> = {
  residential: 'minor',
  living_street: 'minor',
  unclassified: 'minor',
  tertiary: 'mid',
  tertiary_link: 'mid',
  secondary: 'mid',
  secondary_link: 'mid',
  primary: 'major',
  primary_link: 'major',
  motorway: 'major',
  motorway_link: 'major',
  trunk: 'trunk',
  trunk_link: 'trunk',
};

const ROAD_TOLERANCE: Readonly<Record<RoadKind, number>> = {
  minor: 0.9,
  mid: 0.7,
  major: 0.6,
  trunk: 0.6,
};

const AREAS: Readonly<Record<string, AreaKind>> = {
  park: 'park',
  garden: 'park',
  grass: 'park',
  recreation_ground: 'park',
  forest: 'forest',
  wood: 'forest',
  scrub: 'forest',
  cemetery: 'cemetery',
  water: 'water',
};

const AREA_TOLERANCE = 0.8;
const AREA_KEYS = ['leisure', 'landuse', 'natural'] as const;

export function classifyRoad(tags: Tags): RoadClass | null {
  const highway = tags.highway;
  const kind = typeof highway === 'string' ? ROADS[highway] : undefined;
  return kind ? { kind, tolerance: ROAD_TOLERANCE[kind] } : null;
}

export function classifyArea(tags: Tags): AreaClass | null {
  for (const key of AREA_KEYS) {
    const value = tags[key];
    const kind = typeof value === 'string' ? AREAS[value] : undefined;
    if (kind) return { kind, tolerance: AREA_TOLERANCE };
  }
  return null;
}
