import { readFileSync, writeFileSync } from 'node:fs';

import { buildGround } from './build-ground.ts';
import { parseCityConfig } from './city-config.ts';
import { createProjection } from './geo/project.ts';
import { readFeatures } from './osm/geojson.ts';
import { renderModule } from './render-module.ts';

// run this command once per city.
const [configPath] = process.argv.slice(2);
if (configPath === undefined) {
  console.error('Usage: node tools/citymaps/src/cli.ts <city.json>');
  process.exit(1);
}

const config = parseCityConfig(readFileSync(configPath, 'utf8'));
const features = readFeatures(readFileSync(config.source, 'utf8'));
const ground = buildGround(features, createProjection(config.bounds, config.unitsPerDegree));
const source = renderModule(ground, config.exportName, config.source);
writeFileSync(config.output, source);

const kilobytes = Math.round(Buffer.byteLength(source) / 1024);
console.log(
  `✓ ${config.exportName}: ${String(ground.width)}×${String(ground.height)} units, ${String(kilobytes)} KB → ${config.output}`,
);
