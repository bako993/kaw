import { describe, expect, it } from 'vitest';

import { buildApp } from '../../app.ts';

async function requestHealth(isDatabaseReachable: () => Promise<boolean>) {
  const app = await buildApp({ logger: false, isDatabaseReachable });
  try {
    return await app.inject({ method: 'GET', url: '/health' });
  } finally {
    await app.close();
  }
}

describe('GET /health', () => {
  it('reports ok when the database answers', async () => {
    const response = await requestHealth(() => Promise.resolve(true));

    expect(response.statusCode).toBe(200);
    expect(response.json<unknown>()).toEqual({ status: 'ok', database: 'ok' });
  });

  it('reports an error when the database is unreachable', async () => {
    const response = await requestHealth(() => Promise.resolve(false));

    expect(response.statusCode).toBe(503);
    expect(response.json<unknown>()).toEqual({ status: 'error', database: 'unreachable' });
  });
});
