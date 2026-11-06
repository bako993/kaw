import { describe, expect, it } from 'vitest';

import { classifyArea, classifyRoad } from './classify.ts';

describe('classifyRoad', () => {
  it('groups street types into four kinds', () => {
    expect(classifyRoad({ highway: 'residential' })?.kind).toBe('minor');
    expect(classifyRoad({ highway: 'secondary_link' })?.kind).toBe('mid');
    expect(classifyRoad({ highway: 'primary' })?.kind).toBe('major');
    expect(classifyRoad({ highway: 'trunk' })?.kind).toBe('trunk');
  });

  it('ignores paths and buildings', () => {
    expect(classifyRoad({ highway: 'footway' })).toBeNull();
    expect(classifyRoad({ building: 'yes' })).toBeNull();
  });
});

describe('classifyArea', () => {
  it('reads parks, forests, cemeteries and water', () => {
    expect(classifyArea({ leisure: 'garden' })?.kind).toBe('park');
    expect(classifyArea({ natural: 'wood' })?.kind).toBe('forest');
    expect(classifyArea({ landuse: 'cemetery' })?.kind).toBe('cemetery');
    expect(classifyArea({ natural: 'water' })?.kind).toBe('water');
  });

  it('ignores everything else', () => {
    expect(classifyArea({ building: 'hotel' })).toBeNull();
  });
});
