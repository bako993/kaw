import type { FastifyPluginAsync } from 'fastify';

export interface HealthRoutesOptions {
  readonly isDatabaseReachable: () => Promise<boolean>;
}

export const healthRoutes: FastifyPluginAsync<HealthRoutesOptions> = (app, options) => {
  app.get('/health', async (_request, reply) => {
    const databaseOk = await options.isDatabaseReachable();

    return reply.code(databaseOk ? 200 : 503).send({
      status: databaseOk ? 'ok' : 'error',
      database: databaseOk ? 'ok' : 'unreachable',
    });
  });

  return Promise.resolve();
};
