export type Position = readonly number[];

export type Geometry =
  | { readonly type: 'LineString'; readonly coordinates: readonly Position[] }
  | { readonly type: 'MultiLineString'; readonly coordinates: readonly (readonly Position[])[] }
  | { readonly type: 'Polygon'; readonly coordinates: readonly (readonly Position[])[] }
  | {
      readonly type: 'MultiPolygon';
      readonly coordinates: readonly (readonly (readonly Position[])[])[];
    }
  | { readonly type: 'Point'; readonly coordinates: Position };

export interface Feature {
  readonly properties: Readonly<Record<string, unknown>> | null;
  readonly geometry: Geometry | null;
}

export function readFeatures(json: string): readonly Feature[] {
  const value: unknown = JSON.parse(json);
  if (typeof value !== 'object' || value === null || !('features' in value)) {
    throw new Error('Expected a GeoJSON FeatureCollection');
  }
  const { features } = value;
  if (!Array.isArray(features)) throw new Error('"features" must be a list');
  return features as readonly Feature[];
}
