import { describe, expect, it } from 'vitest';

import { loadConfig } from './config.ts';

describe('loadConfig', () => {
  it('uses safe defaults when nothing is set', () => {
    expect(loadConfig({})).toEqual({ host: '0.0.0.0', port: 3000, prettyLogs: true });
  });

  it('reads HOST and PORT', () => {
    expect(loadConfig({ HOST: '127.0.0.1', PORT: '8080' })).toMatchObject({
      host: '127.0.0.1',
      port: 8080,
    });
  });

  it('turns off pretty logs in production', () => {
    expect(loadConfig({ NODE_ENV: 'production' }).prettyLogs).toBe(false);
  });

  it.each(['abc', '0', '70000', '3.5'])('refuses PORT "%s"', (port) => {
    expect(() => loadConfig({ PORT: port })).toThrow();
  });
});
