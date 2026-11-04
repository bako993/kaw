import { fastify, type FastifyInstance, type FastifyServerOptions } from 'fastify';

import { healthRoutes } from './routes/health.ts';

export interface AppOptions {
  readonly logger: FastifyServerOptions['logger'];
}

export async function buildApp(options: AppOptions): Promise<FastifyInstance> {
  const app = fastify({ logger: options.logger });

  await app.register(healthRoutes);

  return app;
}
