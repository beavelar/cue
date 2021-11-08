import express from 'express';
import bodyParser from 'body-parser';
import { Environment } from './env/env';
import { Logger } from './logging/logger';
import { DBStore } from './store/db-store';

const logger = new Logger('server');
const env = new Environment();
if (env.validKeys()) {
  const store = new DBStore(env.DATABASE_URI);
  const server = express();
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());

  server.post('/write_realtime', (req, res) => {
    logger.log('main', `Receive POST request - ${req.url}`);
    store.writeRealtime(req.body);
  });

  server.post('/write_historical', (req, res) => {
    logger.log('main', `Receive POST request - ${req.url}`);
    store.writeHistorical(req.body);
  });

  server.listen(env.DB_STORE_PORT, () => {
    logger.log('main', `Server is up and listening on port: ${env.DB_STORE_PORT}`);
  });
}
