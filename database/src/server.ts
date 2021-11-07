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

  server.post('/', (req, res) => {
    logger.log('main', `Receive POST request - ${req.url}`);
    store.write({
      name: 'TEST NAME',
      email: 'TEST EMAIL',
      avatar: 'TEST AVATAR'
    });
  });

  server.listen(env.DB_STORE_PORT, () => {
    logger.log('main', `Server is up and listening on port: ${env.DB_STORE_PORT}`);
  });
}
