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

  server.post('/historical', (req, res) => {
    logger.log('main', 'Receive POST request - /historical');
    logger.log('main', JSON.stringify(req.body));
    res.status(200).json('Okay :)');
  });

  server.post('/realtime', (req, res) => {
    logger.log('main', 'Receive POST request - /realtime');
    logger.log('main', JSON.stringify(req.body));
    res.status(200).json('Okay :)');
  });

  server.listen(env.PROXY_PORT, () => {
    logger.log('main', `Server is up and listening on port: ${env.PROXY_PORT}`);
  });
}