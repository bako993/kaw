import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { buildRig } from './build-rig.ts';
import { readPackSvg } from './svg/read-pack-svg.ts';

const CHEERING = fileURLToPath(
  new URL('../../../design/kaw-moving-pack/svg/kew-11-cheering.svg', import.meta.url),
);

describe('buildRig (pose 11, cheering)', () => {
  const rig = buildRig(readPackSvg(readFileSync(CHEERING, 'utf8')));

  it('finds the hopping body', () => {
    expect(rig.body.motion?.durationMs).toBe(800);
  });

  it('finds both wings and the beak with their turning points', () => {
    expect(rig.parts.map((part) => part.pivot)).toEqual([
      { kind: 'point', point: [305, 505] },
      { kind: 'point', point: [690, 505] },
      { kind: 'point', point: [445, 357] },
    ]);
  });

  it('finds the eight stars with their delays', () => {
    expect(rig.sparkles.map((sparkle) => sparkle.motion?.delayMs)).toEqual([
      0, 550, 1100, 0, 550, 1100, 0, 550,
    ]);
  });
});
