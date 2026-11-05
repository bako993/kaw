import { buildApp } from './app.ts';
import { loadConfig } from './platform/config.ts';
import { createDatabase } from './platform/db/database.ts';
import { pingDatabase } from './platform/db/ping.ts';

const config = loadConfig();
const database = createDatabase(config.databaseUrl);

const app = await buildApp({
  logger: config.prettyLogs ? { transport: { target: 'pino-pretty' } } : true,
  isDatabaseReachable: () => pingDatabase(database.db),
});

app.addHook('onClose', async () => {
  await database.close();
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void app.close();
  });
}

try {
  await app.listen({ host: config.host, port: config.port });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
