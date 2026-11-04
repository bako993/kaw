import { describe, expect, it } from 'vitest';

import type { LockableItem } from './access-policy.ts';
import { openAccessPolicy } from './open-access-policy.ts';

describe('openAccessPolicy', () => {
  const items: LockableItem[] = [
    { kind: 'city', id: 'sulaimani' },
    { kind: 'topic', id: 'family' },
    { kind: 'game', id: 'memory' },
  ];

  it.each(items)('opens $kind "$id"', (item) => {
    expect(openAccessPolicy.canOpen(item)).toBe(true);
  });
});
