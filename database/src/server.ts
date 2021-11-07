import express from 'express';
import bodyParser from 'body-parser';
import { Environment } from './env/env';
import { Logger } from './logging/logger';

const logger = new Logger('server');
const env = new Environment();
if (env.validKeys()) {
  const server = express();
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());

  server.post('/', (req, res) => {
    logger.log('main', `Receive POST request - ${req.url}`);
  });

  server.listen(env.DB_STORE_PORT, () => {
    logger.log('main', `Server is up and listening on port: ${env.DB_STORE_PORT}`);
  });
}