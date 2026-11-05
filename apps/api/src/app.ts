import { fastify, type FastifyInstance, type FastifyServerOptions } from 'fastify';

import { healthRoutes } from './modules/health/index.ts';

export interface AppOptions {
  readonly logger: FastifyServerOptions['logger'];
  readonly isDatabaseReachable: () => Promise<boolean>;
}

export async function buildApp(options: AppOptions): Promise<FastifyInstance> {
  const app = fastify({ logger: options.logger });

  await app.register(healthRoutes, { isDatabaseReachable: options.isDatabaseReachable });

  return app;
}
