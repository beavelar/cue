import express from 'express';
import { Environment } from './env/env';
import { Logger } from './logging/logger';
import { Realtime } from './routes/realtime';
import { Historical } from './routes/historical';

const logger = new Logger('server');
const env = new Environment();
if (env.validKeys()) {
  const server = express();
  server.use(express.json({ limit: '50mb' }));
  server.use(express.urlencoded({ extended: true, limit: '50mb' }));

  const realtime = new Realtime(env, new Logger('realtime'));
  const historical = new Historical(env, new Logger('historical'));
  server.use('/realtime', realtime.router);
  server.use('/historical', historical.router);

  server.listen(env.PROXY_PORT, () => {
    logger.info('main', `Server is up and listening on port: ${env.PROXY_PORT}`);
  });
}