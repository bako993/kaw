import { readFileSync, writeFileSync } from 'node:fs';

import { buildRig } from './build-rig.ts';
import { renderModule } from './render-module.ts';
import { readPackSvg } from './svg/read-pack-svg.ts';

const USAGE = 'Usage: node tools/kaw-rig/src/cli.ts <pose.svg> <output.generated.ts> <exportName>';

const [inputPath, outputPath, exportName] = process.argv.slice(2);

if (inputPath === undefined || outputPath === undefined || exportName === undefined) {
  console.error(USAGE);
  process.exit(1);
}

if (!/^[a-z][a-zA-Z0-9]*$/.test(exportName)) {
  console.error(`exportName must be a camelCase name, got "${exportName}"`);
  process.exit(1);
}

const rig = buildRig(readPackSvg(readFileSync(inputPath, 'utf8')));
const source = inputPath.replaceAll('\\', '/');
writeFileSync(outputPath, renderModule(rig, exportName, source));

console.log(
  `✓ ${exportName}: ${String(rig.parts.length)} moving parts, ${String(rig.sparkles.length)} sparkles → ${outputPath}`,
);
