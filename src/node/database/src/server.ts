import express from 'express';
import { DBStore } from './store/db-store';
import { Realtime } from './routes/realtime';
import { Environment } from './util/env/env';
import { Logger } from './util/logging/logger';
import { Historical } from './routes/historical';

const logger = new Logger('server');
const env = new Environment();
if (env.validKeys()) {
  logger.info('main', 'Setting up DB-Store server..');
  const store = new DBStore();
  store.connect(env.DATABASE_URI).then((connection) => {
    logger.info('DBStore', `Successfully connected to database: ${env.DATABASE_URI}`);
    const server = express();
    server.use(express.json({ limit: '50mb' }));
    server.use(express.urlencoded({ extended: true, limit: '50mb' }));

    const realtime = new Realtime(new Logger('realtime'), store);
    const historical = new Historical(new Logger('historical'), store);
    server.use('/realtime', realtime.router);
    server.use('/historical', historical.router);

    server.listen(env.DB_STORE_PORT, () => {
      logger.info('main', `Server is up and listening on port: ${env.DB_STORE_PORT}`);
    });
  }).catch((connectErr) => {
    logger.critical('DBStore', `Unable to connect to database. Please verify database is up and restart DB-Store server`, connectErr);
  });
}
