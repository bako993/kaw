export type AreaKind = 'forest' | 'park' | 'cemetery' | 'water';

export type RoadKind = 'minor' | 'mid' | 'major' | 'trunk';

export interface CityGround {
  readonly width: number;
  readonly height: number;
  readonly areas: Readonly<Record<AreaKind, string>>;
  readonly roads: Readonly<Record<RoadKind, string>>;
}
