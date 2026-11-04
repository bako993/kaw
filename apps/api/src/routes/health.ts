import type { FastifyPluginAsync } from 'fastify';

export const healthRoutes: FastifyPluginAsync = (app) => {
  app.get('/health', () => ({ status: 'ok' }));
  return Promise.resolve();
};
