import { afterAll, describe, expect, it } from 'vitest';

import { createDatabase } from './database.ts';
import { pingDatabase } from './ping.ts';

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (testDatabaseUrl === undefined || testDatabaseUrl === '') {
  throw new Error('TEST_DATABASE_URL is missing. Copy apps/api/.env.example to apps/api/.env');
}

describe('pingDatabase', () => {
  const reachable = createDatabase(testDatabaseUrl);
  const unreachable = createDatabase('postgres://kaw:kaw@localhost:5499/missing');

  afterAll(async () => {
    await Promise.all([reachable.close(), unreachable.close()]);
  });

  it('returns true when the database answers', async () => {
    expect(await pingDatabase(reachable.db)).toBe(true);
  });

  it('returns false when the database cannot be reached', async () => {
    expect(await pingDatabase(unreachable.db)).toBe(false);
  });
});
