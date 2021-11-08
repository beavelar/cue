import express from 'express';
import { Environment } from './env/env';
import { Logger } from './logging/logger';
import { DBStore } from './store/db-store';

const logger = new Logger('server');
const env = new Environment();
if (env.validKeys()) {
  const store = new DBStore(env.DATABASE_URI);
  const server = express();
  server.use(express.json({ limit: '50mb' }));
  server.use(express.urlencoded({ extended: true, limit: '50mb' }));

  server.post('/write_realtime', (req, res) => {
    logger.log('main', `Receive POST request - ${req.url}`);
    store.writeRealtime(req.body).then((onfulfilled) => {
      res.status(200).json('Realtime alerts written');
    }).catch((onrejected) => {
      res.status(500).json(onrejected);
    });
  });

  server.post('/write_historical', (req, res) => {
    logger.log('main', `Receive POST request - ${req.url}`);
    store.writeHistorical(req.body).then((onfulfilled) => {
      res.status(200).json('Historical alerts written');
    }).catch((onrejected) => {
      res.status(500).json(onrejected);
    });
  });

  server.listen(env.DB_STORE_PORT, () => {
    logger.log('main', `Server is up and listening on port: ${env.DB_STORE_PORT}`);
  });
}
