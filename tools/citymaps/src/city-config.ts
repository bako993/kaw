export interface Bounds {
  readonly west: number;
  readonly south: number;
  readonly east: number;
  readonly north: number;
}

export interface CityConfig {
  readonly exportName: string;
  readonly source: string;
  readonly output: string;
  readonly bounds: Bounds;
  readonly unitsPerDegree: number;
}

export function parseCityConfig(json: string): CityConfig {
  const value: unknown = JSON.parse(json);
  if (!isRecord(value) || !isRecord(value.bounds)) {
    throw new Error('City config must be an object with "bounds"');
  }

  const config: CityConfig = {
    exportName: requireString(value, 'exportName'),
    source: requireString(value, 'source'),
    output: requireString(value, 'output'),
    bounds: {
      west: requireNumber(value.bounds, 'west'),
      south: requireNumber(value.bounds, 'south'),
      east: requireNumber(value.bounds, 'east'),
      north: requireNumber(value.bounds, 'north'),
    },
    unitsPerDegree: requireNumber(value, 'unitsPerDegree'),
  };

  if (!/^[a-z][a-zA-Z0-9]*$/.test(config.exportName)) {
    throw new Error(`exportName must be a camelCase name, got "${config.exportName}"`);
  }
  if (config.bounds.west >= config.bounds.east || config.bounds.south >= config.bounds.north) {
    throw new Error('bounds must have west < east and south < north');
  }
  return config;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function requireString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value === '') throw new Error(`"${key}" must be a text`);
  return value;
}

function requireNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`"${key}" must be a number`);
  }
  return value;
}
