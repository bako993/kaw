import type { HealthResponse } from '@kaw/shared';
import type { FastifyPluginAsync } from 'fastify';

export interface HealthRoutesOptions {
  readonly isDatabaseReachable: () => Promise<boolean>;
}

const HEALTHY: HealthResponse = { status: 'ok', database: 'ok' };
const DATABASE_DOWN: HealthResponse = { status: 'error', database: 'unreachable' };

export const healthRoutes: FastifyPluginAsync<HealthRoutesOptions> = (app, options) => {
  app.get('/health', async (_request, reply) => {
    const databaseOk = await options.isDatabaseReachable();

    return reply.code(databaseOk ? 200 : 503).send(databaseOk ? HEALTHY : DATABASE_DOWN);
  });

  return Promise.resolve();
};
