import { describe, expect, it } from 'vitest';

import { loadConfig } from './config.ts';

const DATABASE_URL = 'postgres://user:pass@localhost:5432/db';

describe('loadConfig', () => {
  it('uses safe defaults when only the database is set', () => {
    expect(loadConfig({ DATABASE_URL })).toEqual({
      host: '0.0.0.0',
      port: 3000,
      prettyLogs: true,
      databaseUrl: DATABASE_URL,
    });
  });

  it('reads HOST and PORT', () => {
    expect(loadConfig({ DATABASE_URL, HOST: '127.0.0.1', PORT: '8080' })).toMatchObject({
      host: '127.0.0.1',
      port: 8080,
    });
  });

  it('turns off pretty logs in production', () => {
    expect(loadConfig({ DATABASE_URL, NODE_ENV: 'production' }).prettyLogs).toBe(false);
  });

  it.each(['abc', '0', '70000', '3.5'])('refuses PORT "%s"', (port) => {
    expect(() => loadConfig({ DATABASE_URL, PORT: port })).toThrow();
  });

  it('refuses a missing DATABASE_URL', () => {
    expect(() => loadConfig({})).toThrow('DATABASE_URL is missing');
  });
});
